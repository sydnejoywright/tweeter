import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { FollowDao } from "../dao/DaoInterfaces/FollowDao";
import { UserDao } from "../dao/DaoInterfaces/UserDao";

export class FollowService implements Service {
  private userDao: UserDao;
  private followDao: FollowDao;

  constructor(userDao: UserDao, followDao: FollowDao) {
    this.followDao = followDao;
    this.userDao = userDao;
  }

  public async loadMoreFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.followDao.getFolloweeItems(userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.followDao.getFollowerItems(userAlias, pageSize, lastItem);
  }

  public async getIsFollowerStatus(
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    return this.followDao.getIsFollowerStatus(user, selectedUser);
  }

  public async getFolloweeCount(user: UserDto): Promise<number> {
    return this.followDao.getFolloweeCount(user);
  }

  public async getFollowerCount(user: UserDto): Promise<number> {
    return this.followDao.getFollowerCount(user);
  }

  public async follow(
    currentUser: UserDto,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.followDao.follow(currentUser, userToFollow);

    const followerCount = await this.getFollowerCount(currentUser);
    const followeeCount = await this.getFolloweeCount(currentUser);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    currentUser: UserDto,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    await this.followDao.unfollow(currentUser, userToUnfollow);

    const followerCount = await this.getFollowerCount(currentUser);
    const followeeCount = await this.getFolloweeCount(currentUser);

    return [followerCount, followeeCount];
  }
}

export default FollowService;
