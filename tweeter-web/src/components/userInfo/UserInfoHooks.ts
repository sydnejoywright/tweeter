import { User, AuthToken } from "tweeter-shared"
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts"
import { useContext } from "react"


export const useUserInfoHooks = () => {
    return useContext(UserInfoContext);
}
export const useUserInfoActionsHooks = () => {
    return useContext(UserInfoActionsContext);
};
