export interface UserImageDao {
  uploadUserImage(
    userId: string,
    imageBytes: Uint8Array,
    extension: string
  ): Promise<string>;

  deleteUserImage(userId: string, extension: string): Promise<void>;
}
