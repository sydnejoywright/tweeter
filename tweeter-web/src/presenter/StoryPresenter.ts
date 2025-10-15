import { AuthToken, Status} from "tweeter-shared";
import { StatusItemPresenter} from "./StatusItemPresenter";
import { PAGE_SIZE} from "./PagedItemPresenter";

export class StoryPresenter extends StatusItemPresenter{
    protected itemDescription(): string {
      return "story items";
    }
    protected getMoreItems(authtoken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
      return this.service.loadMoreStoryItems(authtoken,userAlias,PAGE_SIZE, this.lastItem)
    }
}