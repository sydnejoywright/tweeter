import { LogoutRequest, TweeterResponse } from "tweeter-shared";
import { userService } from "../../model.service/lambda_service/LambdaService";

// lambda/user/LogoutLambda.ts (or .js) — replace handler body with:
export const handler = async (
  request: LogoutRequest
): Promise<TweeterResponse> => {
  // be permissive about incoming token shape
  const incomingAuth = request?.authToken;
  const token =
    (incomingAuth && (incomingAuth.token ?? (incomingAuth as any)._token)) ??
    // as last resort, if client sent token directly
    (typeof request === "string" ? request : undefined);

  if (!token) {
    // respond with 400 and a helpful message
    return {
      success: false,
      message:
        "Missing auth token in request. Expected authToken.token or authToken._token",
    };
  }

  await userService.logout(token);
  return {
    success: true,
    message: null,
  };
};
