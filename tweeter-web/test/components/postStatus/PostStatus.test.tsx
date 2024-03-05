import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { anything, instance, mock, verify } from "ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom"

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));  

describe("PostStatus Component", () => {
  let mockUser: User;
  let mockAuthToken: AuthToken;
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    mockUser = mock<User>();
    mockUserInstance = instance(mockUser);

    mockAuthToken = mock<AuthToken>();
    mockAuthTokenInstance = instance(mockAuthToken);    

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });


  it("When first rendered the Post Status and Clear buttons are both disabled.", async () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text.", async () => {
    const { statusText, postStatusButton, clearButton, user } = renderPostStatusAndGetElement();
    await enterFieldInput(statusText, postStatusButton, clearButton, user);
  });

  it("Both buttons are disabled when the text field is cleared.", async () => {
    const { statusText, postStatusButton, clearButton, user } = renderPostStatusAndGetElement();
    await enterFieldInput(statusText, postStatusButton, clearButton, user);
    await user.clear(statusText);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    
    const text = "text";
    const { statusText, postStatusButton, clearButton, user } = renderPostStatusAndGetElement(mockPresenterInstance);
    await enterFieldInput(statusText, postStatusButton, clearButton, user, text);
    await user.click(postStatusButton);
    verify(mockPresenter.submitPost(text, mockUserInstance, mockAuthTokenInstance)).once();
  });

});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <PostStatus presenter={presenter} />
      ) : (
        <PostStatus />
      )}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);

  const statusText = screen.getByLabelText("post status text");
  const postStatusButton = screen.getByLabelText("post status button");
  const clearButton = screen.getByLabelText("clear status button");

  return { statusText, postStatusButton, clearButton, user };
};

async function enterFieldInput(
  statusText: HTMLElement,
  postStatusButton: HTMLElement,
  clearButton: HTMLElement,
  user: any,
  text: string = "text"
) {
  await user.type(statusText, text);
  expect(postStatusButton).toBeEnabled();
  expect(clearButton).toBeEnabled();
}