import { Dayjs } from "dayjs";
import CategoryModel from "../../../models/category-model";
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import { asNumString, getDebitsByDate } from "../../../utils/helpers";
import { calculateCreditCardsUsage } from "../../../utils/bank-utils";
import { useTranslation } from "react-i18next";
import CurrencyList from 'currency-list'
import { BankAccountModel } from "../../../models/bank-model";
import { useAppSelector } from "../../../redux/store";
import { Skeleton } from "antd";

interface DashboardFirstProps {
  setMonthToDisplay?: React.Dispatch<React.SetStateAction<Dayjs>>;
  monthToDisplay: Dayjs;
  categories: CategoryModel[];
  account: BankAccountModel;
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const { t } = useTranslation();
  const { account, loading } = useAppSelector((state) => state.userBanks);

  const bankAccount = account?.banks?.[0];
  const accountBalance = asNumString(bankAccount?.details?.balance);
  const currency = CurrencyList.get(bankAccount?.extraInfo?.accountCurrencyCode || "ILS");
  const creditCards = bankAccount?.creditCards || [];
  const used = calculateCreditCardsUsage(creditCards);
  const savingsBalance = bankAccount?.savings;

  const debits = getDebitsByDate(bankAccount, props.monthToDisplay);

  return (
    <div className="home-first-main-container home-component">
      <div className="card-container">
        <div className="card-title-container">
          <div className="card-title">{t('dashboard.first.0')}</div>
        </div>
        <div className="card-body">
          <div className="sub-title-container">
            <div className="card-subtitle">{t('dashboard.first.1')}</div>
            <div className="balance">
                {loading ? <Skeleton paragraph={{ rows: 0 }} /> : (
                  <>
                    <span>{currency?.symbol}</span> {accountBalance}
                  </>
                )}
              </div>
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