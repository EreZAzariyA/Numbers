import { useAppSelector } from "./redux/store";
import UserRouter from "./routes/UserRouter";
import { Languages } from "./utils/enums";
import { getThemeConfig } from "./utils/antd";
import { ConfigProvider, App as AppContainer } from "antd";
import il from 'antd/locale/he_IL';
import en from 'antd/locale/en_US';
import { useEffect } from "react";

const App = () => {
  const { themeColor: { theme }, language: { lang } } = useAppSelector((state) => state.config);
  const isEN = lang === Languages.EN
  const direction = isEN ? 'ltr': 'rtl';
  const locale = isEN ? en : il;

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
      <AppContainer
        message={{
          maxCount: 1,
        }}
      >
        <UserRouter />
      </AppContainer>
    </ConfigProvider>
  );
};

export default App;