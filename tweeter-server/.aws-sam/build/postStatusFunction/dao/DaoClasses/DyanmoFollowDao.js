"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFollowDao = void 0;
// DynamoFollowDao.ts
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoFollowDao {
    ddb;
    tableName; // follow table (holds follower_alias, followee_alias)
    usersTable; // users table (holds full user rows)
    /**
     * @param tableName - follow table name (required)
     * @param usersTable - users table name (optional; will fall back to process.env.USERS_TABLE)
     */
    constructor(tableName, usersTable) {
        const client = new client_dynamodb_1.DynamoDBClient({});
        this.ddb = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
        this.tableName = tableName;
        this.usersTable = usersTable ?? process.env.USERS_TABLE ?? "";
        if (!this.tableName) {
            throw new Error("Follow table name must be provided");
        }
        if (!this.usersTable) {
            throw new Error("Users table name not provided and USERS_TABLE env var is not set");
        }
    }
    async batchGetUsersByAliases(aliases) {
        if (!aliases || aliases.length === 0)
            return [];
        const CHUNK_SIZE = 25;
        const chunks = [];
        for (let i = 0; i < aliases.length; i += CHUNK_SIZE) {
            chunks.push(aliases.slice(i, i + CHUNK_SIZE));
        }
        const fetchedUsers = [];
        for (const chunk of chunks) {
            const keys = chunk.map((a) => ({ alias: a }));
            const batchParams = {
                RequestItems: {
                    [this.usersTable]: {
                        Keys: keys,
                        ProjectionExpression: "alias, firstName, lastName, imageUrl",
                    },
                },
            };
            const batchRes = await this.ddb.send(new lib_dynamodb_1.BatchGetCommand(batchParams));
            const responses = batchRes.Responses?.[this.usersTable] ?? [];
            fetchedUsers.push(...responses);
        }
        const byAlias = new Map();
        for (const u of fetchedUsers) {
            if (!u?.alias)
                continue;
            byAlias.set(u.alias, {
                firstName: u.firstName ?? "",
                lastName: u.lastName ?? "",
                alias: u.alias,
                imageUrl: u.imageUrl ?? "",
            });
        }
        return aliases.map((a) => byAlias.get(a)).filter((u) => !!u);
    }
    async getFolloweeItems(userAlias, pageSize, lastItem) {
        const params = {
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
        const result = await this.ddb.send(new lib_dynamodb_1.QueryCommand(params));
        const followeeAliases = (result.Items ?? []).map((i) => i.followee_alias).filter(Boolean) || [];
        const hasMore = !!result.LastEvaluatedKey;
        if (followeeAliases.length === 0)
            return [[], hasMore];
        const users = await this.batchGetUsersByAliases(followeeAliases);
        return [users, hasMore];
    }
    async getFollowerItems(userAlias, pageSize, lastItem) {
        const params = {
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
        const result = await this.ddb.send(new lib_dynamodb_1.QueryCommand(params));
        const followerAliases = (result.Items ?? []).map((i) => i.follower_alias).filter(Boolean) || [];
        const hasMore = !!result.LastEvaluatedKey;
        if (followerAliases.length === 0)
            return [[], hasMore];
        const users = await this.batchGetUsersByAliases(followerAliases);
        return [users, hasMore];
    }
    async getIsFollowerStatus(user, selectedUser) {
        const result = await this.ddb.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: {
                follower_alias: user.alias,
                followee_alias: selectedUser.alias,
            },
        }));
        return result.Item !== undefined;
    }
    async getFolloweeCount(user) {
        const result = await this.ddb.send(new lib_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "follower_alias = :u",
            ExpressionAttributeValues: { ":u": user.alias },
            Select: "COUNT",
        }));
        return result.Count ?? 0;
    }
    async getFollowerCount(user) {
        const result = await this.ddb.send(new lib_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            IndexName: "follow_index",
            KeyConditionExpression: "followee_alias = :u",
            ExpressionAttributeValues: { ":u": user.alias },
            Select: "COUNT",
        }));
        return result.Count ?? 0;
    }
    async follow(currentUser, userToFollow) {
        await this.ddb.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                follower_alias: currentUser.alias,
                followee_alias: userToFollow.alias,
                created_at: new Date().toISOString(),
            },
            ConditionExpression: "attribute_not_exists(follower_alias) AND attribute_not_exists(followee_alias)",
        }));
    }
    async unfollow(currentUser, userToUnfollow) {
        await this.ddb.send(new lib_dynamodb_1.DeleteCommand({
            TableName: this.tableName,
            Key: {
                follower_alias: currentUser.alias,
                followee_alias: userToUnfollow.alias,
            },
        }));
    }
}
exports.DynamoFollowDao = DynamoFollowDao;
