import { useEffect } from "react";
import { useAppSelector } from "./redux/store";
import UserRouter from "./routes/UserRouter";
import { Languages, ThemeColors } from "./utils/enums";
import { ConfigProvider, theme as AntdThemes, App as AppContainer } from "antd";

const App = () => {
  const { theme } = useAppSelector((state) => state.config.themeColor);
  const { lang } = useAppSelector((state) => state.config.language);

  const direction = lang === Languages.EN ? 'ltr': 'rtl';
  const isDarkTheme = theme === ThemeColors.DARK;
  const algorithm = (isDarkTheme ? AntdThemes.darkAlgorithm : AntdThemes.defaultAlgorithm) ?? AntdThemes.defaultAlgorithm;

  useEffect(() => {
    const body = document.body;
    body.classList.add(`${theme}-theme`);

    return () => {
      body.classList.remove(`${theme}-theme`);
    }
  }, [theme]);

  useEffect(() => {
    const body = document.body;
    body.classList.add(`${direction}-direction`);

    return () => {
      body.classList.remove(`${direction}-direction`);
    }
  }, [direction]);

  return (
    <ConfigProvider
      direction={direction}
      theme={{ algorithm }}
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