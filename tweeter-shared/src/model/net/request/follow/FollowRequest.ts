import { UserDto } from "../../../dto/UserDto";
import { TweeterRequest } from ".././TweeterRequest";

export interface FollowRequest extends TweeterRequest{
    readonly authToken: string,
    readonly userToFollow: UserDto
}