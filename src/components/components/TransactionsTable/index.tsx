import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { useTranslation } from "react-i18next";
import TransactionModel from "../../../models/transaction";
import { TransactionsTableTypes } from "../../dashboard/DashboardSecond";
import { TransactionStatuses } from "../../../utils/transactions";
import { asNumString } from "../../../utils/helpers";
import { Table, TableProps, Tooltip } from "antd";
import "./TransactionsTable.css"

dayjs.extend(relativeTime);

interface TransactionsTableProps {
  type?: string;
  status?: TransactionStatuses;
  transactions: TransactionModel[];
  loading?: boolean;
  props?: TableProps;
  date?: Dayjs;
};

export const TransactionsTable = (props: TransactionsTableProps) => {
  const { t } = useTranslation();
  const tableType = (TransactionsTableTypes as any)[props.type] || props.type;

  let dataSet = [...props.transactions];

  if (tableType === TransactionsTableTypes.Card_Withdrawals) {
    const latestInvoices = [...props.transactions].slice(0, 5);
    dataSet = latestInvoices;
  }

  const columns: TableProps<TransactionModel | any>['columns'] = [
    {
      title: t('transactions.table.header.date'),
      dataIndex: 'date',
      key: 'date',
      width: '33.3%',
      sorter: (a, b) => (dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
      defaultSortOrder: 'ascend',
      render: (text) => (
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

  return (
    <Table
      columns={columns}
      dataSource={dataSet}
      rowKey="_id"
      bordered
      pagination={false}
      loading={props.loading}
      {...props.props}
    />
  );
};