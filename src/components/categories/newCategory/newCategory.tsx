import { Button, Col, Form, Input, Row, Space } from "antd";
import "./newCategory.css";
import { useState } from "react";
import CategoryModel from "../../../models/category-model";

interface NewCategoryProps {
  category?: Partial<CategoryModel>;
  onFinish: (values: Partial<CategoryModel>) => void;
  isLoading?: boolean;
};

const NewCategory = (props: NewCategoryProps) => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState<Partial<CategoryModel>>({
    _id: props.category?._id || null,
    name: props.category?.name || null,
  });
  const isUpdate = !!props.category;

  return (
    <div className="inner-page new-category-page">
      <Space direction="vertical" className="w-100">
        <Row justify={'center'}>
          <Col span={24}>
            <div className="inner-page-title">{`${isUpdate ? 'Update' : 'New'} Category`}</div>
          </Col>
        </Row>

        <Row justify={'center'}>
          <Col span={16}>
            <Form
              form={form}
              initialValues={initialValues}
              onFinish={() => props.onFinish(initialValues)}
              className="insert-form add-category-form"
            >
              <Form.Item
                label="Name"
                name={'name'}
                rules={[{ required: true, message: 'Please enter category for transactions'}]}
              >
                <Input onChange={(e) => setInitialValues({...initialValues, name: e.target.value})} />
              </Form.Item>

              <Form.Item>
                <Button htmlType="submit" loading={props.isLoading}>Submit</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default NewCategory;