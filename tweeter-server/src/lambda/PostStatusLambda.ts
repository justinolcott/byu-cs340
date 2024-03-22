import { PostStatusRequest, PostStatusResponse, TweeterResponseFactory } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";


export const handler = async (event: PostStatusRequest): Promise<PostStatusResponse> => {
  try {
    await new StatusService().postStatus(event.authToken, event.newStatus);
    return TweeterResponseFactory.createPostStatusResponse(true);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}