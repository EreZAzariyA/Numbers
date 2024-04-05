import { Button, Col, Dropdown, Layout, MenuProps, Row, message } from "antd";
import { CiSearch } from "react-icons/ci";
import { Colors, Sizes, getError, useResize } from "../utils/helpers";
import { useLocation, useNavigate } from "react-router-dom";
import DarkModeButton from "../components/components/Darkmode-button";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import categoriesServices from "../services/categories";
import { useEffect, useState } from "react";
import invoicesServices from "../services/invoices";
import { MenuOutlined } from "@ant-design/icons";
import { MenuItem } from "../utils/types";
import authServices from "../services/authentication";
import { Logo } from "../components/components/logo/logo";
import i18n from "i18next";
import { LanguageType, Languages } from "../redux/slicers/lang-slicer";
import userServices from "../services/user-services";

interface DashboardHeaderProps {
  changeTheme?: () => void;
  collapsedHandler?: () => void;
  items: MenuItem[];
};

const { Header } = Layout;
const languages = {...Languages};

const DashboardHeader = (props: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const lang = useSelector((state: RootState) => state.language.lang);
  const [current, setCurrent] = useState<string>('1');
  const { isPhone, isMobile } = useResize();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await categoriesServices.fetchCategoriesByUserId(user._id);
        await invoicesServices.fetchInvoicesByUserId(user._id);
      } catch (err) {
        console.log(getError(err));
      }
    };

    if (user) {
      if (user?._id) {
        fetchUserData();
      } else {
        message.info('No User id');
      }
    }
  }, [user]);

  useEffect(() => {
    const locationArray = pathname.split('/');
    const currentLocation = locationArray[1];
    setCurrent(currentLocation);
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'sign-out') {
      authServices.logout();
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

    i18n.changeLanguage(lang);
    try {
      await userServices.changeLang(user?._id, lang);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const langs: MenuItem[] = Object.entries(languages).map(([key, value]) => ({
    label: `${value}-${key}`,
    value,
    key: key.toLowerCase()
  }));

  return (
    <Header className="main-header">
      <div className="main-header-container">
        <div className="left-container">
          {isPhone && (
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
                className="dropdown-area"
              >
                <MenuOutlined className="menu-btn" />
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
                <Button type="link" size="small" onClick={() => navigate('search')}>
                  <CiSearch color={Colors.ICON} size={Sizes.MENU_ICON} />
                </Button>
              </Col>
              <Col>
                <Dropdown
                  menu={{
                    items: langs,
                    className: "dropdown-menu langs",
                    onClick: (e) => handleChangeLang(e.key as any)
                  }}
                >
                  <Button type="link" size="small">
                    {`${lang}-${lang.toUpperCase()} `}
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <DarkModeButton handleSwitch={props.changeTheme} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default DashboardHeader;