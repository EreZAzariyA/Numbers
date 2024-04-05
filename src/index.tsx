import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';
import './styles/global.css';
import './styles/style.css';
import './styles/DashboardView.css';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './messages/en.json';
import he from './messages/he.json';
import interceptorsService from './services/InterceptorsService';
interceptorsService.createInterceptors();
const userLang = localStorage.getItem('lang');

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

const isAdmin = JSON.parse(process.env.REACT_APP_IS_ADMIN);
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if (isAdmin) {
  import("./routes/AdminRouter").then((AdminRouter) => {
    root.render(AdminRouter.default());
  });
} else {
  import("./routes/UserRouter").then((UserRouter) => {
    root.render(UserRouter.default());
  });
}

reportWebVitals();
