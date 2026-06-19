import i18n from "i18next";
import "dayjs/locale/he";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { changeLanguageAction } from "../redux/actions/user-config-actions";
import { logoutAction } from "../redux/actions/auth-actions";
import { useAiSettings } from "../hooks/useAiSettings";
import { useAiHealth } from "../hooks/useAiHealth";
import AiHealthDot from "../components/components/ai-health-dot";
import { MenuItem } from "../utils/antd";
import { useResize } from "../utils/helpers";
import { Languages } from "../utils/enums";
import { LanguageType } from "../utils/types";
import { AiProvider } from "../models/ai-settings";
import DarkModeButton from "../components/components/Darkmode-button";
import Logo from "../components/components/logo/logo";
import { App, Button, Divider, Dropdown, Flex, Layout, MenuProps, Select, Space, Typography } from "antd";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import GlobalOutlined from "@ant-design/icons/GlobalOutlined";
import MenuOutlined from "@ant-design/icons/MenuOutlined";

interface DashboardHeaderProps {
  collapsedHandler?: () => void;
  items: MenuItem[];
  currentLabel?: string;
};

const { Header } = Layout;
const languages = {...Languages};
const languageLabels: Record<LanguageType, string> = {
  [Languages.EN]: "English",
  [Languages.HE]: "עברית",
};

const DashboardHeader = (props: DashboardHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { pathname } = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { lang, loading } = useAppSelector((state) => state.config.language);
  const { data: aiSettings, updateProvider, isLoading: aiSettingsLoading, isUpdatingProvider } = useAiSettings();
  const { health: aiHealth } = useAiHealth();
  const [current, setCurrent] = useState<string>('1');
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile, isPhone } = useResize();

  useEffect(() => {
    const locationArray = pathname.split('/');
    const currentLocation = locationArray[1];
    setCurrent(currentLocation);
  }, [pathname]);

  const onClick: MenuProps['onClick'] = async (e) => {
    if (e.key === 'sign-out') {
      await dispatch(logoutAction()).unwrap();
      return;
    }
    navigate(e.key);
    setCurrent(e.key);
  };

  const handleChangeLang = async (selectedLang: LanguageType): Promise<void> => {
    if (!user) {
      message.error(t('errors.noUserId'));
      return;
    }
    if (selectedLang === lang) return;

    try {
      const language = await dispatch(changeLanguageAction({
        user_id: user._id,
        language: selectedLang
      })).unwrap();
      i18n.changeLanguage(language);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const handleChangeProvider = async (provider: AiProvider): Promise<void> => {
    try {
      await updateProvider(provider);
      message.success(t('settings.aiSelectorUpdated', { provider: t(`settings.providers.${provider}`) }));
    } catch (err: any) {
      message.error(err?.response?.data || err?.message || t('settings.aiSelectorError'));
    }
  };

  const langs: MenuItem[] = Object.entries(languages).map(([key, value]) => ({
    label: languageLabels[value as LanguageType],
    value,
    key: key.toLowerCase(),
    disabled: value === lang,
  }));

  return (
    <Header>
      <Flex align="center" justify="space-between">
        <Flex>
          {isMobile && (
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
                {isOpen ? <CloseOutlined /> : <MenuOutlined />}
              </div>
            </Dropdown>
          )}
          {!isPhone && <Logo />}
          {!isPhone && (
            <div className="header-current-page">
              <Typography.Text className="header-current-kicker">{t('common.workspace')}</Typography.Text>
              <Typography.Text className="header-current-label">{props.currentLabel}</Typography.Text>
            </div>
          )}
        </Flex>
        <Space align="center" className="header-right" split={<Divider type="vertical" />}>
          <Select
            size="small"
            value={aiSettings?.provider}
            loading={aiSettingsLoading || isUpdatingProvider}
            className="header-model-select"
            placeholder={t('settings.aiSelectorLabel')}
            popupMatchSelectWidth={false}
            onChange={(value) => handleChangeProvider(value as AiProvider)}
            optionLabelProp="label"
            options={(['ollama', 'gemini', 'claude'] as AiProvider[]).map((provider) => ({
              label: (
                <Space size={6} align="center">
                  <AiHealthDot status={aiHealth?.[provider]?.status} error={aiHealth?.[provider]?.error} />
                  {t(`settings.providers.${provider}`)}
                </Space>
              ),
              value: provider,
              disabled: !aiSettings?.providers?.[provider]?.available
                || aiHealth?.[provider]?.status === 'error',
            }))}
          />
          <Dropdown
            menu={{
              items: langs,
              className: "dropdown-menu langs",
              onClick: (e) => handleChangeLang(e.key as LanguageType),
            }}
          >
            <Button type="link" size="small" loading={loading} className="header-lang-btn">
              <GlobalOutlined />
              <span>{lang?.toUpperCase()}</span>
            </Button>
          </Dropdown>
          <DarkModeButton />
        </Space>
      </Flex>
    </Header>
  );
};

export default DashboardHeader;
