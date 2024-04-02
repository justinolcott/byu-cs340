import { AuthToken, User, Status, FakeData, TweeterRequestFactory } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";
import { LoadMoreStatusesRequest } from "tweeter-shared";

export class StatusService {
  private server: ServerFacade = new ServerFacade();

  public async loadMoreStoryItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      // TODO: Replace with the result of calling server
      let authTokenDto = authToken.dto;
      let userDto = user.dto;
      const letItemDto = lastItem?.dto ?? null;
      const responses = await this.server.loadMoreStoryItems(
        TweeterRequestFactory.createLoadMoreStatusesRequest(
          authTokenDto,
          userDto,
          pageSize,
          letItemDto
        )
      );

      let statuses = responses.statuses.map((status) => Status.fromDto(status));
      if (statuses.includes(null)) {
        throw new Error("Invalid status in loadMoreStoryItems");
      }

      return [statuses, responses.hasMorePages] as [Status[], boolean];
      //   new LoadMoreStatusesRequest(authToken, user, pageSize, lastItem)
      // );
      // return [responses.statuses, responses.hasMorePages];
  };
  
  public async loadMoreFeedItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      console.log("Last Item: ", lastItem);
      // TODO: Replace with the result of calling server
      let authTokenDto = authToken.dto;
      let userDto = user.dto;
      const letItemDto = lastItem?.dto ?? null;
      const responses = await this.server.loadMoreFeedItems(
        TweeterRequestFactory.createLoadMoreStatusesRequest(
          authTokenDto,
          userDto,
          pageSize,
          letItemDto
        )
      );
      let statuses = responses.statuses.map((status) => Status.fromDto(status));
      if (statuses.includes(null)) {
        throw new Error("Invalid status in loadMoreFeedItems");
      }
      return [statuses, responses.hasMorePages] as [Status[], boolean];
      //   new LoadMoreStatusesRequest(authToken, user, pageSize, lastItem)
      // );
      // return [responses.statuses, responses.hasMorePages];
  };

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
    const response = await this.server.postStatus(
      TweeterRequestFactory.createPostStatusRequest(authToken.dto, newStatus.dto)
    );
    if (!response.success) {
      throw new Error("Invalid status in postStatus");
    }

    // return response;
    return;
  };
}