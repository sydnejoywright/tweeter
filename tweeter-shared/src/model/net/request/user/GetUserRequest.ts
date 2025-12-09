import { TweeterRequest } from "../TweeterRequest";

export interface GetUserRequest extends TweeterRequest {
  readonly authToken: string;
  readonly userAlias: string;
}
