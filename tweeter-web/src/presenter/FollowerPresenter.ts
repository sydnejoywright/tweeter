import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter} from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends UserItemPresenter{
    protected itemDescription(): string {
        return "load followers";
    }
    protected getMoreItems(authtoken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
        return this.service.loadMoreFollowers(authtoken, userAlias, PAGE_SIZE, this.lastItem);
    }
}