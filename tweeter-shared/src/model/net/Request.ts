import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";
import { AuthTokenDto } from "../dto/AuthTokenDto";
import { StatusDto } from "../dto/StatusDto";
import { UserDto } from "../dto/UserDto";

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
  authToken: AuthTokenDto;
  alias: string;
}

export interface LoadMoreFollowsRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;
  pageSize: number;
  lastItem: UserDto | null;
}

export interface LoadMoreStatusesRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;
  pageSize: number;
  lastItem: StatusDto | null;
}

export interface PostStatusRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  newStatus: StatusDto;
}

export interface LogoutRequest extends TweeterRequest {
  authToken: AuthTokenDto;
}

export interface FollowRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  userToFollow: UserDto;
}

export interface UnfollowRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  userToUnfollow: UserDto;
}

export interface GetIsFollowerStatusRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;
  selectedUser: UserDto;
}

export interface GetFolloweesCountRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;
}

export interface GetFollowersCountRequest extends TweeterRequest {
  authToken: AuthTokenDto;
  user: UserDto;
}




export class TweeterRequestFactory {
  static createLoginRequest(username: string, password: string): LoginRequest {
    return { username, password };
  }

  static createRegisterRequest(firstName: string, lastName: string, alias: string, password: string, userImageString: string): RegisterRequest {
    return { firstName, lastName, alias, password, userImageString };
  }

  static createGetUserRequest(authToken: AuthTokenDto, alias: string): GetUserRequest {
    return { authToken, alias };
  }

  static createLoadMoreFollowsRequest(authToken: AuthTokenDto, user: UserDto, pageSize: number, lastItem: UserDto | null): LoadMoreFollowsRequest {
    return { authToken, user, pageSize, lastItem };
  }

  static createLoadMoreStatusesRequest(authToken: AuthTokenDto, user: UserDto, pageSize: number, lastItem: StatusDto | null): LoadMoreStatusesRequest {
    return { authToken, user, pageSize, lastItem };
  }

  static createPostStatusRequest(authToken: AuthTokenDto, newStatus: StatusDto): PostStatusRequest {
    return { authToken, newStatus};
  }

  static createLogoutRequest(authToken: AuthTokenDto): LogoutRequest {
    return { authToken };
  }

  static createFollowRequest(authToken: AuthTokenDto, userToFollow: UserDto): FollowRequest {
    return { authToken, userToFollow };
  }

  static createUnfollowRequest(authToken: AuthTokenDto, userToUnfollow: UserDto): UnfollowRequest {
    return { authToken, userToUnfollow };
  }

  static createGetIsFollowerStatusRequest(authToken: AuthTokenDto, user: UserDto, selectedUser: UserDto): GetIsFollowerStatusRequest {
    return { authToken, user, selectedUser };
  }

  static createGetFolloweesCountRequest(authToken: AuthTokenDto, user: UserDto): GetFolloweesCountRequest {
    return { authToken, user };
  }

  static createGetFollowersCountRequest(authToken: AuthTokenDto, user: UserDto): GetFollowersCountRequest {
    return { authToken, user };
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
