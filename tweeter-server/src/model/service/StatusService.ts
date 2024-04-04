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
    Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);

    const followsTableDAO = Factory.instance().createFollowsTableDAO();
    const feedTableDAO = Factory.instance().createFeedTableDAO();
    const StoryTableDAO = Factory.instance().createStoryTableDAO();

    const followers = await followsTableDAO.getFollowers(newStatus.user.alias);
    const followee = newStatus.user.alias;

    for (const follower of followers) {
      await feedTableDAO.putStatus(newStatus, followee, follower);
    }

    newStatus.timestamp = new Date().getTime();
    await StoryTableDAO.putStory(newStatus);
  };
}