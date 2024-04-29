import DashboardFirst from "./dashboardFirst";
import DashboardSeconde from "./dashboardSeconde";
import "./dashboard.css";
import { Button, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getInvoicesBySelectedMonth } from "../../utils/helpers";
import { useTranslation } from "react-i18next";
import ConnectBankForm from "./ConnectBankForm";
import CustomModal from "../components/CustomModal";

const Dashboard = () => {
  const { t } = useTranslation();
  const invoices = useSelector((state: RootState) => state.invoices);
  const categories = useSelector((state: RootState) => state.categories);
  const currentMonth = dayjs();
  const [monthToDisplay, setMonthToDisplay] = useState<Dayjs>(currentMonth);
  const invoicesByMonth = getInvoicesBySelectedMonth(invoices, monthToDisplay);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="page-container dashboard">
      <div className="title-container">
        <div className="page-title">{t('pages.dashboard')}</div>
        <Button type="primary" onClick={showModal}>
          Connect your bank
        </Button>
        <DatePicker.MonthPicker
          defaultPickerValue={currentMonth}
          allowClear={false}
          value={monthToDisplay}
          onChange={setMonthToDisplay}
        />
      </div>
      <div className="page-inner-container">
        <DashboardFirst
          invoices={invoicesByMonth}
          categories={categories}
          monthToDisplay={monthToDisplay}
        />
        <DashboardSeconde />
      </div>
      <CustomModal
        title="Connect your bank"
        type="bank"
        isOpen={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ConnectBankForm />
      </CustomModal>
    </div>
  );
};

export default Dashboard;