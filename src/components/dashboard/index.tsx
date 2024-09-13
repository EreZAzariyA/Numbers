import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { useAppSelector } from "../../redux/store";
import DashboardFirst from "./DashboardFirst";
import DashboardSecond from "./DashboardSecond";
import DashboardThird from "./DashboardThird";
import { getAccountCreditCards, getGreeting, getInvoicesBySelectedMonth, getUserfName } from "../../utils/helpers";
import { DatePicker, Row, Skeleton } from "antd";
import "./Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { transactions } = useAppSelector((state) => state.transactions);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.categories);
  const { account, loading: accountLoading } = useAppSelector((state) => state.userBanks);
  const currentMonth = dayjs();
  const [monthToDisplay, setMonthToDisplay] = useState<Dayjs>(currentMonth);
  const transactionsByMonth = getInvoicesBySelectedMonth(transactions, monthToDisplay);
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
          value={monthToDisplay}
          onChange={setMonthToDisplay}
        />
      </div>
      <div className="sub-title-container">
        <Row>
          {loading ? <Skeleton active paragraph={{ rows: 0 }} /> : (
            <span>Hey {getUserfName(user)}, {getGreeting()}</span>
          )}
        </Row>
      </div>
      <div className="page-inner-container">
        <DashboardFirst
          categories={categories}
          monthToDisplay={monthToDisplay}
          account={account}
          loading={categoriesLoading && accountLoading}
          transactionsByMonth={transactionsByMonth}
        />
        <DashboardSecond
          user={user}
          transactions={transactions}
          transactionsByMonth={transactionsByMonth}
          monthToDisplay={monthToDisplay}
        />
        <DashboardThird
          creditCards={creditCards}
        />
      </div>
    </div>
  );
};

export default Dashboard;