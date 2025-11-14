import { AuthToken } from "../../../domain/AuthToken";
import { TweeterRequest } from "../TweeterRequest";

export interface LogoutRequest extends TweeterRequest {
    readonly authToken: AuthToken;
}