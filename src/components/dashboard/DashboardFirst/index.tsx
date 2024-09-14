import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CurrencyList from 'currency-list'
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import CategoryModel from "../../../models/category-model";
import { MainBanksAccount } from "../../../models/bank-model";
import { asNumString, isArrayAndNotEmpty } from "../../../utils/helpers";
import { calculateCreditCardsUsage } from "../../../utils/bank-utils";
import { CreditCardType } from "../../../utils/types";
import { Col, Row, Skeleton } from "antd";
import TransactionModel from "../../../models/transaction";
import "./DashboardFirst.css";
import { SimpleCharts } from "../../components/Charts/SimpleCharts";
import { TotalAmountInput } from "../../components/TotalAmount";
import { TotalAmountType } from "../../../utils/enums";
import { RefreshBankDataButton } from "../../components/RefreshBankDataButton";

interface DashboardFirstProps {
  setMonthToDisplay?: React.Dispatch<React.SetStateAction<Dayjs>>;
  monthToDisplay: Dayjs;
  categories: CategoryModel[];
  account: MainBanksAccount;
  loading: boolean;
  transactionsByMonth: TransactionModel[];
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const { t } = useTranslation();
  const banks = props.account?.banks || [];
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
      <Row align={"middle"} gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Row align={"top"} justify={'start'} className="dashboard-card">
            <Col span={24}>
              <Row justify={"space-between"}>
                <Col>
                  <div className="card-title">{t('dashboard.first.0')}</div>
                </Col>
                <Col>
                  <div className="action">
                    <RefreshBankDataButton />
                  </div>
                </Col>
              </Row>
            </Col>

            <Col>
              <div className="balances">
                <div className="card-subtitle">{t('dashboard.first.1')}</div>
                <div className="balance">
                  {props.loading ? <Skeleton paragraph={{ rows: 0 }} /> : (
                    <>{currency?.symbol} {banksTotalBalance}</>
                  )}
                </div>
              </div>
              <CreditCardsAndSavings currency={currency?.symbol} cardsUsed={used} savingsBalance={savingsBalance} />
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={12}>
          <div className="dashboard-card charts">
            <TotalAmountInput
              transactions={props.transactionsByMonth}
              type={TotalAmountType.SPENT}
              style={{ maxWidth: '30%' }}
            />
            <SimpleCharts categories={props.categories} transactions={props.transactionsByMonth} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardFirst;