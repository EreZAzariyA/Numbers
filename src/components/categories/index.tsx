import { useState } from "react";
import { Button, Col, Input, Row, Space, TableProps, message } from "antd";
import NewCategory from "./newCategory/newCategory";
import CategoryModel from "../../models/category-model";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { getError, isArrayAndNotEmpty } from "../../utils/helpers";
import { EditTable } from "../components/EditTable";
import { useTranslation } from "react-i18next";
import { addCategoryAction, removeCategoryAction, updateCategoryAction } from "../../redux/actions/categories";

enum Steps {
  New_Category = "New_Category",
  Update_Category = "Update_Category"
};

const CategoriesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => (state.auth.user));
  const { categories, loading } = useSelector((state: RootState) => (state.categories));
  const [selectedCategory, setSelectedCategory] = useState<CategoryModel>(null);
  const [step, setStep] = useState<string>(null);
  const [filterState, setFilterState] = useState({
    category: '',
  });

  const onBack = () => {
    setStep(null);
    setSelectedCategory(null);
  };

  const onEdit = (record: CategoryModel) => {
    setSelectedCategory(record);
    setStep(Steps.Update_Category);
  };

  const onFinish = async (values: CategoryModel) => {
    if (!user) {
      message.error("User id is missing");
      return;
    }

    try {
      let result = null;
      let msg = null;

      if (selectedCategory) {
        result = await dispatch(updateCategoryAction({
          category: values,
          user_id: user._id
        }));

        if (updateCategoryAction.fulfilled.match(result)) {
          msg = `Category: ${result.payload.name} updated successfully`
        }
      } else {
        result = await dispatch(addCategoryAction({
          categoryName: values.name,
          user_id: user._id
        }));

        if (addCategoryAction.fulfilled.match(result)) {
          msg = `Category: ${result.payload.name} added successfully`
        }
      }

      message.success(msg);
      onBack();
    } catch (error: any) {
      console.log(error);
      message.error(getError(error));
    }
  };

  const onRemove = async (record_id: string): Promise<void> => {
    try {
      await dispatch(removeCategoryAction({
        category_id: record_id,
        user_id: user._id
      }));

      message.success('Category removed...');
    } catch (err: any) {
      message.error(getError(err));
    }
  };

  const resetFilters = () => {
    setFilterState({ category: null });
  };

  const filtering = (categories: CategoryModel[] = []) => {
    if (!isArrayAndNotEmpty(categories)) {
      return [];
    }

    let data = [...categories];

    if (filterState.category) {
      data = data.filter((d) => d.name.toLowerCase().startsWith(filterState.category.toLowerCase()));
    }

    return data;
  };
  const dataSource = filtering(categories);

  const columns: TableProps<CategoryModel>['columns'] = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      fixed: 'left'
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
                    placeholder={t('placeholders.1')}
                    allowClear
                    value={filterState.category}
                    onChange={(e) => setFilterState({...filterState, category: e.target.value})}
                  />
                </Col>
                <Col>
                  <Button className="reset-btn" onClick={resetFilters}>Reset</Button>
                </Col>
              </Row>
            </div>
            <EditTable
              type="categories"
              onEditMode={onEdit}
              removeHandler={onRemove}
              tableProps={{
                dataSource,
                columns,
                rowKey: '_id',
                loading: loading
              }}
            />
            <Button onClick={() => setStep(Steps.New_Category)}>
              Add Category
            </Button>
          </Space>
        )}
        {(step && step === Steps.New_Category) && (
          <NewCategory
            onFinish={onFinish}
            isLoading={loading}
          />
        )}
        {(step && step === Steps.Update_Category) && (
          <NewCategory
            onFinish={onFinish}
            category={selectedCategory}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;