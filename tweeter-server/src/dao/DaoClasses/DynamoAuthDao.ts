import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import { AuthDao } from "../DaoInterfaces/AuthDao"; // adjust path as needed

export class DynamoAuthDao implements AuthDao {
  private client: DynamoDBClient;
  private ddb: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName = process.env.SESSIONS_TABLE!) {
    if (!tableName) {
      throw new Error("SESSIONS_TABLE not provided");
    }
    this.client = new DynamoDBClient({});
    this.ddb = DynamoDBDocumentClient.from(this.client);
    this.tableName = tableName;
  }

  private hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
  public async createAuthToken(
    userAlias: string,
    ttlSeconds: number,
    meta?: { userAgent?: string; ip?: string }
  ): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(token);
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + ttlSeconds;

    await this.ddb.send(
      new PutCommand({
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
      })
    );

    return token;
  }

  /**
   * Validate raw token; returns userAlias if valid, otherwise null.
   */
  public async validateAuthToken(token: string): Promise<string | null> {
    const tokenHash = this.hashToken(token);
    const r = await this.ddb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { token_hash: tokenHash },
      })
    );

    if (!r.Item) return null;
    if (r.Item.revoked) return null;

    // DynamoDB TTL is eventually consistent (item may remain briefly after expiry).
    // Double-check expires_at to ensure immediate invalidation.
    const now = Math.floor(Date.now() / 1000);
    if (r.Item.expires_at && r.Item.expires_at < now) return null;

    return r.Item.user_alias as string;
  }

  public async revokeAuthToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    await this.ddb.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { token_hash: tokenHash },
        UpdateExpression: "SET revoked = :t",
        ExpressionAttributeValues: { ":t": true },
      })
    );
  }

  public async revokeAllForUser(userAlias: string): Promise<void> {
    const q = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: "user_index",
        KeyConditionExpression: "user_alias = :u",
        ExpressionAttributeValues: { ":u": userAlias },
        ProjectionExpression: "token_hash",
      })
    );

    if (!q.Items || q.Items.length === 0) return;

    for (const it of q.Items) {
      // token_hash property name is stored in the table; TypeScript `any` here.
      const tokenHash = (it as any).token_hash;
      if (!tokenHash) continue;
      await this.ddb.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { token_hash: tokenHash },
          UpdateExpression: "SET revoked = :t",
          ExpressionAttributeValues: { ":t": true },
        })
      );
    }
  }
}

export default DynamoAuthDao;
