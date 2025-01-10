import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import CurrencyList from 'currency-list'
import transactionsServices, { TransactionsResp } from "../../services/transactions";
import UserModel from "../../models/user-model";
import { MainBanksAccount } from "../../models/bank-model";
import { CreditCardsAndSavings } from "./CreditCardsAndSavings";
import { SimpleCharts } from "../components/Charts/SimpleCharts";
import { TotalAmountInput } from "../components/TotalAmount";
import { RefreshBankDataButton } from "../components/RefreshBankDataButton";
import { asNumString, isArrayAndNotEmpty, queryFiltering } from "../../utils/helpers";
import { TotalAmountType } from "../../utils/enums";
import { TransactionStatuses, TransactionsType } from "../../utils/transactions";
import { Card, Col, Flex, Grid, Row, Skeleton, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";

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
  const { data, isLoading } = useQuery<TransactionsResp>({
    queryKey: ['transactions', props.user?._id],
    queryFn: () => transactionsServices.fetchTransactions(props.user?._id, query, TransactionsType.ACCOUNT),
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
              transactions={data?.transactions}
              type={TotalAmountType.SPENT}
              style={{ maxWidth: '7rem' }}
            />
            <SimpleCharts transactions={data?.transactions} loading={isLoading} />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardFirst;