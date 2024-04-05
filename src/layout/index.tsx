import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import { Layout, Menu, MenuProps, message } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineLogout, AiOutlineProfile, AiOutlineShoppingCart } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { Colors, Sizes, useResize } from "../utils/helpers";
import { BiLogInCircle } from "react-icons/bi";
import { FaAddressCard } from "react-icons/fa";
import { LiaShippingFastSolid } from "react-icons/lia";
import { GoHome } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ThemeColors } from "../redux/slicers/theme-slicer";
import { MenuItem, getMenuItem } from "../utils/types";
import authServices from "../services/authentication";
import { useTranslation } from "react-i18next";
import userServices from "../services/user-services";

const { Sider, Content } = Layout;

const DashboardView = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useSelector((state: RootState) => state.theme.themeColor);
  const user = useSelector((state: RootState) => state.auth.user);
  const { width } = useResize();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(width <= 500);
  const [current, setCurrent] = useState<string>('dashboard');
  const themeToSet = theme === ThemeColors.LIGHT ? 'light' : 'dark';
  const { t } = useTranslation();

  useEffect(() => {
    const body = document.querySelector('body');
    body.classList.add(`${theme}-theme`);

    return () => {
      body.classList.remove(`${theme}-theme`);
    }
  }, [theme]);

  useEffect(() => {
    const path = pathname.split('/')[1];
    setCurrent(path);
  }, [pathname]);

  useEffect(() => {
    setIsCollapsed(width <= 500);
  }, [width]);

  useEffect(() => {
    if (!user) {
      navigate('/auth/sign-in');
    }
  }, [user, navigate]);

  const accountItems = user ? [
    getMenuItem(
      t('pages.account.1'),
      'profile',
      <AiOutlineProfile size={Sizes.SUB_MENU_ICON} />
    ),
    getMenuItem(
      t('pages.account.5'),
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
      t('pages.dashboard'),
      'dashboard',
      <GoHome size={Sizes.MENU_ICON} />
    ),
    getMenuItem(
      t('pages.invoices'),
      'invoices',
      <AiOutlineShoppingCart size={Sizes.MENU_ICON} />
    ),
    getMenuItem(
      t('pages.categories'),
      'categories',
      <LiaShippingFastSolid size={Sizes.MENU_ICON} />
    ),
    getMenuItem(
      t('pages.account.0'),
      'account',
      <VscAccount size={Sizes.MENU_ICON} />,
      accountItems
    )
  ];

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'sign-out') {
      authServices.logout();
      return;
    }
    navigate(e.key);
    setCurrent(e.key);
  };

  items.forEach((i) => (
    i.style = {
      textAlign: 'left',
    }
  ));

  const handleChangeTheme = async (): Promise<void> => {
    if (!user) {
      return;
    };
    const newThemeToSet = theme === ThemeColors.LIGHT ? ThemeColors.DARK : ThemeColors.LIGHT;
    try {
      userServices.changeTheme(user._id, newThemeToSet);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <Layout className={`main-layout ${theme}-theme`}>
      <DashboardHeader
        changeTheme={handleChangeTheme}
        collapsedHandler={() => setIsCollapsed(!isCollapsed)}
        items={items}
      />
      <Layout hasSider style={{position: 'relative'}}>
        <Sider
          trigger={null}
          collapsed={isCollapsed}
          collapsedWidth={0}
          theme={themeToSet}
        >
          <Menu
            mode="inline"
            theme={themeToSet}
            items={items}
            onClick={onClick}
            selectedKeys={[current]}
          />
        </Sider>
        <Content className="site-layout">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardView;