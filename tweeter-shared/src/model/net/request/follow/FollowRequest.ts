import { UserDto } from "../../../dto/UserDto";
import { TweeterRequest } from ".././TweeterRequest";

export interface FollowRequest extends TweeterRequest{
    readonly token: string, 
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: UserDto | null
}