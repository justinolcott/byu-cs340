import { User, AuthToken } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected getItemDescription(): string {
    return "load feed items";
  }

  protected async getMoreItems(authToken: AuthToken, user: User): Promise<[any[], boolean]> {
    return this.service.loadMoreFeedItems(authToken, user, PAGE_SIZE, this.lastItem);
  }
}