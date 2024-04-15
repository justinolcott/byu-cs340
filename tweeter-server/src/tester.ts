import { AuthToken } from "tweeter-shared";
import { UserService } from "./model/service/UserService";


async function getUser() {
  const request = {"authToken":{"token":"1bf4deca-a4d9-40d8-bae2-a69ead55c577","timestamp":1713197761877},"alias":"http://localhost:5173/following/alias0"}
  // let user = await new UserService().getUser(AuthToken.fromDto(request.authToken)!, request.alias);
  console.log(user);
}

getUser();