import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../utils/config";
import { LanguageType, ThemeColorType } from "../../utils/types";

export enum UserConfigActionsType {
  CHANGE_THEME = "userConfig/changeThemeAction",
  CHANGE_LANG = "userConfig/changeLanguageAction",
  CHANGE_PAY_DAY = "userConfig/changePayDayAction"
};

export const changeThemeAction = createAsyncThunk<ThemeColorType, { user_id: string, theme: ThemeColorType }>(
  UserConfigActionsType.CHANGE_THEME,
  async ({ user_id, theme } , thunkApi) => {
    try {
      const response = await axios.put<ThemeColorType>(config.urls.users.config.theme + `/${user_id}`, { theme });
      const selectedTheme = response.data;
      localStorage.setItem('theme-color', selectedTheme)
      return thunkApi.fulfillWithValue(selectedTheme);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const changeLanguageAction = createAsyncThunk<LanguageType, { user_id: string, language: LanguageType }>(
  UserConfigActionsType.CHANGE_LANG,
  async ({ user_id, language }, thunkApi) => {
    try {
      const response = await axios.put<LanguageType>(config.urls.users.config.language + `/${user_id}`, { language });
      const selectedLanguage = response.data;
      localStorage.setItem('language', selectedLanguage)
      return thunkApi.fulfillWithValue(selectedLanguage);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

export const changePayDayAction = createAsyncThunk<number, { user_id: string, payDay: number }>(
  UserConfigActionsType.CHANGE_PAY_DAY,
  async ({ user_id, payDay }, thunkApi) => {
    try {
      const response = await axios.put<{ payDay: number }>(config.urls.users.config.payDay + `/${user_id}`, { payDay });
      return thunkApi.fulfillWithValue(response.data.payDay);
    } catch (err: any) {
      return thunkApi.rejectWithValue(err.message);
    }
  }
);