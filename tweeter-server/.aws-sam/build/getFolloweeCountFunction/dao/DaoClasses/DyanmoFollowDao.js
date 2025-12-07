"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoFollowDao = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class DynamoFollowDao {
    ddb;
    tableName;
    constructor(tableName) {
        const client = new client_dynamodb_1.DynamoDBClient({});
        this.ddb = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
        this.tableName = tableName;
    }
    async getFolloweeItems(userAlias, pageSize, lastItem) {
        const params = {
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
        const result = await this.ddb.send(new lib_dynamodb_1.QueryCommand(params));
        const items = result.Items?.map((i) => ({ alias: i.followee_alias })) || [];
        const hasMore = result.LastEvaluatedKey !== undefined;
        return [items, hasMore];
    }
    async getFollowerItems(userAlias, pageSize, lastItem) {
        const params = {
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
        const result = await this.ddb.send(new lib_dynamodb_1.QueryCommand(params));
        const items = result.Items?.map((i) => ({ alias: i.follower_alias })) || [];
        const hasMore = result.LastEvaluatedKey !== undefined;
        return [items, hasMore];
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
