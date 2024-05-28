import { Dayjs } from "dayjs";
import InvoiceModel from "../../models/invoice";
import TransactionsTable from "../components/TransactionsTable/TransactionsTable";
import { Col, Row } from "antd";
import UserModel from "../../models/user-model";
import { useResize } from "../../utils/helpers";
import { BarCharts } from "../components/BarCharts";

interface DashboardSecondeProps {
  user: UserModel;
  invoices: InvoiceModel[];
  invoicesByMonth?: InvoiceModel[];
  monthToDisplay: Dayjs;
};

export enum TransactionsTableTypes {
  Pending = "Pending Transactions",
  Card_Withdrawals = "Card Withdrawals",
  Last_Transactions = "Last Transactions"
};

const DashboardSeconde = (props: DashboardSecondeProps) => {
  const { isTablet } = useResize();
  const debits = props.user.bank[0]?.pastOrFutureDebits || [];
  const pastOrFutureDebits = !isTablet ? [...debits].reverse().slice(0, 5) : debits;
  const invoices = [...props.invoices].reverse().slice(0, 50);

  return (
    <div className="home-seconde-main-container home-component">
      <Row align={"top"} justify={'center'} gutter={[10, 20]} style={{ flexDirection: isTablet ? 'column-reverse' : 'row-reverse' }}>
        <Col xs={24} lg={16}>
          <TransactionsTable
            invoices={invoices}
            type={TransactionsTableTypes.Last_Transactions}
            props={{ scroll: { y: 600, x: 600 } }}
          />
        </Col>
        <Col xs={24} lg={8} style={{ width: '100%' }}>
          <div style={{ width: '100%', height: 250 }}>
            <BarCharts pastOrFutureDebit={pastOrFutureDebits} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSeconde;