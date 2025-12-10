import { Status, Type } from "tweeter-shared";
import { useNavigateToUserHook } from "../appNavbar/NavToUserHooks";

interface Props {
  status: Status;
  featurePath: string;
}

const Post = (props: Props) => {
  const navigateToUserByAlias = useNavigateToUserHook();

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <button
            key={index}
            className="btn btn-link p-0"
            onClick={(e) => {
              e.preventDefault();
              navigateToUserByAlias(segment.text, props.featurePath);
            }}
          >
            {segment.text}
          </button>
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
