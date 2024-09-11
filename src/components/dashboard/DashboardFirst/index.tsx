import { Dayjs } from "dayjs";
import CurrencyList from 'currency-list'
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../redux/store";
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import CategoryModel from "../../../models/category-model";
import { BankAccountModel } from "../../../models/bank-model";
import { asNumString, getDebitsByDate, isArrayAndNotEmpty } from "../../../utils/helpers";
import { calculateCreditCardsUsage } from "../../../utils/bank-utils";
import { CreditCardType } from "../../../utils/types";
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
  const banks = account?.banks;

  let totalBanksBalance = 0;
  let cards: CreditCardType[] = [];
  if (isArrayAndNotEmpty(banks)) {
    banks.forEach((b) => {
      totalBanksBalance += b.details?.balance || 0;
      if (isArrayAndNotEmpty(b?.creditCards)) {
        for (const card of b.creditCards) {
          cards.push(card);
        }
      }
    });
  }
  const banksTotalBalance = asNumString(totalBanksBalance);
  const currency = CurrencyList.get(bankAccount?.extraInfo?.accountCurrencyCode || "ILS");
  const used = calculateCreditCardsUsage(cards);
  const savingsBalance = bankAccount?.savings;

  const debits = getDebitsByDate(account, props.monthToDisplay);

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
                    <span>{currency?.symbol}</span> {banksTotalBalance}
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