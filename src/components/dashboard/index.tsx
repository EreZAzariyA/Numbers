import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "../../redux/store";
import { useBanks } from "../../hooks/useBanks";
import DashboardFirst from "./DashboardFirst";
import DashboardSecond from "./DashboardSecond";
import DashboardThird from "./DashboardThird";
import DashboardFourth from "./DashboardFourth/index";
import DashboardFifth from "./DashboardFifth/index";
import { getAccountCreditCards } from "../../utils/bank-utils";
import { getBanksTotal, getUserfName } from "../../utils/helpers";
import { Button, DatePicker, Flex, Space, Typography } from "antd";
import "./Dashboard.css";

const getGreetingKey = (): string => {
  const h = dayjs().hour();
  if (h >= 5 && h < 12) return 'dashboard.greeting.morning';
  if (h >= 12 && h < 17) return 'dashboard.greeting.afternoon';
  if (h >= 17 && h < 20) return 'dashboard.greeting.evening';
  return 'dashboard.greeting.night';
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { data: account, isLoading: accountLoading } = useBanks();
  const currentMonth = dayjs();
  const [monthToDisplay, setMonthToDisplay] = useState<Dayjs>(currentMonth);
  const creditCards = getAccountCreditCards(account);
  const banks = account?.banks || [];
  const latestConnection = banks.reduce((latest, bank) => Math.max(latest, bank?.lastConnection || 0), 0);
  const totalBalance = getBanksTotal(banks) || 0;

  return (
    <Flex vertical gap={20} className="page-container dashboard">
      <div className="page-shell">
        <div className="page-heading">
          <div className="page-heading-copy">
            <div className="page-kicker">{t(getGreetingKey())}</div>
            <Typography.Title level={2} className="page-title">{t('pages.dashboard')}</Typography.Title>
            <Typography.Text className="page-subtitle">
              {`${getUserfName(user)} — ${dayjs().format('dddd, MMM D')}. ${t('dashboard.subtitle')}`}
            </Typography.Text>
          </div>

          <div className="page-toolbar">
            <DatePicker
              picker="month"
              defaultPickerValue={currentMonth}
              maxDate={dayjs()}
              placeholder={dayjs().format('MMM YYYY')}
              format="MMM YYYY"
              allowClear={false}
              showNow={true}
              renderExtraFooter={() => (
                <Button type="text" danger onClick={() => setMonthToDisplay(dayjs())}>{t('common.buttons.reset')}</Button>
              )}
              value={monthToDisplay}
              onChange={setMonthToDisplay}
            />
          </div>
        </div>

        <div className="page-stat-grid">
          <div className="page-stat-card">
            <span className="page-stat-label">{t('dashboard.summary.connectedBanks')}</span>
            <span className="page-stat-value">{banks.length}</span>
            <span className="page-stat-caption">{t('dashboard.summary.connectedBanksCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('dashboard.summary.currentBalance')}</span>
            <span className="page-stat-value">₪{totalBalance.toLocaleString()}</span>
            <span className="page-stat-caption">{t('dashboard.summary.currentBalanceCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('dashboard.summary.cards')}</span>
            <span className="page-stat-value">{creditCards.length}</span>
            <span className="page-stat-caption">{t('dashboard.summary.cardsCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('dashboard.summary.lastSync')}</span>
            <span className="page-stat-value">{latestConnection ? dayjs(latestConnection).fromNow() : t('dashboard.summary.notSynced')}</span>
            <span className="page-stat-caption">{t('dashboard.summary.lastSyncCaption')}</span>
          </div>
        </div>
      </div>

      <Space direction="vertical" size={"large"} className="w-100">
        <DashboardFirst
          user={user}
          account={account}
          loading={loading && accountLoading}
          monthToDisplay={monthToDisplay}
        />
        <DashboardSecond
          user={user}
          monthToDisplay={monthToDisplay}
        />
        <DashboardThird creditCards={creditCards} />
        <DashboardFourth user={user} />
        <DashboardFifth user={user} />
      </Space>
    </Flex>
  );
};

export default Dashboard;
