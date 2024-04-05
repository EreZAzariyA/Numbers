import axios from "axios";
import config from "../utils/config";
import UserModel from "../models/user-model";
import CredentialsModel from "../models/credentials-model";
import store from "../redux/store";
import { loginAction, logoutAction, registerAction } from "../redux/slicers/auth-slicer";
import { categoriesOnLogoutAction } from "../redux/slicers/categories";
import { invoicesOnLogoutAction } from "../redux/slicers/invoices";
import { ThemeColors, fetchUserThemeAction, themeLogoutAction } from "../redux/slicers/theme-slicer";
import { fetchUserLangAction, langLogoutAction } from "../redux/slicers/lang-slicer";
import { jwtDecode } from "jwt-decode";
import { Languages } from "../utils/helpers";

class AuthServices {
  signup = async (user: UserModel) => {
    const response = await axios.post<string>(config.urls.auth.signUp, user);
    const token = response.data;
    store.dispatch(registerAction({token}));
    return token;
  };

  signin = async (credentials: CredentialsModel) => {
    if (!(credentials.email || credentials.password)) {
      throw new Error('Some fields are missing');
    }
    const response = await axios.post<string>(config.urls.auth.signIn, credentials);
    const token = response.data;
    store.dispatch(loginAction({token}));

    const user: UserModel = jwtDecode(token);
    store.dispatch(fetchUserLangAction(user.config?.lang || Languages.English));
    store.dispatch(fetchUserThemeAction(user.config?.["theme-color"] || ThemeColors.LIGHT));
    return token;
  };

  logout = () => {
    store.dispatch(logoutAction());
    store.dispatch(categoriesOnLogoutAction());
    store.dispatch(invoicesOnLogoutAction());
    store.dispatch(themeLogoutAction());
    store.dispatch(langLogoutAction());
  };
};

const authServices = new AuthServices();
export default authServices;