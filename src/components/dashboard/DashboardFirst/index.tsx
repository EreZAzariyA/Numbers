import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CurrencyList from 'currency-list'
import transactionsServices from "../../../services/transactions";
import TransactionModel from "../../../models/transaction";
import UserModel from "../../../models/user-model";
import { MainBanksAccount } from "../../../models/bank-model";
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import { SimpleCharts } from "../../components/Charts/SimpleCharts";
import { TotalAmountInput } from "../../components/TotalAmount";
import { RefreshBankDataButton } from "../../components/RefreshBankDataButton";
import { asNumString, isArrayAndNotEmpty, queryFiltering } from "../../../utils/helpers";
import { TotalAmountType } from "../../../utils/enums";
import { getBankCreditCards } from "../../../utils/bank-utils";
import { CreditCardType } from "../../../utils/types";
import { TransactionStatusesType } from "../../../utils/transactions";
import { Col, message, Row, Skeleton } from "antd";
import "./DashboardFirst.css";

interface DashboardFirstProps {
  monthToDisplay: Dayjs;
  account: MainBanksAccount;
  user: UserModel;
  loading: boolean;
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const banks = props.account?.banks || [];
  const bankAccount = banks.find((b) => b.isMainAccount) ?? banks?.[0];
  const currency = CurrencyList.get(bankAccount?.extraInfo?.accountCurrencyCode || "ILS");

  useEffect(() => {
    const dispatchTransactions = async () => {
      setLoading(true);
      const query = queryFiltering({ status: TransactionStatusesType.COMPLETED, month: props.monthToDisplay });

      try {
        const { transactions } = await transactionsServices.fetchTransactions(props.user._id, null, query);
        setTransactions(transactions);
      } catch (err: any) {
        message.error(err);
      }
      setLoading(false);
    };

    dispatchTransactions();
  }, [props.monthToDisplay, props.user._id]);

  let totalBanksBalance = 0;
  let cards: CreditCardType[] = [];
  if (isArrayAndNotEmpty(banks)) {
    banks.forEach((bank) => {
      totalBanksBalance += bank.details?.balance || 0;
      cards = [...cards, ...getBankCreditCards(bank)];
    });
  }

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
                    <>{currency.symbol} {asNumString(totalBanksBalance)}</>
                  )}
                </div>
              </div>
              <CreditCardsAndSavings currency={currency.symbol} cards={cards} bankAccount={bankAccount} />
            </Col>
          </Row>
        </Col>

        <Col xs={24} lg={12}>
          <div className="dashboard-card charts">
            <TotalAmountInput
              transactions={transactions}
              type={TotalAmountType.SPENT}
              style={{ maxWidth: '30%' }}
            />
            <SimpleCharts transactions={transactions} loading={loading} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardFirst;