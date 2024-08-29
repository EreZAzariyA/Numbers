import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { RootState } from "../../redux/store";
import DashboardFirst from "./DashboardFirst";
import DashboardSeconde from "./DashboardSeconde";
import DashboardThird from "./DashboardThird";
import { getGreeting, getInvoicesBySelectedMonth, getUserfName } from "../../utils/helpers";
import { DatePicker, Row } from "antd";
import "./Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { transactions } = useSelector((state: RootState) => state.transactions);
  const { categories } = useSelector((state: RootState) => state.categories);
  const banks = useSelector((state: RootState) => state.userBanks.account?.banks);
  const currentMonth = dayjs();
  const [monthToDisplay, setMonthToDisplay] = useState<Dayjs>(currentMonth);
  const transactionsByMonth = getInvoicesBySelectedMonth(transactions, monthToDisplay);
  const creditCards = banks?.[0]?.creditCards || [];

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
          Hey {getUserfName(user)}, {getGreeting()}
        </Row>
      </div>
      <div className="page-inner-container">
        <DashboardFirst
          user={user}
          transactions={transactionsByMonth}
          categories={categories}
          monthToDisplay={monthToDisplay}
          account={banks?.[0]}
        />
        <DashboardSeconde
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