import { Dayjs } from "dayjs";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import TransactionModel from "../../../models/transaction";
import UserModel from "../../../models/user-model";
import { filterInvoicesByStatus, isArrayAndNotEmpty } from "../../../utils/helpers";
import { TransactionStatusesType } from "../../../utils/transactions";
import "./DashboardSeconde.css";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../redux/store";

interface DashboardSecondeProps {
  user: UserModel;
  transactions: TransactionModel[];
  transactionsByMonth?: TransactionModel[];
  monthToDisplay: Dayjs;
};

export enum TransactionsTableTypes {
  Pending = "Pending Transactions",
  Card_Withdrawals = "Card Withdrawals",
  Last_Transactions = "Transactions"
};

const DashboardSeconde = (props: DashboardSecondeProps) => {
  const { t } = useTranslation();
  let transactions: TransactionModel[] = [];
  const { loading } = useAppSelector((state) => state.transactions);

  if (isArrayAndNotEmpty(props.transactions)) {
    transactions  = filterInvoicesByStatus(props.transactionsByMonth, TransactionStatusesType.COMPLETED);
    transactions = transactions.slice(0, 6);
  }

  return (
    <div className="home-seconde-main-container home-component">
      <div className="card-container">
        <div className="card-title-container">
          <div className="card-title">
            {t('dashboard.second.0')}
          </div>
          <div className="action">
            {t('dashboard.second.1')}
          </div>
        </div>
        <div className="card-body">
          <TransactionsTable
            transactions={transactions}
            type={TransactionsTableTypes.Last_Transactions}
            date={props.monthToDisplay}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSeconde;