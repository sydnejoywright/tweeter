import { UserDto } from "tweeter-shared";
import { Service } from "./Service";
import { UserDao } from "../dao/DaoInterfaces/UserDao";
import { AuthDao } from "../dao/DaoInterfaces/AuthDao";
import { S3Dao } from "../dao/DaoClasses/S3Dao";

export class UserService implements Service {
  private userDao: UserDao;
  private imageDao: S3Dao;
  private authDao: AuthDao;
  private tokenLife: number;

  constructor(
    userDao: UserDao,
    imageDao: S3Dao,
    authDao: AuthDao,
    tokenLife = 600
  ) {
    this.userDao = userDao;
    this.imageDao = imageDao;
    this.authDao = authDao;
    this.tokenLife = tokenLife;
  }

  public async getUser(alias: string): Promise<UserDto | null> {
    return this.userDao.getUserByAlias(alias);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    const user = await this.userDao.getUserByAlias(alias);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    const token = await this.authDao.createAuthToken(alias, this.tokenLife);
    return [user, token];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    const imageUrl = await this.imageDao.uploadUserImage(
      alias,
      userImageBytes,
      imageFileExtension
    );
    const user: UserDto = {
      firstName,
      lastName,
      alias,
      imageUrl: imageUrl,
    };
    await this.userDao.createUser(
      user,
      password,
      userImageBytes,
      imageFileExtension
    );
    const authToken = await this.authDao.createAuthToken(alias, this.tokenLife);
    return [user, authToken];
  }

  public async logout(authToken: string): Promise<void> {
    await this.authDao.revokeAuthToken(authToken);
  }
}

export default UserService;
