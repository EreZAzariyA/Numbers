import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ThemeColors } from "../../utils/enums";

interface DarkModeButtonProps {
  handleSwitch: (isDark: boolean) => void;
};

const DarkModeButton = (props: DarkModeButtonProps) => {
  const { theme, loading } = useSelector((state: RootState) => state.config.themeColor);
  const isDark: boolean = theme === ThemeColors.DARK;

  return (
    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      onChange={(isDarkTheme) => props.handleSwitch(isDarkTheme)}
      value={isDark}
      loading={loading}
    />
  );
};

export default DarkModeButton;