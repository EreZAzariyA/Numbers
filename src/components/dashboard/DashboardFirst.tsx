import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CurrencyList from 'currency-list'
import transactionsServices from "../../services/transactions";
import TransactionModel from "../../models/transaction";
import UserModel from "../../models/user-model";
import { MainBanksAccount } from "../../models/bank-model";
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import { SimpleCharts } from "../components/Charts/SimpleCharts";
import { TotalAmountInput } from "../components/TotalAmount";
import { RefreshBankDataButton } from "../components/RefreshBankDataButton";
import { asNumString, isArrayAndNotEmpty, queryFiltering } from "../../utils/helpers";
import { TotalAmountType } from "../../utils/enums";
import { TransactionStatusesType } from "../../utils/transactions";
import { Card, Col, Flex, Grid, message, Row, Skeleton, Typography } from "antd";

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
  const { lg } = Grid.useBreakpoint();

  const banks = props.account?.banks || [];
  const bankAccount = banks.find((b) => b.isMainAccount) ?? banks?.[0];
  const currency = CurrencyList.get(bankAccount?.extraInfo?.accountCurrencyCode || "ILS");

  useEffect(() => {
    const dispatchTransactions = async () => {
      setLoading(true);
      const query = queryFiltering({ status: TransactionStatusesType.COMPLETED, month: props.monthToDisplay });

      try {
        const { transactions } = await transactionsServices.fetchTransactions(props.user._id, query);
        setTransactions(transactions);
      } catch (err: any) {
        message.error(err);
      }
      setLoading(false);
    };

    dispatchTransactions();
  }, [props.monthToDisplay, props.user._id]);

  let totalBanksBalance = 0;
  if (isArrayAndNotEmpty(banks)) {
    banks.forEach((bank) => {
      totalBanksBalance += bank.details?.balance || 0;
    });
  }

  const cardStyles = { body: lg ? { minHeight: '300px' } : {} }

  return (
    <Card
      title={t('dashboard.first.0')}
      extra={<RefreshBankDataButton />}
      className="dashboard-first"
    >
      <Row align={"middle"} gutter={[20, 20]}>
        <Col xs={24} lg={11}>
          <Card type="inner" styles={cardStyles} className="dashboard-card">
            <Flex vertical align="flex-start">
              <Typography.Title level={4}>{t('dashboard.first.1')}</Typography.Title>
              <Typography.Title level={3}>
                {props.loading ? <Skeleton paragraph={{ rows: 0 }} active /> : (
                  <>{currency.symbol} {asNumString(totalBanksBalance)}</>
                )}
              </Typography.Title>
            </Flex>
            <CreditCardsAndSavings currency={currency.symbol} account={props.account} />
          </Card>
        </Col>

        <Col xs={24} lg={13}>
          <Card type="inner" styles={cardStyles} className="dashboard-card charts">
            <TotalAmountInput
              transactions={transactions}
              type={TotalAmountType.SPENT}
              style={{ maxWidth: '7rem' }}
            />
            <SimpleCharts transactions={transactions} loading={loading} />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardFirst;