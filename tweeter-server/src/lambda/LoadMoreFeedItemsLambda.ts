import { AuthToken, LoadMoreStatusesRequest, Status, StatusDto, TweeterResponseFactory, User } from "tweeter-shared";
import { LoadMoreStatusesResponse } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export const handler = async (event: LoadMoreStatusesRequest): Promise<LoadMoreStatusesResponse> => {
  try {
    // let [statuses, hasMore] = await new StatusService().loadMoreFeedItems(event.authToken, event.user, event.pageSize, event.lastItem);
    // let statusesDto = statuses.map((status) => status.dto);
    // return TweeterResponseFactory.createLoadMoreStatusesResponse(true, statusesDto, hasMore);
    let [statuses, hasMore] = await new StatusService().loadMoreFeedItems(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.user)!,
      event.pageSize,
      event.lastItem ? Status.fromDto(event.lastItem) : null
      );
      let statusesDto: StatusDto[] = [];
      for (let i = 0; i < statuses.length; i++) {
        let userDto = {
          firstName: statuses[i].user.firstName,
          lastName: statuses[i].user.lastName,
          alias: statuses[i].user.alias,
          imageUrl: statuses[i].user.imageUrl
        }
        console.log("userDto: ", userDto);
        let statusDto = {
          post: statuses[i].post,
          user: userDto,
          timestamp: statuses[i].timestamp,
          segments: statuses[i].segments
        }
        statusesDto.push(statusDto);
  
      }
    return TweeterResponseFactory.createLoadMoreStatusesResponse(true, statusesDto, hasMore);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}