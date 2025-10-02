import { Link, useNavigate } from "react-router-dom";
import { AuthToken, FakeData, Status, Type, User } from "tweeter-shared";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfoHooks, useUserInfoActionsHooks } from "../userInfo/UserInfoHooks";
import { useNavigateToUserHook } from "../appNavbar/NavToUserHooks";

interface Props {
  status: Status;
  featurePath: string;
}

const Post = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfoHooks();
  const { setDisplayedUser } = useUserInfoActionsHooks();
  const navigateToUser = useNavigateToUserHook();

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={`${props.featurePath}/${segment.text}`}
            onClick={navigateToUser}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
