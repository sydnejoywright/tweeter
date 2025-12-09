import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest {
  readonly authToken: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: UserDto | null;
}
