import {
  AuthToken,
  User,
  PagedUserItemRequest,
  GetFollowCountRequest,
} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      authToken: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    try {
      return await this.serverFacade.getMoreFollowees(request);
    } catch (error) {
      console.error("Error loading followees:", error);
      return [[], false];
    }
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      authToken: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    try {
      return await this.serverFacade.getMoreFollowers(request);
    } catch (error) {
      console.error("Error loading followers:", error);
      return [[], false];
    }
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request = {
      authToken: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };
    try {
      return await this.serverFacade.getIsFollowerStatus(request);
    } catch (error) {
      console.error("Error loading follow status:", error);
      return false;
    }
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: GetFollowCountRequest = {
      authToken: authToken.token,
      user: user?.dto ?? null,
    };
    try {
      return await this.serverFacade.getFolloweeCount(request);
    } catch (error) {
      console.error("Error loading followee count:", error);
      return 0;
    }
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: GetFollowCountRequest = {
      authToken: authToken.token,
      user: user?.dto ?? null,
    };
    try {
      return await this.serverFacade.getFollowerCount(request);
    } catch (error) {
      console.error("Error loading follower count:", error);
      return 0;
    }
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      authToken: authToken.token,
      userToFollow: userToFollow.dto,
    };
    return await this.serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request = {
      authToken: authToken.token,
      userToFollow: userToUnfollow.dto,
    };
    return await this.serverFacade.follow(request);
  }
}
export default FollowService;
