import { Switch } from "antd"
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ThemeColors } from "../../redux/slicers/theme-slicer";

interface DarkModeButtonProps {
  handleSwitch: () => void;
};

const DarkModeButton = (props: DarkModeButtonProps) => {
  const theme = useSelector((state: RootState) => state.theme.themeColor);
  const isDark: boolean = theme === ThemeColors.DARK;

  return (
    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      onChange={props.handleSwitch}
      value={isDark}
    />
  );
};

export default DarkModeButton;