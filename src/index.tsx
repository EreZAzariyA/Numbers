import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './redux/store';
import interceptorsService from './services/InterceptorsService';
import en from './messages/en.json';
import he from './messages/he.json';
import './styles/index.css';
import './styles/global.css';
import './styles/style.css';
import './styles/darkmode.css';
import './styles/DashboardView.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interceptorsService.createInterceptors();
const userLang = localStorage.getItem('language');
const queryClient = new QueryClient()

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
    <React.StrictMode>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <App />
          </Provider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
});

reportWebVitals();
