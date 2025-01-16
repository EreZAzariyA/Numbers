import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logoutAction } from "../redux/actions/auth-actions";
import DashboardHeader from "./DashboardHeader";
import { Colors, Sizes, useResize } from "../utils/helpers";
import { MenuItem, getMenuItem } from "../utils/antd";
import { Languages, ThemeColors } from "../utils/enums";
import { Layout, Menu, MenuProps } from "antd";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";
import { BiLogInCircle } from "react-icons/bi";
import { CiCircleList, CiBank } from "react-icons/ci";
import { BsReceipt } from "react-icons/bs";
import { FaAddressCard } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { VscAccount } from "react-icons/vsc";

const { Sider, Content } = Layout;

const DashboardView = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const { pathname } = location;
  const { isMobile } = useResize();
  const { user } = useAppSelector((state) => state.auth);

  const { themeColor: { theme }, language: { lang } } = useAppSelector((state) => state.config);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile);
  const [current, setCurrent] = useState<string>('dashboard');

  const isDarkTheme = theme === ThemeColors.DARK;
  const themeToSet = isDarkTheme ? ThemeColors.DARK : ThemeColors.LIGHT;
  const isEN = lang === Languages.EN;
  const style: React.CSSProperties = {
    textAlign: isEN ? 'left' : 'right'
  }

  useEffect(() => {
    const path = pathname.split('/').at(1);
    setCurrent(path);
  }, [pathname]);

  const accountItems = user ? [
    getMenuItem(
      <Link to='/profile'>{t('menu.account.1')}</Link>,
      'profile',
      <AiOutlineProfile size={Sizes.SUB_MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      t('menu.account.5'),
      'sign-out',
      <AiOutlineLogout color={Colors.DANGER} size={Sizes.SUB_MENU_ICON} />,
      null, style
    )
  ] : [
    getMenuItem(
      'Sign-in',
      'auth/sign-in',
      <BiLogInCircle size={Sizes.SUB_MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      'Sign-up',
      'auth/sign-up',
      <FaAddressCard size={Sizes.SUB_MENU_ICON} />,
      null, style
    ),
  ];

  const items: MenuItem[] = [
    getMenuItem(
      <Link to={'/dashboard'}>{t('menu.dashboard')}</Link>,
      'dashboard',
      <RxDashboard size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/transactions'>{t('menu.transactions')}</Link>,
      'transactions',
      <BsReceipt size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/categories'>{t('menu.categories')}</Link>,
      'categories',
      <CiCircleList size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/bank'>{t('menu.bankAccount')}</Link>,
      'bank',
      <CiBank size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      t('menu.account.0'),
      'account',
      <VscAccount size={Sizes.MENU_ICON} />,
      accountItems, style
    )
  ];

  const onClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'sign-out') {
      await dispatch(logoutAction()).unwrap();
      return;
    }
    setCurrent(e.key);
  };

  return (
    <Layout className="main-layout">
      <DashboardHeader
        collapsedHandler={() => setIsCollapsed(!isCollapsed)}
        items={items}
      />
      <Layout hasSider>
        {!isMobile && (
          <Sider
            collapsed={isCollapsed}
            collapsedWidth={80}
            theme={themeToSet}
            collapsible
            onCollapse={(e) => setIsCollapsed(e)}
          >
            <Menu
              mode="inline"
              theme={themeToSet}
              items={items}
              onClick={onClick}
              selectedKeys={[current]}
            />
          </Sider>
        )}
        <Content className="site-layout">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardView;