import { AuthDao } from "../../dao/DaoInterfaces/AuthDao";
import { UserDao } from "../../dao/DaoInterfaces/UserDao";
import { UserDto } from "tweeter-shared";

export class AuthorizationError extends Error {
  constructor(msg = "Unauthorized") {
    super(msg);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class AuthorizationService {
  private authDao: AuthDao;
  private userDao: UserDao;

  constructor(authDao: AuthDao, userDao: UserDao) {
    this.authDao = authDao;
    this.userDao = userDao;
  }

  public async authenticate(authToken: string): Promise<UserDto> {
    const alias = await this.authDao.validateAuthToken(authToken);
    if (!alias) throw new AuthorizationError("Invalid or expired auth token");

    const user = await this.userDao.getUserByAlias(alias);
    if (!user) throw new AuthorizationError("User not found");

    return user;
  }
}
