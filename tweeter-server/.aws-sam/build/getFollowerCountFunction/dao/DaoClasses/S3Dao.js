"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Dao = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3Dao {
    bucketName;
    client;
    constructor(bucketName) {
        this.bucketName = bucketName;
        this.client = new client_s3_1.S3Client({});
    }
    async uploadUserImage(userId, imageBytes, extension) {
        const key = `users/${userId}.${extension}`;
        await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: imageBytes,
        }));
        return key;
    }
    async deleteUserImage(userId, extension) {
        const key = `users/${userId}.${extension}`;
        await this.client.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        }));
    }
}
exports.S3Dao = S3Dao;
