import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState, useAppDispatch } from "../../redux/store";
import { addTransaction, removeTransaction, updateTransaction } from "../../redux/actions/transaction-actions";
import TransactionModel from "../../models/transaction";
import NewTransaction from "./newTransaction/newTransaction";
import { TotalAmountInput } from "../components/TotalAmount";
import { EditTable } from "../components/EditTable";
import { Filters } from "../components/Filters";
import { TransactionStatusesType } from "../../utils/transactions";
import { TotalAmountType } from "../../utils/enums";
import { asNumString, getError, isArrayAndNotEmpty } from "../../utils/helpers";
import { App, Button, Space, TableProps, Tooltip } from "antd";

enum Steps {
  New_Transaction = "New_Transaction",
  Update_Transaction = "Update_Transaction",
};

const Transactions = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const { hash } = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { transactions, loading } = useSelector((state: RootState) => state.transactions);
  const { categories } = useSelector((state: RootState) => state.categories);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionModel>(null);
  const newTransWithCategory_idFromCategories = hash.split('#')?.[1];
  const [step, setStep] = useState<string>(hash ? Steps.New_Transaction : null);
  const [filterState, setFilterState] = useState({
    categories: [],
    dates: null,
    month: dayjs(),
    status: 'completed',
    text: null,
    companyId: null
  });

  const dataSource = filtering(transactions);

  function filtering (transactions: TransactionModel[] = []): TransactionModel[] {
    let data = [...transactions];

    if (!isArrayAndNotEmpty(transactions)) {
      return [];
    }
    if (isArrayAndNotEmpty(filterState.categories)) {
      data = data.filter((d) => filterState.categories.includes(d.category_id));
    }
    if (filterState.companyId) {
      data = data.filter((d) => d.companyId === filterState.companyId);
    }
    if (filterState.dates && filterState.dates.length === 2) {
      data = data.filter((d) => (
        dayjs(d.date).valueOf() >= dayjs(filterState.dates[0]).startOf('day').valueOf() &&
        dayjs(d.date).valueOf() <= dayjs(filterState.dates[1]).endOf('day').valueOf()
      ));
    }
    if (filterState.month) {
      data = data.filter((d) => (
        dayjs(d.date).valueOf() >= dayjs(filterState.month).startOf('month').valueOf() &&
        dayjs(d.date).valueOf() <= dayjs(filterState.month).endOf('month').valueOf()
      ));
    }
    if (filterState.status) {
      data = data.filter((d) => d.status === filterState.status);
    }
    if (filterState.text) {
      data = data.filter((d) => d.description.startsWith(filterState.text));
    }

    return data;
  };

  const onFinish = async (transaction: TransactionModel) => {
    if (!user) {
      message.error("User id is missing");
      return;
    }

    try {
      let successMessage = '';

      if (step === Steps.Update_Transaction) {
        const result = await dispatch(updateTransaction({ transaction }));
        if (updateTransaction.fulfilled.match(result)) {
          successMessage = 'Transaction updated successfully...';
        }
      } else {
        const result = await dispatch(addTransaction({ transaction, user_id: user._id }));
        if (addTransaction.fulfilled.match(result)) {
          successMessage = 'Transaction added successfully';
        }
      }

      message.success(successMessage);
      if (newTransWithCategory_idFromCategories) {
        navigate('/transactions');
      } else {
        onBack();
      }
    } catch (error: any) {
      console.log({error});
      message.error(error.message);
    }
  };

  const onBack = () => {
    setStep(null);
    setSelectedTransaction(null);
  };

  const onEdit = (record: TransactionModel) => {
    setSelectedTransaction(record);
    setStep(Steps.Update_Transaction);
  };

  const onRemove = async (record_id: string): Promise<void> => {
    try {
      const result = await dispatch(removeTransaction({
        user_id: user._id,
        transaction_id: record_id
      }));

      if (removeTransaction.fulfilled.match(result)) {
        message.success('Transaction removed...');
      }
    } catch (err: any) {
      message.error(err.message);
      message.error(getError(err));
    }
  };

  const handleFilterChange = (field: string, value: string | number[] | Dayjs[]): void => {
    setFilterState({ ...filterState, [field]: value });
  };

  const resetFilters = () => {
    setFilterState({
      categories: [],
      dates: [],
      month: dayjs(),
      status: TransactionStatusesType.COMPLETED,
      text: null,
      companyId: null,
    });
  };

  const columns: TableProps<TransactionModel>['columns'] = [
    {
      title: t('transactions.table.header.date'),
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (text) => (
        <span>{new Date(text).toLocaleDateString()}</span>
      ),
      sorter: (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
      defaultSortOrder: 'ascend'
    },
    {
      title: t('transactions.table.header.category'),
      dataIndex: 'category_id',
      key: 'category',
      width: 120,
      render:(value) => {
        const category = categories.find((c) => c._id === value);
        return (
          <span>{category?.name}</span>
        );
      }
    },
    {
      title: t('transactions.table.header.description'),
      dataIndex: 'description',
      key: 'description',
      width: 130,
      ellipsis: {
        showTitle: false
      },
      render: (val) => (
        <Tooltip title={val}>
          {val}
        </Tooltip>
      )
    },
    {
      title: t('transactions.table.header.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (val) => (
        asNumString(val)
      )
    },
    {
      title: t('transactions.table.header.status'),
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (val) => (
        <span>{t(`transactions.status.${val}`)}</span>
      )
    },
    {
      title: t('transactions.table.header.company'),
      dataIndex: 'companyId',
      key: 'companyId',
      width: 100,
      ellipsis: {
        showTitle: false
      },
      render: (val) => (
        <Tooltip title={t(`companies.${val}`)}>
          {t(`companies.${val}`)}
        </Tooltip>
      )
    }
  ];

  return (
    <div className="page-container transactions">
      <div className="title-container">
        <div className="page-title">{t('pages.transactions')}</div>
        {step ? (
          <Button danger className="btn-18" type="link" size="small" onClick={onBack}>Back</Button>
        ) : (
          <Space>
            <TotalAmountInput transactions={dataSource} type={TotalAmountType.SPENT} style={{ width: 100 }} />
            <TotalAmountInput transactions={dataSource} type={TotalAmountType.INCOME} style={{ width: 100 }} />
          </Space>
        )}
      </div>
      <div className="page-inner-container">
        {!step && (
          <Space direction="vertical" className="w-100">
            <Filters
              datesFilter
              monthFilter
              categoryFilter
              statusFilter
              textFilter
              companyFilter
              filterState={filterState}
              handleFilterChange={handleFilterChange}
              resetFilters={resetFilters}
            />
            <EditTable
              type="transactions"
              onEditMode={onEdit}
              removeHandler={onRemove}
              tableProps={{
                dataSource,
                rowKey: '_id',
                columns,
                scroll: { x: 800 },
                bordered: true,
                loading: loading,
              }}
            />
            <Button onClick={() => setStep(Steps.New_Transaction)}>
              {t('transactions.buttons.add')}
            </Button>
          </Space>
        )}
        {(step && step === Steps.New_Transaction) && (
          <NewTransaction
            onFinish={onFinish}
            categories={categories}
            newInvoiceCategoryId={newTransWithCategory_idFromCategories}
            isLoading={loading}
          />
        )}
        {(step && step === Steps.Update_Transaction) && (
          <NewTransaction
            onFinish={onFinish}
            categories={categories}
            transaction={selectedTransaction}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Transactions;