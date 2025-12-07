import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import {
  authService,
  userService,
} from "../../model.service/lambda_service/LambdaService";
import { AuthorizationError } from "../../model.service/lambda_service/AuthorizationService";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  try {
    const currentUser = await authService.authenticate(request.token);
    const userDto = await userService.getUser(request.userAlias);
    return {
      success: true,
      message: null,
      user: userDto || null,
    };
  } catch (e) {
    if (e instanceof AuthorizationError) {
      return {
        success: false,
        message: "Unauthorized",
        user: null,
      };
    }
    throw e;
  }
};
