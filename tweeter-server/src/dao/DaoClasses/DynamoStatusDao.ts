import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { StatusDao } from "../DaoInterfaces/StatusDao";
import { StatusDto, User } from "tweeter-shared";

const STATUS_TABLE = process.env.STATUS_TABLE!;

export class DynamoStatusDao implements StatusDao {
  private ddb: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string = STATUS_TABLE) {
    const client = new DynamoDBClient({});
    this.ddb = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  public async getFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: "user_alias = :u",
      ExpressionAttributeValues: {
        ":u": userAlias,
      },
      Limit: pageSize,
      ScanIndexForward: false,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        user_alias: userAlias,
        timestamp: lastItem.timestamp,
      };
    }

    const result = await this.ddb.send(new QueryCommand(params));
    const items: StatusDto[] =
      result.Items?.map((i) => ({
        user: new User(i.firstName, i.lastName, i.user_alias, i.imageUrl ?? "")
          .dto,
        post: i.message,
        timestamp: i.timestamp,
      })) || [];

    const hasMore = result.LastEvaluatedKey !== undefined;
    return [items, hasMore];
  }

  public async getStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // For a single user, story is the same as feed
    return this.getFeedItems(userAlias, pageSize, lastItem);
  }

  public async postStatus(newStatus: StatusDto): Promise<void> {
    await this.ddb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          user_alias: newStatus.user.alias,
          timestamp: newStatus.timestamp, // epoch number or ISO string
          message: newStatus.post,
        },
      })
    );
  }
}
