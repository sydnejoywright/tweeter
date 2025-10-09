import { User, AuthToken} from "tweeter-shared";
import UserService from "../model.service/UserService";

export interface LoginView{
    displayErrorMessage: (message: string) => void
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    updateUserInfo(user: User, authToken: AuthToken, rememberMe: boolean): void;
    navigateTo(url: string): void;
}

export class LoginPresenter{
        private _view: LoginView;
        private userService: UserService;

    public constructor(view: LoginView){
        this._view = view;
        this.userService = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        try {
          this._view.setLoading(true);

          const [user, authToken] = await this.userService.login(alias, password);
    
          this._view.updateUserInfo(user, authToken, rememberMe);
    
          if (!!originalUrl) {
            this._view.navigateTo(originalUrl);
          } else {
            this._view.navigateTo(`/feed/${user.alias}`);
          }
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to log user in because of exception: ${error}`,
          );
        } finally {
          this._view.setLoading(false);
        }
      };

}
