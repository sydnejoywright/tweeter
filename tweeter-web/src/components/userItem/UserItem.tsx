import { Link, useNavigate } from "react-router-dom";
import { AuthToken, User, FakeData, Status } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useNavigateToUserHook} from "../appNavbar/NavToUserHooks";
import { useUserInfoActionsHooks, useUserInfoHooks } from "../userInfo/UserInfoHooks";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfoHooks();
  const { setDisplayedUser } = useUserInfoActionsHooks();
  const navigateToUser = useNavigateToUserHook();


  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${props.featurePath}/${props.user.alias}`}
                onClick={navigateToUser}
              >
                {props.user.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
