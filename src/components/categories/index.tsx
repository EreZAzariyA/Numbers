import { useState } from "react";
import { App, Button, Col, Divider, Input, Popconfirm, Row, Space, Table, TableProps, Typography } from "antd";
import NewCategory from "./newCategory/newCategory";
import CategoryModel from "../../models/category-model";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { getError, isArrayAndNotEmpty } from "../../utils/helpers";
import { useTranslation } from "react-i18next";
import { addCategoryAction, removeCategoryAction, updateCategoryAction } from "../../redux/actions/category-actions";
import { useNavigate } from "react-router-dom";

enum Steps {
  New_Category = "New_Category",
  Update_Category = "Update_Category"
};

const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    {
      title: 'Actions',
      key: 'action',
      width: 200,
      render: (_: any, record: any) => (
        <Row align={'middle'}>
          <Col>
            <Typography.Link onClick={() => onEdit(record)}>
              Edit
            </Typography.Link>
          </Col>
          <Divider type="vertical" />
          <Col>
            <Typography.Link onClick={() => navigate({ pathname: '/transactions', hash: record._id })}>
              Add transaction
            </Typography.Link>
          </Col>
          <Divider type="vertical" />
          <Col>
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => onRemove(record?._id)}
            >
              <Typography.Link>
                Delete
              </Typography.Link>
            </Popconfirm>
          </Col>
        </Row>
      ),
    }
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
            <Table
              dataSource={dataSource}
              columns={columns}
              rowKey={'_id'}
              loading={loading}
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