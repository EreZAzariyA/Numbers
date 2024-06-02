import { Dayjs } from "dayjs";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import InvoiceModel from "../../../models/invoice";
import UserModel from "../../../models/user-model";
import { filterInvoicesByStatus } from "../../../utils/helpers";
import { TransactionStatusesType } from "../../../utils/transactions";
import "./DashboardSeconde.css";

interface DashboardSecondeProps {
  user: UserModel;
  invoices: InvoiceModel[];
  invoicesByMonth?: InvoiceModel[];
  monthToDisplay: Dayjs;
};

export enum TransactionsTableTypes {
  Pending = "Pending Transactions",
  Card_Withdrawals = "Card Withdrawals",
  Last_Transactions = "Transactions"
};

const DashboardSeconde = (props: DashboardSecondeProps) => {
  let invoices = filterInvoicesByStatus(props.invoices, TransactionStatusesType.COMPLETED);
  invoices = invoices.slice(0, 6);

  return (
    <div className="home-seconde-main-container home-component">
      <div className="card-container">
        <div className="card-title-container">
          <div className="card-title">
            Recent movements in the account
          </div>
          <div className="action">
            More movements
          </div>
        </div>
        <div className="card-body">
          <TransactionsTable
            invoices={invoices}
            type={TransactionsTableTypes.Last_Transactions}
            date={props.monthToDisplay}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSeconde;