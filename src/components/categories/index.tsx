import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dayjs } from "dayjs";
import transactionsServices, { TransactionsResp } from "../../services/transactions";
import { useAppSelector } from "../../redux/store";
import CategoryModel from "../../models/category-model";
import NewCategory from "./newCategory/newCategory";
import CategoryTransactionsModal from "./CategoryTransactionsModal";
import { Filters } from "../components/Filters";
import { TransactionStatuses } from "../../utils/transactions";
import { asNumString, getError, getTransactionsByCategory, isArrayAndNotEmpty, queryFiltering } from "../../utils/helpers";
import { App, Button, Divider, Flex, message, Pagination, Popconfirm, Row, Space, Spin, Table, TablePaginationConfig, TableProps, Tooltip, Typography } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import categoriesServices from "../../services/categories";
import { useNavigate } from "react-router-dom";

enum Steps {
  New_Category = "New_Category",
  Update_Category = "Update_Category"
};

const CategoriesPage = () => {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const { modal } = App.useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState<Partial<CategoryModel>>(null);
  const [step, setStep] = useState<string>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', user?._id],
    queryFn: () => categoriesServices.fetchCategories(user?._id),
  });

  const query = queryFiltering({ status: TransactionStatuses.completed, });
  const { data: transResponse, isLoading: isTransactionsLoading } = useQuery<TransactionsResp>({
    queryKey: ['transactions'],
    queryFn: () => transactionsServices.fetchTransactions(user._id, query)
  });

  const [filterState, setFilterState] = useState({
    name: null,
  });
  const [pagination, setPagination] = useState<Pick<TablePaginationConfig, "current" | "pageSize">>({
    current: 1,
    pageSize: 10,
  });

  const updateCategory = useMutation<CategoryModel, unknown, { user_id: string, category: Partial<CategoryModel> }>({
    mutationKey: ['categories', user._id],
    mutationFn: ({ user_id, category }) => categoriesServices.updateCategory(user_id, category),
  });
  const addCategory = useMutation<CategoryModel, unknown, { user_id: string, categoryName: string }>({
    mutationKey: ['categories', user._id],
    mutationFn: ({ user_id, categoryName }) => categoriesServices.addCategory(user_id, categoryName),
  });
  const removeCategory = useMutation<void, unknown, { user_id: string, category_id: string }>({
    mutationKey: ['categories', user._id],
    mutationFn: ({ user_id, category_id }) => categoriesServices.removeCategory(user_id, category_id),
    onError(error, variables) {
      messageApi.error(`Error while trying to remove category id: ${variables.category_id}, ${JSON.stringify(error)}.`);
    },
    onSuccess(_, variables) {
      messageApi.success(`Category id: ${variables.category_id} removed successfully.`);
      queryClient.invalidateQueries({ queryKey: ['categories', user?._id] });
    },
  });

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
    const isUpdate = !!selectedCategory || step === Steps.Update_Category;
    let res: CategoryModel;

    try {
      if (isUpdate) {
        res = await updateCategory.mutateAsync({ user_id: user?._id, category: values });
      } else {
        res = await addCategory.mutateAsync({ user_id: user?._id, categoryName: values.name });
      }
      successMessage = `Category: ${res.name} ${isUpdate ? 'updated' : 'added'} successfully`;
      messageApi.success(successMessage);
      onBack();
    } catch (error: any) {
      console.log({error});
      messageApi.error(getError(error));
    }
  };

  const handleFilterChange = (field: string, value: string | boolean | number[] | Dayjs | Dayjs[] | CategoryModel[]) => {
    setFilterState({ ...filterState, [field]: value });
  };

  const resetFilters = () => {
    setFilterState({
      name: null,
    });
  };

  const showModal = (record: CategoryModel) => {
    modal.info({
      icon: null,
      closable: true,
      maskClosable: true,
      destroyOnClose: true,
      style: { top: 20 },
      width: 'min(80%, 500px)',
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
      const categoryTransactions = getTransactionsByCategory(category._id, transResponse?.transactions) || [];
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
      render: (value, record: any) => isTransactionsLoading ? (
        <Spin />
      ) : (
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
          <Typography.Link onClick={() => navigate('/transactions', { state: record._id })}>
            {t('actions.1')}
          </Typography.Link>
          <Typography.Link onClick={() => onEdit(record)}>
            {t('actions.2')}
          </Typography.Link>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => removeCategory.mutateAsync({ user_id: user._id, category_id: record?._id })}
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
      {contextHolder}
      <Typography.Title level={2} className="page-title">{t('pages.categories')}</Typography.Title>

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
            rowKey={'_id'}
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
              onChange={(page, size) => setPagination({ current: page, pageSize: size })}
            />
          </Row>
        </Space>
      )}
      {(step && step === Steps.New_Category) && (
        <NewCategory
          onFinish={onFinish}
          isLoading={isLoading}
          onBack={onBack}
        />
      )}
      {(step && step === Steps.Update_Category) && (
        <NewCategory
          onFinish={onFinish}
          category={selectedCategory}
          isLoading={isLoading}
          onBack={onBack}
        />
      )}
    </Flex>
  );
};

export default CategoriesPage;