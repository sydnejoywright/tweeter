import { User, AuthToken } from "tweeter-shared";

export interface AuthMessages{
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    displayErrorMessage: (message: string) => void;
    updateUserInfo(user: User, authToken: AuthToken, rememberMe: boolean): void;
    navigateTo(url: string): void;
    rememberMe: boolean;
}
export abstract class AuthPresenter<V extends AuthMessages>{
    protected view: V;

    protected constructor(view: V){
        this.view = view
    }

    protected async doAuthAction(authFun: () => Promise<void>, action: string): Promise<void> {
        try {
          this.view.setLoading(true);
          await authFun();
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to ${action} because of exception: ${error}`,
              );
            } finally {
              this.view.setLoading(false);
            }
    }
}