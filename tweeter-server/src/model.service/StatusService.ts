import { Status, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";
import { StatusDao } from "../dao/DaoInterfaces/StatusDao";
import { AuthDao } from "../dao/DaoInterfaces/AuthDao";
import { FollowDao } from "../dao/DaoInterfaces/FollowDao";
import { UserDao } from "../dao/DaoInterfaces/UserDao";

export class StatusService implements Service {
  private userDao: UserDao;
  private followDao: FollowDao;
  private authDao: AuthDao;
  private statusDao: StatusDao;

  constructor(
    userDao: UserDao,
    followDao: FollowDao,
    authDao: AuthDao,
    statusDao: StatusDao
  ) {
    this.userDao = userDao;
    this.followDao = followDao;
    this.authDao = authDao;
    this.statusDao = statusDao;
  }

  public async loadMoreFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    //To do: verify auth token?
    return await this.statusDao.getFeedItems(userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    //verify auth token?
    return await this.statusDao.getStoryItems(userAlias, pageSize, lastItem);
  }

  public async postStatus(newStatus: StatusDto): Promise<void> {
    //verify auth token?
    return await this.statusDao.postStatus(newStatus);
  }
}

export default StatusService;
