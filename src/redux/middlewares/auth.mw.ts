import { Middleware } from "redux";
import { googleSignInAction, logoutAction, refreshTokenAction, signinAction, signupAction } from "../actions/auth-actions";
import { jwtDecode } from "jwt-decode";
import UserModel from "../../models/user-model";
import { removeUserConfig, setPayDay, setUserLang, setUserTheme } from "../slicers/user-config-slicer";
import queryClient from "../../services/queryClient";
import { BANKS_QUERY_KEY } from "../../hooks/useBanks";

const authMiddleWare: Middleware = (store) => (next) => async (action: any) => {
  const { dispatch } = store;

  switch(action.type) {
    case signinAction.fulfilled.type:
    case signupAction.fulfilled.type:
    case googleSignInAction.fulfilled.type:
    case refreshTokenAction.fulfilled.type: {
      // Access token is held in Redux memory only; the refresh token is an
      // HttpOnly cookie. Nothing auth-related is persisted to localStorage.
      const user = jwtDecode(action.payload.token) as UserModel;
      dispatch(setUserTheme(user.config["theme-color"]));
      dispatch(setUserLang(user.config.lang));
      dispatch(setPayDay(user.config.payDay ?? null));
      break;
    }

    case logoutAction.fulfilled.type:
      queryClient.removeQueries({ queryKey: [BANKS_QUERY_KEY] });
      dispatch(removeUserConfig());
    break;
  }

  next(action);
};

export default authMiddleWare;
