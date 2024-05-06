import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RootState } from "../redux/store";
import { ThemeColors } from "../redux/slicers/theme-slicer";
import DashboardHeader from "./DashboardHeader";
import authServices from "../services/authentication";
import userServices from "../services/user-services";
import { Colors, Sizes, useResize } from "../utils/helpers";
import { MenuItem, getMenuItem } from "../utils/types";
import { Layout, Menu, MenuProps, message } from "antd";
import { AiOutlineLogout, AiOutlineProfile } from "react-icons/ai";
import { BiLogInCircle } from "react-icons/bi";
import { CiCircleList } from "react-icons/ci";
import { BsReceipt } from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { FaAddressCard } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { VscAccount } from "react-icons/vsc";

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
      t('menu.invoices'),
      'invoices',
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

  items.forEach((i) => (
    i.style = {
      textAlign: 'left',
    }
  ));

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'sign-out') {
      authServices.logout();
      return;
    }
    navigate(e.key);
    setCurrent(e.key);
  };

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