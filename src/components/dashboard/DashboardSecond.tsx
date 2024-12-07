import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import TransactionModel from "../../models/transaction";
import UserModel from "../../models/user-model";
import { EditTable } from "../components/EditTable";
import { asNumString, queryFiltering } from "../../utils/helpers";
import { TransactionStatusesType } from "../../utils/transactions";
import { Card, Flex, Tooltip, Typography } from "antd";
import { TableProps } from "antd/lib";

interface DashboardSecondProps {
  user: UserModel;
  monthToDisplay: Dayjs;
};

const DashboardSecond = (props: DashboardSecondProps) => {
  const { t } = useTranslation();

  const query = queryFiltering({
    month: props.monthToDisplay.toISOString(),
    status: TransactionStatusesType.COMPLETED
  }, { limit: 5 });

  const columns: TableProps<TransactionModel>['columns'] = [
    {
      title: t('transactions.table.header.date'),
      dataIndex: 'date',
      key: 'date',
      width: '33.3%',
      sorter: (a, b) => (dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
      defaultSortOrder: 'ascend',
      render: (text, r) => (
        <span>{new Date(text).toLocaleDateString()}</span>
      ),
    },
    {
      title: t('transactions.table.header.description'),
      dataIndex: 'description',
      key: 'description',
      width: '33.3%',
      ellipsis: {
        showTitle: false
      },
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      title: t('transactions.table.header.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: '33.3%',
      render: (val) => (
        asNumString(val)
      )
    },
  ];

  const cardTitle = (
    <Flex align="center" justify="space-between">
      {t('dashboard.second.0')}
      <Link to={'/transactions'}>{t('dashboard.second.1')}</Link>
    </Flex>
  )

  return (
    <Card title={cardTitle} className="dashboard-second">
      <EditTable
        query={query}
        tableProps={{
          columns,
          bordered: false
        }}
      />
    </Card>
  );
};

export default DashboardSecond;