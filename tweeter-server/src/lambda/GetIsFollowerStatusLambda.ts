import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, TweeterResponseFactory } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export const handler = async (event: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
  try {
    let isFollower = await new FollowService().getIsFollowerStatus(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.user)!,
      User.fromDto(event.selectedUser)!);
    return TweeterResponseFactory.createGetIsFollowerStatusResponse(true, isFollower);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}