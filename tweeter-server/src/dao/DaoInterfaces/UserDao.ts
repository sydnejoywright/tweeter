import { UserDto } from "tweeter-shared";

export interface UserDao {
  createUser(
    user: UserDto,
    password: string,
    imageBytes?: Uint8Array,
    imageExt?: string
  ): Promise<void>;

  getUserByAlias(alias: string): Promise<UserDto | null>;
}
