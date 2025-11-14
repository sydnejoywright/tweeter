import { Buffer } from "buffer";
import { AuthToken, User, FakeData, GetUserRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service{
    private serverFacade = new ServerFacade();

    public async getUser(
      authToken: AuthToken,
      alias: string
    ): Promise<User | null> {
      console.log("UserService.getUser called with:", { authToken, alias });
      const request: GetUserRequest = {
        token: authToken.token,
        userAlias: alias
      };
  
      try {
        return await this.serverFacade.getUser(request);
      } catch (error) {
        console.error("Error loading user:", error);
        return null;
      }
    };

    public async login(
        alias: string,
        password: string
      ): Promise<[User, AuthToken]> {
        // TODO: Replace with the result of calling the server
        const request = {
          alias: alias,
          password: password
        }
        return await this.serverFacade.login(request)
      };

      public async register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
        ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");
        
        const request = {
          firstName: firstName,
          lastName: lastName,
          alias: alias,
          password: password,
          userImageBytes: imageStringBase64,
          imageFileExtension: imageFileExtension
        }

        return await this.serverFacade.register(request)
        // const user = FakeData.instance.firstUser;
    
        // if (user === null) {
        //     throw new Error("Invalid registration");
        // }
    
        // return [user, FakeData.instance.authToken];
        };

      public async logout(authToken: AuthToken): Promise<void>{
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        const request = {authToken: authToken}
        return await this.serverFacade.logout(request);
        
        // new Promise((res) => setTimeout(res, 1000));
      };
    
}

export default UserService;