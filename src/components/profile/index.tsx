import { Card, Col, Divider, Flex, Form, Input, InputNumber, Row, Typography } from "antd";
import { useAppSelector } from "../../redux/store";
import { useBanks } from "../../hooks/useBanks";
import { useTranslation } from "react-i18next";
import { asNumString, getBanksTotal } from "../../utils/helpers";
import "./profile.css";

const Profile = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const { lang } = useAppSelector((state) => state.config.language);
  const { data: banksAccount } = useBanks();
  const banks = banksAccount?.banks;

  const verifiedEmail = user.emails.find((email) => (email.isValidate || email.isActive));
  const firstName = user?.profile?.first_name ?? '';
  const lastName  = user?.profile?.last_name  ?? '';
  const initials  = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
  const fullName  = [firstName, lastName].filter(Boolean).join(' ') || 'User';

  const initialValues = {
    ...user,
    emails: { email: verifiedEmail?.email },
    current_balance: asNumString(getBanksTotal(banks)),
    currency: "NIS"
  };

  return (
    <Flex vertical gap={20} className="page-container profile">
      <div className="page-shell">
        <div className="page-heading">
          <div className="page-heading-copy">
            <div className="page-kicker">{t('profile.kicker')}</div>
            <Typography.Title level={2} className="page-title">{t('pages.profile')}</Typography.Title>
            <Typography.Text className="page-subtitle">{t('profile.subtitle')}</Typography.Text>
          </div>
        </div>

        <div className="page-stat-grid">
          <div className="page-stat-card">
            <span className="page-stat-label">{t('profile.summary.connectedBanks')}</span>
            <span className="page-stat-value">{banks?.length || 0}</span>
            <span className="page-stat-caption">{t('profile.summary.connectedBanksCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('profile.fields.totalBalance')}</span>
            <span className="page-stat-value">₪ {asNumString(getBanksTotal(banks))}</span>
            <span className="page-stat-caption">{t('profile.summary.totalBalanceCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('profile.summary.language')}</span>
            <span className="page-stat-value">{lang?.toUpperCase()}</span>
            <span className="page-stat-caption">{t('profile.summary.languageCaption')}</span>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]} align="top">

        {/* ── Left: Avatar card ── */}
        <Col xs={24} md={8} lg={7}>
          <Card className="profile-avatar-card">
            <Flex vertical align="center" gap={14}>
              <div className="profile-avatar">
                <span className="profile-avatar-initials">{initials}</span>
              </div>
              <Flex vertical align="center" gap={4}>
                <Typography.Title level={4} className="profile-full-name">{fullName}</Typography.Title>
                <Typography.Text className="profile-email-display">{verifiedEmail?.email}</Typography.Text>
              </Flex>
              <Divider style={{ margin: '4px 0' }} />
              <Flex vertical gap={10} className="profile-balance-section">
                <span className="profile-balance-label">{t('profile.fields.totalBalance')}</span>
                <span className="profile-balance-value">
                  ₪ {asNumString(getBanksTotal(banks))}
                </span>
              </Flex>
            </Flex>
          </Card>
        </Col>

        {/* ── Right: Info card ── */}
        <Col xs={24} md={16} lg={17}>
          <Card className="profile-info-card" title={t('profile.title')}>
            <Form initialValues={initialValues} layout="vertical">

              <div className="profile-section-label">{t('profile.sections.personal')}</div>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item label={t('profile.fields.firstName')} name={['profile', 'first_name']}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('profile.fields.lastName')} name={['profile', 'last_name']}>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={t('profile.fields.email')} name={['emails', 'email']}>
                <Input disabled />
              </Form.Item>

              <Divider style={{ margin: '8px 0 20px' }} />

              <div className="profile-section-label">{t('profile.sections.financials')}</div>
              <Row gutter={[16, 0]}>
                <Col span={12}>
                  <Form.Item label={t('profile.fields.balance')} name="current_balance">
                    <InputNumber disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={t('profile.fields.currency')} name="currency">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

            </Form>
          </Card>
        </Col>

      </Row>
    </Flex>
  );
};

export default Profile;
