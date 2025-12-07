import {
  DynamoDBClient,
  PutItemCommandInput,
  UpdateItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowDao } from "../DaoInterfaces/FollowDao";
import { UserDto } from "tweeter-shared";

export class DynamoFollowDao implements FollowDao {
  private ddb: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    const client = new DynamoDBClient({});
    this.ddb = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
  }

  public async getFolloweeItems(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      KeyConditionExpression: "follower_alias = :u",
      ExpressionAttributeValues: {
        ":u": userAlias,
      },
      Limit: pageSize,
      ScanIndexForward: true,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        follower_alias: userAlias,
        followee_alias: lastItem.alias,
      };
    }

    const result = await this.ddb.send(new QueryCommand(params));
    const items =
      result.Items?.map((i) => ({ alias: i.followee_alias } as UserDto)) || [];
    const hasMore = result.LastEvaluatedKey !== undefined;
    return [items, hasMore];
  }

  public async getFollowerItems(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params: any = {
      TableName: this.tableName,
      IndexName: "follow_index",
      KeyConditionExpression: "followee_alias = :u",
      ExpressionAttributeValues: {
        ":u": userAlias,
      },
      Limit: pageSize,
      ScanIndexForward: true,
    };

    if (lastItem) {
      params.ExclusiveStartKey = {
        followee_alias: userAlias,
        follower_alias: lastItem.alias,
      };
    }

    const result = await this.ddb.send(new QueryCommand(params));
    const items =
      result.Items?.map((i) => ({ alias: i.follower_alias } as UserDto)) || [];
    const hasMore = result.LastEvaluatedKey !== undefined;
    return [items, hasMore];
  }

  public async getIsFollowerStatus(
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const result = await this.ddb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          follower_alias: user.alias,
          followee_alias: selectedUser.alias,
        },
      })
    );
    return result.Item !== undefined;
  }

  public async getFolloweeCount(user: UserDto): Promise<number> {
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: "follower_alias = :u",
        ExpressionAttributeValues: { ":u": user.alias },
        Select: "COUNT",
      })
    );
    return result.Count ?? 0;
  }

  public async getFollowerCount(user: UserDto): Promise<number> {
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: "follow_index",
        KeyConditionExpression: "followee_alias = :u",
        ExpressionAttributeValues: { ":u": user.alias },
        Select: "COUNT",
      })
    );
    return result.Count ?? 0;
  }

  public async follow(
    currentUser: UserDto,
    userToFollow: UserDto
  ): Promise<void> {
    await this.ddb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          follower_alias: currentUser.alias,
          followee_alias: userToFollow.alias,
          created_at: new Date().toISOString(),
        },
        ConditionExpression:
          "attribute_not_exists(follower_alias) AND attribute_not_exists(followee_alias)",
      })
    );
  }

  public async unfollow(
    currentUser: UserDto,
    userToUnfollow: UserDto
  ): Promise<void> {
    await this.ddb.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: {
          follower_alias: currentUser.alias,
          followee_alias: userToUnfollow.alias,
        },
      })
    );
  }
}
