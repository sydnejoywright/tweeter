import { UserService } from "../model.service/UserService";
import { AuthMessages, AuthPresenter } from "./AuthPresenter";

export class RegisterPresenter extends AuthPresenter<AuthMessages>{
    private service = new UserService;

    public constructor(view: AuthMessages){
        super(view)
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string){
      await this.doAuthAction(
        async () => {
          this.view.setLoading(true);
    
          const [user, authToken] = await this.service.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
          );
    
          this.view.updateUserInfo(user, authToken, this.view.rememberMe);
          this.view.navigateTo(`/feed/${user.alias}`);
        }
        , "register user"
      )
    };

}