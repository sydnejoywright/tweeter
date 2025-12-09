import { TweeterResponse, UserDto } from "../../../..";

export interface GetFollowCountResponse extends TweeterResponse {
  readonly count?: number | null;
}
