import { AuthToken, User, FakeData, UserDto} from "tweeter-shared";
import { Service } from "./Service";

export class FollowService implements Service{

      public async loadMoreFollowees(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };
    
      public async loadMoreFollowers(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return this.getFakeData(lastItem, pageSize, userAlias);
      };

      private async getFakeData(lastItem: UserDto | null, pageSize: number, userAlias: string) : Promise<[UserDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
        const dtos = items.map((user) => user.dto);
        return [dtos, hasMore];
      }

      public async getIsFollowerStatus(
        authToken: string,
        user: UserDto,
        selectedUser: UserDto
        ): Promise<boolean> {
          console.log("Hit server side FollowService!")
        return FakeData.instance.isFollower();
        };
    
      public async getFolloweeCount (
          authToken: string,
          user: UserDto
        ): Promise<number> {
          return FakeData.instance.getFolloweeCount(User.fromDto(user)!.alias);
        };
  
      public async getFollowerCount (
      authToken: string,
      user: UserDto
      ): Promise<number>{
      // TODO: Replace with the result of calling server
        return FakeData.instance.getFollowerCount(User.fromDto(user)!.alias);
      };
  
      public async follow(
          authToken: AuthToken,
          userToFollow: User
        ): Promise<[followerCount: number, followeeCount: number]> {
          // Pause so we can see the follow message. Remove when connected to the server
          await new Promise((f) => setTimeout(f, 2000));
      
          // TODO: Call the server
      
          const followerCount = await this.getFollowerCount(authToken.token, userToFollow);
          const followeeCount = await this.getFolloweeCount(authToken.token, userToFollow);
      
          return [followerCount, followeeCount];
        };
  
        public async unfollow(
          authToken: AuthToken,
          userToUnfollow: User
        ): Promise<[followerCount: number, followeeCount: number]>{
          // Pause so we can see the unfollow message. Remove when connected to the server
          await new Promise((f) => setTimeout(f, 2000));
      
          // TODO: Call the server
      
          const followerCount = await this.getFollowerCount(authToken.token, userToUnfollow);
          const followeeCount = await this.getFolloweeCount(authToken.token, userToUnfollow);
      
          return [followerCount, followeeCount];
        };

}

export default FollowService;