import { AuthToken, FakeData, User } from "tweeter-shared";
import { Factory } from "../../dao/DAOInterfaces";

export class FollowService {


    // move to follow folder anything with follow folder
  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    if (!AuthToken.isValid(authToken)) {
      throw new Error("Invalid AuthToken");
    }
  
    const authTokenTable = Factory.instance().createAuthTokenTableDAO();
    const followsTable = Factory.instance().createFollowsTableDAO();
    const userTable = Factory.instance().createUserTableDAO();

    await authTokenTable.updateAuthToken(authToken);

    const followerAlias = await authTokenTable.getAlias(authToken.token);
    const followeeAlias = userToFollow.alias;
    
    if (followerAlias === null) {
      throw new Error("Invalid AuthToken");
    }

    await followsTable.follow(followerAlias, followeeAlias);
    await userTable.incrementFollowersCount(followeeAlias);
    
    // let followersCount = await followsTable.getFollowersCount(followeeAlias);
    // let followeesCount = await followsTable.getFolloweesCount(followeeAlias);

    // return [followersCount, followeesCount];
    return userTable.getFollowCount(followeeAlias);
  };

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    if (!AuthToken.isValid(authToken)) {
      throw new Error("Invalid AuthToken");
    }

    const authTokenTable = Factory.instance().createAuthTokenTableDAO();
    const followsTable = Factory.instance().createFollowsTableDAO();
    const userTable = Factory.instance().createUserTableDAO();

    await authTokenTable.updateAuthToken(authToken);

    const followerAlias = await authTokenTable.getAlias(authToken.token);
    const followeeAlias = userToUnfollow.alias;

    if (followerAlias === null) {
      throw new Error("Invalid AuthToken");
    }
    await followsTable.unfollow(followerAlias, followeeAlias);
    await userTable.decrementFollowersCount(followeeAlias);
    // const [followersCount, followeesCount] = await userTable.getFollowCount(followeeAlias);

    // let followersCount = await followsTable.getFollowersCount(followeeAlias);
    // let followeesCount = await followsTable.getFolloweesCount(followeeAlias);

    return userTable.getFollowCount(followeeAlias);
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    if (!AuthToken.isValid(authToken)) {
      throw new Error("Invalid AuthToken");
    }

    const authTokenTable = Factory.instance().createAuthTokenTableDAO();
    const followsTable = Factory.instance().createFollowsTableDAO();

    authTokenTable.updateAuthToken(authToken);

    const followerAlias = await authTokenTable.getAlias(authToken.token);
    const followeeAlias = selectedUser.alias;

    if (followerAlias === null) {
      throw new Error("Invalid AuthToken");
    }

    return followsTable.getIsFollower(followerAlias, followeeAlias);
  };

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    if (!AuthToken.isValid(authToken)) {
      throw new Error("Invalid AuthToken");
    }
    Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);
    // const followsTable = Factory.instance().createFollowsTableDAO();
    // return followsTable.getFolloweesCount(user.alias);
    const userTable = Factory.instance().createUserTableDAO();
    return userTable.getFolloweesCount(user.alias);
  };

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    if (!AuthToken.isValid(authToken)) {
      throw new Error("Invalid AuthToken");
    }
    Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);

    // const followsTable = Factory.instance().createFollowsTableDAO();

    // return followsTable.getFollowersCount(user.alias);
    const userTable = Factory.instance().createUserTableDAO();
    return userTable.getFollowersCount(user.alias);
  };

  public async loadMoreFollowers(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // if (!AuthToken.isValid(authToken)) {
    //   throw new Error("Invalid AuthToken");
    // }
    // Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);

    const userTable = Factory.instance().createUserTableDAO();
    const followsTable = Factory.instance().createFollowsTableDAO();

    const followeeAlias = user.alias;
    const [followerAliases, hasMore] = await followsTable.loadMoreFollowers(followeeAlias, lastItem?.alias ?? "", pageSize);

    let followers = []
    for (let alias of followerAliases) {
      let user = await userTable.getUser(alias);
      if (user !== null) {
        followers.push(user);
      }
    }
    return [followers, hasMore];
  };

  public async loadMoreFollowees(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // if (!AuthToken.isValid(authToken)) {
    //   throw new Error("Invalid AuthToken");
    // }
    // Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);

    const userTable = Factory.instance().createUserTableDAO();
    const followsTable = Factory.instance().createFollowsTableDAO();

    const followerAlias = user.alias;
    const [followeeAliases, hasMore] = await followsTable.loadMoreFollowees(followerAlias, lastItem?.alias ?? "", pageSize);

    let followees = []
    for (let alias of followeeAliases) {
      let user = await userTable.getUser(alias);
      if (user !== null) {
        followees.push(user);
      }
    }
    return [followees, hasMore];
  };

  public async loadMoreFollowersAliases(
    user: User,
    pageSize: number,
    lastItem: User | null
  ): Promise<[string[], boolean]> {
    const followsTable = Factory.instance().createFollowsTableDAO();
    return followsTable.loadMoreFollowers(user.alias, lastItem?.alias ?? "", pageSize);
  }
}