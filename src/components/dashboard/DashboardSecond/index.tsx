import { Dayjs } from "dayjs";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../redux/store";
import TransactionModel from "../../../models/transaction";
import UserModel from "../../../models/user-model";
import { TransactionsTable } from "../../components/TransactionsTable";
import { filterInvoicesByStatus, isArrayAndNotEmpty } from "../../../utils/helpers";
import { TransactionStatusesType } from "../../../utils/transactions";
import "./DashboardSecond.css";

interface DashboardSecondProps {
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

const DashboardSecond = (props: DashboardSecondProps) => {
  const { t } = useTranslation();
  const { loading } = useAppSelector((state) => state.transactions);
  let transactions: TransactionModel[] = [];

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
            <Link to={'/transactions'}>
              {t('dashboard.second.1')}
            </Link>
          </div>
        </div>
        <div className="card-body">
          <TransactionsTable
            transactions={transactions}
            type={TransactionsTableTypes.Last_Transactions}
            date={props.monthToDisplay}
            loading={loading}
            props={{
              pagination: {
                hideOnSinglePage: true
              },
              style: {
                borderRadius: 0
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSecond;