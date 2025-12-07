import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import {
  authService,
  followService,
} from "../../model.service/lambda_service/LambdaService";
import { AuthorizationError } from "../../model.service/lambda_service/AuthorizationService";

export const handler = async (
  request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
  try {
    const currentUser = await authService.authenticate(request.token);

    const [items, hasMore] = await followService.loadMoreFollowers(
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
