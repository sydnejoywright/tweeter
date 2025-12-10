"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoStatusDao = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const FEED_TABLE = process.env.FEED_TABLE ?? "";
const STORY_TABLE = process.env.STORY_TABLE ?? "";
if (!FEED_TABLE || !STORY_TABLE) {
    throw new Error("FEED_TABLE or STORY_TABLE environment variables are not set");
}
class DynamoStatusDao {
    ddb;
    feedTable;
    storyTable;
    followDao;
    constructor(followDao, feedTable = FEED_TABLE, storyTable = STORY_TABLE) {
        const client = new client_dynamodb_1.DynamoDBClient({});
        this.ddb = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
        this.feedTable = feedTable;
        this.storyTable = storyTable;
        this.followDao = followDao;
    }
    async getFeedItems(userAlias, pageSize, lastItem) {
        return this.queryTable(this.feedTable, userAlias, pageSize, lastItem);
    }
    async queryTable(tableName, userAlias, pageSize, lastItem) {
        const params = {
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
        const result = await this.ddb.send(new lib_dynamodb_1.QueryCommand(params));
        // Map each item to StatusDto, using the 'author' object for user info
        const items = (result.Items ?? []).map((i) => ({
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
    async getStoryItems(userAlias, pageSize, lastItem) {
        return this.queryTable(this.storyTable, userAlias, pageSize, lastItem);
    }
    async postStatus(newStatus) {
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
        await this.ddb.send(new lib_dynamodb_1.PutCommand({ TableName: this.storyTable, Item: storyItem }));
        const [followers, hasMore] = await this.followDao.getFollowerItems(newStatus.user.alias, 1000, null);
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
            await this.ddb.send(new lib_dynamodb_1.PutCommand({ TableName: this.feedTable, Item: feedItem }));
        }
        console.log("Status successfully posted to story and feeds.");
    }
}
exports.DynamoStatusDao = DynamoStatusDao;
