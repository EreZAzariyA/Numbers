import { Space, Table, TableProps, Typography } from "antd";
import { TransactionStatuses } from "../../../utils/transactions";
import { TransactionsTableTypes } from "../../dashboard/dashboardSeconde";
import "./TransactionsTable.css"
import InvoiceModel from "../../../models/invoice";
import dayjs from "dayjs";
import { asNumString } from "../../../utils/helpers";

interface TransactionsTableProps {
  type: string;
  status?: TransactionStatuses;
  invoices: InvoiceModel[];
};

const TransactionsTable = (props: TransactionsTableProps) => {
  const tableType = (TransactionsTableTypes as any)[props.type] || props.type;

  const columns: TableProps<InvoiceModel>['columns'] = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <span>{dayjs(text).format('DD MMMM')}</span>
      ),
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
  if (tableType === TransactionsTableTypes.Pending) {
    columns.push({
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => {
        return (TransactionStatuses as any)[val]
      }
    })
  };
  if (tableType === TransactionsTableTypes.Card_Withdrawals) {
    props.invoices.splice(0, 5);
  }

  return (
    <Space direction="vertical" className="w-100 transaction-table">
      <Typography.Title level={5}>{tableType}</Typography.Title>
      <Table
        columns={columns}
        dataSource={props.invoices}
        rowKey="_id"
      />
    </Space>
  );
};

export default TransactionsTable;