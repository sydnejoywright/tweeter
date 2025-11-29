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
    private SERVER_URL = "https://2a92vvdql8.execute-api.us-east-1.amazonaws.com/prod";
  
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    ///FOLLOW//////////////////////////////////////////////////////////////////////////////
  
    public async getMoreFollowees(
      request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        PagedUserItemRequest,
        PagedUserItemResponse
      >(request, "/followee/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors
      if (response.success) {
        if (items == null) {
          throw new Error(`No followees found`);
        } else {
          return [items, response.hasMore];
        }
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
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: User[] | null =
        response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
  
      // Handle errors
      if (response.success) {
        if (items == null) {
          throw new Error(`No followers found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    public async getFolloweeCount(request: GetFollowCountRequest): Promise<number>{
      const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/followee/count");

      if(response.success){
        return response.count ?? 0
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    public async getFollowerCount(request: GetFollowCountRequest): Promise<number>{
      const response = await this.clientCommunicator.doPost<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/follower/count");

      if(response.success){
        return response.count ?? 0
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }
    
    public async getIsFollowerStatus(request: GetIsFollowerStatusRequest): Promise <boolean>{
      const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
    >(request, "/follower/status");

      if(response.success){
        return response.following
      }else{
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    public async follow(request: FollowRequest): Promise <[followerCount: number, followeeCount: number]>{
      const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/follow");

      if(response.success && response.followeeCount && response.followerCount){
        return [response.followerCount, response.followeeCount]
      }else{
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    public async unfollow(request: FollowRequest): Promise <[followerCount: number, followeeCount: number]>{
      const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/unfollow");

      if(response.success && response.followeeCount && response.followerCount){
        return [response.followerCount, response.followeeCount]
      }else{
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    ///STATUS//////////////////////////////////////////////////////////////////////////////
    public async getFeedItems(
      request: GetFeedItemsRequest
    ): Promise<[Status[], boolean]> {
      const response = await this.clientCommunicator.doPost<
        GetFeedItemsRequest,
        GetFeedItemsResponse
      >(request, "/feed/list");
  
      // Convert the UserDto array returned by ClientCommunicator to a User array
      const items: Status[] | null =
        response.success && response.items
          ? response.items.map((dto) => Status.fromDto(dto) as Status)
          : null;
  
      // Handle errors
      if (response.success) {
        if (items == null) {
          throw new Error(`No feed items found`);
        } else {
          return [items, response.hasMore];
        }
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
          ? response.items.map((dto) => Status.fromDto(dto) as Status)
          : null;
  
      if (response.success) {
        if (items == null) {
          throw new Error(`No story items found`);
        } else {
          return [items, response.hasMore];
        }
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    public async postStatus(
      request: PostStatusRequest
    ): Promise<void> {
      const response = await this.clientCommunicator.doPost<
        PostStatusRequest,
        TweeterResponse
      >(request, "/status/poststatus");

      if(response.success){
        return;
      }else{
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    ///USER//////////////////////////////////////////////////////////////////////////////
    public async getUser(request:GetUserRequest) : Promise<User | null>{
      console.log("ServerFacade.getUser received request:", JSON.stringify(request));
      const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
      >(request, "/user/get");

      if (response.success) {
        console.log(response.user)
        return response.user? User.fromDto(response.user) : null;
      } else {
        console.error("Error fetching user:", response);
        throw new Error(response.message ?? "Unknown error");
      }
    }

    public async login(
      request: LoginRequest
    ): Promise<[User, AuthToken]> {
      const response = await this.clientCommunicator.doPost<
        LoginRequest,
        LoginResponse
      >(request, "/user/login");
  
      // Convert the UserDto returned by ClientCommunicator to a User
      
      if(response.success && response.user){
        const user = User.fromDto(response.user)
        const authToken = new AuthToken(response.authToken, Date.now());
        if (!user) {
          throw new Error("Failed to convert UserDto to User");
        }
        return [user, authToken]
      } else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    public async register(
      request: RegisterRequest
    ): Promise<[User, AuthToken]> {
      const response = await this.clientCommunicator.doPost<
        RegisterRequest,
        RegisterResponse
      >(request, "/user/register");
        
      if(response.success && response.user){
        const user = User.fromDto(response.user)
        const authToken = new AuthToken(response.authToken, Date.now());
        if (!user) {
          throw new Error("Failed to convert UserDto to User");
        }
        return [user, authToken]
      }else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

    public async logout(
      request: LogoutRequest
    ): Promise<void>{
      const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      TweeterResponse
      >(request, '/user/logout')

      if(response.success && response.success){
        return;
      }else {
        console.error(response);
        throw new Error(response.message ?? undefined);
      }
    }

  }