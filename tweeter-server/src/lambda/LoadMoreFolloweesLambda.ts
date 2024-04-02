import { AuthToken, LoadMoreFollowsRequest, LoadMoreFollowsResponse, TweeterResponseFactory, User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";


export const handler = async (event: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> => {
  try {
    let [followees, hasMore] = await new FollowService().loadMoreFollowees(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.user)!,
      event.pageSize,
      event.lastItem ? User.fromDto(event.lastItem) : null
      );
    let followeesDto = followees.map((user) => user.dto);
    return TweeterResponseFactory.createLoadMoreFollowsResponse(true, followeesDto, hasMore);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
};

