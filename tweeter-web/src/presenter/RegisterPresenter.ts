import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";


export interface RegisterView{
    displayErrorMessage: (message: string) => void
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    updateUserInfo(user: User, authToken: AuthToken, rememberMe: boolean): void;
    navigateTo(url: string): void;
    rememberMe: boolean;
}

export class RegisterPresenter{
    private service: UserService;
    private _view: RegisterView;

    public constructor(view: RegisterView){
        this.service = new UserService;
        this._view = view
    }

    public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string){
        try {
          this._view.setLoading(true);
    
          const [user, authToken] = await this.service.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
          );
    
          this._view.updateUserInfo(user, authToken, this._view.rememberMe);
          this._view.navigateTo(`/feed/${user.alias}`);
        } catch (error) {
          this._view.displayErrorMessage(
            `Failed to register user because of exception: ${error}`,
          );
        } finally {
          this._view.setLoading(false);
        }
      };

}