import { LoginRequest, LoginResponse } from "tweeter-shared";
import { userService } from "../../model.service/lambda_service/LambdaService";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const [user, authToken] = await userService.login(
    request.alias,
    request.password
  );
  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
