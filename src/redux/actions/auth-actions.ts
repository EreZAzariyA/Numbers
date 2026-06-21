import axios from "axios";
import type { CredentialResponse } from "@react-oauth/google";
import { createAsyncThunk } from "@reduxjs/toolkit";
import UserModel from "../../models/user-model";
import CredentialsModel from "../../models/credentials-model";
import config from "../../utils/config";

export enum AuthActions {
  SIGN_UP = "auth/sign-up",
  SIGN_IN = "auth/sign-in",
  GOOGLE_SIGN_IN = "auth/google-sign-in",
  REFRESH = "auth/refresh",
  LOGOUT = "auth/logout"
};

interface AuthTokens {
  token: string;
}

export const signupAction = createAsyncThunk<AuthTokens, UserModel>(
  AuthActions.SIGN_UP,
  async (user, thunkApi) => {
    try {
      const response = await axios.post<AuthTokens>(config.urls.auth.signup, user);
      return thunkApi.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const signinAction = createAsyncThunk<AuthTokens, CredentialsModel>(
  AuthActions.SIGN_IN,
  async (credentials, thunkApi) => {
    try {
      if (!(credentials.email || credentials.password)) {
        throw new Error('Some fields are missing');
      }
      const response = await axios.post<AuthTokens>(config.urls.auth.signIn, credentials);
      return thunkApi.fulfillWithValue(response.data);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const googleSignInAction = createAsyncThunk<AuthTokens, CredentialResponse>(
  AuthActions.GOOGLE_SIGN_IN,
  async (tokenResponse, thunkApi) => {
    try {
      const response = await axios.post<AuthTokens>(config.urls.auth.googleSignIn, tokenResponse);
      const { token } = response.data;
      if (!token) return thunkApi.rejectWithValue('No token received');
      return { token };
    } catch (err: any) {
      return thunkApi.rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// The refresh token is an HttpOnly cookie sent automatically by the browser, so
// there is nothing to read from state or include in the request body.
export const refreshTokenAction = createAsyncThunk<AuthTokens>(
  AuthActions.REFRESH,
  async (_, thunkApi) => {
    try {
      const response = await axios.post<AuthTokens>(config.urls.auth.refresh);
      return response.data;
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
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
