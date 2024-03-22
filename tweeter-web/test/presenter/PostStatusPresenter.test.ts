import { mock, instance, spy, verify, when, anything, capture } from "ts-mockito";
import { PostStatusView, PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model/service/StatusService";


describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("token", Date.now());
  const user = new User("firstname", "lastname", "alias", "imageurl");

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
  });

  it("The presenter tells the view to display a posting status message.", async () => {
    await postStatusPresenter.submitPost("post", user, authToken);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("The presenter calls postStatus on the post status service with the correct status string and auth token.", async () => {
    await postStatusPresenter.submitPost("post", user, authToken);
    verify(mockStatusService.postStatus(authToken, anything())).once();

    let [authTokenArg, statusArg] = capture(mockStatusService.postStatus).last();
    expect(statusArg.post).toEqual("post");
  });

  it("When posting of the status is successful, the presenter tells the view to clear the last info message, clear the post, and display a status posted message.", async () => {
    await postStatusPresenter.submitPost("post", user, authToken);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("When posting of the status is not successful, the presenter tells the view to display an error message and does not tell it to do the following: clear the last info message, clear the post, and display a status posted message.", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost("post", user, authToken);
    verify(mockPostStatusView.displayErrorMessage("Failed to post status because of exception: An error occurred")).once();
    verify(mockPostStatusView.clearLastInfoMessage()).never();
    verify(mockPostStatusView.setPost("")).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  });
});