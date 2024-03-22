import { AuthenticateResponse, RegisterRequest, TweeterResponseFactory } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export const handler = async (event: RegisterRequest): Promise<any> => {
  try {
    let [user, token] = await new UserService().register(event.firstName, event.lastName, event.alias, event.password, event.userImageString);
    return TweeterResponseFactory.createAuthenticateResponse(true, user, token);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
}

// JSON input: {"firstName":"John","lastName":"Doe","alias":"johndoe","password":"password","userImageBytes":"dGVzdA=="}

//{"errorType":"TypeError","errorMessage":"The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined","trace":["TypeError [ERR_INVALID_ARG_TYPE]: The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined","    at Function.from (node:buffer:324:9)","    at UserService.register (/var/task/index.js:5052:50)","    at Runtime.handler (/var/task/index.js:5072:47)","    at Runtime.handleOnceNonStreaming (file:///var/runtime/index.mjs:1173:29)"]}
