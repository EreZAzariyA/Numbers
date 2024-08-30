import { Middleware } from "redux";
import { signinAction } from "../actions/auth-actions";
import { jwtDecode } from "jwt-decode";
import UserModel from "../../models/user-model";
import { setUserLang, setUserTheme } from "../slicers/user-config-slicer";

const authMiddleWare: Middleware = (store) => (next) => (action: any) => {
  const { dispatch } = store;

  if (signinAction.fulfilled.match(action)) {
    const user = jwtDecode(action.payload) as UserModel;

    dispatch(setUserTheme(user.config["theme-color"]));
    dispatch(setUserLang(user.config.lang));
  }

  return next(action);
}

export default authMiddleWare;