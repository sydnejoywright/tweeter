import { User, UserDto } from "tweeter-shared";

export interface FollowDao {
  getFolloweeItems(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  getFollowerItems(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  getIsFollowerStatus(user: UserDto, selectedUser: UserDto): Promise<boolean>;

  getFolloweeCount(user: UserDto): Promise<number>;
  getFollowerCount(user: UserDto): Promise<number>;

  follow(currentUser: UserDto, userToFollow: UserDto): Promise<void>;
  unfollow(currentUser: UserDto, userToUnfollow: UserDto): Promise<void>;
}
