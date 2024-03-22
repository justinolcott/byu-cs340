import { LoadMoreStatusesRequest, TweeterResponseFactory } from "tweeter-shared";
import { LoadMoreStatusesResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: LoadMoreStatusesRequest): Promise<LoadMoreStatusesResponse> => {
  try {
    let [statuses, hasMore] = await new StatusService().loadMoreFeedItems(event.authToken, event.user, event.pageSize, event.lastItem);
    let statusesDto = statuses.map((status) => status.dto);
    return TweeterResponseFactory.createLoadMoreStatusesResponse(true, statusesDto, hasMore);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}