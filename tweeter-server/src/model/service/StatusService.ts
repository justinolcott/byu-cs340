import { AuthToken, User, Status, FakeData } from "tweeter-shared";

export class StatusService {
  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      // TODO: Replace with the result of calling server
      return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
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
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };
}