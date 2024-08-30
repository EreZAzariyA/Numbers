import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { Languages, ThemeColors } from "./utils/enums";
import { ConfigProvider, theme as AntdThemes, App as AppContainer } from "antd";
import UserRouter from "./routes/UserRouter";
import { useEffect } from "react";

const App = () => {
  const { lang } = useSelector((state: RootState) => state.config.language);
  const { theme } = useSelector((state: RootState) => state.config.themeColor);

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