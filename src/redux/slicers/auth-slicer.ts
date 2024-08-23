import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode';
import UserModel from '../../models/user-model';
import bankServices from '../../services/banks';

export interface AuthState {
  token: string | null,
  user?: UserModel | null
};

const token = localStorage.getItem('token');
const user: UserModel = token && token  !== 'undefined' ? jwtDecode(token) : null;

const initialState: AuthState = {
  token,
  user
};

const authSlicer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginAction(state: AuthState, action: PayloadAction<AuthState>): AuthState {
      if (!action.payload || !action.payload.token) return;

      localStorage.setItem('token', action.payload.token);
      state = {
        token: action.payload.token,
        user: jwtDecode(action.payload.token)
      };
      return state;
    },
    registerAction(state: AuthState, action: PayloadAction<AuthState>) {
    },
    logoutAction(state: AuthState, action: PayloadAction<AuthState>): AuthState {
      localStorage.removeItem('token');
      state = {token: null, user: null}
      return state;
    },
    refreshTokenAction(state: AuthState, action: PayloadAction<string>): AuthState {
      localStorage.setItem('token', action.payload);
      state = {
        token: action.payload,
        user: jwtDecode(action.payload)
      };
      return state;
    },
    updateUserFieldsAction(state: AuthState, action: PayloadAction<{field: string, value: any}>): AuthState {
      state = {
        ...state,
        user: {
          ...state.user,
          [action.payload.field]: action.payload.value
        }
      };
      return state
    },
    fetchUserDataAction(state: AuthState, action: PayloadAction<UserModel>): AuthState {
      state = {
        ...state,
        user: action.payload
      }
      return state;
    }
  },
});

export const {
  loginAction,
  registerAction,
  logoutAction,
  refreshTokenAction,
  updateUserFieldsAction,
  fetchUserDataAction
  } = authSlicer.actions;
export default authSlicer.reducer;