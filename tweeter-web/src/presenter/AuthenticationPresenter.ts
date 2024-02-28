import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  updateUserInfo: (currentUser: User, displayedUser: User, authToken: AuthToken) => void;
  navigate: (url: string) => void;
}

export abstract class AuthenticationPresenter<T extends LoginView> extends Presenter<T> {
  private _service: UserService;

  protected constructor(view: T) {
    super(view);
    this._service = new UserService();
  }

  public async doAuthentication(
    operation: () => Promise<[User, AuthToken]>,
    navigate: () => void
  ): Promise<void> {
    this.doFailureReportingOperation(
      async () => {
        let [user, authToken] = await operation();
        this.view.updateUserInfo(user, user, authToken);
        navigate();
      },
      this.getAuthenticationDescription()
    );
  }

  protected abstract getAuthenticationDescription(): string;

  protected get service(): UserService {
    return this._service;
  }
}