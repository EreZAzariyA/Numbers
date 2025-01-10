import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import CategoryModel from "../../models/category-model";
import TransactionModel from "../../models/transaction";
import { EditTable } from "../components/EditTable";
import { asNumString } from "../../utils/helpers";
import { TransactionStatuses } from "../../utils/transactions";
import { Space, TableProps, Tooltip } from "antd";

const CategoryTransactionsModal = (props: { category: CategoryModel }) => {
  const { t } = useTranslation();

  const [filterState, setFilterState] = useState({
    categories: [props.category._id],
    status: TransactionStatuses.completed,
  });

  const columns: TableProps<TransactionModel>['columns'] = [
    {
      title: t('transactions.table.header.date'),
      dataIndex: 'date',
      key: 'date',
      width: '33.3%',
      sorter: (a, b) => (dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
      defaultSortOrder: 'ascend',
      ellipsis: {
        showTitle: false
      },
      render: (date) => {
        const val = new Date(date).toLocaleDateString()
        return <Tooltip title={val} children={val} />;
      },
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
        <Tooltip title={text} children={text} />
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
        totals
        filterState={filterState}
        setFilterState={setFilterState}
        tableProps={{
          columns,
          scroll: {
            y: 300,
            x: 50
          },
        }}
      />
    </Space>
  );
};

export default CategoryTransactionsModal;