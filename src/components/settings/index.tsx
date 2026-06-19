import { Card, Flex, Menu, Typography } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import { useBanks } from "../../hooks/useBanks";
import { useAiSettings } from "../../hooks/useAiSettings";
import { Languages } from "../../utils/enums";
import { asNumString, getBanksTotal } from "../../utils/helpers";
import "./settings.css";

const SettingsPage = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { lang } = useAppSelector((state) => state.config.language);
  const { data: banksAccount } = useBanks();
  const { data: aiSettings } = useAiSettings();
  const banks = banksAccount?.banks ?? [];
  const activeSection = pathname.includes('/api-keys') ? 'api-keys' : 'profile';
  const activeProviderLabel = aiSettings ? t(`settings.providers.${aiSettings.provider}`) : '—';
  const isEnglish = lang === Languages.EN;

  return (
    <Flex vertical gap={20} className="page-container settings-page">
      <div className="page-shell">
        <div className="page-heading">
          <div className="page-heading-copy">
            <div className="page-kicker">{t('settings.kicker')}</div>
            <Typography.Title level={2} className="page-title">{t('settings.title')}</Typography.Title>
            <Typography.Text className="page-subtitle">{t('settings.subtitle')}</Typography.Text>
          </div>
        </div>

        <div className="page-stat-grid">
          <div className="page-stat-card">
            <span className="page-stat-label">{t('settings.summary.connectedBanks')}</span>
            <span className="page-stat-value">{banks.length}</span>
            <span className="page-stat-caption">{t('settings.summary.connectedBanksCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('settings.summary.activeProvider')}</span>
            <span className="page-stat-value">{activeProviderLabel}</span>
            <span className="page-stat-caption">{t('settings.summary.activeProviderCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('settings.summary.language')}</span>
            <span className="page-stat-value">{lang?.toUpperCase()}</span>
            <span className="page-stat-caption">{t('settings.summary.languageCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('settings.summary.totalBalance')}</span>
            <span className="page-stat-value">{isEnglish ? `₪ ${asNumString(getBanksTotal(banks))}` : `${asNumString(getBanksTotal(banks))} ₪`}</span>
            <span className="page-stat-caption">{t('settings.summary.totalBalanceCaption')}</span>
          </div>
        </div>
      </div>

      <div className="settings-layout">
        <Card className="settings-nav-card">
          <Menu
            mode="inline"
            selectedKeys={[activeSection]}
            items={[
              {
                key: 'profile',
                label: <Link to="/settings/profile">{t('settings.sections.profile')}</Link>,
              },
              {
                key: 'api-keys',
                label: <Link to="/settings/api-keys">{t('settings.sections.apiKeys')}</Link>,
              },
            ]}
          />
        </Card>

        <div className="settings-content">
          <Outlet />
        </div>
      </div>
    </Flex>
  );
};

export default SettingsPage;
