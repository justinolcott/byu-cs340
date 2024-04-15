import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { View, Presenter } from "./Presenter";

export interface UserNavigationView extends View {
    setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private service: UserService;

  public constructor(view: UserNavigationView) {
      super(view);
      this.service = new UserService();
  }

  private async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
      return this.service.getUser(authToken, alias);
  }

  private extractAlias(value: string): string {
      let index = value.indexOf("@");
      if (index === -1) {
          // http://localhost:5173/following/alias0 or http://localhost:5173/followers/myuser
          index = value.indexOf("/following/");
          index += "/following/".length; // "following/"
          if (index === -1) {
              index = value.indexOf("/followers/");
              index += "/followers/".length; // "followers/"
          }
      }
      return value.substring(index);
  }

  public async navigateToUser(currentUser: User | null,authToken: AuthToken, aliasString: string): Promise<void> {
    this.doFailureReportingOperation(
      async () => {
        let alias = this.extractAlias(aliasString);
        let user = await this.getUser(authToken!, alias);

        if (!!user) {
          if (currentUser!.equals(user)) {
            this.view.setDisplayedUser(currentUser!);
          } else {
            this.view.setDisplayedUser(user);
          }
        }
      },
      "get user"
    );
  }
};