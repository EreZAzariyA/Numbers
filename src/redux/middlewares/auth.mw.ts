import { Middleware } from "redux";
import { jwtDecode } from "jwt-decode";
import { fetchUserLangAction } from "../slicers/lang-slicer";
import { fetchUserThemeAction } from "../slicers/theme-slicer";
import UserModel from "../../models/user-model";

const authMiddleWare: Middleware = (store) => (next) => (action: any) => {
  if (action.type === 'auth/loginAction') {
    const token = action.payload.token;
    const user: UserModel = jwtDecode(token);

    if (user && user?.config) {
      store.dispatch(fetchUserLangAction(user.config.lang));
      store.dispatch(fetchUserThemeAction(user.config?.["theme-color"]));
    }
  }

  return next(action);
}

export default authMiddleWare;