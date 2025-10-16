import UserService from "../model.service/UserService";
import { AuthMessages, AuthPresenter } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthMessages>{
        private userService: UserService;

    public constructor(view: AuthMessages){
        super(view)
        this.userService = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        await this.doAuthAction(
          async () => {
            const [user, authToken] = await this.userService.login(alias, password);
            this.view.updateUserInfo(user, authToken, rememberMe);
            if (!!originalUrl) {
              this.view.navigateTo(originalUrl);
            } else {
              this.view.navigateTo(`/feed/${user.alias}`); 
              }  
            }        
            , `log in`
        )
    }

}
