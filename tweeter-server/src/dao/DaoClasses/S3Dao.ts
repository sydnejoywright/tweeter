import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { UserImageDao } from "../DaoInterfaces/UserImageDao";

export class S3Dao implements UserImageDao {
  private bucketName: string;
  private client: S3Client;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
    this.client = new S3Client({});
  }

  async uploadUserImage(
    userId: string,
    imageBytes: Uint8Array,
    extension: string
  ): Promise<string> {
    const key = `users/${userId}.${extension}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: imageBytes,
      })
    );
    return key;
  }

  async deleteUserImage(userId: string, extension: string): Promise<void> {
    const key = `users/${userId}.${extension}`;
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
  }
}
