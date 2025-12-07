"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoAuthDao = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const crypto_1 = __importDefault(require("crypto"));
class DynamoAuthDao {
    client;
    ddb;
    tableName;
    constructor(tableName = process.env.SESSIONS_TABLE) {
        if (!tableName) {
            throw new Error("SESSIONS_TABLE not provided");
        }
        this.client = new client_dynamodb_1.DynamoDBClient({});
        this.ddb = lib_dynamodb_1.DynamoDBDocumentClient.from(this.client);
        this.tableName = tableName;
    }
    hashToken(token) {
        return crypto_1.default.createHash("sha256").update(token).digest("hex");
    }
    async createAuthToken(userAlias, ttlSeconds, meta) {
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const tokenHash = this.hashToken(token);
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = now + ttlSeconds;
        await this.ddb.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                token_hash: tokenHash,
                user_alias: userAlias,
                created_at: new Date().toISOString(),
                expires_at: expiresAt, // epoch seconds for DynamoDB TTL
                revoked: false,
                user_agent: meta?.userAgent ?? null,
                ip_address: meta?.ip ?? null,
            },
            ConditionExpression: "attribute_not_exists(token_hash)",
        }));
        return token;
    }
    /**
     * Validate raw token; returns userAlias if valid, otherwise null.
     */
    async validateAuthToken(token) {
        const tokenHash = this.hashToken(token);
        const r = await this.ddb.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { token_hash: tokenHash },
        }));
        if (!r.Item)
            return null;
        if (r.Item.revoked)
            return null;
        // DynamoDB TTL is eventually consistent (item may remain briefly after expiry).
        // Double-check expires_at to ensure immediate invalidation.
        const now = Math.floor(Date.now() / 1000);
        if (r.Item.expires_at && r.Item.expires_at < now)
            return null;
        return r.Item.user_alias;
    }
    async revokeAuthToken(token) {
        const tokenHash = this.hashToken(token);
        await this.ddb.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.tableName,
            Key: { token_hash: tokenHash },
            UpdateExpression: "SET revoked = :t",
            ExpressionAttributeValues: { ":t": true },
        }));
    }
    async revokeAllForUser(userAlias) {
        const q = await this.ddb.send(new lib_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            IndexName: "user_index",
            KeyConditionExpression: "user_alias = :u",
            ExpressionAttributeValues: { ":u": userAlias },
            ProjectionExpression: "token_hash",
        }));
        if (!q.Items || q.Items.length === 0)
            return;
        for (const it of q.Items) {
            // token_hash property name is stored in the table; TypeScript `any` here.
            const tokenHash = it.token_hash;
            if (!tokenHash)
                continue;
            await this.ddb.send(new lib_dynamodb_1.UpdateCommand({
                TableName: this.tableName,
                Key: { token_hash: tokenHash },
                UpdateExpression: "SET revoked = :t",
                ExpressionAttributeValues: { ":t": true },
            }));
        }
    }
}
exports.DynamoAuthDao = DynamoAuthDao;
exports.default = DynamoAuthDao;
