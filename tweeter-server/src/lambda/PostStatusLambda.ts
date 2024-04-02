import { AuthToken, PostStatusRequest, PostStatusResponse, Status, TweeterResponseFactory, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";


export const handler = async (event: PostStatusRequest): Promise<PostStatusResponse> => {
  try {
    await new StatusService().postStatus(
      AuthToken.fromDto(event.authToken)!,
      new Status(
        event.newStatus.post,
        User.fromDto(event.newStatus.user)!,
        event.newStatus.timestamp,
      )
    );
    return TweeterResponseFactory.createPostStatusResponse(true);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}