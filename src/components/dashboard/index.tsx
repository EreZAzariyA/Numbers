import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "../../redux/store";
import DashboardFirst from "./DashboardFirst";
import DashboardSecond from "./DashboardSecond";
import DashboardThird from "./DashboardThird";
import { getAccountCreditCards, getGreeting, getUserfName } from "../../utils/helpers";
import { Button, DatePicker, Flex, Space, Typography } from "antd";
import "./Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { account, loading: accountLoading } = useAppSelector((state) => state.userBanks);

  const currentMonth = dayjs();
  const [monthToDisplay, setMonthToDisplay] = useState<Dayjs>(currentMonth);
  const creditCards = getAccountCreditCards(account);

  return (
    <Space direction="vertical" className="page-container dashboard">
      <Flex align="flex-start" justify="space-between">
        <Flex vertical justify="flex-start">
          <Typography.Title level={2} className="page-title">{t('pages.dashboard')}</Typography.Title>
          <span>Hey {getUserfName(user)}, {getGreeting()}</span>
        </Flex>

        <DatePicker
          picker="month"
          defaultPickerValue={currentMonth}
          maxDate={dayjs()}
          placeholder={dayjs().format('YYYY-MM')}
          allowClear={false}
          showNow={true}
          renderExtraFooter={() => {
            return (
              <Button type="text" danger onClick={() => setMonthToDisplay(dayjs())}>Reset</Button>
            )
          }}
          value={monthToDisplay}
          onChange={setMonthToDisplay}
        />
      </Flex>

      <Space direction="vertical" size={"large"}>
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
      </Space>
    </Space>
  );
};

export default Dashboard;