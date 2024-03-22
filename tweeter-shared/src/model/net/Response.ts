import { AuthToken } from "../domain/AuthToken";
import { Status } from "../domain/Status";
import { User } from "../domain/User";
import { AuthTokenDto } from "../dto/AuthTokenDto";
import { StatusDto } from "../dto/StatusDto";
import { UserDto } from "../dto/UserDto";

export interface TweeterResponse {
  success: boolean;
  message: string | null;
}

export interface AuthenticateResponse extends TweeterResponse {
  readonly user: UserDto;
  readonly token: AuthTokenDto;
}

export interface GetUserResponse extends TweeterResponse {
  readonly user: UserDto | null;
}

export interface LoadMoreFollowsResponse extends TweeterResponse {
  readonly users: UserDto[];
  readonly hasMorePages: boolean;
}

export interface LoadMoreStatusesResponse extends TweeterResponse {
  readonly statuses: StatusDto[];
  readonly hasMorePages: boolean;
}

export class TweeterResponseFactory {
  static createAuthenticateResponse(
    success: boolean,
    user: UserDto,
    token: AuthTokenDto,
    message: string | null = null
  ): AuthenticateResponse {
    return { success, user, token, message };
  }

  static createGetUserResponse(
    success: boolean,
    user: UserDto | null,
    message: string | null = null
  ): GetUserResponse {
    return { success, user, message };
  }

  static createLoadMoreFollowsResponse(
    success: boolean,
    users: UserDto[],
    hasMorePages: boolean,
    message: string | null = null
  ): LoadMoreFollowsResponse {
    return { success, users, hasMorePages, message };
  }

  static createLoadMoreStatusesResponse(
    success: boolean,
    statuses: StatusDto[],
    hasMorePages: boolean,
    message: string | null = null
  ): LoadMoreStatusesResponse {
    return { success, statuses, hasMorePages, message };
  }
}

// export class TweeterResponse {
//   private _success: boolean;
//   private _message: string | null;

//   constructor(success: boolean, message: string | null = null) {
//     this._success = success;
//     this._message = message;
//   }

//   get success(): boolean {
//     return this._success;
//   }

//   get message(): string | null {
//     return this._message;
//   }
// }

// interface ResponseJSON {
//   _success: boolean;
//   _message: string;
// }



// export class AuthenticateResponse extends TweeterResponse {
//   private _user: User;
//   private _token: AuthToken;

//   constructor(success: boolean, user: User, token: AuthToken, message: string | null = null) {
//     super(success, message);
//     this._user = user;
//     this._token = token;
//   }

//   get user(): User {
//     return this._user;
//   }

//   get token(): AuthToken {
//     return this._token;
//   }

//   static fromJSON(json: JSON): AuthenticateResponse {
//     interface AuthenticateResponseJSON extends ResponseJSON {
//       _user: JSON;
//       _token: JSON;
//     }

//     const jsonObject: AuthenticateResponseJSON = 
//       json as unknown as AuthenticateResponseJSON;
//     const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

//     if (deserializedUser === null) {
//       throw new Error(
//         "AuthenticateResponse, could not deserialize user with json:\n" +
//           JSON.stringify(jsonObject._user)
//       );
//     }

//     const deserializedToken = AuthToken.fromJson(
//       JSON.stringify(jsonObject._token)
//     );

//     if (deserializedToken === null) {
//       throw new Error(
//         "AuthenticateResponse, could not deserialize token with json:\n" +
//           JSON.stringify(jsonObject._token)
//       );
//     }

//     return new AuthenticateResponse(
//       jsonObject._success,
//       deserializedUser,
//       deserializedToken,
//       jsonObject._message
//     );
//   }
// }  





// export class GetUserResponse extends TweeterResponse {
//   private _user: User | null;

//   constructor(success: boolean, user: User | null, message: string | null = null) {
//     super(success, message);
//     this._user = user;
//   }

//   get user(): User | null {
//     return this._user;
//   }

//   static fromJSON(json: JSON): GetUserResponse {
//     interface GetUserResponseJSON extends ResponseJSON {
//       _user: JSON;
//     }

//     const jsonObject: GetUserResponseJSON = 
//       json as unknown as GetUserResponseJSON;
//     const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user));

//     if (deserializedUser === null) {
//       throw new Error(
//         "GetUserResponse, could not deserialize user with json:\n" +
//           JSON.stringify(jsonObject._user)
//       );
//     }

//     return new GetUserResponse(
//       jsonObject._success,
//       deserializedUser,
//       jsonObject._message
//     );
//   }
// }


// export class LoadMoreFollowsResponse extends TweeterResponse {
//   private _users: User[];
//   private _hasMorePages: boolean;

//   constructor(
//     success: boolean,
//     users: User[],
//     hasMorePages: boolean,
//     message: string | null = null
//   ) {
//     super(success, message);
//     this._users = users;
//     this._hasMorePages = hasMorePages;
//   }

//   get users(): User[] {
//     return this._users;
//   }

//   get hasMorePages(): boolean {
//     return this._hasMorePages;
//   }

//   static fromJSON(json: JSON): LoadMoreFollowsResponse {
//     interface LoadMoreFollowsResponseJSON extends ResponseJSON {
//       _users: JSON[];
//       _hasMorePages: boolean;
//     }

//     const jsonObject: LoadMoreFollowsResponseJSON = 
//       json as unknown as LoadMoreFollowsResponseJSON;
//     const deserializedUsers = jsonObject._users.map((user) => {
//       const deserializedUser = User.fromJson(JSON.stringify(user));
//       if (deserializedUser === null) {
//         throw new Error(
//           "LoadMoreFollowsResponse, could not deserialize user with json:\n" +
//             JSON.stringify(user)
//         );
//       }
//       return deserializedUser;
//     });

//     return new LoadMoreFollowsResponse(
//       jsonObject._success,
//       deserializedUsers,
//       jsonObject._hasMorePages,
//       jsonObject._message
//     );
//   }
// }



// export class LoadMoreStatusesResponse extends TweeterResponse {
//   private _statuses: Status[];
//   private _hasMorePages: boolean;

//   constructor(
//     success: boolean,
//     statuses: Status[],
//     hasMorePages: boolean,
//     message: string | null = null
//   ) {
//     super(success, message);
//     this._statuses = statuses;
//     this._hasMorePages = hasMorePages;
//   }

//   get statuses(): Status[] {
//     return this._statuses;
//   }

//   get hasMorePages(): boolean {
//     return this._hasMorePages;
//   }

//   static fromJSON(json: JSON): LoadMoreStatusesResponse {
//     interface LoadMoreStatusesResponseJSON extends ResponseJSON {
//       _statuses: JSON[];
//       _hasMorePages: boolean;
//     }

//     const jsonObject: LoadMoreStatusesResponseJSON = 
//       json as unknown as LoadMoreStatusesResponseJSON;
//     const deserializedStatuses = jsonObject._statuses.map((status) => {
//       const deserializedStatus = Status.fromJson(JSON.stringify(status));

//       if (deserializedStatus === null) {
//         throw new Error(
//           "LoadMoreStatusesResponse, could not deserialize status with json:\n" +
//             JSON.stringify(status)
//         );
//       }
//       return deserializedStatus;
//     });

//     return new LoadMoreStatusesResponse(
//       jsonObject._success,
//       deserializedStatuses,
//       jsonObject._hasMorePages,
//       jsonObject._message
//     );
//   }
// }


