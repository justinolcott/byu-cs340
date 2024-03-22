import { LoadMoreFollowsRequest, LoadMoreFollowsResponse, TweeterResponseFactory } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export const handler = async (event: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> => {
  try {
    let [followers, hasMore] = await new UserService().loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem);
    return TweeterResponseFactory.createLoadMoreFollowsResponse(true, followers, hasMore);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
};

