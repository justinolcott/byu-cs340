import { LoadMoreFollowsRequest, LoadMoreFollowsResponse, TweeterResponseFactory } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export const handler = async (event: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> => {
  try {
    let [followees, hasMore] = await new UserService().loadMoreFollowees(event.authToken, event.user, event.pageSize, event.lastItem);
    let followeesDto = followees.map((user) => user.dto);
    return TweeterResponseFactory.createLoadMoreFollowsResponse(true, followeesDto, hasMore);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
};

