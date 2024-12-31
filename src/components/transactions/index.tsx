import { useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { addTransaction, removeTransaction, updateTransaction } from "../../redux/actions/transaction-actions";
import TransactionModel from "../../models/transaction";
import NewTransaction from "./newTransaction/newTransaction";
import { EditTable } from "../components/EditTable";
import { TransactionStatusesType, TransactionsType } from "../../utils/transactions";
import { asNumString, getError } from "../../utils/helpers";
import { App, Button, Flex, Spin, TableProps, Tooltip, Typography } from "antd";

enum Steps {
  New_Transaction = "New_Transaction",
  Update_Transaction = "Update_Transaction",
};

const Transactions = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { hash } = useLocation();
  const { message } = App.useApp();

  const { user } = useAppSelector((state) => state.auth);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.categories);

  const [selectedTransaction, setSelectedTransaction] = useState<TransactionModel>(null);
  const [step, setStep] = useState<string>(hash ? Steps.New_Transaction : null);
  const [filterState, setFilterState] = useState({
    month: dayjs(),
    status: TransactionStatusesType.COMPLETED,
    transactionsType: TransactionsType.ACCOUNT
  });

  const newTransCategory_idFromCategories = hash.split('#')?.[1];

  const onFinish = async (transaction: TransactionModel) => {
    if (!user) {
      message.error("User id is missing");
      return;
    }

    try {
      let successMessage = null;

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
      onBack();
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

  const columns: TableProps<TransactionModel>['columns'] = [
    {
      title: t('transactions.table.header.date'),
      dataIndex: 'date',
      key: 'date',
      width: 120,
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
      width: 130,
      ellipsis: {
        showTitle: false,
      },
      render:(value) => {
        if (categoriesLoading) return <Spin />
        const category = categories.find((c) => c._id === value);
        return (
          <Tooltip title={category?.name}>
            <span>{category?.name}</span>
          </Tooltip>
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
      sorter: (a, b) => (b.amount - a.amount),
      render: (val) => {
        return (
          asNumString(val)
        );
      }
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

  const actionButton = (
    <Button onClick={() => setStep(Steps.New_Transaction)}>
      {t('transactions.buttons.add')}
    </Button>
  );

  return (
    <Flex vertical gap={5} className="page-container transactions">
      <Typography.Title level={2} className="page-title">{t('pages.transactions')}</Typography.Title>

      {!step && (
        <EditTable
          editable
          totals
          type={filterState.transactionsType}
          filterState={filterState}
          setFilterState={setFilterState}
          actionButton={actionButton}
          onEditMode={onEdit}
          removeHandler={onRemove}
          tableProps={{
            columns,
            scroll: {
              x: 800
            },
          }}
        />
      )}
      {(step && step === Steps.New_Transaction) && (
        <NewTransaction
          onFinish={onFinish}
          categories={categories}
          newInvoiceCategoryId={newTransCategory_idFromCategories}
          isLoading={categoriesLoading}
          onBack={onBack}
        />
      )}
      {(step && step === Steps.Update_Transaction) && (
        <NewTransaction
          onFinish={onFinish}
          categories={categories}
          transaction={selectedTransaction}
          isLoading={categoriesLoading}
          onBack={onBack}
        />
      )}
    </Flex>
  );
};

export default Transactions;