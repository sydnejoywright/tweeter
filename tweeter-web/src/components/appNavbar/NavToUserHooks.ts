import { useNavigate } from "react-router-dom";
import { User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import {
  useUserInfoActionsHooks,
  useUserInfoHooks,
} from "../userInfo/UserInfoHooks";
import { useRef } from "react";
import {
  NavToUserPresenter,
  NavToUserView,
} from "../../presenter/NavToUserPresenter";

interface Props {
  presenterFactory?: (view: NavToUserView) => NavToUserPresenter;
}

export const useNavigateToUserHook = (props?: Props) => {
  const { displayedUser, authToken } = useUserInfoHooks();
  const { setDisplayedUser } = useUserInfoActionsHooks();
  const { displayErrorMessage } = useMessageActions();
  const navigate = useNavigate();

  const listener: NavToUserView = {
    setDisplayedUser: (user: User) => setDisplayedUser(user),
    navigateTo: (path: string) => navigate(path),
    displayErrorMessage,
  };

  const defaultFactory = (view: NavToUserView) => new NavToUserPresenter(view);

  const factory = props?.presenterFactory ?? defaultFactory;

  const presenterRef = useRef<NavToUserPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = factory(listener);
  }

  // Updated: accept alias and featurePath directly
  const navigateToUser = async (alias: string, featurePath: string) => {
    if (!authToken || !displayedUser) return;
    try {
      await presenterRef.current?.navigateToUserByAlias(
        alias,
        featurePath,
        authToken,
        displayedUser
      );
    } catch (e) {
      displayErrorMessage(`Failed to navigate: ${e}`);
    }
  };

  return navigateToUser;
};
