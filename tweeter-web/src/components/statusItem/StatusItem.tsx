import { Link, useNavigate} from "react-router-dom";
import { User, Status, AuthToken, FakeData } from "tweeter-shared";
import Post from "./Post";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoHooks, useUserInfoActionsHooks } from "../userInfo/UserInfoHooks";
import { useNavigateToUserHook } from "../appNavbar/NavToUserHooks";

interface Props {
  status: Status;
  featurePath : string;
}

const StatusItem = (props: Props) => {
    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfoHooks();
    const { setDisplayedUser } = useUserInfoActionsHooks();
    const navigateToUser = useNavigateToUserHook();
  
    return(
        <div className="row mb-3 mx-0 px-0 border rounded bg-white">
            <div className="col bg-light mx-0 px-0">
              <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={props.status.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {props.status.user.firstName} {props.status.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={`${props.featurePath}/${props.status.user.alias}`}
                        onClick={navigateToUser}
                      >
                        {props.status.user.alias}
                      </Link>
                    </h2>
                    {props.status.formattedDate}
                    <br />
                    <Post status={props.status} featurePath={props.featurePath} />
                </div>
            </div>
        </div>
    </div>
        </div>
    );
}

export default StatusItem;
