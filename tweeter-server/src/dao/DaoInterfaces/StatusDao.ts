import { StatusDto } from "tweeter-shared";

export interface StatusDao {
  getFeedItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;

  getStoryItems(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;

  postStatus(newStatus: StatusDto): Promise<void>;
}
