import { GetFollowersCountRequest, GetFollowersCountResponse, TweeterResponseFactory } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export const handler = async (event: GetFollowersCountRequest): Promise<GetFollowersCountResponse> => {
  try {
    let followersCount = await new FollowService().getFollowersCount(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.user)!);
    return TweeterResponseFactory.createGetFollowersCountResponse(true, followersCount);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}