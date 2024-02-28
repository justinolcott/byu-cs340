import { AuthenticationPresenter, AuthentificationView } from "./AuthenticationPresenter";


export class LoginPresenter extends AuthenticationPresenter<AuthentificationView> {
  constructor(view: AuthentificationView) {
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