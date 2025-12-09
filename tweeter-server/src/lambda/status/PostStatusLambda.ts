import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import {
  authService,
  statusService,
} from "../../model.service/lambda_service/LambdaService";
import { AuthorizationError } from "../../model.service/lambda_service/AuthorizationService";
export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  try {
    const currentUser = await authService.authenticate(request.authToken);
    console.log("AAGGHGHH:", currentUser.imageUrl);
    const statusToPost = { ...request.newStatus, user: currentUser };
    await statusService.postStatus(statusToPost);
    return {
      success: true,
      message: null,
    };
  } catch (e) {
    if (e instanceof AuthorizationError) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    throw e;
  }
};
