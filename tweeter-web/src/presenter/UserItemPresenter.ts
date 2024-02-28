import { User } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { UserService } from "../model/service/UserService";

export abstract class UserItemPresenter extends PagedItemPresenter<User, UserService> {
  public constructor(view: PagedItemView<User>) {
    super(view);
  }

  protected createService(): UserService {
    return new UserService();
  }
}