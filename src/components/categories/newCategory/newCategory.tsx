import { useState } from "react";
import { useTranslation } from "react-i18next";
import CategoryModel from "../../../models/category-model";
import { Button, Divider, Flex, Form, Input, Space, Typography } from "antd";
import "./newCategory.css";

interface NewCategoryProps {
  category?: Partial<CategoryModel>;
  onFinish: (values: Partial<CategoryModel>) => void;
  onBack: () => void;
  isLoading?: boolean;
};

const NewCategory = (props: NewCategoryProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState<Partial<CategoryModel>>({
    _id: props.category?._id || null,
    name: props.category?.name || null,
  });
  const isUpdate = !!props.category;

  return (
    <Flex vertical align="center">
      <Typography.Title level={3} className="text-center">{isUpdate ? t('categories.form.titleUpdate') : t('categories.form.titleNew')}</Typography.Title>
      <Divider />

      <Form
        form={form}
        initialValues={initialValues}
        onFinish={() => props.onFinish(initialValues)}
        className="insert-form"
        labelAlign="left"
      >
        <Form.Item
          label={t('categories.form.name')}
          name={'name'}
          rules={[{ required: true, message: t('categories.form.nameRequired')}]}
        >
          <Input onChange={(e) => setInitialValues({...initialValues, name: e.target.value})} />
        </Form.Item>

        <Form.Item label={null} style={{ justifySelf: 'center' }}>
          <Space size={"middle"}>
            <Button type="primary" htmlType="submit" loading={props.isLoading}>{t('common.buttons.submit')}</Button>
            <Button type="primary" danger onClick={props?.onBack}>{t('common.buttons.cancel')}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default NewCategory;