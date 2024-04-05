import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode';
import UserModel from '../../models/user-model';

interface AuthState {
  token: string | null,
  user?: UserModel | null
};

const token = localStorage.getItem('token') || null;
const user: UserModel = token ? jwtDecode(token) : null;

const initialState: AuthState = {
  token: token,
  user: user
};

const authSlicer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAction(state: AuthState, action: PayloadAction<AuthState>) {
      if (!action.payload) return;
      localStorage.setItem('token', action.payload.token);
      state = {
        token: action.payload.token,
        user: jwtDecode(action.payload.token)
      };
      return state;
    },
    registerAction(state: AuthState, action: PayloadAction<AuthState>) {
    },
    logoutAction(state: AuthState, action: PayloadAction<AuthState>) {
      localStorage.removeItem('token');
      state = {token: null, user: null}
      return state
    },
    refreshTokenAction(state: AuthState, action: PayloadAction<AuthState>) {
      state = {
        token: action.payload.token,
        user: jwtDecode(action.payload.token)
      };
    }
  }
});

export const {
  loginAction,
  registerAction,
  logoutAction,
  refreshTokenAction,
  } = authSlicer.actions;
export default authSlicer.reducer;