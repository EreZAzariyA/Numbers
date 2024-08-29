import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Logo from "../components/components/logo/logo";

const { Content, Header } = Layout;

const AuthView = () => (
  <Layout className="layout auth-layout">
    <Header className="auth-header-container">
      <Logo />
    </Header>
    <Content>
      <Outlet />
    </Content>
  </Layout>
);

export default AuthView;