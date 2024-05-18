import { Dayjs } from "dayjs";
import InvoiceModel from "../../models/invoice";
import { filterInvoicesByType } from "../../utils/helpers";
import { TransactionsTypes } from "../../utils/enums";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { Col, Row } from "antd";
import { TransactionStatusesType } from "../../utils/transactions";

interface DashboardSecondeProps {
  invoices: InvoiceModel[];
  invoicesByMonth?: InvoiceModel[];
  monthToDisplay: Dayjs;
};

export enum TransactionsTableTypes {
  Pending = "Pending Transactions",
  Card_Withdrawals = "Card Withdrawals"
};

const DashboardSeconde = (props: DashboardSecondeProps) => {
  const cardWithdrawals = filterInvoicesByType(props.invoicesByMonth, TransactionsTypes.ATM);
  const pendingTransactions = filterInvoicesByType(props.invoices, TransactionsTypes.CARD_WITHDRAWAL, TransactionStatusesType.PENDING);

  return (
    <div className="home-seconde-main-container home-component">
      <Row align={"top"} justify={'center'} gutter={[10, 5]}>
        <Col xs={24} md={20} lg={12}>
          <TransactionsTable type={TransactionsTableTypes.Pending} invoices={pendingTransactions} />
        </Col>
        <Col xs={24} md={20} lg={12}>
          <TransactionsTable type={TransactionsTableTypes.Card_Withdrawals} invoices={cardWithdrawals} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSeconde;