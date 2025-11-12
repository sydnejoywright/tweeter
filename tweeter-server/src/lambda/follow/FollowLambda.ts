import { FollowRequest, FollowResponse } from "tweeter-shared"
import FollowService from "../../model.service/FollowService"



export const handler = async (request: FollowRequest): Promise<FollowResponse> => {
    const followService = new FollowService
    const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem)
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    }
}