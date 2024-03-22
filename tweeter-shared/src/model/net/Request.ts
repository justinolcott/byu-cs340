import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";

// abstract??
export interface TweeterRequest {
  // Empty interface
}

export interface LoginRequest extends TweeterRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends TweeterRequest {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  userImageString: string;
}

export interface GetUserRequest extends TweeterRequest {
  authToken: AuthToken;
  alias: string;
}

export interface LoadMoreFollowsRequest extends TweeterRequest {
  authToken: AuthToken;
  user: User;
  pageSize: number;
  lastItem: User | null;
}

export interface LoadMoreStatusesRequest extends TweeterRequest {
  authToken: AuthToken;
  user: User;
  pageSize: number;
  lastItem: Status | null;
}

export class TweeterRequestFactory {
  static createLoginRequest(username: string, password: string): LoginRequest {
    return { username, password };
  }

  static createRegisterRequest(firstName: string, lastName: string, alias: string, password: string, userImageString: string): RegisterRequest {
    return { firstName, lastName, alias, password, userImageString };
  }

  static createGetUserRequest(authToken: AuthToken, alias: string): GetUserRequest {
    return { authToken, alias };
  }

  static createLoadMoreFollowsRequest(authToken: AuthToken, user: User, pageSize: number, lastItem: User | null): LoadMoreFollowsRequest {
    return { authToken, user, pageSize, lastItem };
  }

  static createLoadMoreStatusesRequest(authToken: AuthToken, user: User, pageSize: number, lastItem: Status | null): LoadMoreStatusesRequest {
    return { authToken, user, pageSize, lastItem };
  }
}

// export class LoginRequest implements TweeterRequest {
//   username: string;
//   password: string;

//   constructor (username: string, password: string) {
//     this.username = username;
//     this.password = password;
//   }
// }

// export class RegisterRequest implements TweeterRequest {
//   firstName: string;
//   lastName: string;
//   alias: string;
//   password: string;
//   userImageString: string;

//   constructor (firstName: string, lastName: string, alias: string, password: string, userImageString: string) {
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.alias = alias;
//     this.password = password;
//     this.userImageString = userImageString;
//   }
// }

// export class GetUserRequest implements TweeterRequest {
//   authToken: AuthToken;
//   alias: string;

//   constructor (authToken: AuthToken, alias: string) {
//     this.authToken = authToken;
//     this.alias = alias;
//   }
// }

// export class LoadMoreFollowsRequest implements TweeterRequest {
//   authToken: AuthToken;
//   user: User;
//   pageSize: number;
//   lastItem: User | null;

//   constructor (authToken: AuthToken, user: User, pageSize: number, lastItem: User | null) {
//     this.authToken = authToken;
//     this.user = user;
//     this.pageSize = pageSize;
//     this.lastItem = lastItem;
//   }
// }

// export class LoadMoreStatusesRequest implements TweeterRequest {
//   authToken: AuthToken;
//   user: User;
//   pageSize: number;
//   lastItem: Status | null;

//   constructor (authToken: AuthToken, user: User, pageSize: number, lastItem: Status | null) {
//     this.authToken = authToken;
//     this.user = user;
//     this.pageSize = pageSize;
//     this.lastItem = lastItem;
//   }
// }
