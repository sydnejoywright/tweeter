import { Status, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { StatusDto } from "tweeter-shared/dist/model/dto/StatusDto";

export class StatusService implements Service{

      public async loadMoreFeedItems(
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize, userAlias);
      };

      private async getFakeData(lastItem: StatusDto | null, pageSize: number, userAlias: string) : Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
      }
  
      public async loadMoreStoryItems(
        authToken: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
      ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize, userAlias);
      };

      public async postStatus (
        authToken: string,
        newStatus: StatusDto
      ): Promise<void> {
        await new Promise((f) => setTimeout(f, 2000));
      };
}

export default StatusService;