import { Button, Form, Input, Space } from "antd";
import "./newCategory.css";
import { useState } from "react";
import CategoryModel from "../../../models/category-model";

interface NewCategoryProps {
  category?: CategoryModel;
  onFinish: (values: CategoryModel) => void;
};

const NewCategory = (props: NewCategoryProps) => {
  const [form] = Form.useForm();

  const [initialValues, setInitialValues] = useState<CategoryModel>({
    _id: props.category?._id || '',
    user_id: props.category?.user_id || '',
    name: props.category?.name || '',
  });

  return (
    <div className="inner-page new-invoice-page">
      <Space direction="vertical" className="w-100">
        <div className="inner-page-title">New Category</div>
        <Form
          form={form}
          initialValues={initialValues}
          onFinish={() => props.onFinish(initialValues)}
        >
          <Form.Item label="Name" name={'name'}>
            <Input onChange={(e) => setInitialValues({...initialValues, name: e.target.value})} />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default NewCategory;