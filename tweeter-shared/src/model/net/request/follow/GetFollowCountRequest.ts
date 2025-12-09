import { UserDto } from "../../../..";
import { TweeterRequest } from "../TweeterRequest";

export interface GetFollowCountRequest extends TweeterRequest {
  readonly authToken: string;
  readonly user: UserDto;
}
