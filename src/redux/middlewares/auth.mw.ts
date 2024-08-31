import { Middleware } from "redux";
import { logoutAction, signinAction } from "../actions/auth-actions";
import { jwtDecode } from "jwt-decode";
import UserModel from "../../models/user-model";
import { removeUserConfig, setUserLang, setUserTheme } from "../slicers/user-config-slicer";

const authMiddleWare: Middleware = (store) => (next) => (action: any) => {
  const { dispatch } = store;
  console.log(action);


  switch(action.type) {
    case signinAction.fulfilled.type:
      localStorage.setItem('token', action.payload);
      const user = jwtDecode(action.payload) as UserModel;

      dispatch(setUserTheme(user.config["theme-color"]));
      dispatch(setUserLang(user.config.lang));
    break;

    case logoutAction.fulfilled.type:
      localStorage.removeItem('token');
      dispatch(removeUserConfig());
    break;
  }

  next(action);
};

export default authMiddleWare;