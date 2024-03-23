import { AuthToken, LoadMoreStatusesRequest, Status, TweeterResponseFactory, User } from "tweeter-shared";
import { LoadMoreStatusesResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";



export const handler = async (event: LoadMoreStatusesRequest): Promise<LoadMoreStatusesResponse> => {
  try {
    let [statuses, hasMore] = await new StatusService().loadMoreStoryItems(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.user)!,
      event.pageSize,
      event.lastItem ? Status.fromDto(event.lastItem) : null
      // event.authToken, event.user, event.pageSize, event.lastItem
      );
    let statusesDto = statuses.map((status) => status.dto);
    return TweeterResponseFactory.createLoadMoreStatusesResponse(true, statusesDto, hasMore);
    // let [statuses, hasMore] = await new StatusService().loadMoreStoryItems(event.authToken, event.user, event.pageSize, event.lastItem);
    // let statusesDto = statuses.map((status) => status.dto);
    // return TweeterResponseFactory.createLoadMoreStatusesResponse(true, statusesDto, hasMore);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}