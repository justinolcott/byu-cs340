import { AuthenticateResponse, LoginRequest, TweeterResponseFactory } from "tweeter-shared";
import { UserService } from "../model/service/UserService";


export const handler = async (event: LoginRequest): Promise<AuthenticateResponse> => {
  try {
    let [user, token] = await new UserService().login(event.username, event.password);
    return TweeterResponseFactory.createAuthenticateResponse(true, user.dto, token.dto);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
};