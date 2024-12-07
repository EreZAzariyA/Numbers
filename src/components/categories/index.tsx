import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dayjs } from "dayjs";
import transactionsServices from "../../services/transactions";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { addCategoryAction, removeCategoryAction, updateCategoryAction } from "../../redux/actions/category-actions";
import TransactionModel from "../../models/transaction";
import CategoryModel from "../../models/category-model";
import NewCategory from "./newCategory/newCategory";
import CategoryTransactionsModal from "./CategoryTransactionsModal";
import { Filters } from "../components/Filters";
import { TransactionStatusesType } from "../../utils/transactions";
import { asNumString, getError, getTransactionsByCategory, isArrayAndNotEmpty, queryFiltering } from "../../utils/helpers";
import { App, Button, Divider, Flex, Pagination, Popconfirm, Row, Space, Table, TablePaginationConfig, TableProps, Tooltip, Typography } from "antd";

enum Steps {
  New_Category = "New_Category",
  Update_Category = "Update_Category"
};

const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { message, modal } = App.useApp();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { categories, loading: isLoading } = useAppSelector((state) => state.categories);
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Partial<CategoryModel>>(null);
  const [step, setStep] = useState<string>(null);

  const [filterState, setFilterState] = useState({
    name: null,
  });
  const [pagination, setPagination] = useState<Pick<TablePaginationConfig, "current" | "pageSize">>({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    const dispatchTransactions = async () => {
      const query = queryFiltering({ status: TransactionStatusesType.COMPLETED });
      const { transactions } = await  transactionsServices.fetchTransactions(user._id, null, query);
      setTransactions(transactions);
    }

    dispatchTransactions();
  }, [user._id]);

  const onBack = () => {
    setStep(null);
    setSelectedCategory(null);
  };

  const onEdit = (record: Partial<CategoryModel>): void => {
    setSelectedCategory(record);
    setStep(Steps.Update_Category);
  };

  const onFinish = async (values: Partial<CategoryModel>) => {
    let successMessage = '';

    try {
      if (selectedCategory) {
        await dispatch(updateCategoryAction({
          category: values,
          user_id: user?._id
        })).unwrap();
        successMessage = `Category: ${values.name} updated successfully`
      } else {
        await dispatch(addCategoryAction({
          categoryName: values.name,
          user_id: user?._id
        })).unwrap();
        successMessage = `Category: ${values.name} added successfully`;
      }

      message.success(successMessage);
      onBack();
    } catch (error: any) {
      console.log({error});
      message.error(getError(error));
    }
  };

  const onRemove = async (record_id: string): Promise<void> => {
    try {
      await dispatch(removeCategoryAction({
        category_id: record_id,
        user_id: user._id
      })).unwrap();

      message.success('Category removed...');
    } catch (err: any) {
      message.error(err);
    }
  };

  const handleFilterChange = (field: string, value: string | boolean | number[] | Dayjs | Dayjs[] | CategoryModel[]) => {
    setFilterState({...filterState, [field]: value});
  };

  const resetFilters = () => {
    setFilterState({
      name: null,
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  };

  const showModal = (record: CategoryModel) => {
    modal.info({
      icon: null,
      closable: true,
      maskClosable: true,
      destroyOnClose: true,
      style: { top: 20 },
      width: 500,
      content: <CategoryTransactionsModal category={record} />,
      footer: null
    });
  };

  const categoriesFiltering = (categories: CategoryModel[] = []) => {
    if (!isArrayAndNotEmpty(categories)) {
      return [];
    }

    let data = [...categories];

    if (filterState.name) {
      data = [...data].filter((d) => d.name.toLowerCase().startsWith(filterState.name.toLowerCase()));
    }

    return data.map((category) => {
      const categoryTransactions = getTransactionsByCategory(category._id, transactions) || [];

      let totalAmount = 0;
      categoryTransactions.forEach((t) => {
        totalAmount += t.amount;
      });

      return {
        ...category,
        spent: totalAmount,
        transactions: categoryTransactions.length
      };
    }).sort((a, b) => (Math.abs(b.spent) - Math.abs(a.spent)));
  };

  const filtered = categoriesFiltering(categories);
  const dataSource = [...filtered].slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const columns: TableProps<CategoryModel>['columns'] = [
    {
      title: t('categories.table.header.category'),
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 60,
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
      title: t('categories.table.header.total-spent'),
      dataIndex: 'spent',
      key: 'spent',
      width: 70,
      ellipsis: {
        showTitle: false
      },
      render: (value, record: any) => (
        <Tooltip title={value}>
          {`(${record.transactions}) ${asNumString(value)}`}
        </Tooltip>
      ),
    },
    {
      title: t('transactions.table.header.actions'),
      key: 'action',
      width: 200,
      render: (_: any, record: CategoryModel) => (
        <Space split={<Divider type="vertical" />}>
          <Typography.Link onClick={() => showModal(record)}>
            {t('actions.0')}
          </Typography.Link>
          <Typography.Link href={`/transactions/#${record._id}`}>
            {t('actions.1')}
          </Typography.Link>
          <Typography.Link onClick={() => onEdit(record)}>
            {t('actions.2')}
          </Typography.Link>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onRemove(record?._id)}
          >
            <Typography.Link>
              {t('actions.3')}
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <Flex vertical gap={5} className="page-container categories">
      <Flex align="center" justify="space-between">
        <Typography.Title level={2} className="page-title">{t('pages.categories')}</Typography.Title>
        {step && (
          <Button danger type="link" size="small" onClick={onBack}>Back</Button>
        )}
      </Flex>

      {!step && (
        <Space direction="vertical" size={"middle"}>
          <Filters
            type="categories"
            categoryText
            filterState={filterState}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            loading={isLoading}
            pagination={false}
            scroll={{
              x: 650
            }}
          />
          <Row justify={'space-between'}>
            <Button onClick={() => setStep(Steps.New_Category)}>
              {t('categories.buttons.add')}
            </Button>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={filtered.length || 0}
              onChange={handlePageChange}
            />
          </Row>
        </Space>
      )}
      {(step && step === Steps.New_Category) && (
        <NewCategory
          onFinish={onFinish}
          isLoading={isLoading}
        />
      )}
      {(step && step === Steps.Update_Category) && (
        <NewCategory
          onFinish={onFinish}
          category={selectedCategory}
          isLoading={isLoading}
        />
      )}
    </Flex>
  );
};

export default CategoriesPage;