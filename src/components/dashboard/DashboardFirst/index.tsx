import { Dayjs } from "dayjs";
import InvoiceModel from "../../../models/invoice";
import CategoryModel from "../../../models/category-model";
import UserModel from "../../../models/user-model";
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import { asNumString } from "../../../utils/helpers";
import { calculateCreditCardsUsage } from "../../../utils/bank-utils";
import CurrencyList from 'currency-list';

interface DashboardFirstProps {
  setMonthToDisplay?: React.Dispatch<React.SetStateAction<Dayjs>>;
  monthToDisplay: Dayjs;
  invoices: InvoiceModel[];
  categories: CategoryModel[];
  user: UserModel;
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const account = props.user.bank[0];
  const accountBalance = asNumString(account?.details?.balance);
  const currency = CurrencyList.get(account?.extraInfo?.accountCurrencyCode || "ILS");
  const creditCards = account?.creditCards || [];
  const used = calculateCreditCardsUsage(creditCards);
  const savingsBalance = account?.savings;

  return (
    <div className="home-first-main-container home-component">
      <div className="card-container">
        <div className="card-title-container">
          <div className="card-title">Your account status</div>
        </div>
        <div className="card-body">
          <div className="sub-title-container">
            <div className="card-subtitle">Account balance</div>
            <div className="balance"><span>{currency?.symbol}</span> {accountBalance}</div>
          </div>

          <div className="cards">
            <CreditCardsAndSavings currency={currency?.symbol} cardsUsed={used} savingsBalance={savingsBalance} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFirst;