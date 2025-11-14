import { StatusDto } from "../../../dto/StatusDto";
import { TweeterResponse } from "../TweeterResponse";

export interface GetFeedItemsResponse extends TweeterResponse{
    readonly items: StatusDto[] | null;
    readonly hasMore: boolean;
}