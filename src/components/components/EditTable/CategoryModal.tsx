import { useState } from "react";
import { Dayjs } from "dayjs";
import CategoryModel from "../../../models/category-model";
import { TransactionsTable } from "../TransactionsTable";
import { Filters } from "../Filters";
import { TotalsContainer } from "../TotalsContainer";
import { filtering, getTransactionsByCategory } from "../../../utils/helpers";
import { TransactionStatuses, TransactionStatusesType } from "../../../utils/transactions";
import { Space, Spin } from "antd";

const CategoryModal = (props: { category: CategoryModel, loading: boolean }) => {
  const transactions = getTransactionsByCategory(props.category._id);
  const [filterState, setFilterState] = useState({
    status: TransactionStatusesType.COMPLETED
  });
  const data = filtering(transactions, filterState);

  const handleFilterChange = (field: string, value: string | number[] | Dayjs[]) => {
    setFilterState({...filterState, [field]: value});
  };

  if (props.loading) {
    return <Spin />
  }
  return (
    <Space direction="vertical">
      <p>{props.category?.name}</p>
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

      <TransactionsTable
        transactions={data}
        status={TransactionStatuses.completed}
        withTotals
        props={{scroll: { x: 200 }}}
      />
    </Space>
  );
};

export default CategoryModal;