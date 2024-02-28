import { AuthToken, User } from "tweeter-shared";
import { MessageView, Presenter } from "./Presenter";
import { FollowService } from "../model/service/FollowService";

export interface UserInfoView extends MessageView {
  setIsFollowerStatus(isFollower: boolean): void;
  setNumbFollowees(count: number): void;
  setNumbFollowers(count: number): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
  }

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    this.doFailureReportingOperation(
      async () => {
        this.view.setNumbFollowees(
          await this.service.getFolloweesCount(authToken, displayedUser)
        );
      },
      "get followees count"
    );
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.view.setNumbFollowers(
          await this.service.getFollowersCount(authToken, displayedUser)
        );
      },
      "get followers count"
    );
  };

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(
      async () => {
        if (currentUser === displayedUser) {
          this.view.setIsFollowerStatus(false);
        } else {
          this.view.setIsFollowerStatus(
            await this.service.getIsFollowerStatus(authToken, currentUser, displayedUser)
          );
        }
      },
      "determine follower status"
    );
  };

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);

        let [followersCount, followeesCount] = await this.service.follow(
          authToken!,
          displayedUser!
        );

        this.view.clearLastInfoMessage();

        this.view.setIsFollowerStatus(true);
        this.view.setNumbFollowers(followersCount);
        this.view.setNumbFollowees(followeesCount);
      },
      "follow user"
    );
  };

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ) {
    this.doFailureReportingOperation(
      async () => {
        this.view.displayInfoMessage(
          `Removing ${displayedUser!.name} from followers...`,
          0
        );
  
        let [followersCount, followeesCount] = await this.service.unfollow(
          authToken!,
          displayedUser!
        );
  
        this.view.clearLastInfoMessage();
  
        this.view.setIsFollowerStatus(false);
        this.view.setNumbFollowers(followersCount);
        this.view.setNumbFollowees(followeesCount);
      },
      "unfollow user"
    );
  };
}