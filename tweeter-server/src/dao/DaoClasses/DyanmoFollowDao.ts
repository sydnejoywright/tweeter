// DynamoFollowDao.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  DeleteCommand,
  GetCommand,
  BatchGetCommand,
  QueryCommandInput,
  BatchGetCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { FollowDao } from "../DaoInterfaces/FollowDao";
import { UserDto } from "tweeter-shared";

export class DynamoFollowDao implements FollowDao {
  private readonly ddb: DynamoDBDocumentClient;
  private readonly tableName: string; // follow table (holds follower_alias, followee_alias)
  private readonly usersTable: string; // users table (holds full user rows)

  /**
   * @param tableName - follow table name (required)
   * @param usersTable - users table name (optional; will fall back to process.env.USERS_TABLE)
   */
  constructor(tableName: string, usersTable?: string) {
    const client = new DynamoDBClient({});
    this.ddb = DynamoDBDocumentClient.from(client);
    this.tableName = tableName;
    this.usersTable = usersTable ?? process.env.USERS_TABLE ?? "";
    if (!this.tableName) {
      throw new Error("Follow table name must be provided");
    }
    if (!this.usersTable) {
      throw new Error(
        "Users table name not provided and USERS_TABLE env var is not set"
      );
    }
  }

  private async batchGetUsersByAliases(aliases: string[]): Promise<UserDto[]> {
    if (!aliases || aliases.length === 0) return [];

    const CHUNK_SIZE = 25;
    const chunks: string[][] = [];
    for (let i = 0; i < aliases.length; i += CHUNK_SIZE) {
      chunks.push(aliases.slice(i, i + CHUNK_SIZE));
    }

    const fetchedUsers: any[] = [];

    for (const chunk of chunks) {
      const keys = chunk.map((a) => ({ alias: a }));
      const batchParams: BatchGetCommandInput = {
        RequestItems: {
          [this.usersTable]: {
            Keys: keys,
            ProjectionExpression: "alias, firstName, lastName, imageUrl",
          },
        },
      };

      const batchRes = await this.ddb.send(new BatchGetCommand(batchParams));
      const responses = batchRes.Responses?.[this.usersTable] ?? [];
      fetchedUsers.push(...responses);
    }

    const byAlias = new Map<string, UserDto>();
    for (const u of fetchedUsers) {
      if (!u?.alias) continue;
      byAlias.set(u.alias, {
        firstName: u.firstName ?? "",
        lastName: u.lastName ?? "",
        alias: u.alias,
        imageUrl: u.imageUrl ?? "",
      });
    }

    return aliases.map((a) => byAlias.get(a)).filter((u): u is UserDto => !!u);
  }

  public async getFolloweeItems(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "follower_alias = :u",
      ExpressionAttributeValues: { ":u": userAlias },
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

    const followeeAliases: string[] =
      (result.Items ?? []).map((i) => i.followee_alias).filter(Boolean) || [];

    const hasMore = !!result.LastEvaluatedKey;

    if (followeeAliases.length === 0) return [[], hasMore];

    const users = await this.batchGetUsersByAliases(followeeAliases);

    return [users, hasMore];
  }

  public async getFollowerItems(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: "follow_index",
      KeyConditionExpression: "followee_alias = :u",
      ExpressionAttributeValues: { ":u": userAlias },
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

    const followerAliases: string[] =
      (result.Items ?? []).map((i) => i.follower_alias).filter(Boolean) || [];

    const hasMore = !!result.LastEvaluatedKey;

    if (followerAliases.length === 0) return [[], hasMore];

    const users = await this.batchGetUsersByAliases(followerAliases);

    return [users, hasMore];
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
