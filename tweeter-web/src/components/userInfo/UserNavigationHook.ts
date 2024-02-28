import useUserInfo from "./UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { UserNavigationView, UserNavigationPresenter } from "../../presenter/UserNavigationPresenter";
import { useState } from "react";

const useUserNavigation = () => {
    const { setDisplayedUser, currentUser, authToken } = useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const listener: UserNavigationView = {
        displayErrorMessage: displayErrorMessage,
        setDisplayedUser: setDisplayedUser
    }

    // Presenter: Should this be a state?
    const [presenter] = useState(new UserNavigationPresenter(listener));

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
        presenter.navigateToUser(currentUser, authToken!, event.target.toString());
      };

      return { navigateToUser };
}

export default useUserNavigation;
