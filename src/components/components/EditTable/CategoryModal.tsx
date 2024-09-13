import { useState } from "react";
import { Dayjs } from "dayjs";
import CategoryModel from "../../../models/category-model";
import { TransactionsTable } from "../TransactionsTable";
import { Filters } from "../Filters";
import { TotalsContainer } from "../TotalsContainer";
import { filtering, getTransactionsByCategory } from "../../../utils/helpers";
import { TransactionStatuses } from "../../../utils/transactions";
import { Space, Spin } from "antd";

const CategoryModal = (props: { category: CategoryModel, loading: boolean }) => {
  const transactions = getTransactionsByCategory(props.category._id);
  const [filterState, setFilterState] = useState({});
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
          companyFilter
          datesFilter
          monthFilter
          textFilter
          byIncome
          filterState={filterState}
          handleFilterChange={handleFilterChange}
          resetFilters={() => {
            setFilterState({});
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