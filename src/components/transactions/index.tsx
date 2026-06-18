import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import TransactionModel from "../../models/transaction";
import NewTransaction from "./newTransaction/newTransaction";
import { EditTable } from "../components/EditTable";
import { TransactionsType } from "../../utils/transactions";
import { asNumString, getError } from "../../utils/helpers";
import { App, Button, Flex, Spin, TableProps, Tooltip, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CardTransactionModel from "../../models/card-transaction";
import transactionsServices, { MainTransaction } from "../../services/transactions";
import { useCategories } from "../../hooks/useCategories";
import { useTransactionFilters } from "../../hooks/useTransactionFilters";

enum Steps {
  New_Transaction = "New_Transaction",
  Update_Transaction = "Update_Transaction",
};

const Transactions = <T extends MainTransaction>() => {
  const queryClient = useQueryClient();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const [selectedTransaction, setSelectedTransaction] = useState<T>(null);
  const [step, setStep] = useState<string>(location.state ? Steps.New_Transaction : null);
  const [filterState, setFilterState] = useTransactionFilters();
  const isCardTransactions = filterState.type === TransactionsType.CARD_TRANSACTIONS;
  const newTransCategory_idFromCategories = location.state;

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const categoriesMap = useMemo(() => new Map(categories.map((category) => [category._id, category])), [categories]);


  const updateTransaction = useMutation<MainTransaction, unknown, { user_id: string, transaction: MainTransaction, type: TransactionsType }>({
    mutationKey: ['transactions', user._id],
    mutationFn: ({ user_id, transaction, type }) => transactionsServices.updateTransaction(user_id, transaction, type),
  });
  const addTransaction = useMutation<MainTransaction, unknown, { user_id: string, transaction: MainTransaction, type: TransactionsType }>({
    mutationKey: ['transactions', user._id],
    mutationFn: ({ user_id, transaction, type }) => transactionsServices.addTransaction(user_id, transaction, type),
  });
  const removeTransaction = useMutation<void, unknown, { user_id: string, transaction_id: string, type: TransactionsType }>({
    mutationKey: ['transactions', user._id],
    mutationFn: ({ user_id, transaction_id, type }) => transactionsServices.removeTransaction(user_id, transaction_id, type),
  });

  const onFinish = async (transaction: T): Promise<void> => {
    if (!user) {
      message.error(t('transactions.messages.userIdMissing'));
      return;
    }

    try {
      let res: TransactionModel | CardTransactionModel;
      const isUpdate = step === Steps.Update_Transaction;

      if (isUpdate) {
        res = await updateTransaction.mutateAsync({ user_id: user._id, transaction, type: filterState.type });
      } else {
        res = await addTransaction.mutateAsync({ user_id: user._id, transaction, type: filterState.type });
      }

      message.success(t(`transactions.messages.${isUpdate ? 'updated' : 'added'}`, { id: res._id }));
      onBack();
    } catch (error: any) {
      console.log({error});
      message.error(error);
    }
  };

  const onBack = (): void => {
    setStep(null);
    setSelectedTransaction(null);
    if (newTransCategory_idFromCategories) {
      navigate('/transactions', { replace: true });
    }
  };

  const onEdit = (record: T): void => {
    setSelectedTransaction(record);
    setStep(Steps.Update_Transaction);
  };

  const onRemove = async (record_id: string): Promise<void> => {
    try {
      await removeTransaction.mutateAsync({ user_id: user._id, transaction_id: record_id, type: filterState.type });
      message.success(t('transactions.messages.removed', { id: record_id }));
      queryClient.invalidateQueries({ queryKey: ['transactions', user?._id] });
    } catch (err: any) {
      message.error(getError(err));
    }
  };

  const actionButton = (
    <Button type="primary" onClick={() => setStep(Steps.New_Transaction)}>
      {t('transactions.buttons.add')}
    </Button>
  );

  const columns: TableProps<T>['columns'] = [
    {
      title: t('transactions.table.header.date'),
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (text) => (
        <span>{new Date(text).toLocaleDateString()}</span>
      ),
      sorter: (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
      defaultSortOrder: 'ascend',
      fixed: 'left'
    },
    {
      title: t('transactions.table.header.category'),
      dataIndex: 'category_id',
      key: 'category',
      width: 130,
      ellipsis: {
        showTitle: false,
      },
      render: (value) => {
        if (categoriesLoading) return <Spin />
        const category = categoriesMap.get(value);

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
      render: (description, record) => {
        const val = `${description} ${(record as CardTransactionModel)?.memo || ''}`;
        return (
          <Tooltip title={val}>
            {val}
          </Tooltip>
        )
      }
    },
    ...(isCardTransactions ? [{
      title: t('transactions.table.header.chargedAmount'),
      dataIndex: 'chargedAmount',
      key: 'chargedAmount',
      width: 100,
      sorter: (a: T, b: T) => {
        if (a instanceof CardTransactionModel && b instanceof CardTransactionModel) {
          return (b.chargedAmount - a.chargedAmount)
        }
      },
      render: (val: number, record: T) => {
        const chargedAmount = asNumString(val || record?.amount);
        return <Tooltip title={chargedAmount}>{chargedAmount}</Tooltip>
      }
    }] : []),
    {
      title: t('transactions.table.header.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      sorter: (a, b) => (b.amount - a.amount),
      render: (val) => {
        const amount = asNumString(val);
        return <Tooltip title={amount}>{amount}</Tooltip>
      }
    },
    ...(isCardTransactions ? [{
      title: t('transactions.table.header.cardNumber'),
      dataIndex: 'cardNumber',
      key: 'cardNumber',
      width: 100,
      render: (val: number) => {
        return <Tooltip title={val}>{val}</Tooltip>
      }
    }] : []),
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
          {val ? t(`companies.${val}`) : ''}
        </Tooltip>
      )
    }
  ];

  const scopeLabel = filterState.dates
    ? `${filterState.dates[0].format('MMM D')} - ${filterState.dates[1].format('MMM D')}`
    : filterState.month
      ? filterState.month.format('MMM YYYY')
      : t('transactions.summary.allTime');
  const statusLabel = filterState.status ? t(`transactions.status.${filterState.status}`) : t('transactions.summary.allStatuses');
  const typeLabel = filterState.type === TransactionsType.CARD_TRANSACTIONS
    ? t('transactions.transactionsType.creditcards')
    : t('transactions.transactionsType.transactions');
  const incomeLabel = filterState.byIncome === 'income'
    ? t('transactions.summary.incomeOnly')
    : filterState.byIncome === 'spent'
      ? t('transactions.summary.spendingOnly')
      : t('transactions.summary.allCashMovement');

  return (
    <Flex vertical gap={5} className="page-container transactions">
      <div className="page-shell">
        <div className="page-heading">
          <div className="page-heading-copy">
            <div className="page-kicker">{t('transactions.kicker')}</div>
            <Typography.Title level={2} className="page-title">{t('pages.transactions')}</Typography.Title>
            <Typography.Text className="page-subtitle">
              {t('transactions.subtitle')}
            </Typography.Text>
          </div>
          <div className="page-toolbar">{actionButton}</div>
        </div>

        <div className="page-stat-grid">
          <div className="page-stat-card">
            <span className="page-stat-label">{t('transactions.summary.scope')}</span>
            <span className="page-stat-value">{scopeLabel}</span>
            <span className="page-stat-caption">{t('transactions.summary.scopeCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('transactions.summary.status')}</span>
            <span className="page-stat-value">{statusLabel}</span>
            <span className="page-stat-caption">{t('transactions.summary.statusCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('transactions.summary.type')}</span>
            <span className="page-stat-value">{typeLabel}</span>
            <span className="page-stat-caption">{t('transactions.summary.typeCaption')}</span>
          </div>
          <div className="page-stat-card">
            <span className="page-stat-label">{t('transactions.summary.cashLens')}</span>
            <span className="page-stat-value">{incomeLabel}</span>
            <span className="page-stat-caption">{t('transactions.summary.cashLensCaption')}</span>
          </div>
        </div>
      </div>

      {!step && (
        <div className="page-card">
          <EditTable
            editable
            totals
            filterState={filterState}
            setFilterState={setFilterState}
            actionButton={null}
            onEditMode={onEdit}
            removeHandler={onRemove}
            tableProps={{
              bordered: true,
              columns,
              scroll: {
                x: 800,
              },
            }}
          />
        </div>
      )}
      {(step && step === Steps.New_Transaction) && (
        <NewTransaction
          onFinish={onFinish}
          categories={categories}
          newInvoiceCategoryId={newTransCategory_idFromCategories}
          isLoading={categoriesLoading}
          onBack={onBack}
          type={filterState.type}
        />
      )}
      {(step && step === Steps.Update_Transaction) && (
        <NewTransaction
          onFinish={onFinish}
          categories={categories}
          transaction={selectedTransaction}
          isLoading={categoriesLoading}
          onBack={onBack}
          type={filterState.type}
        />
      )}
    </Flex>
  );
};

export default Transactions;
