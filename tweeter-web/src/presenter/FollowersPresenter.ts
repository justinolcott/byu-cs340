import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowersPresenter extends UserItemPresenter {
  protected getItemDescription(): string {
    return "load follower items";
  }

  protected async getMoreItems(authToken: AuthToken, user: User): Promise<[any[], boolean]> {
    return this.service.loadMoreFollowers(authToken, user, PAGE_SIZE, this.lastItem);
  }
}