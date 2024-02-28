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
      try {
          this.view.setNumbFollowees(await this.service.getFolloweesCount(authToken, displayedUser));
          // this.view.setNumbFollowees(
          //     await this.service.getFolloweesCount(authToken!, displayedUser!)
          // );
      } catch (error) {
          this.view.displayErrorMessage(
              `Failed to get followees count because of exception: ${error}`
          );
      }
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setNumbFollowers(await this.service.getFollowersCount(authToken, displayedUser));
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollowerStatus(false);
      } else {
        this.view.setIsFollowerStatus(await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
  ) {
    try {
      this.view.displayInfoMessage(`Adding ${displayedUser!.name} to followers...`, 0);

      let [followersCount, followeesCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.view.clearLastInfoMessage();

      this.view.setIsFollowerStatus(true);
      this.view.setNumbFollowers(followersCount);
      this.view.setNumbFollowees(followeesCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    }
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