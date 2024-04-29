import axios from "axios";
import config from "../utils/config";
import UserModel from "../models/user-model";
import CredentialsModel from "../models/credentials-model";
import store from "../redux/store";
import { loginAction, logoutAction, registerAction } from "../redux/slicers/auth-slicer";
import { categoriesOnLogoutAction } from "../redux/slicers/categories";
import { invoicesOnLogoutAction } from "../redux/slicers/invoices";
import { themeLogoutAction } from "../redux/slicers/theme-slicer";
import { langLogoutAction } from "../redux/slicers/lang-slicer";
import { TokenResponse } from "@react-oauth/google";

class AuthServices {
  signup = async (user: UserModel): Promise<string> => {
    const response = await axios.post<string>(config.urls.auth.signUp, user);
    const token = response.data;
    if (token) {
      store.dispatch(registerAction({token}));
      return token;
    }
    return null;
  };

  signin = async (credentials: CredentialsModel): Promise<string> => {
    if (!(credentials.email || credentials.password)) {
      throw new Error('Some fields are missing');
    }
    const response = await axios.post<string>(config.urls.auth.signIn, credentials);
    const token = response.data;
    if (token) {
      store.dispatch(loginAction({token}));
      return token;
    }
    return null;
  };

  googleSignIn = async (tokenResponse: TokenResponse): Promise<string> => {
    const response = await axios.post<string>(config.urls.auth.googleSignIn, tokenResponse);
    const token = response.data;
    store.dispatch(loginAction({token}));
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