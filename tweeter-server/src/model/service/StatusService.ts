import { AuthToken, User, Status, FakeData } from "tweeter-shared";
import { Factory } from "../../dao/DAOInterfaces";

export class StatusService {
  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      return await Factory.instance().createStoryTableDAO().loadMoreStories(user.alias, lastItem);
  };
  
  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      // TODO: Replace with the result of calling server
      // console.log("starting loadMoreFeedItems");
      // console.log("lastItem", lastItem);
      // console.log("user", lastItem?.user);
      const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(lastItem, pageSize);
      // console.log("finishing loadMoreFeedItems", statuses);
      return [statuses, hasMore];
  };

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Check authtoken
    // console.log("AuthToken", authToken);
    if (!AuthToken.isValid(authToken)) {
      throw new Error("Invalid AuthToken");
    }

    newStatus.timestamp = new Date().getTime();
    await Factory.instance().createStoryTableDAO().putStory(newStatus);
  };
}