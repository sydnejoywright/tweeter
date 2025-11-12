import { UserDto } from "../../../dto/UserDto";
import { TweeterResponse } from ".././TweeterResponse";


export interface FollowResponse extends TweeterResponse{
    readonly items: UserDto[] | null;
    readonly hasMore: boolean;
}