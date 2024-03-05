import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("start with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField } = renderLoginAndGetElement("/");
    await enterFieldInput(signInButton, aliasField, passwordField, userEvent);
  });

  it("disables the sign-in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");
    await enterFieldInput(signInButton, aliasField, passwordField, user);
    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "user");
    expect(signInButton).toBeEnabled();
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "user";
    const password = "password";
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement(originalUrl, mockPresenterInstance);
    await enterFieldInput(signInButton, aliasField, passwordField, user, alias, password);
    await user.click(signInButton);
    verify(mockPresenter.doLogin(alias, password, originalUrl)).once();

  });


});


const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
      
    </MemoryRouter>
  );
};

const renderLoginAndGetElement = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i  });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};

async function enterFieldInput(
  signInButton: HTMLElement,
  aliasField: HTMLElement,
  passwordField: HTMLElement,
  user: any,
  aliasText: string = "user",
  passwordText: string = "password"
): Promise<void> {
  await user.type(aliasField, aliasText);
  await user.type(passwordField, passwordText);
  expect(signInButton).toBeEnabled();
}

