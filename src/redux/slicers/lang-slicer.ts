import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum Languages {
  EN = "en",
  HE = "he"
};

export type LanguageType = string;

interface LanguageState {
  lang: LanguageType;
};

const initialState: LanguageState = {
  lang: localStorage.getItem('lang') || Languages.EN,
};

const languagesSlicer = createSlice({
  name: 'language',
  initialState,
  reducers: {
    fetchUserLangAction(state, action: PayloadAction<LanguageType>): LanguageState {
      state.lang = action.payload;
      localStorage.setItem('lang', action.payload);
      return state;
    },
    changeLangAction(state, action: PayloadAction<LanguageType>): LanguageState {
      state.lang = action.payload;
      localStorage.setItem('lang', action.payload);
      return state;
    },
    langLogoutAction(state): LanguageState {
      localStorage.removeItem('lang');
      return state = initialState
    }
  }
});

export const { fetchUserLangAction, changeLangAction, langLogoutAction } = languagesSlicer.actions;
export default languagesSlicer.reducer