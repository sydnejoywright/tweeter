import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { StatusDao } from "../DaoInterfaces/StatusDao";
import { StatusDto, User } from "tweeter-shared";
import { DynamoFollowDao } from "./DyanmoFollowDao"; // make sure this path is correct

const FEED_TABLE = process.env.FEED_TABLE ?? "";
const STORY_TABLE = process.env.STORY_TABLE ?? "";

if (!FEED_TABLE || !STORY_TABLE) {
  throw new Error(
    "FEED_TABLE or STORY_TABLE environment variables are not set"
  );
}

export class DynamoStatusDao implements StatusDao {
  private readonly ddb: DynamoDBDocumentClient;
  private readonly feedTable: string;
  private readonly storyTable: string;
  private readonly followDao: DynamoFollowDao;

  constructor(
    followDao: DynamoFollowDao,
    feedTable: string = FEED_TABLE,
    storyTable: string = STORY_TABLE
  ) {
    const client = new DynamoDBClient({});
    this.ddb = DynamoDBDocumentClient.from(client);
    this.feedTable = feedTable;
    this.storyTable = storyTable;
    this.followDao = followDao;
  }

  public async getFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.queryTable(this.feedTable, userAlias, pageSize, lastItem);
  }

  private async queryTable(
    tableName: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params: QueryCommandInput = {
      TableName: tableName,
      KeyConditionExpression: "user_alias = :userAlias",
      ExpressionAttributeValues: {
        ":userAlias": userAlias,
      },
      Limit: pageSize,
      ScanIndexForward: false, // newest first
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        user_alias: userAlias,
        timestamp: lastItem.timestamp,
      };
    }

    const result = await this.ddb.send(new QueryCommand(params));

    // Map each item to StatusDto, using the 'author' object for user info
    const items: StatusDto[] = (result.Items ?? []).map((i: any) => ({
      user: {
        firstName: i.author?.firstName ?? "",
        lastName: i.author?.lastName ?? "",
        alias: i.author?.alias ?? i.post_author ?? "",
        imageUrl: i.author?.imageUrl ?? "",
      },
      post: i.message ?? "",
      timestamp: i.timestamp ?? 0,
    }));

    const hasMore = !!result.LastEvaluatedKey;
    return [items, hasMore];
  }

  public async getStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return this.queryTable(this.storyTable, userAlias, pageSize, lastItem);
  }

  public async postStatus(newStatus: StatusDto): Promise<void> {
    console.log("Posting new status:", JSON.stringify(newStatus));

    const storyItem = {
      user_alias: newStatus.user.alias,
      timestamp: newStatus.timestamp,
      post_author: newStatus.user.alias,
      author: newStatus.user,
      message: newStatus.post,
      firstName: newStatus.user.firstName,
      lastName: newStatus.user.lastName,
      imageUrl: newStatus.user.imageUrl ?? "",
    };

    await this.ddb.send(
      new PutCommand({ TableName: this.storyTable, Item: storyItem })
    );

    const [followers, hasMore] = await this.followDao.getFollowerItems(
      newStatus.user.alias,
      1000,
      null
    );

    const allRecipients = [
      { alias: newStatus.user.alias },
      ...followers.map((f) => ({ alias: f.alias })),
    ];

    console.log("ALL FEED RECIPIENTS:", allRecipients);

    for (const recipient of allRecipients) {
      const feedItem = {
        ...storyItem,
        user_alias: recipient.alias,
      };

      await this.ddb.send(
        new PutCommand({ TableName: this.feedTable, Item: feedItem })
      );
    }

    console.log("Status successfully posted to story and feeds.");
  }
}
