import "./UserInfoComponent.css";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoHooks, useUserInfoActionsHooks } from "./UserInfoHooks";
import {
  UserInfoPresenter,
  UserInfoView,
} from "../../presenter/UserInfoPresenter";

interface Props {
  presenterFactory?: (view: UserInfoView) => UserInfoPresenter;
}

const UserInfo = (props: Props) => {
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();
  const { currentUser, authToken, displayedUser } = useUserInfoHooks();
  const { setDisplayedUser } = useUserInfoActionsHooks();
  const navigate = useNavigate();
  const location = useLocation();

  const listener: UserInfoView = {
    displayErrorMessage,
    deleteMessage,
    displayInfoMessage,
    setLoading: setIsLoading,
    setIsFollower,
    setFollowerCount,
    setFolloweeCount,
    authToken: () => authToken!,
    currentUser: () => currentUser!,
    displayedUser: () => displayedUser!,
  };

  const presenterRef = useRef<UserInfoPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current =
      props.presenterFactory?.(listener) ?? new UserInfoPresenter(listener);
  }

  // Ensure displayedUser is initialized
  useEffect(() => {
    if (!displayedUser && currentUser) {
      setDisplayedUser(currentUser);
    }
  }, [currentUser, displayedUser, setDisplayedUser]);

  // Load follower/followee info
  useEffect(() => {
    if (displayedUser && currentUser && authToken) {
      presenterRef.current!.setIsFollowerStatus(
        authToken,
        currentUser,
        displayedUser
      );
      presenterRef.current!.setNumbFollowees(authToken, displayedUser);
      presenterRef.current!.setNumbFollowers(authToken, displayedUser);
    }
  }, [displayedUser, currentUser, authToken]);

  const follow = (e: React.MouseEvent) => {
    e.preventDefault();
    presenterRef.current!.followDisplayedUser(e);
  };

  const unfollow = (e: React.MouseEvent) => {
    e.preventDefault();
    presenterRef.current!.unfollowDisplayedUser(e);
  };

  const switchToLoggedInUser = (event: React.MouseEvent) => {
    event.preventDefault();
    if (currentUser) {
      setDisplayedUser(currentUser);
      navigate(`/feed/${currentUser.alias}`);
    }
  };

  if (!currentUser || !displayedUser || !authToken) return null;

  return (
    <div className="container">
      <div className="row">
        <div className="col-auto p-3">
          <img
            src={displayedUser.imageUrl}
            className="img-fluid"
            width="100"
            alt="User profile"
          />
        </div>
        <div className="col p-3">
          {!displayedUser.equals(currentUser) && (
            <p id="returnToLoggedInUser">
              Return to{" "}
              <button
                className="btn btn-link p-0"
                onClick={switchToLoggedInUser}
              >
                logged in user
              </button>
            </p>
          )}
          <h2>
            <b>{displayedUser.name}</b>
          </h2>
          <h3>{displayedUser.alias}</h3>
          {followeeCount > -1 && followerCount > -1 && (
            <div>
              Followees: {followeeCount} Followers: {followerCount}
            </div>
          )}
        </div>
        {!displayedUser.equals(currentUser) && (
          <div className="col-auto p-3">
            {isFollower ? (
              <button
                id="unFollowButton"
                className="btn btn-md btn-secondary"
                type="button"
                style={{ width: "6em" }}
                onClick={unfollow}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  "Unfollow"
                )}
              </button>
            ) : (
              <button
                id="followButton"
                className="btn btn-md btn-primary"
                type="button"
                style={{ width: "6em" }}
                onClick={follow}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  "Follow"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
