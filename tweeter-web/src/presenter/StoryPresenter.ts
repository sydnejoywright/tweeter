import { AuthToken, User } from "tweeter-shared";
import StatusService from "../model.service/StatusService";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./FolloweePresenter";

export interface StoryView{
    addItems: (items: User[]) => void
    displayErrorMessage: (message: string) => void
}

export class StoryPresenter extends StatusItemPresenter{

    private service: StatusService;

    public constructor (view: StatusItemView) {
        super(view);
        this.service = new StatusService();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string, itemDescription: string){
        try {
          const [newItems, hasMore] = await this.service.loadMoreStoryItems(
            authToken!,
            userAlias,
            PAGE_SIZE,
            this.lastItem
          );
    
          this.hasMoreItems = hasMore;
          this.lastItem = newItems[newItems.length - 1];
          this.view.addItems(newItems);
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to load ${itemDescription} items because of exception: ${error}`,
          );
        }
      };



}