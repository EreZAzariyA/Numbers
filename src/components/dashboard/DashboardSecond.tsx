import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { useQuery } from "@tanstack/react-query";
import UserModel from "../../models/user-model";
import transactionsServices, { TransactionsResp } from "../../services/transactions";
import { asNumString, queryFiltering } from "../../utils/helpers";
import { TransactionStatuses, TransactionsType } from "../../utils/transactions";
import { Card, Flex, Skeleton, Typography } from "antd";
import { LuActivity } from "react-icons/lu";

interface DashboardSecondProps {
  user: UserModel;
  monthToDisplay: Dayjs;
};

const DashboardSecond = (props: DashboardSecondProps) => {
  const { t } = useTranslation();
  const monthKey = props.monthToDisplay.format('YYYY-MM');

  const query = queryFiltering({
    month: props.monthToDisplay.toISOString(),
    status: TransactionStatuses.completed
  }, { limit: 5 });

  const { data, isLoading } = useQuery<TransactionsResp>({
    queryKey: ['dashboard-recent-transactions', props.user?._id, monthKey],
    queryFn: () => transactionsServices.fetchTransactions(props.user?._id, query, TransactionsType.ACCOUNT),
    enabled: !!props.user?._id,
    staleTime: 1000 * 60,
  });

  const transactions = data?.transactions ?? [];

  const cardTitle = (
    <Flex align="center" justify="space-between">
      {t('dashboard.second.0')}
      <Link to={'/transactions'} className="more-link">{t('dashboard.second.1')}</Link>
    </Flex>
  );

  const emptyState = (
    <div className="dashboard-empty-state">
      <div className="dashboard-empty-icon">
        <LuActivity size={28} />
      </div>
      <Typography.Text className="dashboard-empty-title">{t('dashboard.empty')}</Typography.Text>
      <Typography.Text className="dashboard-empty-desc">
        {t('dashboard.emptyDesc')}
      </Typography.Text>
    </div>
  );

  return (
    <Card title={cardTitle} className="dashboard-second">
      {isLoading ? (
        <div className="dashboard-recent-loading">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : transactions.length === 0 ? (
        emptyState
      ) : (
        <div className="dashboard-recent-list" role="table">
          <div className="dashboard-recent-row dashboard-recent-head" role="row">
            <span role="columnheader">{t('transactions.table.header.date')}</span>
            <span role="columnheader">{t('transactions.table.header.description')}</span>
            <span role="columnheader">{t('transactions.table.header.amount')}</span>
          </div>
          {transactions.map((transaction) => (
            <div className="dashboard-recent-row" role="row" key={transaction._id}>
              <span role="cell">{dayjs(transaction.date).format('DD/MM/YYYY')}</span>
              <span role="cell" className="dashboard-recent-description" title={transaction.description}>
                {transaction.description}
              </span>
              <span role="cell" className={transaction.amount < 0 ? 'dashboard-amount-expense' : 'dashboard-amount-income'}>
                {asNumString(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default DashboardSecond;
