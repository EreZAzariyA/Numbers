import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { TokenResponse } from "@react-oauth/google";
import { createAsyncThunk } from "@reduxjs/toolkit";
import UserModel from "../../models/user-model";
import CredentialsModel from "../../models/credentials-model";
import { removeUserConfig, setUserLang, setUserTheme } from "../slicers/user-config";
import config from "../../utils/config";

export enum AuthActions {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  GOOGLE_SIGN_IN = "GOOGLE_SIGN_IN",
  LOGOUT = "LOGOUT"
};

export const signupAction = createAsyncThunk(
  AuthActions.SIGN_UP,
  async (user: UserModel): Promise<string> => {
    const response = await axios.post<string>(config.urls.auth.signup, user);
    const token = response.data;
    return token;
  }
);

export const signinAction = createAsyncThunk(
  AuthActions.SIGN_IN,
  async (credentials: CredentialsModel, thunkApi): Promise<string> => {
    if (!(credentials.email || credentials.password)) {
      throw new Error('Some fields are missing');
    }
    const response = await axios.post<string>(config.urls.auth.signIn, credentials);
    const token = response.data;
    if (!!token) {
      const user = jwtDecode(token) as UserModel;
      thunkApi.dispatch(setUserTheme(user.config["theme-color"]));
      thunkApi.dispatch(setUserLang(user.config.lang));
      return token;
    }
    thunkApi.rejectWithValue(null);
  }
);

export const googleSignInAction = createAsyncThunk(
  AuthActions.GOOGLE_SIGN_IN,
  async (tokenResponse: TokenResponse, thunkApi) => {
    const response = await axios.post<string>(config.urls.auth.googleSignIn, tokenResponse);
    const token = response.data;
    if (!!token) {
      const user = jwtDecode(token) as UserModel;
      thunkApi.dispatch(setUserTheme(user.config["theme-color"]));
      thunkApi.dispatch(setUserLang(user.config.lang));
      return token;
    }
    thunkApi.rejectWithValue(null);
  }
);

export const logoutAction = createAsyncThunk<void>(
  AuthActions.LOGOUT,
  async (_, api) => {
    api.dispatch(removeUserConfig());
    localStorage.removeItem('token');
    await axios.post<void>(config.urls.auth.logout);
  }
);