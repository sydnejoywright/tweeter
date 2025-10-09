import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoHooks, useUserInfoActionsHooks } from "./UserInfoHooks";
import { UserInfoPresenter, UserInfoView } from "../../presenter/UserInfoPresenter";

interface Props{
    presenterFactory?: (view: UserInfoView) => UserInfoPresenter
}

const UserInfo = (props: Props) => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, deleteMessage } = useMessageActions();

  const { currentUser, authToken, displayedUser } = useUserInfoHooks();
  const { setDisplayedUser } = useUserInfoActionsHooks();
  const navigate = useNavigate();
  const location = useLocation();

  const listener: UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    deleteMessage: deleteMessage,
    displayInfoMessage: displayInfoMessage,
    setLoading: setIsLoading,
    setIsFollower: setIsFollower,
    setFollowerCount: setFollowerCount,
    setFolloweeCount: setFolloweeCount,

    authToken: () => authToken!,
    currentUser: () => currentUser!,
    displayedUser: () => displayedUser!
  }

  const presenterRef = useRef<UserInfoPresenter | null>(null)
  if(!presenterRef.current){
    presenterRef.current =
    (props.presenterFactory?.(listener)) ??
    new UserInfoPresenter(listener);
  }

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  useEffect(() => {
    presenterRef.current!.setIsFollowerStatus(authToken!, currentUser!, displayedUser!);
    presenterRef.current!.setNumbFollowees(authToken!, displayedUser!);
    presenterRef.current!.setNumbFollowers(authToken!, displayedUser!);
  }, [displayedUser]);

  const follow = (e: React.MouseEvent) => {
    e.preventDefault();
    presenterRef.current!.followDisplayedUser(e);
  };

  const unfollow = (e: React.MouseEvent) => {
    e.preventDefault();
    presenterRef.current!.unfollowDisplayedUser(e);
  };


  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
    navigate(`${getBaseUrl()}/${currentUser!.alias}`);
  };

  const getBaseUrl = (): string => {
    const segments = location.pathname.split("/@");
    return segments.length > 1 ? segments[0] : "/";
  };

  return (
    <>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {!displayedUser.equals(currentUser) && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={`./${currentUser.alias}`}
                    onClick={switchToLoggedInUser}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {!displayedUser.equals(currentUser) && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={unfollow}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={follow}
                    >
                      {isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
