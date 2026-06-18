import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { changeThemeAction } from "../../redux/actions/user-config-actions";
import { ThemeColors } from "../../utils/enums";
import { App, Switch, Tooltip } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

const DarkModeButton = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, loading } = useAppSelector((state) => state.config.themeColor);
  const isDark = theme === ThemeColors.DARK;

  const handleChangeTheme = async (): Promise<void> => {
    try {
      const newThemeToSet = isDark ? ThemeColors.LIGHT : ThemeColors.DARK;
      await dispatch(changeThemeAction({
        theme: newThemeToSet,
        user_id: user._id
      })).unwrap();
    } catch (err: any) {
      message.error(err);
    }
  };

  return (
    <Tooltip title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')} placement="bottom">
      <Switch
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        onChange={handleChangeTheme}
        value={isDark}
        loading={loading}
      />
    </Tooltip>
  );
};

export default DarkModeButton;
