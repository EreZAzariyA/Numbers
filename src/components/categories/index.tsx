import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import NewCategory from "./newCategory/newCategory";
import CategoryModel from "../../models/category-model";
import { addCategoryAction, removeCategoryAction, updateCategoryAction } from "../../redux/actions/category-actions";
import { asNumString, getError, getTransactionsByCategory, isArrayAndNotEmpty } from "../../utils/helpers";
import { App, Button, Col, Input, Row, Space, TableProps, Tooltip } from "antd";
import { EditTable } from "../components/EditTable";

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
  const [filterState, setFilterState] = useState<Partial<CategoryModel>>({
    name: '',
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

  const resetFilters = () => {
    setFilterState({ name: null });
  };

  const filtering = (categories: CategoryModel[] = []) => {
    if (!isArrayAndNotEmpty(categories)) {
      return [];
    }

    let data = [...categories];

    if (filterState.name) {
      data = data.filter((d) => d.name.toLowerCase().startsWith(filterState.name.toLowerCase()));
    }

    return data;
  };
  const dataSource = filtering(categories);

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
      render: (_, record) => {
        const transactions = getTransactionsByCategory(record._id);
        let totalAmount = 0;
        transactions.forEach((t) => {
          totalAmount += t.amount;
        });
        const value = `${asNumString(totalAmount)} (${transactions.length})`;
        return (
          <Tooltip title={value}>
            {value}
          </Tooltip>
        );
      }
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
              <Row gutter={[10, 10]} wrap={false}>
                <Col>
                  <Input
                    type="text"
                    placeholder={t('filters.placeholders.1')}
                    allowClear
                    value={filterState.name}
                    onChange={(e) => setFilterState({ ...filterState, name: e.target.value })}
                  />
                </Col>
                <Col>
                  <Button className="reset-btn" onClick={resetFilters}>
                    {t('filters.reset')}
                  </Button>
                </Col>
              </Row>
            </div>
            <EditTable
              type="categories"
              onEditMode={onEdit}
              removeHandler={onRemove}
              tableProps={{
                dataSource,
                rowKey: '_id',
                columns,
                scroll: { x: 800 },
                bordered: true,
                loading: isLoading,
              }}
            />
            <Button onClick={() => setStep(Steps.New_Category)}>
              {t('categories.buttons.add')}
            </Button>
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