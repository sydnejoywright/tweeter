import {
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
} from "tweeter-shared";
import {
  authService,
  followService,
} from "../../model.service/lambda_service/LambdaService";
import { AuthorizationError } from "../../model.service/lambda_service/AuthorizationService";

export const handler = async (
  request: GetIsFollowerStatusRequest
): Promise<GetIsFollowerStatusResponse> => {
  try {
    const currentUser = await authService.authenticate(request.token);
    const following = await followService.getIsFollowerStatus(
      request.user,
      request.selectedUser
    );
    return {
      success: true,
      message: null,
      following: following,
    };
  } catch (e) {
    if (e instanceof AuthorizationError) {
      return {
        success: false,
        message: "Unauthorized",
        following: false,
      };
    }
    throw e;
  }
};
