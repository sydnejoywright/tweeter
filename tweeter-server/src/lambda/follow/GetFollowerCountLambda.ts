import {
  GetFollowCountRequest,
  GetFollowCountResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
} from "tweeter-shared";
import {
  authService,
  followService,
} from "../../model.service/lambda_service/LambdaService";
import { AuthorizationError } from "../../model.service/lambda_service/AuthorizationService";

export const handler = async (
  request: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
  try {
    const currentUser = await authService.authenticate(request.authToken);

    const count = await followService.getFollowerCount(request.user);
    return {
      success: true,
      message: null,
      count: count,
    };
  } catch (e) {
    if (e instanceof AuthorizationError) {
      return {
        success: false,
        message: "Unauthorized",
        count: null,
      };
    }
    throw e;
  }
};
