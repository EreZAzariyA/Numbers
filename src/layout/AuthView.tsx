import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AuthView = () => {
  return (
    <Layout className="layout auth-layout">
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default AuthView;