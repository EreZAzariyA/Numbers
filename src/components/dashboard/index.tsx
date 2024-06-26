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
  const invoices = useSelector((state: RootState) => state.invoices);
  const categories = useSelector((state: RootState) => state.categories);
  const currentMonth = dayjs();
  const [monthToDisplay, setMonthToDisplay] = useState<Dayjs>(currentMonth);
  const invoicesByMonth = getInvoicesBySelectedMonth(invoices, monthToDisplay);
  const creditCards = user?.bank?.[0]?.creditCards || [];

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
          invoices={invoicesByMonth}
          categories={categories}
          monthToDisplay={monthToDisplay}
        />
        <DashboardSeconde
          user={user}
          invoices={invoices}
          invoicesByMonth={invoicesByMonth}
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