import i18n from "i18next";
import "dayjs/locale/he";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { changeLanguageAction } from "../redux/actions/user-config-actions";
import { fetchUserDataAction, logoutAction } from "../redux/actions/auth-actions";
import DarkModeButton from "../components/components/Darkmode-button";
import Logo from "../components/components/logo/logo";
import { MenuItem } from "../utils/antd-types";
import { useResize } from "../utils/helpers";
import { Languages } from "../utils/enums";
import { LanguageType } from "../utils/types";
import { App, Button, Col, Dropdown, Layout, MenuProps, Row } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

interface DashboardHeaderProps {
  collapsedHandler?: () => void;
  items: MenuItem[];
};

const { Header } = Layout;
const languages = {...Languages};

const DashboardHeader = (props: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { lang, loading } = useAppSelector((state) => state.config.language);
  const [current, setCurrent] = useState<string>('1');
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useResize();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(fetchUserDataAction()).unwrap();
      } catch (err: any) {
        message.error(err);
      }
    };

    fetchUserData();
  }, [dispatch, message]);

  useEffect(() => {
    const locationArray = pathname.split('/');
    const currentLocation = locationArray[1];
    setCurrent(currentLocation);
  }, [pathname]);

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'sign-out') {
      return dispatch(logoutAction());
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
      const language = await dispatch(changeLanguageAction({
        user_id: user._id,
        language: lang
      })).unwrap();
      i18n.changeLanguage(language);
    } catch (err: any) {
      message.error(err.message);
    }
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
                  className: "dropdown-menu",
                }}
                arrow
                overlayClassName="dropdown-container"
                trigger={['click']}
                open={isOpen}
                onOpenChange={setIsOpen}
                className="dropdown-area"
              >
                <div className="menu-btn">
                  {!isOpen ? (
                    <MenuOutlined />
                  ) : (
                    <CloseOutlined />
                  )}
                </div>
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
                <DarkModeButton />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default DashboardHeader;