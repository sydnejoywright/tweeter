import { TweeterResponse, UserDto } from "../../../..";

export interface GetIsFollowerStatusResponse extends TweeterResponse{
    readonly following: boolean;
}