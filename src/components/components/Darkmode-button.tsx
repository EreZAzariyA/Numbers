import { useAppDispatch, useAppSelector } from "../../redux/store";
import { changeThemeAction } from "../../redux/actions/user-config-actions";
import { ThemeColors } from "../../utils/enums";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { App, Switch } from "antd";

const DarkModeButton = () => {
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
    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      onChange={handleChangeTheme}
      value={isDark}
      loading={loading}
    />
  );
};

export default DarkModeButton;