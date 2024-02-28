import { AuthenticationPresenter, LoginView } from "./AuthenticationPresenter";


export class LoginPresenter extends AuthenticationPresenter<LoginView> {
  constructor(view: LoginView) {
      super(view);
  }

  public async doLogin(alias: string, password: string, url?: string): Promise<void> {
    this.doAuthentication(
      () => this.service.login(alias, password),
      () => {
        if (!!url) {
          this.view.navigate(url);
        }
        else {
          this.view.navigate("/");
        }
      }
    );
  };

  public getAuthenticationDescription(): string {
    return "log user in";
  }
}