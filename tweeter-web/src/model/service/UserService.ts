import { Buffer } from "buffer";
import { User, AuthToken, FakeData, LoginRequest, AuthenticateResponse, GetUserRequest } from 'tweeter-shared';
import { ServerFacade } from "../../network/ServerFacade";
import Register from "../../components/authentication/register/Register";
import { RegisterRequest } from "tweeter-shared";
import { LoadMoreFollowsRequest } from "tweeter-shared";
import { TweeterRequestFactory } from "tweeter-shared";


export class UserService {
  private server: ServerFacade = new ServerFacade();

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const response: AuthenticateResponse = await this.server.login(
      TweeterRequestFactory.createLoginRequest(alias, password)
    );
    if (!response.success) {
      throw new Error("Invalid alias or password");
    }


    
    // console.log("RESPONSE: ", response.user);
    // console.log("IS NULL", response.user === null);
    const user = new User(
      response.user.firstName,
      response.user.lastName,
      response.user.alias,
      response.user.imageUrl
    );

    const authToken = new AuthToken(response.token.token,
      response.token.timestamp);
    // console.log("USER AFTER: ", user);

    if (user === null) {
      throw new Error("Invalid user in login");
    }
    
    return [user, authToken];
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
    userImageBytes: Uint8Array
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const response: AuthenticateResponse = await this.server.register(
      TweeterRequestFactory.createRegisterRequest(firstName, lastName, alias, password, Buffer.from(userImageBytes).toString("base64"))
    );
    if (!response.success) {
      throw new Error("Invalid registration");
    }

    const user =  new User(
      response.user.firstName,
      response.user.lastName,
      response.user.alias,
      response.user.imageUrl
    );

    const authToken = new AuthToken(response.token.token,
      response.token.timestamp);

    if (user === null) {
      throw new Error("Invalid user in register");
    }

    return [user, authToken];
    //   new RegisterRequest(firstName, lastName, alias, password, 
    //     Buffer.from(userImageBytes).toString("base64"))
    // );
    // if (!response.success) {
    //   throw new Error("Invalid registration");
    // }
    // return [response.user, response.token];
  };

  

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    const response = await this.server.getUser(
      TweeterRequestFactory.createGetUserRequest(authToken, alias)
    );
    const user = User.fromDto(response.user);
    if (user === null) {
      throw new Error("Invalid user in getUser");
    }
    // console.log("USER: ", user);
    return user;
    //   new GetUserRequest(authToken, alias)
    // );
    // return response.user;
  };

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    const response = await this.server.loadMoreFollowers(
      TweeterRequestFactory.createLoadMoreFollowsRequest(authToken, user, pageSize, lastItem)
    );

    let users = response.users.map((user) => User.fromDto(user));

    if (users.includes(null)) {
      throw new Error("Invalid user in loadMoreFollowers");
    }

    return [users, response.hasMorePages] as [User[], boolean];
    //   new LoadMoreFollowsRequest(authToken, user, pageSize, lastItem)
    // );
    // return [response.users, response.hasMorePages];
  };

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    const response = await this.server.loadMoreFollowees(
      TweeterRequestFactory.createLoadMoreFollowsRequest(authToken, user, pageSize, lastItem)
    );

    let users = response.users.map((user) => User.fromDto(user));

    if (users.includes(null)) {
      throw new Error("Invalid user in loadMoreFollowees");
    }

    return [users, response.hasMorePages] as [User[], boolean];
    //   new LoadMoreFollowsRequest(authToken, user, pageSize, lastItem)
    // );
    // console.log("RESPONSE: ", response.users, response.hasMorePages);
    // return [response.users, response.hasMorePages];
  };
}