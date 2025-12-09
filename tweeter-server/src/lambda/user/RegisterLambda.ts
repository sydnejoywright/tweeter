import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { userService } from "../../model.service/lambda_service/LambdaService";

export const handler = async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  let bytes: Uint8Array | null = null;

  // Only convert the image if both fields are provided
  if (request.userImageBytes && request.imageFileExtension) {
    bytes = new Uint8Array(Buffer.from(request.userImageBytes, "base64"));
  }

  const [user, authToken] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    bytes ?? undefined, // can be null if no image provided
    request.imageFileExtension ?? undefined
  );

  return {
    success: true,
    message: null,
    user,
    authToken,
  };
};
