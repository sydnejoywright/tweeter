import { AuthToken, User } from "tweeter-shared";
import UserService from "../model.service/UserService";

export interface NavToUserView{
    setDisplayedUser(user: User): void;
    navigateTo: (path: string) => void;
    displayErrorMessage(message: string):void;
}

export class NavToUserPresenter{
        service: UserService
        private _view: NavToUserView
    
        public constructor(view: NavToUserView){
            this.service = new UserService
            this._view = view;
        }

        public getUser(){
            return this.service.getUser;
        }

        public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, displayedUser: User): Promise<void>{
        
            try {
              const alias = this.extractAlias(event.target.toString());
              const featurePath = this.extractFeaturePath(event.target.toString());
              const toUser = await this.service.getUser(authToken!, alias);
        
              if (toUser) {
                if (!toUser.equals(displayedUser!)) {
                  this._view.setDisplayedUser(toUser);
                  this._view.navigateTo(`${featurePath}/${toUser.alias}`);
                }
              }
            } catch (error) {
              this._view.displayErrorMessage(
                `Failed to get user because of exception: ${error}`,
              );
            }
          };

          public extractAlias(value: string): string{
            const index = value.indexOf("@");
            return value.substring(index);
          };
    
          public extractFeaturePath(url: string): string{
            const urlObject = new URL(url);
            return urlObject.pathname.replace(/\/@[^/]+$/, "");
          };
    
}