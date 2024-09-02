import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import store from './redux/store';
import { CookiesProvider } from 'react-cookie';
import interceptorsService from './services/InterceptorsService';
import en from './messages/en.json';
import he from './messages/he.json';
import './styles/index.css';
import './styles/global.css';
import './styles/style.css';
import './styles/darkmode.css';
import './styles/DashboardView.css';

interceptorsService.createInterceptors();
const userLang = localStorage.getItem('language');

i18n
.use(initReactI18next)
.init({
  lng: userLang,
  fallbackLng: 'en',
  resources: {
    en: {
      translation: en
    },
    he: {
      translation: he
    }
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

import("./App").then((RootApp) => {
  const App = RootApp.default;

  root.render(
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <CookiesProvider defaultSetOptions={{ path: '/' }}>
          <App />
        </CookiesProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
});

reportWebVitals();
