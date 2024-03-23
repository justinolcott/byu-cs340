import { TweeterResponseFactory } from "tweeter-shared";
import { UnfollowRequest, UnfollowResponse } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export const handler = async (event: UnfollowRequest): Promise<UnfollowResponse> => {
  try {
    let [followersCount, followeesCount] = await new FollowService().unfollow(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.userToUnfollow)!);
    return TweeterResponseFactory.createUnfollowResponse(true, followersCount, followeesCount);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}