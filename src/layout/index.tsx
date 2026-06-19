import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logoutAction } from "../redux/actions/auth-actions";
import DashboardHeader from "./DashboardHeader";
import { Colors, Sizes, useResize } from "../utils/helpers";
import { MenuItem, getMenuItem } from "../utils/antd";
import { Languages, ThemeColors } from "../utils/enums";
import { Avatar, Layout, Menu, MenuProps, Typography } from "antd";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";
import { BiLogInCircle } from "react-icons/bi";
import { CiCircleList, CiBank } from "react-icons/ci";
import { BsReceipt, BsGraphUpArrow } from "react-icons/bs";
import { FaAddressCard } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { VscAccount, VscShield } from "react-icons/vsc";
import { TbRepeat, TbPigMoney, TbCashBanknote } from "react-icons/tb";
import { useIdleMonitor } from '../hooks/useIdleMonitor';
import ChatPanel from '../components/chat';

const { Sider, Content } = Layout;

const DashboardView = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const { pathname } = location;
  const { isMobile } = useResize();
  const { user, token } = useAppSelector((state) => state.auth);
  useIdleMonitor(!!token);

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

  const currentPageLabelMap: Record<string, string> = {
    dashboard: t('menu.dashboard'),
    categories: t('menu.categories'),
    transactions: t('menu.transactions'),
    bank: t('menu.bankAccount'),
    'loans-savings': t('menu.loansSavings'),
    recurring: t('menu.recurring'),
    'savings-goals': t('menu.savingsGoals'),
    'cash-flow': t('menu.cashFlow'),
    settings: t('menu.settings'),
    admin: 'Admin',
  };

  const currentPageLabel = currentPageLabelMap[current] || t('menu.dashboard');
  const verifiedEmail = user?.emails?.find((email) => email?.isValidate || email?.isActive)?.email || user?.emails?.[0]?.email || '';
  const userName = [user?.profile?.first_name, user?.profile?.last_name].filter(Boolean).join(' ') || verifiedEmail;
  const userInitials = `${user?.profile?.first_name?.[0] ?? ''}${user?.profile?.last_name?.[0] ?? ''}`.toUpperCase() || '?';

  const accountItems = user ? [
    getMenuItem(
      <Link to='/settings/profile'>{t('menu.account.1')}</Link>,
      'settings',
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
      t('menu.account.3'),
      'auth/sign-in',
      <BiLogInCircle size={Sizes.SUB_MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      t('menu.account.4'),
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
      <Link to='/categories'>{t('menu.categories')}</Link>,
      'categories',
      <CiCircleList size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/transactions'>{t('menu.transactions')}</Link>,
      'transactions',
      <BsReceipt size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/bank'>{t('menu.bankAccount')}</Link>,
      'bank',
      <CiBank size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/loans-savings'>{t('menu.loansSavings')}</Link>,
      'loans-savings',
      <BsGraphUpArrow size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/recurring'>{t('menu.recurring')}</Link>,
      'recurring',
      <TbRepeat size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/savings-goals'>{t('menu.savingsGoals')}</Link>,
      'savings-goals',
      <TbPigMoney size={Sizes.MENU_ICON} />,
      null, style
    ),
    getMenuItem(
      <Link to='/cash-flow'>{t('menu.cashFlow')}</Link>,
      'cash-flow',
      <TbCashBanknote size={Sizes.MENU_ICON} />,
      null, style
    ),
    ...(user?.role === 'admin' ? [
      getMenuItem(
        <Link to='/admin'>Admin</Link>,
        'admin',
        <VscShield size={Sizes.MENU_ICON} />,
        null, style
      )
    ] : []),
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
    } else {
      setCurrent(e.key);
    }
  };

  return (
    <Layout className="main-layout">
      <DashboardHeader
        collapsedHandler={() => setIsCollapsed(!isCollapsed)}
        items={items}
        currentLabel={currentPageLabel}
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
            <div className="sider-menu-wrap">
              <Menu
                mode="inline"
                theme={themeToSet}
                items={items}
                onClick={onClick}
                selectedKeys={[current]}
              />
            </div>
            {user && (
              <div className="sidebar-footer">
                <Avatar size={isCollapsed ? 34 : 38}>{userInitials}</Avatar>
                {!isCollapsed && (
                  <div className="sidebar-user-copy">
                    <Typography.Text className="sidebar-user-name">{userName}</Typography.Text>
                    <Typography.Text className="sidebar-user-email">{verifiedEmail}</Typography.Text>
                  </div>
                )}
              </div>
            )}
          </Sider>
        )}
        <Content className="site-layout">
          <Outlet />
        </Content>
      </Layout>
      <ChatPanel />
    </Layout>
  );
};

export default DashboardView;
