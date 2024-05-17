import { Button, Col, DatePicker, DatePickerProps, Form, InputNumber, Row, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import CategoryModel from "../../../models/category-model";
import { DefaultOptionType } from "antd/es/select";
import { useState } from "react";
import InvoiceModel from "../../../models/invoice";
import dayjs from "dayjs";

interface NewInvoiceProps {
  invoice?: InvoiceModel;
  categories?: CategoryModel[];
  onFinish: (values: Partial<InvoiceModel>) => void;
  newInvoiceCategoryId?: string;
  isLoading?: boolean;
};

const NewInvoice = (props: NewInvoiceProps) => {
  const [form] = Form.useForm();

  const [initialValues, setInitialValues] = useState<Partial<InvoiceModel>>({
    _id: props.invoice?._id || null,
    user_id: props.invoice?.user_id || null,
    category_id: props.invoice?.category_id || props.newInvoiceCategoryId || null,
    description: props.invoice?.description || null,
    amount: props.invoice?.amount || null,
    date: dayjs(props.invoice?.date) || null,
  });

  const onChange: DatePickerProps['onChange'] = (value, dateString) => {
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
    <div className="inner-page new-invoice-page">
      <Space direction="vertical" className="w-100">
        <Row justify={'center'}>
          <Col>
            <div className="inner-page-title">New Invoice</div>
          </Col>
        </Row>

        <Row justify={'center'}>
          <Col span={16}>
            <Form
              form={form}
              initialValues={initialValues}
              onFinish={() => props.onFinish(initialValues)}
              className="insert-form add-invoice-form"
              labelAlign="left"
            >
              <Form.Item
                label="Date"
                name={'date'}
                rules={[{ required: true, message: 'Date is required' }]}
              >
                <DatePicker allowClear onChange={onChange} />
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

              <Form.Item>
                <Button htmlType="submit" loading={props.isLoading || false}>Submit</Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default NewInvoice;