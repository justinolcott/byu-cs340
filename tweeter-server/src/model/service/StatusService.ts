import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { Factory } from "../../dao/DAOInterfaces";

export class StatusService {
  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      if (!AuthToken.isValid(authToken)) {
        throw new Error("Invalid AuthToken");
      }
      Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);
      return await Factory.instance().createStoryTableDAO().loadMoreStories(user.alias, lastItem, pageSize);
  };
  
  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      if (!AuthToken.isValid(authToken)) {
        throw new Error("Invalid AuthToken");
      }
      Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);
      return await Factory.instance().createFeedTableDAO().loadMoreFeedItems(user.alias, lastItem, pageSize);
  };

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    if (!AuthToken.isValid(authToken)) {
      throw new Error("Invalid AuthToken");
    }
    // Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);

    const StoryTableDAO = Factory.instance().createStoryTableDAO();
    const postStatusQueueDAO = Factory.instance().createPostStatusQueueDAO();
    newStatus.timestamp = new Date().getTime();

    const message = JSON.stringify(newStatus);
    await postStatusQueueDAO.sendPost(message)
    await StoryTableDAO.putStory(newStatus);

    // const followee = newStatus.user.alias;
    // while (true) {
    //   const [followerAliases, hasMore] = await Factory.instance().createFollowsTableDAO().loadMoreFollowers(followee, "");
    //   for (const follower of followerAliases) {
    //     await feedTableDAO.putStatus(newStatus, followee, follower);
    //   }
    //   if (!hasMore) {
    //     break;
    //   }
    // }    
  };

  public async postUpdateFeedMessages(status: Status): Promise<void> {
    const user = status.user;
    // new User(
    //   status.user.firstName,
    //   status.user.lastName,
    //   status.user.alias,
    //   status.user.imageUrl
    // );

    console.log("Posting update feed messages")
    console.log(status);

    let hasMore = true;
    let lastFollower = "";
    let followers: string[] = [];
    const followTableDAO = Factory.instance().createFollowsTableDAO();
    const updateFeedQueueDAO = Factory.instance().createUpdateFeedQueueDAO();
    while(hasMore) {
      [followers, hasMore] = await followTableDAO.loadMoreFollowers(user.alias, lastFollower, 100);
      lastFollower = followers[followers.length - 1];
      const newMessage = {
        status: status,
        followers: followers
      };
      const newMessageString = JSON.stringify(newMessage);
      await updateFeedQueueDAO.sendMessage(newMessageString);
    }
  };

  public async updateFeeds(status: Status, followers: string[]): Promise<void> {
    console.log("Updating feeds");
    console.log(status);
    console.log(followers);
    await Factory.instance().createFeedTableDAO().putBatchStatus(status, status.user.alias, followers);
  };
}