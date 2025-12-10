import { User } from "tweeter-shared";
import { useNavigateToUserHook } from "../appNavbar/NavToUserHooks";

interface Props {
  user: User;
  featurePath: string; // e.g., "/feed" or "/story"
}

const UserItem = (props: Props) => {
  const navigateToUserByAlias = useNavigateToUserHook();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigateToUserByAlias(props.user.alias, props.featurePath);
  };

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0 align-items-center">
          <div className="col-auto p-3">
            <img
              src={props.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="User profile"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.user.firstName} {props.user.lastName}
              </b>{" "}
              -{" "}
              <button className="btn btn-link p-0" onClick={handleClick}>
                {props.user.alias}
              </button>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
