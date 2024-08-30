import { ActionReducerMapBuilder, createSlice, SerializedError } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode';
import UserModel from '../../models/user-model';
import { fetchUser, googleSignInAction, logoutAction, signinAction, signupAction } from '../actions/auth-actions';

export interface AuthState {
  token: string | null;
  user: UserModel | null;
  loading: boolean;
  error: SerializedError | null;
};

const token = localStorage.getItem('token') || null;
const user = !!token ? jwtDecode(token) as UserModel : null;

const initialState: AuthState = {
  token,
  user,
  loading: false,
  error: null,
};

const extraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  // Fetch-User
  builder.addCase(fetchUser.pending, (state) => ({
    ...state,
    loading: true,
    error: null
  }))
  .addCase(fetchUser.rejected, (state, action) => ({
    ...state,
    loading: false,
    error: action.error
  }))
  .addCase(fetchUser.fulfilled, (state, action) => ({
    ...state,
    loading: false,
    error: null,
    user: action.payload.user,
    token: action.payload.token
  }));

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
      token: action.payload,
      user: jwtDecode(action.payload)
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
  .addCase(signupAction.fulfilled, (state) => ({
    ...state,
    loading: false,
    error: null,
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
    localStorage.setItem('token', action.payload);
    return {
      loading: false,
      error: null,
      token: action.payload,
      user: jwtDecode(action.payload),
    }
  });

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
  reducers: {
    updateUserToken(state, action) {
      localStorage.setItem('token', action.payload);
      state = {
        token: action.payload,
        user: jwtDecode(action.payload),
        error: null,
        loading: false
      }
      return state;
    }
  },
  extraReducers
});

export const {
  updateUserToken
} = authSlicer.actions;

export default authSlicer.reducer;