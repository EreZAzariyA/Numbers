import { lazy, Suspense } from "react";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CurrencyList from 'currency-list'
import transactionsServices, { TransactionsResp } from "../../services/transactions";
import UserModel from "../../models/user-model";
import { MainBanksAccount } from "../../models/bank-model";
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import { TotalAmountInput } from "../components/TotalAmount";
import { RefreshBankDataButton } from "../components/RefreshBankDataButton";
import { asNumString, isArrayAndNotEmpty, queryFiltering } from "../../utils/helpers";
import { TotalAmountType } from "../../utils/enums";
import { TransactionStatuses, TransactionsType } from "../../utils/transactions";
import { Card, Col, Flex, Grid, Row, Skeleton, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";

const SimpleCharts = lazy(() => (
  import("../components/Charts/SimpleCharts").then((module) => ({ default: module.SimpleCharts }))
));

interface DashboardFirstProps {
  monthToDisplay: Dayjs;
  account: MainBanksAccount;
  user: UserModel;
  loading: boolean;
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const { t } = useTranslation();
  const { lg } = Grid.useBreakpoint();

  const banks = props.account?.banks || [];
  const bankAccount = banks.find((b) => b.isMainAccount) ?? banks?.[0];
  const currency = CurrencyList.get(bankAccount?.extraInfo?.accountCurrencyCode || "ILS");

  const query = queryFiltering({ status: TransactionStatuses.completed, month: props.monthToDisplay });
  const monthKey = props.monthToDisplay.format('YYYY-MM');
  const { data, isLoading } = useQuery<TransactionsResp>({
    queryKey: ['dashboard-transactions-summary', props.user?._id, monthKey],
    queryFn: () => transactionsServices.fetchTransactions(props.user?._id, query, TransactionsType.ACCOUNT),
    enabled: !!props.user?._id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    gcTime: 1000 * 2,
  });

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
            <Flex vertical align="flex-start" gap={2}>
              <span className="balance-kpi-label">{t('dashboard.first.1')}</span>
              <Typography.Title level={2} className="balance-kpi-value">
                {props.loading ? <Skeleton paragraph={{ rows: 0 }} active /> : (
                  <><span className="balance-kpi-currency">{currency.symbol}</span>{asNumString(totalBanksBalance)}</>
                )}
              </Typography.Title>
            </Flex>
            <CreditCardsAndSavings currency={currency.symbol} account={props.account} />
          </Card>
        </Col>

        <Col xs={24} lg={13}>
          <Card type="inner" styles={cardStyles} className="dashboard-card charts">
            <Flex vertical gap={12} className="chart-card-inner">
              <span className="chart-section-label">{t('dashboard.first.7')}</span>
              <TotalAmountInput
                transactions={data?.transactions}
                type={TotalAmountType.SPENT}
              />
              <Suspense fallback={<div className="dashboard-chart-skeleton"><Skeleton active paragraph={{ rows: 3 }} /></div>}>
                <SimpleCharts transactions={data?.transactions} loading={isLoading} />
              </Suspense>
            </Flex>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardFirst;
