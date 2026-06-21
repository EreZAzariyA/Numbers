import { jwtDecode } from 'jwt-decode';
import { ActionReducerMapBuilder, createSlice, SerializedError } from '@reduxjs/toolkit'
import UserModel from '../../models/user-model';
import { googleSignInAction, logoutAction, refreshTokenAction, signinAction, signupAction } from '../actions/auth-actions';

export interface AuthState {
  token: string | null;
  user: UserModel | null;
  loading: boolean;
  // True until the startup session-restore (silent refresh) has resolved, so
  // routes can wait instead of redirecting to sign-in on a hard refresh.
  initializing: boolean;
  error: SerializedError | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  initializing: true,
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
  .addCase(signinAction.fulfilled, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    token: action.payload.token,
    user: jwtDecode(action.payload.token),
  }));

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
  .addCase(signupAction.fulfilled, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    token: action.payload.token,
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
  .addCase(googleSignInAction.fulfilled, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    token: action.payload.token,
    user: jwtDecode(action.payload.token),
  }));

  // Refresh Token (also used for startup session restore)
  builder.addCase(refreshTokenAction.fulfilled, (state, action) => ({
    ...state,
    initializing: false,
    token: action.payload.token,
    user: jwtDecode(action.payload.token),
  }))
  .addCase(refreshTokenAction.rejected, (state, action) => ({
    ...state,
    initializing: false,
    token: null,
    user: null,
    error: action.error,
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
