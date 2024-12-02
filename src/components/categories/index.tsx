import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import NewCategory from "./newCategory/newCategory";
import { EditTable } from "../components/EditTable";
import { Filters } from "../components/Filters";
import CategoryModel from "../../models/category-model";
import { addCategoryAction, removeCategoryAction, updateCategoryAction } from "../../redux/actions/category-actions";
import { asNumString, getError, getTransactionsByCategory, isArrayAndNotEmpty } from "../../utils/helpers";
import { TransactionStatusesType } from "../../utils/transactions";
import { App, Button, Pagination, Row, Space, TablePaginationConfig, TableProps, Tooltip } from "antd";
import { Dayjs } from "dayjs";

enum Steps {
  New_Category = "New_Category",
  Update_Category = "Update_Category"
};

const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { categories, loading: isLoading } = useAppSelector((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState<Partial<CategoryModel>>(null);
  const [step, setStep] = useState<string>(null);
  const [filterState, setFilterState] = useState({
    name: null,
  });
  const [pagination, setPagination] = useState<Pick<TablePaginationConfig, "current" | "pageSize">>({
    current: 1,
    pageSize: 10,
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

  const handleFilterChange = (field: string, value: string | number[] | Dayjs[]) => {
    setFilterState({...filterState, [field]: value});
  };

  const resetFilters = () => {
    setFilterState({
      name: null,
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
      const transactions = getTransactionsByCategory(category._id, TransactionStatusesType.COMPLETED) || [];

      let totalAmount = 0;
      transactions.forEach((t) => {
        totalAmount += t.amount;
      });

      return {
        ...category,
        spent: totalAmount,
        transactions: transactions.length
      };
    }).sort((a, b) => (Math.abs(b.spent) - Math.abs(a.spent)));
  };

  const filtered = categoriesFiltering(categories);

  const dataSource = [...filtered].slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  };

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
      )
    },
  ];

  return (
    <div className="page-container categories">
      <div className="title-container">
        <div className="page-title">{t('pages.categories')}</div>
        {step && (
          <Button className="btn-18" type="text" size="small" onClick={onBack}>Back</Button>
        )}
      </div>

      <div className="page-inner-container">
        {!step && (
          <Space direction="vertical" className="w-100">
            <div className="filter">
              <Filters
                type="categories"
                categoryText
                filterState={filterState}
                handleFilterChange={handleFilterChange}
                resetFilters={resetFilters}
              />
            </div>
            <EditTable
              editable
              type="categories"
              onEditMode={onEdit}
              removeHandler={onRemove}
              tableProps={{
                dataSource,
                columns,
                rowKey: '_id',
                scroll: { x: 600 },
                bordered: true,
                loading: isLoading,
                pagination: false,
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
      </div>
    </div>
  );
};

export default CategoriesPage;