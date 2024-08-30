import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState, useAppDispatch } from "../redux/store";
import DashboardHeader from "./DashboardHeader";
import { Colors, Sizes, useResize } from "../utils/helpers";
import { MenuItem, getMenuItem } from "../utils/antd-types";
import { Layout, Menu, MenuProps } from "antd";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";
import { BiLogInCircle } from "react-icons/bi";
import { CiCircleList } from "react-icons/ci";
import { BsReceipt } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { FaAddressCard } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { VscAccount } from "react-icons/vsc";
import { ThemeColors } from "../utils/enums";
import { fetchUser, logoutAction } from "../redux/actions/auth-actions";

const { Sider, Content } = Layout;

const DashboardView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isMobile } = useResize();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.config.themeColor);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile);
  const [current, setCurrent] = useState<string>('dashboard');

  const isDarkTheme = theme === ThemeColors.DARK;

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);


  useEffect(() => {
    const path = pathname.split('/')?.[1];
    setCurrent(path);
  }, [pathname]);

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const accountItems = user ? [
    getMenuItem(
      t('menu.account.1'),
      'profile',
      <AiOutlineProfile size={Sizes.SUB_MENU_ICON} />
    ),
    getMenuItem(
      t('menu.account.5'),
      'sign-out',
      <AiOutlineLogout color={Colors.DANGER} size={Sizes.SUB_MENU_ICON} />,
    )
  ] : [
    getMenuItem(
      'Sign-in',
      'auth/sign-in',
      <BiLogInCircle size={Sizes.SUB_MENU_ICON} />
    ),
    getMenuItem(
      'Sign-up',
      'auth/sign-up',
      <FaAddressCard size={Sizes.SUB_MENU_ICON} />
    ),
  ];

  const items: MenuItem[] = [
    getMenuItem(
      t('menu.dashboard'),
      'dashboard',
      <RxDashboard size={Sizes.MENU_ICON} />
    ),
    getMenuItem(
      t('menu.transactions'),
      'transactions',
      <BsReceipt size={Sizes.MENU_ICON} />
    ),
    getMenuItem(
      t('menu.categories'),
      'categories',
      <CiCircleList size={Sizes.MENU_ICON} />
    ),
    getMenuItem(
      t('menu.bankAccount'),
      'bank',
      <CiBank size={Sizes.MENU_ICON} />
    ),
    getMenuItem(
      t('menu.account.0'),
      'account',
      <VscAccount size={Sizes.MENU_ICON} />,
      accountItems
    )
  ];

  const onClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'sign-out') {
      dispatch(logoutAction());
      return;
    }
    navigate(e.key);
    setCurrent(e.key);
  };

  const themeToSet = isDarkTheme ? ThemeColors.DARK : ThemeColors.LIGHT;
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