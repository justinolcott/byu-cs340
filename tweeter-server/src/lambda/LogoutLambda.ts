import { AuthToken, LogoutRequest, LogoutResponse, TweeterResponseFactory } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export const handler = async (event: LogoutRequest): Promise<LogoutResponse> => {
  try {
    await new UserService().logout(AuthToken.fromDto(event.authToken)!);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
  return TweeterResponseFactory.createLogoutResponse(true);
}