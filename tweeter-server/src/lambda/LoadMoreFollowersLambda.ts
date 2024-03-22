import { LoadMoreFollowsRequest, LoadMoreFollowsResponse, TweeterResponseFactory } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export const handler = async (event: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> => {
  try {
    let [followers, hasMore] = await new UserService().loadMoreFollowers(event.authToken, event.user, event.pageSize, event.lastItem);
    let followersDto = followers.map((user) => user.dto);
    return TweeterResponseFactory.createLoadMoreFollowsResponse(true, followersDto, hasMore);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
};

