import { GetFolloweesCountRequest, GetFolloweesCountResponse, TweeterResponseFactory } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export const handler = async (event: GetFolloweesCountRequest): Promise<GetFolloweesCountResponse> => {
  try {
    let followeesCount = await new FollowService().getFolloweesCount(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.user)!);
    return TweeterResponseFactory.createGetFolloweesCountResponse(true, followeesCount);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}