// dao/DaoClasses/DynamoUserDao.ts
import bcrypt from "bcryptjs";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { UserDto } from "tweeter-shared";
import { v4 as uuidv4 } from "uuid";
import { UserDao } from "../DaoInterfaces/UserDao";
import { UserImageDao } from "../DaoInterfaces/UserImageDao";

export class DynamoUserDao implements UserDao {
  private ddb: DynamoDBDocumentClient;
  private tableName: string;
  private imageDao: UserImageDao;

  constructor(tableName: string, imageDao: UserImageDao) {
    this.ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
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
  async createUser(
    user: UserDto,
    password: string,
    imageBytes?: Uint8Array,
    imageExt?: string
  ): Promise<void> {
    const userId = uuidv4();
    let imageUrl: string | null = null;

    // 1) upload image first (we need a URL to store in the user record)
    if (imageBytes && imageExt) {
      try {
        imageUrl = await this.imageDao.uploadUserImage(
          userId,
          imageBytes,
          imageExt
        );
      } catch (err) {
        // bubble up a clear error
        throw new Error("Failed to upload user image");
      }
    }

    // 2) hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) build item — use clear names
    const item: any = {
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
      await this.ddb.send(
        new PutCommand({
          TableName: this.tableName,
          Item: item,
          ConditionExpression: "attribute_not_exists(alias)", // fail if alias exists
        })
      );
    } catch (err) {
      // DB write failed — attempt to delete uploaded image (best-effort cleanup)
      try {
        if (imageUrl && imageExt) {
          await this.imageDao.deleteUserImage(userId, imageExt);
        }
      } catch (_) {}
      if ((err as any)?.name === "ConditionalCheckFailedException") {
        throw new Error("Alias already exists");
      }

      throw err;
    }
  }

  async getUserByAlias(alias: string): Promise<UserDto | null> {
    const result = await this.ddb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { alias },
      })
    );

    if (!result.Item) return null;
    const item = result.Item as any;

    const userDto: UserDto = {
      firstName: item.firstName,
      lastName: item.lastName,
      alias: item.alias,
      imageUrl: item.imageUrl ?? null,
    };

    return userDto;
  }
}

export default DynamoUserDao;
