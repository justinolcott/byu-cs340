import { GetUserResponse, GetUserRequest, TweeterResponseFactory } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: GetUserRequest): Promise<GetUserResponse> => {
  let user = await new UserService().getUser(event.authToken, event.alias);
  if (user === null) {
    // return new GetUserResponse(false, null, "User not found");
    return TweeterResponseFactory.createGetUserResponse(false, null, "User not found");
  }
  // return new GetUserResponse(true, user);
  return TweeterResponseFactory.createGetUserResponse(true, user);
}