import { AuthToken, Status, FakeData, GetFeedItemsRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service{
      private serverFacade = new ServerFacade();
      
      public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        const request: GetFeedItemsRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem?.dto ?? null,
        };
        // TODO: Replace with the result of calling server
        try{
          return await this.serverFacade.getFeedItems(request);
        } catch (error) {
          console.error("Error loading feed items:", error);
          return [[], false];
        }
      };

      public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
      ): Promise<[Status[], boolean]> {
        const request: GetFeedItemsRequest = {
          token: authToken.token,
          userAlias: userAlias,
          pageSize: pageSize,
          lastItem: lastItem?.dto ?? null,
        };
        // TODO: Replace with the result of calling server
        try{
          return await this.serverFacade.getStoryItems(request);
        } catch (error) {
          console.error("Error loading feed items:", error);
          return [[], false];
        }
      };

      public async postStatus (
        authToken: AuthToken,
        newStatus: Status
      ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));
    
        // TODO: Call the server to post the status
      };
}

export default StatusService;