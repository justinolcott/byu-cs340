import { Buffer } from "buffer";
import { User, AuthToken, FakeData } from "tweeter-shared";


export class UserService {
  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
      // TODO: Replace with the result of calling the server
      let user = FakeData.instance.firstUser;
      if (user === null) {
        throw new Error("Invalid alias or password");
      }
      return [user, FakeData.instance.authToken];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageString: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3

    // TODO: Replace with the result of calling the server
    let user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid registration");
    }
    return [user, FakeData.instance.authToken];
  };

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return FakeData.instance.findUserByAlias(alias);
  };

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
  };

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, user);
  };
  
}