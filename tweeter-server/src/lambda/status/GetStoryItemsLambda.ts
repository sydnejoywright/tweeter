import { GetFeedItemsRequest, GetFeedItemsResponse } from "tweeter-shared";
import {
  authService,
  statusService,
} from "../../model.service/lambda_service/LambdaService";
import { AuthorizationError } from "../../model.service/lambda_service/AuthorizationService";
export const handler = async (
  request: GetFeedItemsRequest
): Promise<GetFeedItemsResponse> => {
  try {
    const currentUser = await authService.authenticate(request.token);
    const [items, hasMore] = await statusService.loadMoreStoryItems(
      request.userAlias,
      request.pageSize,
      request.lastItem
    );
    return {
      success: true,
      message: null,
      items: items,
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
