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
    const userDto = await userService.getUser(request.userAlias);

    if (!userDto) {
      return {
        success: true,
        message: null,
        user: null,
      };
    }

    const fullImageUrl =
      userDto.imageUrl && !userDto.imageUrl.startsWith("http")
        ? `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${userDto.imageUrl}`
        : userDto.imageUrl;
    console.log("Computed full S3 URL:", fullImageUrl);
    const userWithFullImageUrl = {
      ...userDto,
      imageUrl: fullImageUrl,
    };

    return {
      success: true,
      message: null,
      user: userWithFullImageUrl,
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
