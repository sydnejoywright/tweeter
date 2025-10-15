import { AuthToken, Status} from "tweeter-shared";
import { StatusItemPresenter} from "./StatusItemPresenter";
import { PAGE_SIZE} from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter{
    protected itemDescription(): string {
      return "load feed items";
    }
    protected getMoreItems(authtoken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
      return this.service.loadMoreFeedItems(authtoken,userAlias,PAGE_SIZE,this.lastItem);
    }
}