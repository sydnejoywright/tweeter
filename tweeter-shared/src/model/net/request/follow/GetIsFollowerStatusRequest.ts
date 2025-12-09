import { UserDto } from "../../../..";
import { TweeterRequest } from "../TweeterRequest";

export interface GetIsFollowerStatusRequest extends TweeterRequest {
  readonly authToken: string;
  readonly user: UserDto;
  readonly selectedUser: UserDto;
}
