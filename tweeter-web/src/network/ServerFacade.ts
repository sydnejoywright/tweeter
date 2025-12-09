import {
  AuthToken,
  FollowRequest,
  FollowResponse,
  GetFeedItemsRequest,
  GetFeedItemsResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  RegisterRequest,
  RegisterResponse,
  Status,
  TweeterResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://2a92vvdql8.execute-api.us-east-1.amazonaws.com/prod";
  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  private fixUserImageUrl(user: User | null): void {
    if (user?.imageUrl && !user.imageUrl.startsWith("http")) {
      const bucket = "tweeter-server-profile-pics-try1";
      const region = "us-east-1";
      user.imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${user.imageUrl}`;
    }
  }

  /// FOLLOW //////////////////////////////////////////////////////////////////////////

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/followee/list");

    const items: User[] | null =
      response.success && response.items
        ? response.items
            .map((dto) => {
              const user = User.fromDto(dto);
              this.fixUserImageUrl(user);
              return user;
            })
            .filter((u): u is User => u !== null)
        : null;

    if (response.success) {
      if (!items) throw new Error(`No followees found`);
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follower/list");

    const items: User[] | null =
      response.success && response.items
        ? response.items
            .map((dto) => {
              const user = User.fromDto(dto);
              this.fixUserImageUrl(user);
              return user;
            })
            .filter((u): u is User => u !== null)
        : null;

    if (response.success) {
      if (!items) throw new Error(`No followers found`);
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getFolloweeCount(
    request: GetFollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/followee/count");

    if (response.success) return response.count ?? 0;
    console.error(response);
    throw new Error(response.message ?? undefined);
  }

  public async getFollowerCount(
    request: GetFollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follower/count");

    if (response.success) return response.count ?? 0;
    console.error(response);
    throw new Error(response.message ?? undefined);
  }

  public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
    >(request, "/follower/status");

    if (response.success) return response.following;
    console.error(response);
    throw new Error(response.message ?? undefined);
  }

  public async follow(request: FollowRequest): Promise<[number, number]> {
    const cleanRequest = {
      ...request,
      userToFollow:
        request.userToFollow instanceof User
          ? request.userToFollow.dto
          : request.userToFollow,
    };

    const response = await this.clientCommunicator.doPost<
      typeof cleanRequest,
      FollowResponse
    >(cleanRequest, "/follow/follow");

    if (
      response.success &&
      response.followeeCount != null &&
      response.followerCount != null
    ) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async unfollow(request: FollowRequest): Promise<[number, number]> {
    const cleanRequest = {
      ...request,
      userToFollow:
        request.userToFollow instanceof User
          ? request.userToFollow.dto
          : request.userToFollow,
    };

    const response = await this.clientCommunicator.doPost<
      typeof cleanRequest,
      FollowResponse
    >(cleanRequest, "/follow/unfollow");

    if (
      response.success &&
      response.followeeCount != null &&
      response.followerCount != null
    ) {
      return [response.followerCount, response.followeeCount];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  /// STATUS //////////////////////////////////////////////////////////////////////////

  /// STATUS //////////////////////////////////////////////////////////////////////////

  public async getFeedItems(
    request: GetFeedItemsRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      GetFeedItemsRequest,
      GetFeedItemsResponse
    >(request, "/feed/list");

    const items: Status[] | null =
      response.success && response.items
        ? response.items
            .map((dto) => {
              console.log("status dto:", dto);
              const status = Status.fromDto(dto);
              if (status?.user?.imageUrl) {
                // Prepend S3 bucket URL if not a full URL
                if (!status.user.imageUrl.startsWith("http")) {
                  status.user.imageUrl =
                    "https://tweeter-server-profile-pics-try1.s3.us-east-1.amazonaws.com/" +
                    status.user.imageUrl;
                }
              }
              return status;
            })
            .filter((s): s is Status => s !== null)
        : null;

    if (response.success) {
      if (!items) throw new Error(`No feed items found`);
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getStoryItems(
    request: GetFeedItemsRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      GetFeedItemsRequest,
      GetFeedItemsResponse
    >(request, "/story/list");

    const items: Status[] | null =
      response.success && response.items
        ? response.items
            .map((dto) => {
              const status = Status.fromDto(dto);
              if (status?.user?.imageUrl) {
                if (!status.user.imageUrl.startsWith("http")) {
                  status.user.imageUrl =
                    "https://tweeter-server-profile-pics-try1.s3.us-east-1.amazonaws.com/" +
                    status.user.imageUrl;
                }
              }
              return status;
            })
            .filter((s): s is Status => s !== null)
        : null;

    if (response.success) {
      if (!items) throw new Error(`No story items found`);
      return [items, response.hasMore];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const cleanRequest = {
      ...request,
      newStatus:
        request.newStatus instanceof Status
          ? request.newStatus.dto
          : request.newStatus,
    };

    const response = await this.clientCommunicator.doPost<
      typeof cleanRequest,
      TweeterResponse
    >(cleanRequest, "/status/poststatus");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  /// USER //////////////////////////////////////////////////////////////////////////

  public async getUser(request: GetUserRequest): Promise<User | null> {
    console.log(
      "ServerFacade.getUser received request:",
      JSON.stringify(request)
    );
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get");

    if (response.success) {
      const user = response.user ? User.fromDto(response.user) : null;
      this.fixUserImageUrl(user);
      return user;
    } else {
      console.error("Error fetching user:", response);
      throw new Error(response.message ?? "Unknown error");
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/user/login");

    console.log("login response.user:", response.user);

    if (response.success && response.user) {
      const user = User.fromDto(response.user);
      this.fixUserImageUrl(user);
      const authToken = new AuthToken(response.authToken, Date.now());
      if (!user) throw new Error("Failed to convert UserDto to User");
      return [user, authToken];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      RegisterResponse
    >(request, "/user/register");

    if (response.success && response.user) {
      const user = User.fromDto(response.user);
      this.fixUserImageUrl(user);
      const authToken = new AuthToken(response.authToken, Date.now());
      if (!user) throw new Error("Failed to convert UserDto to User");
      return [user, authToken];
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async logout(request: LogoutRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
    >(request, "/user/logout");

    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }
}
