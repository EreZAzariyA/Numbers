import { Middleware } from "redux";
import { googleSignInAction, logoutAction, refreshTokenAction, signinAction, signupAction } from "../actions/auth-actions";
import { jwtDecode } from "jwt-decode";
import UserModel from "../../models/user-model";
import { removeUserConfig, setUserLang, setUserTheme } from "../slicers/user-config-slicer";
import queryClient from "../../services/queryClient";
import { BANKS_QUERY_KEY } from "../../hooks/useBanks";

const authMiddleWare: Middleware = (store) => (next) => async (action: any) => {
  const { dispatch } = store;

  switch(action.type) {
    case signinAction.fulfilled.type:
    case signupAction.fulfilled.type:
    case googleSignInAction.fulfilled.type:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      const user = jwtDecode(action.payload.token) as UserModel;
      dispatch(setUserTheme(user.config["theme-color"]));
      dispatch(setUserLang(user.config.lang));
    break;

    case refreshTokenAction.fulfilled.type:
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    break;

    case logoutAction.fulfilled.type:
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      queryClient.removeQueries({ queryKey: [BANKS_QUERY_KEY] });
      dispatch(removeUserConfig());
    break;
  }

  next(action);
};

export default authMiddleWare;
