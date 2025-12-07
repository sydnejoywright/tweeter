import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { userService } from "../../model.service/lambda_service/LambdaService";

export const handler = async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  //turn the string back to a bytes array
  const bytes: Uint8Array = new Uint8Array(
    Buffer.from(request.userImageBytes, "base64")
  );
  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    bytes,
    request.imageFileExtension
  );
  return {
    success: true,
    message: null,
    user: user,
    authToken: authToken,
  };
};
