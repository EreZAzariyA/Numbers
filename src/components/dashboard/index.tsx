import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "../../redux/store";
import DashboardFirst from "./DashboardFirst";
import DashboardSecond from "./DashboardSecond";
import DashboardThird from "./DashboardThird";
import { getAccountCreditCards, getGreeting, getUserfName } from "../../utils/helpers";
import { Button, DatePicker, Row, Skeleton } from "antd";
import "./Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { account, loading: accountLoading } = useAppSelector((state) => state.userBanks);

  const currentMonth = dayjs();
  const [monthToDisplay, setMonthToDisplay] = useState<Dayjs>(currentMonth);
  const creditCards = getAccountCreditCards(account);

  return (
    <div className="page-container dashboard">
      <div className="title-container">
        <div className="page-title">
          {t('pages.dashboard')}
        </div>

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
      </div>
      <div className="sub-title-container mb-10">
        <Row>
          {loading ? <Skeleton active paragraph={{ rows: 0 }} /> : (
            <span>Hey {getUserfName(user)}, {getGreeting()}</span>
          )}
        </Row>
      </div>
      <div className="page-inner-container">
        <DashboardFirst
          user={user}
          account={account}
          loading={accountLoading}
          monthToDisplay={monthToDisplay}
        />
        <DashboardSecond
          user={user}
          monthToDisplay={monthToDisplay}
        />
        <DashboardThird creditCards={creditCards} />
      </div>
    </div>
  );
};

export default Dashboard;