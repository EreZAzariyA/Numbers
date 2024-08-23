import { Middleware } from "redux";
import { jwtDecode } from "jwt-decode";
import { fetchUserLangAction } from "../slicers/lang-slicer";
import { fetchUserThemeAction } from "../slicers/theme-slicer";
import UserModel from "../../models/user-model";
import { loginAction } from "../slicers/auth-slicer";

const authMiddleWare: Middleware = (store) => (next) => (action: any) => {
  const { dispatch } = store;
  if (action.type === loginAction.type) {
    const token = action.payload.token;
    const user: UserModel = jwtDecode(token);

    if (user && user?.config) {
      dispatch(fetchUserLangAction(user.config.lang));
      dispatch(fetchUserThemeAction(user.config?.["theme-color"]));
    }
  }

  return next(action);
}

export default authMiddleWare;