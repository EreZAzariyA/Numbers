import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { App, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ThemeColors } from "../../utils/enums";
import { changeThemeAction } from "../../redux/actions/user-config-actions";

const DarkModeButton = () => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, loading } = useSelector((state: RootState) => state.config.themeColor);
  const isDark = theme === ThemeColors.DARK;

  const handleChangeTheme = async (): Promise<void> => {
    try {
      const newThemeToSet = isDark ? ThemeColors.LIGHT : ThemeColors.DARK;
      await dispatch(changeThemeAction({ theme: newThemeToSet, user_id: user._id}));
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