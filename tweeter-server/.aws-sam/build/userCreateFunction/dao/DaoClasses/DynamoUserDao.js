"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoUserDao = void 0;
// dao/DaoClasses/DynamoUserDao.ts
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
class DynamoUserDao {
    ddb;
    tableName;
    imageDao;
    constructor(tableName, imageDao) {
        this.ddb = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
        this.tableName = tableName;
        this.imageDao = imageDao;
    }
    /**
     * Create a user.
     * - uploads the image
     * - hashes password
     * - writes DB with conditional expression to ensure alias uniqueness
     * - cleans up S3 image on DB failure (best-effort)
     */
    async createUser(user, password, imageBytes, imageExt) {
        const userId = (0, uuid_1.v4)();
        let imageUrl = null;
        // 1) upload image first (we need a URL to store in the user record)
        if (imageBytes && imageExt) {
            try {
                imageUrl = await this.imageDao.uploadUserImage(userId, imageBytes, imageExt);
            }
            catch (err) {
                // bubble up a clear error
                throw new Error("Failed to upload user image");
            }
        }
        // 2) hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 3) build item — use clear names
        const item = {
            userId,
            alias: user.alias,
            firstName: user.firstName,
            lastName: user.lastName,
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString(),
        };
        if (imageBytes && imageExt && imageUrl) {
            item.imageUrl = imageUrl;
            item.imageFileExtension = imageExt;
        }
        // 4) attempt to write with conditional to ensure alias uniqueness
        try {
            await this.ddb.send(new lib_dynamodb_1.PutCommand({
                TableName: this.tableName,
                Item: item,
                ConditionExpression: "attribute_not_exists(alias)", // fail if alias exists
            }));
        }
        catch (err) {
            // DB write failed — attempt to delete uploaded image (best-effort cleanup)
            try {
                if (imageUrl && imageExt) {
                    await this.imageDao.deleteUserImage(userId, imageExt);
                }
            }
            catch (_) { }
            if (err?.name === "ConditionalCheckFailedException") {
                throw new Error("Alias already exists");
            }
            throw err;
        }
    }
    async getUserByAlias(alias) {
        const result = await this.ddb.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { alias },
        }));
        if (!result.Item)
            return null;
        const item = result.Item;
        const userDto = {
            firstName: item.firstName,
            lastName: item.lastName,
            alias: item.alias,
            imageUrl: item.imageUrl ?? null,
        };
        return userDto;
    }
}
exports.DynamoUserDao = DynamoUserDao;
exports.default = DynamoUserDao;
