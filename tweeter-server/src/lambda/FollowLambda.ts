import { FollowRequest, FollowResponse, TweeterResponseFactory } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";

export const handler = async (event: FollowRequest): Promise<FollowResponse> => {
  try {
    // console.log("FollowLambda: handler: event: ", event);
    const update = Date.now();
    let [followersCount, followeesCount] = await new FollowService().follow(
      AuthToken.fromDto(event.authToken)!,
      User.fromDto(event.userToFollow)!);
    return TweeterResponseFactory.createFollowResponse(true, followersCount, followeesCount);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}

