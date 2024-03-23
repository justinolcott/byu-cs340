import { AuthToken, LoadMoreFollowsRequest, LoadMoreFollowsResponse, TweeterResponseFactory, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export const handler = async (event: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> => {
  try {
    // let [followers, hasMore] = await new UserService().loadMoreFollowers(event.authToken, event.user, event.pageSize, event.lastItem);
    // let followersDto = followers.map((user) => user.dto);
    // return TweeterResponseFactory.createLoadMoreFollowsResponse(true, followersDto, hasMore);
    let [followees, hasMore] = await new UserService().loadMoreFollowees(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.user)!,
      event.pageSize,
      event.lastItem ? User.fromDto(event.lastItem) : null
      // event.authToken, event.user, event.pageSize, event.lastItem
      );
    let followeesDto = followees.map((user) => user.dto);
    return TweeterResponseFactory.createLoadMoreFollowsResponse(true, followeesDto, hasMore);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
};

