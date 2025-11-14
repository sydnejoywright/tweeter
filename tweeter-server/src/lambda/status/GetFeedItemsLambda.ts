import {GetFeedItemsRequest, GetFeedItemsResponse} from "tweeter-shared"
import StatusService from "../../model.service/StatusService"

export const handler = async (request: GetFeedItemsRequest): Promise<GetFeedItemsResponse> => {
    const statusService = new StatusService
    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem)
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}
