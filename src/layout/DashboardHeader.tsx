import i18n from "i18next";
import "dayjs/locale/he";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { changeLanguageAction, changeThemeAction } from "../redux/actions/user-config";
import { fetchBankAccounts } from "../redux/actions/banks";
import { fetchCategoriesAction } from "../redux/actions/categories";
import { fetchTransactions } from "../redux/actions/transactions";
import { logoutAction } from "../redux/actions/authentication";
import DarkModeButton from "../components/components/Darkmode-button";
import Logo from "../components/components/logo/logo";
import { MenuItem } from "../utils/antd-types";
import { useResize } from "../utils/helpers";
import { Languages, ThemeColors } from "../utils/enums";
import { LanguageType } from "../utils/types";
import { Button, Col, Dropdown, Layout, MenuProps, Row, message } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { IoIosClose } from "react-icons/io";

interface DashboardHeaderProps {
  collapsedHandler?: () => void;
  items: MenuItem[];
};

const { Header } = Layout;
const languages = {...Languages};

const DashboardHeader = (props: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { lang, loading } = useSelector((state: RootState) => state.config.language);
  const [current, setCurrent] = useState<string>('1');
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useResize();

  useEffect(() => {
    const fetchUserData = async () => {
      await dispatch(fetchTransactions(user._id));
      await dispatch(fetchCategoriesAction(user._id));
      await dispatch(fetchBankAccounts(user._id));
    };

    if (!!(token && user._id)) {
      fetchUserData();
    }
  }, [user, token, dispatch]);

  useEffect(() => {
    const locationArray = pathname.split('/');
    const currentLocation = locationArray[1];
    setCurrent(currentLocation);
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'sign-out') {
      dispatch(logoutAction());
      return;
    }
    navigate(e.key);
    setCurrent(e.key);
  };

  const handleChangeLang = async (lang: LanguageType): Promise<void> => {
    if (!user) {
      message.error('No user id');
      return;
    }

    try {
      const res = await dispatch(changeLanguageAction({ user_id: user._id, language: lang }));
      i18n.changeLanguage(res.payload as string);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const handleChangeTheme = async (isDark: boolean): Promise<void> => {
    if (!user) {
      return;
    };
    const newThemeToSet = isDark ? ThemeColors.DARK : ThemeColors.LIGHT;
    dispatch(changeThemeAction({ user_id: user._id, theme: newThemeToSet }));
  };

  const langs: MenuItem[] = Object.entries(languages).map(([key, value]) => ({
    label: `${value}-${key}`,
    value,
    key: key.toLowerCase(),
  }));

  return (
    <Header className="main-header">
      <div className="main-header-container">
        <div className="left-container">
          {isMobile && (
            <div className="menu-collapse">
              <Dropdown
                menu={{
                  items: props.items,
                  selectable: true,
                  selectedKeys: [current],
                  onClick: onClick,
                  className: "dropdown-menu"
                }}
                arrow
                overlayClassName="dropdown-container"
                trigger={['click']}
                open={isOpen}
                onOpenChange={setIsOpen}
                className="dropdown-area"
              >
                {!isOpen ? (
                  <MenuOutlined className="menu-btn" />
                ) : (
                  <IoIosClose className="menu-btn" />
                )}
              </Dropdown>
            </div>
          )}
          <div className="left-inner-container inner-container">
            <Logo />
          </div>
        </div>
        <div className="right-container">
          <div className="right-inner-container">
            <Row align={'middle'} gutter={!isMobile ? [10, 0] : [0, 0]}>
              <Col>
                <Dropdown
                  menu={{
                    items: langs,
                    className: "dropdown-menu langs",
                    onClick: (e) => handleChangeLang(e.key as LanguageType),
                  }}
                >
                  <Button type="link" size="small" loading={loading}>
                    {`${lang}-${lang?.toUpperCase()}`}
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <DarkModeButton handleSwitch={handleChangeTheme} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default DashboardHeader;