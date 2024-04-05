import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeType =  string;

export enum ThemeColors {
  DARK = "dark",
  LIGHT = "light"
};

export interface ThemeState {
  themeColor: ThemeType
};

const initialState: ThemeState = {
  themeColor: localStorage.getItem('theme-color') || ThemeColors.LIGHT
};

const themeSlicer = createSlice({
  name: 'theme',
  initialState: initialState,
  reducers: {
    fetchUserThemeAction(state, action: PayloadAction<ThemeType>): ThemeState {
      state.themeColor = action.payload;
      localStorage.setItem('theme-color', action.payload);
      return state;
    },
    changeThemeAction(state, action: PayloadAction<ThemeType>): ThemeState {
      state.themeColor = action.payload;
      localStorage.setItem('theme-color', action.payload);
      return state;
    },
    themeLogoutAction() {
      localStorage.removeItem('theme-color');
      return initialState;
    }
  }
});

export const { fetchUserThemeAction, changeThemeAction, themeLogoutAction } = themeSlicer.actions;
export default themeSlicer.reducer