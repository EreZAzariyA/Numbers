import dayjs from "dayjs";
import { useState } from "react";
import CategoryModel from "../../../models/category-model";
import { Button, DatePicker, DatePickerProps, Divider, Flex, Form, InputNumber, Select, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { DefaultOptionType } from "antd/es/select";
import { TransactionsType } from "../../../utils/transactions";
import { MainTransaction } from "../../../services/transactions";

interface NewTransactionProps<T> {
  transaction?: T;
  categories?: CategoryModel[];
  type: TransactionsType;
  onFinish: (values: T) => void;
  onBack: () => void;
  newInvoiceCategoryId?: string;
  isLoading?: boolean;
};

const NewTransaction = <T extends MainTransaction>(props: NewTransactionProps<T>) => {
  const [form] = Form.useForm();

  const options: DefaultOptionType[] = [...props.categories || []].map((category) => ({
    label: category.name,
    value: category._id
  }));
  const typeOptions: DefaultOptionType[] = [
    {
      label: 'Transactions',
      value: TransactionsType.ACCOUNT
    },
    {
      label: 'Credit Card',
      value: TransactionsType.CARD_TRANSACTIONS
    }
  ];

  return (
    <Flex vertical align="center">
      <Typography.Title level={3} className="text-center">{props.transaction?._id ? 'Update' : 'New'} Transaction</Typography.Title>
      <Divider />
      <Form
        form={form}
        initialValues={{ ...props.transaction, date: dayjs(props.transaction?.date), type: props.type }}
        onFinish={props.onFinish}
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
          <DatePicker allowClear style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Category"
          name={'category_id'}
          rules={[{ required: true, message: 'Category is required' }]}
        >
          <Select
            options={options}
            placeholder="Select Category"
          />
        </Form.Item>

        <Form.Item
          label="Type"
          name={'type'}
          rules={[{ required: true, message: 'Type is required' }]}
        >
          <Select
            options={typeOptions}
            placeholder="Select type"
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
            placeholder="Enter Description"
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