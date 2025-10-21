import { AuthToken } from "tweeter-shared";
import UserService from "../model.service/UserService";

export interface LogoutView{
    displayErrorMessage(message: string): void;
    displayInfoMessage(message: string, duration: number): string;
    deleteMessage(toastId: string): void;
    clearUserInfo(): void;
    navigateTo(url: string): void;
    
}

export class LogoutPresenter{
        private _view: LogoutView;
        private userService: UserService;

    public constructor(view: LogoutView){
        this._view = view;
        this.userService = new UserService();
    }

    public get service(){
      return this.userService;
    }

    public async logOut(authToken: AuthToken){
        const loggingOutToastId = this._view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.service.logout(authToken!);
    
          this._view.deleteMessage(loggingOutToastId);
          this._view.clearUserInfo();
          this._view.navigateTo("/login");
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to log user out because of exception: ${error}`,
          );
        }
      };
}