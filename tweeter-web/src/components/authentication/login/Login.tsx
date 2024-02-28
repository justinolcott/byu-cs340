import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthentificationFormFields from "../AuthentificationFormFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthToken, User } from "tweeter-shared";
import { LoginView } from "../../../presenter/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const rememberMeRef = useRef(rememberMe);
  rememberMeRef.current = rememberMe;

  const listener: LoginView = {
    updateUserInfo: (user: User, displayedUser: User, authToken: AuthToken) => {
      updateUserInfo(user, displayedUser, authToken, rememberMeRef.current);
    },
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  let [presenter] = useState(new LoginPresenter(listener));

  const doLogin = async () => {
    await presenter.doLogin(alias, password, props.originalUrl);
  };

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthentificationFormFields setAlias={setAlias} setPassword={setPassword} />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      submit={doLogin}
    />
  );
};

export default Login;
