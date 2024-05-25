import { Dayjs } from "dayjs";
import InvoiceModel from "../../models/invoice";
import { filterInvoicesByStatus, filterInvoicesByCategoryId } from "../../utils/helpers";
import { TransactionsTypes } from "../../utils/enums";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { Col, Row } from "antd";
import { TransactionStatusesType } from "../../utils/transactions";
import UserModel from "../../models/user-model";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface DashboardSecondeProps {
  user: UserModel;
  invoices: InvoiceModel[];
  invoicesByMonth?: InvoiceModel[];
  monthToDisplay: Dayjs;
};

export enum TransactionsTableTypes {
  Pending = "Pending Transactions",
  Card_Withdrawals = "Card Withdrawals"
};

const DashboardSeconde = (props: DashboardSecondeProps) => {
  const categories = useSelector((state: RootState) => state.categories);
  const category = categories.find((c) => c.name === TransactionsTypes.ATM_WITHDRAWAL);
  const pendingTransactions = filterInvoicesByStatus(props.invoices, TransactionStatusesType.PENDING) || [];
  const ATMWithdrawals = filterInvoicesByCategoryId(props.invoicesByMonth, category?._id) || [];

  return (
    <div className="home-seconde-main-container home-component">
      <Row align={"top"} justify={'center'} gutter={[10, 5]}>
        <Col xs={24} md={20} lg={12}>
          <TransactionsTable type={TransactionsTableTypes.Pending} invoices={pendingTransactions} />
        </Col>
        <Col xs={24} md={20} lg={12}>
          <TransactionsTable type={TransactionsTableTypes.Card_Withdrawals} invoices={ATMWithdrawals} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSeconde;