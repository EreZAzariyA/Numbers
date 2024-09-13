import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CurrencyList from 'currency-list'
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import CategoryModel from "../../../models/category-model";
import { MainBanksAccount } from "../../../models/bank-model";
import { asNumString, isArrayAndNotEmpty, useResize } from "../../../utils/helpers";
import { calculateCreditCardsUsage } from "../../../utils/bank-utils";
import { CreditCardType } from "../../../utils/types";
import { Divider, Skeleton } from "antd";
import TransactionModel from "../../../models/transaction";
import { CreditCardsUsed } from "./CreditCardsUsed";

interface DashboardFirstProps {
  setMonthToDisplay?: React.Dispatch<React.SetStateAction<Dayjs>>;
  monthToDisplay: Dayjs;
  categories: CategoryModel[];
  account: MainBanksAccount;
  loading: boolean;
  transactionsByMonth: TransactionModel[];
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const { isMobile } = useResize();
  const { t } = useTranslation();
  const banks = props.account?.banks || [];
  const hasBanksAccount = isArrayAndNotEmpty(banks);
  const bankAccount = banks.find((b) => b.isMainAccount) ?? banks?.[1];

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

  return (
    <div className="home-first-main-container home-component">
      <div className="card-container">
        <div className="card-title-container">
          <div className="card-title">{t('dashboard.first.0')}</div>
        </div>
        <div className="card-body">
          <div className="balances">
            <div className="sub-title-container">
              <div className="card-subtitle">{t('dashboard.first.1')}</div>
              <div className="balance">
                  {props.loading ? <Skeleton paragraph={{ rows: 0 }} /> : (
                    <><span>{currency?.symbol}</span> {banksTotalBalance}</>
                  )}
                </div>
            </div>
            {!isMobile && (
              <Divider style={{ margin: '5px 0 20px' }} />
            )}
            {hasBanksAccount ? (
              <div className="cards">
                <CreditCardsAndSavings currency={currency?.symbol} cardsUsed={used} savingsBalance={savingsBalance} />
              </div>
            ) : <span>Connect your bank account to see more details</span>}
          </div>
          <Divider type="vertical" style={{ height: 'unset' }} />
          <CreditCardsUsed creditCards={cards} />
          {/* <div className="charts">
            <BarCharts type={ChartsTypes.INVOICES_PER_CATEGORY} data={data} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardFirst;