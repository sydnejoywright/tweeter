import { Buffer } from "buffer";
import { AuthToken, User, GetUserRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service {
  private serverFacade = new ServerFacade();

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    console.log("UserService.getUser called with:", { authToken, alias });
    const request: GetUserRequest = {
      authToken: authToken.token,
      userAlias: alias,
    };
    try {
      return await this.serverFacade.getUser(request);
    } catch (error) {
      console.error("Error loading user:", error);
      return null;
    }
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const request = {
      alias: alias,
      password: password,
    };
    try {
      return await this.serverFacade.login(request);
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error("Login failed");
    }
  }

  public async register(
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
      imageFileExtension: imageFileExtension,
    };

    try {
      return await this.serverFacade.register(request);
    } catch (error) {
      console.error("Error registering:", error);
      throw new Error("Register failed");
    }
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request = {
      authToken: authToken,
    };
    try {
      return await this.serverFacade.logout(request);
    } catch (error) {
      console.error("Error logging out:", error);
      throw new Error("Logout failed");
    }
  }
}

export default UserService;
