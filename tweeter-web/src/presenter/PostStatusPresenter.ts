import { Status, AuthToken, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setPost: (post: string) => void;
}


export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService(): StatusService {
    return this._statusService;
  }

  public async submitPost(post: string, currentUser: User | null, authToken: AuthToken | null) {
    this.doFailureReportingOperation(
      async () => {
        this.view.displayInfoMessage("Posting status...", 0);
        let status = new Status(post, currentUser!, Date.now());
        await this.statusService.postStatus(authToken!, status);
        this.view.clearLastInfoMessage();
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
        },
      "post status"
    );
  };

  public async clearPost() {
    this.view.setPost("");
  };
}