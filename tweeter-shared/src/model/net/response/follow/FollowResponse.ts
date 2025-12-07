import { TweeterResponse } from ".././TweeterResponse";

export interface FollowResponse extends TweeterResponse {
  readonly followerCount?: number | null;
  readonly followeeCount?: number | null;
}
