  
import { useNavigate } from "react-router-dom";
import { User} from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActionsHooks, useUserInfoHooks } from "../userInfo/UserInfoHooks";
import { useRef } from "react";
import { NavToUserPresenter, NavToUserView } from "../../presenter/NavToUserPresenter";
  
  interface Props{
      presenterFactory: (view: NavToUserView) => NavToUserPresenter
  } 
  export const useNavigateToUserHook = (props?: Props) => {
    const {displayedUser, authToken} = useUserInfoHooks();
    const {setDisplayedUser} = useUserInfoActionsHooks();
    const {displayErrorMessage} = useMessageActions();
    const navigate = useNavigate();

  const listener: NavToUserView = {
    setDisplayedUser: (user: User) => setDisplayedUser(user),
    navigateTo: (path: string) => navigate(path),
    displayErrorMessage,
  }

  const defaultFactory = (view: NavToUserView) =>
    new NavToUserPresenter(view);

  const factory = props?.presenterFactory ?? defaultFactory;

  const presenterRef = useRef<NavToUserPresenter | null>(null)
  if(!presenterRef.current){
    presenterRef.current = factory(listener);
  }

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        await presenterRef.current?.navigateToUser(event, authToken!, displayedUser!)
      };

    return navigateToUser;
  };
