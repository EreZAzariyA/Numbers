import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import CategoryModel from "../../models/category-model";
import TransactionModel from "../../models/transaction";
import { EditTable } from "../components/EditTable";
import { asNumString } from "../../utils/helpers";
import { TransactionStatusesType } from "../../utils/transactions";
import { Space, TableProps, Tooltip } from "antd";

const CategoryTransactionsModal = (props: { category: CategoryModel }) => {
  const { t } = useTranslation();

  const [filterState, setFilterState] = useState({
    status: TransactionStatusesType.COMPLETED,
  });

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

  return (
    <Space direction="vertical">
      <p>{props.category.name}</p>
      <EditTable
        filterState={filterState}
        totals
        setFilterState={setFilterState}
        tableProps={{
          columns,
          scroll: {
            y: 300,
            x: 300
          },
        }}
      />
    </Space>
  );
};

export default CategoryTransactionsModal;