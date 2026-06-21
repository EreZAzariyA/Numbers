import { useAppDispatch, useAppSelector } from "./redux/store";
import { Languages } from "./utils/enums";
import { getThemeConfig } from "./utils/antd";
import { ConfigProvider, App as AppContainer, Spin } from "antd";
import il from 'antd/locale/he_IL';
import en from 'antd/locale/en_US';
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useSocketSession } from "./hooks/useSocketSession";
import { refreshTokenAction } from "./redux/actions/auth-actions";
import { routes } from "./routes";

const App = () => {
  const dispatch = useAppDispatch();
  const { token, initializing } = useAppSelector((state) => state.auth);
  const { themeColor: { theme }, language: { lang } } = useAppSelector((state) => state.config);
  const isEN = lang === Languages.EN
  const direction = isEN ? 'ltr': 'rtl';
  const locale = isEN ? en : il;

  useSocketSession(token);

  // Restore the session from the HttpOnly refresh cookie on first load. Until
  // this resolves, render a spinner so protected routes don't redirect to
  // sign-in before we know whether the user is already authenticated.
  useEffect(() => {
    dispatch(refreshTokenAction());
  }, [dispatch]);

  useEffect(() => {
    const body = document.body;
    body.classList.add(`${theme}-theme`);

    return () => {
      body.classList.remove(`${theme}-theme`);
    }
  }, [theme]);

  return (
    <ConfigProvider
      direction={direction}
      theme={getThemeConfig(theme)}
      locale={locale}
    >
      <AppContainer>
        {initializing
          ? <Spin spinning fullscreen />
          : <RouterProvider router={routes} />}
      </AppContainer>
    </ConfigProvider>
  );
};

export default App;
