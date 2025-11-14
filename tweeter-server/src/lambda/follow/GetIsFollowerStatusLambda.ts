import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from "tweeter-shared"
import FollowService from "../../model.service/FollowService"

export const handler = async (request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
    console.log("Hit server side GetIsFollowerStatusLambda!");
    const followService = new FollowService();
    const following = await followService.getIsFollowerStatus(request.token, request.user, request.selectedUser)
    return {
        success: true,
        message: null,
        following: following
    }
}