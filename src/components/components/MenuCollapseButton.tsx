import CloseOutlined from "@ant-design/icons/CloseOutlined";
import MenuOutlined from "@ant-design/icons/MenuOutlined";
import { Button, ButtonProps, ConfigProvider } from "antd";

export const MenuCollapseButton = (props: { open?: boolean, props?: ButtonProps }) => (
  <ConfigProvider
    theme={{
      token: {

      }
    }}
  >
    <Button {...props.props} className="menu-btn">
      {props.open ? <CloseOutlined /> : <MenuOutlined />}
    </Button>
  </ConfigProvider>
);