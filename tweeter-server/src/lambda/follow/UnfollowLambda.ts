import { FollowRequest, FollowResponse } from "tweeter-shared";
import {
  authService,
  followService,
} from "../../model.service/lambda_service/LambdaService";
import { AuthorizationError } from "../../model.service/lambda_service/AuthorizationService";

export const handler = async (
  request: FollowRequest
): Promise<FollowResponse> => {
  try {
    const currentUser = await authService.authenticate(request.authToken);
    const [followerCount, followeeCount] = await followService.unfollow(
      currentUser,
      request.userToFollow
    );
    return {
      success: true,
      message: null,
      followerCount: followerCount,
      followeeCount: followeeCount,
    };
  } catch (e) {
    if (e instanceof AuthorizationError) {
      return {
        success: false,
        message: "Unauthorized",
        followerCount: null,
        followeeCount: null,
      };
    }
    throw e;
  }
};
