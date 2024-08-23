import dayjs, { Dayjs } from "dayjs";
import InvoiceModel from "../../../models/invoice";
import { TransactionsTableTypes } from "../../dashboard/DashboardSeconde";
import { TransactionStatuses } from "../../../utils/transactions";
import { asNumString } from "../../../utils/helpers";
import { Table, TableProps } from "antd";
import "./TransactionsTable.css"

interface TransactionsTableProps {
  type?: string;
  status?: TransactionStatuses;
  invoices: InvoiceModel[];
  loading?: boolean;
  props?: TableProps;
  date?: Dayjs;
};

const TransactionsTable = (props: TransactionsTableProps) => {
  const tableType = (TransactionsTableTypes as any)[props.type] || props.type;
  const columns: TableProps<InvoiceModel | any>['columns'] = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <span>{dayjs(text).format('DD MMMM YY')}</span>
      ),
      width: 170,
      sorter: (a, b) => (dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val) => (
        asNumString(val)
      )
    },
  ];

  let dataSet = [...props.invoices];

  if (tableType === TransactionsTableTypes.Pending) {
    columns.push({
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => {
        return (TransactionStatuses as any)[val]
      }
    });
  }
  if (tableType === TransactionsTableTypes.Card_Withdrawals) {
    const latestInvoices = [...props.invoices].slice(0, 5);
    dataSet = latestInvoices;
  }

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

export default TransactionsTable;