import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { userService } from "../../model.service/lambda_service/LambdaService";

export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  await userService.logout(request.authToken.token);
  return {
    success: true,
    message: null,
  };
};
