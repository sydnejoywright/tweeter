"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoStatusDao = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const tweeter_shared_1 = require("tweeter-shared");
const STATUS_TABLE = process.env.STATUS_TABLE;
class DynamoStatusDao {
    ddb;
    tableName;
    constructor(tableName = STATUS_TABLE) {
        const client = new client_dynamodb_1.DynamoDBClient({});
        this.ddb = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
        this.tableName = tableName;
    }
    async getFeedItems(userAlias, pageSize, lastItem) {
        const params = {
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
        const result = await this.ddb.send(new lib_dynamodb_1.QueryCommand(params));
        const items = result.Items?.map((i) => ({
            user: new tweeter_shared_1.User(i.firstName, i.lastName, i.user_alias, i.imageUrl ?? "")
                .dto,
            post: i.message,
            timestamp: i.timestamp,
        })) || [];
        const hasMore = result.LastEvaluatedKey !== undefined;
        return [items, hasMore];
    }
    async getStoryItems(userAlias, pageSize, lastItem) {
        // For a single user, story is the same as feed
        return this.getFeedItems(userAlias, pageSize, lastItem);
    }
    async postStatus(newStatus) {
        await this.ddb.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                user_alias: newStatus.user.alias,
                timestamp: newStatus.timestamp, // epoch number or ISO string
                message: newStatus.post,
            },
        }));
    }
}
exports.DynamoStatusDao = DynamoStatusDao;
