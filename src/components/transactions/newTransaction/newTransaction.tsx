import dayjs from "dayjs";
import { useState } from "react";
import CategoryModel from "../../../models/category-model";
import TransactionModel from "../../../models/transaction";
import { Button, DatePicker, DatePickerProps, Divider, Flex, Form, InputNumber, Select, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { DefaultOptionType } from "antd/es/select";

interface NewTransactionProps {
  transaction?: TransactionModel;
  categories?: CategoryModel[];
  onFinish: (values: TransactionModel) => void;
  onBack: () => void;
  newInvoiceCategoryId?: string;
  isLoading?: boolean;
};

const NewTransaction = (props: NewTransactionProps) => {
  const [form] = Form.useForm();

  const [initialValues, setInitialValues] = useState<TransactionModel>({
    ...props.transaction,
    category_id: props.newInvoiceCategoryId,
    date: dayjs(props.transaction?.date) || null,
  });

  const onChange: DatePickerProps['onChange'] = (_, dateString) => {
    handleChange('date', dateString);
  };

  const handleChange = (field: string, value: any) => {
    setInitialValues({ ...initialValues, [field]: value });
  };

  const options: DefaultOptionType[] = [...props.categories].map((category) => ({
    label: category.name,
    value: category._id
  }));

  return (
    <Flex vertical align="center">
      <Typography.Title level={3} className="text-center">{props.transaction?._id ? 'Update' : 'New'} Transaction</Typography.Title>
      <Divider />
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={() => props.onFinish(initialValues)}
        className="insert-form"
        labelAlign="left"
        wrapperCol={{ xs: 16 }}
        labelCol={{ xs: 8 }}
      >
        <Form.Item
          label="Date"
          name={'date'}
          rules={[{ required: true, message: 'Date is required' }]}
        >
          <DatePicker allowClear onChange={onChange} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Category"
          name={'category_id'}
          rules={[{ required: true, message: 'Category is required' }]}
        >
          <Select
            options={options}
            onChange={(e) => handleChange('category_id', e)}
            placeholder="Select category"
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name={'description'}
          rules={[
            { required: true, message: 'Description is required' },
            { min: 10, message: 'Please describe more' },
          ]}
        >
          <TextArea
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter description"
          />
        </Form.Item>

        <Form.Item
          label="Amount"
          name={'amount'}
          rules={[
            { required: true, message: 'Amount is required' },
          ]}
        >
          <InputNumber
            placeholder="0"
            onChange={(value) => handleChange('amount', value)}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
            style={{ minWidth: '100%' }}
          />
        </Form.Item>

        <Form.Item label={null} style={{ justifySelf: 'center' }}>
          <Space size={"middle"}>
            <Button type="primary" htmlType="submit" loading={props.isLoading || false}>Submit</Button>
            <Button type="primary" danger onClick={props?.onBack}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default NewTransaction;