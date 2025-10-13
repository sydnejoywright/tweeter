import { AuthToken, Status, User } from "tweeter-shared";
import StatusService from "../model.service/StatusService"

export interface PostStatusView{
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => string;
    deleteMessage: (messageId: string) => void;
  
    setLoading: (v: boolean) => void;
    setPost: (v: string) => void;
}

export class PostStatusPresenter{
    service: StatusService
    private _view: PostStatusView

    public constructor(view: PostStatusView){
        this.service = new StatusService
        this._view = view;
    }

      public async submitPost (post: string, currentUser: User, authtoken: AuthToken) {
        var postingStatusToastId = "";
    
        try {
          this._view.setLoading(true);
          postingStatusToastId = this._view.displayInfoMessage(
            "Posting status...",
            0
          );
    
          const status = new Status(post, currentUser!, Date.now());
    
          await this.service.postStatus(authtoken!, status);
    
          this._view.setPost("");
          this._view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`,
          );
        } finally {
          this._view.deleteMessage(postingStatusToastId);
          this._view.setLoading(false);
        }
      };



}