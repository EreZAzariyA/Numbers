import { jwtDecode } from 'jwt-decode';
import { ActionReducerMapBuilder, createSlice, SerializedError } from '@reduxjs/toolkit'
import UserModel from '../../models/user-model';
import { googleSignInAction, logoutAction, refreshTokenAction, signinAction, signupAction } from '../actions/auth-actions';

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserModel | null;
  loading: boolean;
  error: SerializedError | null;
};

const token = localStorage.getItem('token') || null;
const refreshToken = localStorage.getItem('refreshToken') || null;
const user = !!token ? jwtDecode(token) as UserModel : null;

const initialState: AuthState = {
  token,
  refreshToken,
  user,
  loading: false,
  error: null,
};

const extraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  // Sign-In
  builder.addCase(signinAction.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(signinAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(signinAction.fulfilled, (_, action) => {
    return {
      loading: false,
      error: null,
      token: action.payload.token,
      refreshToken: action.payload.refreshToken,
      user: jwtDecode(action.payload.token)
    }
  });

  // Sign-Up
  builder.addCase(signupAction.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(signupAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(signupAction.fulfilled, (_, action) => ({
    loading: false,
    error: null,
    token: action.payload.token,
    refreshToken: action.payload.refreshToken,
    user: jwtDecode(action.payload.token),
  }));

  // Google Sign-In
  builder.addCase(googleSignInAction.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(googleSignInAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(googleSignInAction.fulfilled, (_, action) => {
    return {
      loading: false,
      error: null,
      token: action.payload.token,
      refreshToken: action.payload.refreshToken,
      user: jwtDecode(action.payload.token),
    }
  });

  // Refresh Token
  builder.addCase(refreshTokenAction.pending, (state) => ({
    ...state,
  }))
  .addCase(refreshTokenAction.rejected, (state, action) => ({
    ...state,
    error: action.error
  }))
  .addCase(refreshTokenAction.fulfilled, (state, action) => ({
    ...state,
    token: action.payload.token,
    refreshToken: action.payload.refreshToken,
    user: jwtDecode(action.payload.token),
  }));

  // Logout
  builder.addCase(logoutAction.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(logoutAction.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(logoutAction.fulfilled, (state) => ({
    ...state,
    loading: false,
    error: null,
    token: null,
    refreshToken: null,
    user: null
  }));
};

const authSlicer = createSlice({
  name: 'auth',
  initialState,
  reducers: null,
  extraReducers
});

export default authSlicer.reducer;
