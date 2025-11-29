import { FakeData, UserDto } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service{
    public async getUser  (
        authToken: string,
        alias: string
    ): Promise<UserDto | null> {
        return this.getFakeUser(alias)
    };

    private async getFakeUser(userAlias: string) : Promise<UserDto | null> {
      const user = FakeData.instance.findUserByAlias(userAlias);
      if(!user){
        return null;
      }
      return user.dto
    }

    public async login(
        alias: string,
        password: string
      ): Promise<[UserDto, string]> {
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
          throw new Error("Invalid alias or password");
        }
        return [user.dto, FakeData.instance.authToken.token];
      };

      public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
        ): Promise<[UserDto, string]> {
        
        const user = FakeData.instance.firstUser;
    
        if (user === null) {
            throw new Error("Invalid registration");
        }
        return [user.dto, FakeData.instance.authToken.token];
        };

      public async logout(
        authToken: string
      ): Promise<void>{
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
      };
}

export default UserService;