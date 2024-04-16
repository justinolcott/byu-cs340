
import "isomorphic-fetch";

import { mock, instance, spy, verify, when, anything, capture } from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";
import { StatusService } from "../../src/model/service/StatusService";
import { PostStatusView, PostStatusPresenter } from "../../src/presenter/PostStatusPresenter";

describe("PostStatusIntegration", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let post = "Hello, World!";
  
  beforeAll(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);
  });

  it("posts a status and checks the story", async () => {
    const userService = new UserService();
    const [user, authToken] = await userService.login("tester", "password");

    await postStatusPresenter.submitPost(
      post,
      user,
      authToken
    );

    await new Promise((res) => setTimeout(res, 5000));

    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();

    const statusService = new StatusService();
    const [stories, hasMore] = await statusService.loadMoreStoryItems(authToken, user, 1, null);
    const story = stories[0];

    expect(story.post).toEqual(post);
    expect(story.user.firstName).toEqual(user.firstName);
    expect(story.user.lastName).toEqual(user.lastName);
    expect(story.user.alias).toEqual(user.alias);
  }, 10000);
})
