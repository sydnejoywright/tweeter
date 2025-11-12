import {
  AuthToken,
  LoginRequest,
  LoginResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
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

    public async getIsFollowerStatus(){}
    public async getFolloweeCount(){}
    public async getFollowerCount(){}
    public async follow(){}
    public async unfollow(){}

    ///STATUS//////////////////////////////////////////////////////////////////////////////
    public async getMoreFeedItems(){}
    public async getMoreStoryItems(){}
    public async postStatus(){}

    ///USER//////////////////////////////////////////////////////////////////////////////
    public async getUser(){}

    // public async login(
    //   request: LoginRequest
    // ): Promise<[UserDto, AuthToken]> {
    //   const response = await this.clientCommunicator.doPost<
    //     LoginRequest,
    //     LoginResponse
    //   >(request, "/login");
  
    //   // Convert the UserDto array returned by ClientCommunicator to a User array
    //   const items: User[] | null =
    //     response.success && response.items
    //       ? response.items.map((dto) => User.fromDto(dto) as User)
    //       : null;
  
    //   // Handle errors
    //   if (response.success) {
    //     if (items == null) {
    //       throw new Error(`No followers found`);
    //     } else {
    //       return [items, response.hasMore];
    //     }
    //   } else {
    //     console.error(response);
    //     throw new Error(response.message ?? undefined);
    //   }
    // }

    public async register(){}
    public async logout(){}

  }