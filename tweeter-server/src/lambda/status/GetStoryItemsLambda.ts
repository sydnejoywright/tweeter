import { GetFeedItemsRequest, GetFeedItemsResponse } from "tweeter-shared";
import {
  authService,
  statusService,
} from "../../model.service/lambda_service/LambdaService";
import { AuthorizationError } from "../../model.service/lambda_service/AuthorizationService";

const BUCKET = "tweeter-server-profile-pics-try1";
const REGION = "us-east-1";

export const handler = async (
  request: GetFeedItemsRequest
): Promise<GetFeedItemsResponse> => {
  try {
    // Authenticate the user
    const currentUser = await authService.authenticate(request.authToken);

    // Fetch story items from the service
    const [items, hasMore] = await statusService.loadMoreStoryItems(
      request.userAlias,
      request.pageSize,
      request.lastItem
    );

    // If no items returned, set as empty array
    if (!items) {
      return {
        success: true,
        message: null,
        items: [],
        hasMore: false,
      };
    }

    // Transform items: ensure user.imageUrl is full URL or empty
    const transformedItems = items.map((status) => {
      const user = status.user;

      const imageUrl =
        user.imageUrl && !user.imageUrl.startsWith("http")
          ? `https://${BUCKET}.s3.${REGION}.amazonaws.com/${user.imageUrl}`
          : user.imageUrl; // leave empty if no image

      return {
        post: status.post,
        timestamp: status.timestamp,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          alias: user.alias,
          imageUrl,
        },
      };
    });

    // Return the transformed story items
    return {
      success: true,
      message: null,
      items: transformedItems,
      hasMore: hasMore,
    };
  } catch (e) {
    if (e instanceof AuthorizationError) {
      return {
        success: false,
        message: "Unauthorized",
        items: null,
        hasMore: false,
      };
    }
    throw e;
  }
};
