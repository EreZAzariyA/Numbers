import { ActionReducerMapBuilder, createSlice, SerializedError } from "@reduxjs/toolkit";
import { LanguageType, ThemeColorType } from "../../utils/types";
import { Languages, ThemeColors } from "../../utils/enums";
import { changeLanguageAction, changeThemeAction } from "../actions/user-config-actions";
import i18next from "i18next";

interface UserConfigState {
  language: {
    lang: LanguageType;
    loading: boolean;
    error: SerializedError | null;
  };
  themeColor: {
    theme: ThemeColorType;
    loading: boolean;
    error: SerializedError | null;
  };
};

const defaultLanguage = localStorage.getItem('language') as LanguageType || Languages.EN;
const defaultThemeColor = localStorage.getItem('theme-color') as ThemeColorType || ThemeColors.LIGHT;
const initialState: UserConfigState = {
  language: {
    lang: defaultLanguage,
    loading: false,
    error: null,
  },
  themeColor: {
    theme: defaultThemeColor,
    loading: false,
    error: null,
  },
};

const extraReducers = (builder: ActionReducerMapBuilder<UserConfigState>) => {
  builder.addCase(changeThemeAction.pending, (state) => ({
    ...state,
    themeColor: {
      ...state.themeColor,
      loading: true,
      error: null
    }
  }))
  .addCase(changeThemeAction.rejected, (state, action) => ({
    ...state,
    themeColor: {
      ...state.themeColor,
      loading: false,
      error: action.error,
    }
  }))
  .addCase(changeThemeAction.fulfilled, (state, action) => ({
    ...state,
    themeColor: {
      loading: false,
      error: null,
      theme: action.payload
    }
  }));

  builder.addCase(changeLanguageAction.pending, (state) => ({
    ...state,
    language: {
      ...state.language,
      loading: true,
      error: null
    }
  }))
  .addCase(changeLanguageAction.rejected, (state, action) => ({
    ...state,
    language: {
      ...state.language,
      loading: false,
      error: action.payload
    }
  }))
  .addCase(changeLanguageAction.fulfilled, (state, action) => ({
    ...state,
    language: {
      ...state.language,
      loading: false,
      error: null,
      lang: action.payload
    }
  }));
};

const userConfigSlicer = createSlice({
  initialState,
  name: 'userConfig',
  reducers: {
    setUserTheme(state, action) {
      localStorage.setItem('theme-color', action.payload);
      return {
        ...state,
        themeColor: {
          ...state.themeColor,
          theme: action.payload
        }
      }
    },
    setUserLang(state, action) {
      localStorage.setItem('language', action.payload);
      i18next.changeLanguage(action.payload);
      return {
        ...state,
        language: {
          ...state.language,
          lang: action.payload
        }
      }
    },
    removeUserConfig(state) {
      localStorage.removeItem('language');
      localStorage.removeItem('theme-color');

      return {
        language: {
          ...state.language,
          lang: Languages.EN
        },
        themeColor: {
          ...state.themeColor,
          theme: ThemeColors.LIGHT
        }
      }
    }
  },
  extraReducers
});

export const { removeUserConfig, setUserTheme, setUserLang } = userConfigSlicer.actions;
export default userConfigSlicer.reducer;