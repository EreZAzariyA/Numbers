import { Outlet } from "react-router-dom";
import { Layout } from "antd";

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