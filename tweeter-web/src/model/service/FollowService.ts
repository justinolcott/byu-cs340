import { AuthToken, FakeData, TweeterRequestFactory, User } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private server: ServerFacade = new ServerFacade();

    // move to follow folder anything with follow folder
  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the following message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // // TODO: Call the server

    // let followersCount = await this.getFollowersCount(authToken, userToFollow);
    // let followeesCount = await this.getFolloweesCount(authToken, userToFollow);

    // return [followersCount, followeesCount];

    const response = await this.server.follow(
      TweeterRequestFactory.createFollowRequest(authToken.dto, userToFollow.dto)
    );
    if (!response.success) {
      throw new Error("Invalid follow");
    }
    return [response.followersCount, response.followingCount];
  };

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followersCount: number, followeesCount: number]> {
    // Pause so we can see the unfollowing message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
    const response = await this.server.unfollow(
      TweeterRequestFactory.createUnfollowRequest(authToken.dto, userToUnfollow.dto)
    );

    if (!response.success) {
      throw new Error("Invalid unfollow");
    }

    return [response.followersCount, response.followeesCount];
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const response = await this.server.getIsFollowerStatus(
      TweeterRequestFactory.createGetIsFollowerStatusRequest(authToken.dto, user.dto, selectedUser.dto)
    );
    return response.isFollower;
  };

  public async getFolloweesCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const response = await this.server.getFolloweesCount(
      TweeterRequestFactory.createGetFolloweesCountRequest(authToken.dto, user.dto)
    );
    return response.followeesCount;
  };

  public async getFollowersCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const response = await this.server.getFollowersCount(
      TweeterRequestFactory.createGetFollowersCountRequest(authToken.dto, user.dto)
    );
    return response.followersCount;
  };
}