import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../authenticationFields/AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActionsHooks } from "../../userInfo/UserInfoHooks";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthMessages } from "../../../presenter/AuthPresenter";

interface Props {
  originalUrl?: string;
  presenterFactory: (view: AuthMessages) => LoginPresenter
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActionsHooks();
  const { displayErrorMessage } = useMessageActions();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const listener: AuthMessages = {
    displayErrorMessage: displayErrorMessage,
    setLoading: setIsLoading,
    updateUserInfo: (user, authToken, remember) =>
      updateUserInfo(user, user, authToken, remember),
    navigateTo: (url) => navigate(url),
    rememberMe: rememberMe,
  }

  const presenterRef = useRef<LoginPresenter | null>(null)
  if(!presenterRef.current){
    presenterRef.current = props.presenterFactory(listener);
  }

  const login = async() => {
    await presenterRef.current?.doLogin(alias, password, rememberMe, props.originalUrl!);
  }

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenterRef.current!.doLogin(alias, password, rememberMe, props.originalUrl!);
    }
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields onKeyDown={loginOnEnter} 
                            onAliasChange={setAlias} 
                            onPasswordChange={setPassword}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={login}
    />
  );
};

export default Login;
