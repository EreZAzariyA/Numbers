import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../utils/config";
import { LanguageType, ThemeColorType } from "../../utils/types";

export const changeThemeAction = createAsyncThunk(
  'userConfig/changeThemeAction',
  async (payload: { user_id: string, theme: ThemeColorType }): Promise<ThemeColorType> => {
    const response = await axios.put<ThemeColorType>(config.urls.users.config.theme, payload);
    const selectedTheme = response.data;
    localStorage.setItem('themeColor', selectedTheme);
    return selectedTheme;
  }
);

export const changeLanguageAction = createAsyncThunk(
  'userConfig/changeLanguageAction',
  async (payload: { user_id: string, language: LanguageType }): Promise<LanguageType> => {
    const response = await axios.put<LanguageType>(config.urls.users.config.language, payload);
    const selectedLanguage = response.data;
    localStorage.setItem('language', selectedLanguage);
    return selectedLanguage;
  }
);