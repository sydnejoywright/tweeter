import { AuthToken, Status, GetFeedItemsRequest } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service {
  private serverFacade = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: GetFeedItemsRequest = {
      authToken: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    try {
      return await this.serverFacade.getFeedItems(request);
    } catch (error) {
      console.error("Error loading feed items:", error);
      return [[], false];
    }
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: GetFeedItemsRequest = {
      authToken: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null,
    };
    try {
      return await this.serverFacade.getStoryItems(request);
    } catch (error) {
      console.error("Error loading feed items:", error);
      return [[], false];
    }
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request = {
      authToken: authToken.token,
      newStatus: newStatus,
    };
    return await this.serverFacade.postStatus(request);
  }
}

export default StatusService;
