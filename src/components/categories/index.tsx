import { useEffect, useState } from "react";
import { DataType } from "../../utils/types";
import { Button, Col, Input, Row, Space, TableProps, message } from "antd";
import NewCategory from "./newCategory/newCategory";
import CategoryModel from "../../models/category-model";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import categoriesServices from "../../services/categories";
import { asNumString, getError, getInvoicesTotalsPrice } from "../../utils/helpers";
import { EditTable } from "../components/EditTable";
import { useTranslation } from "react-i18next";

enum Steps {
  New_Category = "New_Category",
  Update_Category = "Update_Category"
};

const CategoriesPage = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => (state.auth.user));
  const categories = useSelector((state: RootState) => (state.categories));
  const invoices = useSelector((state: RootState) => (state.invoices));
  const [dataSource, setDataSource] = useState<CategoryModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryModel>(null);
  const [step, setStep] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterState, setFilterState] = useState({
    category: '',
  });

  useEffect(() => {
    let data = [...categories];
    if (filterState.category) {
      data = data.filter((d) => d.name.toLowerCase().startsWith(filterState.category.toLowerCase()));
    }

    data = data.map((data) => {
      const categoryInvoices = invoices.filter((i) => i.category_id === data._id);
      const total = getInvoicesTotalsPrice(categoryInvoices);

      return {
        ...data,
        total: asNumString(total.spent)
      }
    });

    setDataSource(data);
  }, [filterState, categories]);

  const onBack = () => {
    setStep(null);
    setSelectedCategory(null);
  };

  const onEdit = (record: CategoryModel) => {
    setSelectedCategory(record);
    setStep(Steps.Update_Category);
  };

  const onFinish = async (category: CategoryModel) => {
    if (!user) {
      message.error("User id is missing");
      return;
    }

    setIsLoading(true);
    try {
      let res = null;
      let msg = '';
      if (selectedCategory) {
        res = await categoriesServices.updateCategory(category, user._id);
        msg = 'Updated category successfully';
        console.log('to update');
      } else {
        console.log('to add');
        res = await categoriesServices.addCategory(category, user._id);
        msg = 'Category added successfully'
      }
      if (res) {
        message.success(msg);
        onBack();
      }
    } catch (error: any) {
      console.log(error);
      message.error(getError(error));
    }
    setIsLoading(false);
  };

  const onRemove = async (record_id: string): Promise<void> => {
    try {
      await categoriesServices.removeCategory(record_id);
      message.success('Category removed...');
    } catch (err: any) {
      message.error(getError(err));
    }
  };

  const resetFilters = () => {
    setFilterState({ category: null });
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Category',
      dataIndex: 'name',
      key: 'name',
      width: 80,
      fixed: 'left'
    },
    {
      title: 'Expected spent amount',
      dataIndex: 'expectedSpent',
      key: 'expectedSpent',
      width: 80,
    },
    {
      title: 'Current spent amount',
      dataIndex: 'total',
      key: 'total'
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
              dataSource={dataSource}
              columns={columns}
              type="categories"
              rowKey="_id"
              onEditMode={onEdit}
              removeHandler={onRemove}
            />
            <Button onClick={() => setStep(Steps.New_Category)}>
              Add Category
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