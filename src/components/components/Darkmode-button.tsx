import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ThemeColors } from "../../redux/slicers/theme-slicer";
import { Switch } from "antd"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface DarkModeButtonProps {
  handleSwitch: (isDark: boolean) => void;
};

const DarkModeButton = (props: DarkModeButtonProps) => {
  const theme = useSelector((state: RootState) => state.theme.themeColor);
  const isDark: boolean = theme === ThemeColors.DARK;

  return (
    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      onChange={(isDark) => props.handleSwitch(isDark)}
      value={isDark}
    />
  );
};

export default DarkModeButton;