import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import CategoryModel from "../../models/category-model";
import { Filters } from "./Filters";
import { TotalsContainer } from "./TotalsContainer";
import { asNumString, filtering, getTransactionsByCategory } from "../../utils/helpers";
import { TransactionStatusesType } from "../../utils/transactions";
import { Space, TableProps, Tooltip } from "antd";
import { EditTable } from "./EditTable";
import { useTranslation } from "react-i18next";
import TransactionModel from "../../models/transaction";

const CategoryTransactionsModal = (props: { category: CategoryModel }) => {
  const { t } = useTranslation();
  const transactions = getTransactionsByCategory(props.category._id);
  const [filterState, setFilterState] = useState({
    status: TransactionStatusesType.COMPLETED,
  });
  const data = filtering(transactions, filterState);

  const handleFilterChange = (field: string, value: string | number[] | Dayjs[]) => {
    setFilterState({...filterState, [field]: value});
  };

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
      <Space>
        <Filters
          type="categories"
          companyFilter
          datesFilter
          monthFilter
          textFilter
          statusFilter
          byIncome
          filterState={filterState}
          handleFilterChange={handleFilterChange}
          resetFilters={() => {
            setFilterState({
              status: TransactionStatusesType.COMPLETED
            });
          }}
        />

        <TotalsContainer transactions={data} />
      </Space>

      <EditTable
        tableProps={{
          dataSource: data,
          columns,
          scroll: { x: 200 },
          rowKey: '_id',
          expandable: {
            defaultExpandAllRows: true
          },
          pagination: {
            pageSize: 5
          }
        }}
      />
    </Space>
  );
};

export default CategoryTransactionsModal;