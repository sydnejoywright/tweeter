  
import { useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoActionsHooks, useUserInfoHooks } from "../userInfo/UserInfoHooks";
import { useCallback } from "react";
  
  
  export const useNavigateToUserHook = () => {
    const {displayedUser, authToken} = useUserInfoHooks();
    const {setDisplayedUser} = useUserInfoActionsHooks();
    const {displayErrorMessage} = useMessageActions();
    const navigate = useNavigate();

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
      };

      const extractFeaturePath = (url: string): string => {
        const urlObject = new URL(url);
        return urlObject.pathname.replace(/\/@[^/]+$/, "");
      };
    
      const getUser = async (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
      };

      const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
          event.preventDefault();
      
          try {
            const alias = extractAlias(event.target.toString());
            const featurePath = extractFeaturePath(event.target.toString());
            const toUser = await getUser(authToken!, alias);
      
            if (toUser) {
              if (!toUser.equals(displayedUser!)) {
                setDisplayedUser(toUser);
                navigate(`${featurePath}/${toUser.alias}`);
              }
            }
          } catch (error) {
            displayErrorMessage(
              `Failed to get user because of exception: ${error}`,
            );
          }
        };

    return navigateToUser;
  };
