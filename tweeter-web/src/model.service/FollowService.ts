import { AuthToken, User, FakeData, PagedUserItemRequest, GetFollowCountRequest} from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service{
      private serverFacade = new ServerFacade();

      public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        const request: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem?.dto ?? null,
        };
        // TODO: Replace with the result of calling server
        try{
          return await this.serverFacade.getMoreFollowees(request);
        } catch (error) {
          console.error("Error loading followees:", error);
          return [[], false];
        }
      };
    
      public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        const request: PagedUserItemRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem?.dto ?? null,
        };
        // TODO: Replace with the result of calling server
        try{
          return await this.serverFacade.getMoreFollowers(request);
        } catch (error) {
          console.error("Error loading followers:", error);
          return [[], false];
        }
      };

      public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User
        ): Promise<boolean> {
          const request = {
            token: authToken.token,
            user: user,
            selectedUser: selectedUser
          }
          try{
            return await this.serverFacade.getIsFollowerStatus(request);
          } catch (error) {
            console.error("Error loading follow status:", error);
            return false;
          }
        };
    
      public async getFolloweeCount (
          authToken: AuthToken,
          user: User
        ): Promise<number> {
          const request: GetFollowCountRequest = {
            token: authToken.token,
            user: user?.dto ?? null,
          };
          try{
            return await this.serverFacade.getFolloweeCount(request);
          } catch (error) {
            console.error("Error loading followee count:", error);
            return 0;
          }
        };
  
      public async getFollowerCount (
        authToken: AuthToken,
        user: User
      ): Promise<number> {
        const request: GetFollowCountRequest = {
          token: authToken.token,
          user: user?.dto ?? null,
        };
        try{
          return await this.serverFacade.getFollowerCount(request);
        } catch (error) {
          console.error("Error loading follower count:", error);
          return 0;
        }
      };
  
      public async follow(
          authToken: AuthToken,
          userToFollow: User
        ): Promise<[followerCount: number, followeeCount: number]> {
          // Pause so we can see the follow message. Remove when connected to the server
          await new Promise((f) => setTimeout(f, 2000));
      
          // TODO: Call the server
      
          const followerCount = await this.getFollowerCount(authToken, userToFollow);
          const followeeCount = await this.getFolloweeCount(authToken, userToFollow);
      
          return [followerCount, followeeCount];
        };
  
        public async unfollow(
          authToken: AuthToken,
          userToUnfollow: User
        ): Promise<[followerCount: number, followeeCount: number]>{
          // Pause so we can see the unfollow message. Remove when connected to the server
          await new Promise((f) => setTimeout(f, 2000));
      
          // TODO: Call the server
      
          const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
          const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);
      
          return [followerCount, followeeCount];
        };

}

export default FollowService;