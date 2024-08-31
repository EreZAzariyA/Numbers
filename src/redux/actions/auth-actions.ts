import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { TokenResponse } from "@react-oauth/google";
import { createAsyncThunk } from "@reduxjs/toolkit";
import UserModel from "../../models/user-model";
import CredentialsModel from "../../models/credentials-model";
import { removeUserConfig, setUserLang, setUserTheme } from "../slicers/user-config-slicer";
import config from "../../utils/config";
import { message } from "antd";
import { fetchTransactions } from "./transaction-actions";
import { fetchCategoriesAction } from "./category-actions";
import { fetchBankAccounts } from "./bank-actions";
import { RootState } from "../store";

export enum AuthActions {
  FETCH_USER = "auth/fetch-user",
  SIGN_UP = "auth/sign-up",
  SIGN_IN = "auth/sign-in",
  GOOGLE_SIGN_IN = "auth/google-sign-in",
  LOGOUT = "auth/logout"
};

export const fetchUser = createAsyncThunk<{ user: UserModel, token: string }, null>(
  AuthActions.FETCH_USER,
  async (_, thunkApi) => {
    try {
      const { user, token } = (thunkApi.getState() as RootState).auth;
      await thunkApi.dispatch(fetchCategoriesAction(user._id)).unwrap();
      await thunkApi.dispatch(fetchTransactions(user._id)).unwrap();
      await thunkApi.dispatch(fetchBankAccounts(user._id)).unwrap();
      return thunkApi.fulfillWithValue({ user, token });
    } catch (err: any) {
      console.log({err});
      thunkApi.rejectWithValue(err.message);
    }
  }
);

export const signupAction = createAsyncThunk<string, UserModel>(
  AuthActions.SIGN_UP,
  async (user, thunkApi): Promise<string> => {
    try {
      const response = await axios.post<string>(config.urls.auth.signup, user);
      const token = response.data;
      return token;
    } catch (err: any) {
      message.error(err.message);
    }
  }
);

export const signinAction = createAsyncThunk<string, CredentialsModel>(
  AuthActions.SIGN_IN,
  async (credentials, thunkApi) => {
    try {
      if (!(credentials.email || credentials.password)) {
        throw new Error('Some fields are missing');
      }
      const response = await axios.post<string>(config.urls.auth.signIn, credentials);
      const token = response.data;
      localStorage.setItem('token', token);
      return thunkApi.fulfillWithValue(token);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
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
    await axios.post<void>(config.urls.auth.logout);
    localStorage.removeItem('token');
    api.dispatch(removeUserConfig());
  }
);