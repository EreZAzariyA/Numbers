import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";
import { createAsyncThunk } from "@reduxjs/toolkit";
import UserModel from "../../models/user-model";
import CredentialsModel from "../../models/credentials-model";
import { setUserLang, setUserTheme } from "../slicers/user-config-slicer";
import config from "../../utils/config";
import { RootState } from "../store";
import { fetchCategoriesAction } from "./category-actions";
import { fetchBankAccounts } from "./bank-actions";

export enum AuthActions {
  FETCH_USER_DATA = "auth/fetch-user-data",
  SIGN_UP = "auth/sign-up",
  SIGN_IN = "auth/sign-in",
  GOOGLE_SIGN_IN = "auth/google-sign-in",
  LOGOUT = "auth/logout"
};

export const fetchUserDataAction = createAsyncThunk<void>(
  AuthActions.FETCH_USER_DATA,
  async (_, thunkApi) => {
    try {
      const { user } = (thunkApi.getState() as RootState).auth;
      await thunkApi.dispatch(fetchBankAccounts(user._id)).unwrap();
      await thunkApi.dispatch(fetchCategoriesAction(user._id)).unwrap();
    } catch (err: any) {
      thunkApi.rejectWithValue(err);
    }
  }
);

export const signupAction = createAsyncThunk<string, UserModel>(
  AuthActions.SIGN_UP,
  async (user, thunkApi) => {
    try {
      const response = await axios.post<string>(config.urls.auth.signup, user);
      const token = response.data;
      return thunkApi.fulfillWithValue(token);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
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

      return thunkApi.fulfillWithValue(token);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const googleSignInAction = createAsyncThunk<string, CredentialResponse>(
  AuthActions.GOOGLE_SIGN_IN,
  async (tokenResponse, thunkApi) => {
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
  async (_, thunkApi) => {
    try {
      await axios.post<void>(config.urls.auth.logout);
    } catch (err: any) {
      thunkApi.rejectWithValue(err);
    }
  }
);