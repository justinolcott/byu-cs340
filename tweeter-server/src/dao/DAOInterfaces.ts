import { AuthToken, Status, User } from "tweeter-shared";
import { FactoryAWSDAO } from "../aws/FactoryAWSDAO";

export class Factory {
  public static instance(): DAOFactory {
    return new FactoryAWSDAO();
  }
}

export interface DAOFactory {
  createUserTableDAO(): UserTableDAO;
  createProfileImageDAO(): ProfileImageDAO;
  createFeedTableDAO(): FeedTableDAO;
  createAuthTokenTableDAO(): AuthTokenTableDAO;
  createStoryTableDAO(): StoryTableDAO;
  createFollowsTableDAO(): FollowsTableDAO;
}

export interface UserTableDAO {
  putUser(
    user: User,
    hash: any,
    // followersCount: number,
    // followeesCount: number
    ): Promise<void>;
  // getFollowersCount(alias: string): Promise<number>;
  // getFolloweesCount(alias: string): Promise<number>;
  getHash(alias: string): Promise<string | null>;
  getUser(alias: string): Promise<User | null>;
  deleteUser(alias: string): Promise<void>;
}

export interface FeedTableDAO {
  putStatus(status: Status, senderAlias: string, receiverAlias: string): Promise<void>;
  loadMoreFeedItems(receiverAlias: string, lastStatus: Status | null, pageSize: number): Promise<[Status[], boolean]>;
}

export interface StoryTableDAO {
  putStory(status: Status): Promise<void>;
  deleteStory(senderAlias: string): Promise<void>;
  loadMoreStories(senderAlias: string, lastStatus: Status | null, pageSize: number): Promise<[Status[], boolean]>;
}

export interface AuthTokenTableDAO {
  updateAuthToken(authToken: AuthToken): unknown;
  putAuthToken(authToken: AuthToken, alias: string): Promise<boolean>;
  getAuthToken(token: string): Promise<AuthToken | null>;
  deleteAuthToken(token: string): Promise<void>;
  getAlias(token: string): Promise<string | null>;
}

export interface FollowsTableDAO {
  follow(followerAlias: string, followeeAlias: string): Promise<void>;
  unfollow(followerAlias: string, followeeAlias: string): Promise<void>;
  getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
  getFollowers(alias: string): Promise<string[]>;
  getFollowees(alias: string): Promise<string[]>;
  getFollowersCount(alias: string): Promise<number>;
  getFolloweesCount(alias: string): Promise<number>;
  loadMoreFollowers(alias: string, lastFollowerAlias: string): Promise<[string[], boolean]>;
  loadMoreFollowees(alias: string, lastFolloweeAlias: string): Promise<[string[], boolean]>;
}

export interface ProfileImageDAO {
  putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
  deleteImage(fileName: string): Promise<void>;
  getImage(fileName: string): Promise<string>;
}

