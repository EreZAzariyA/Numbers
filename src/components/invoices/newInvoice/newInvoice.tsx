import { Button, DatePicker, DatePickerProps, Form, InputNumber, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import Invoice from "../../../models/invoice";
import CategoryModel from "../../../models/category-model";
import { DefaultOptionType } from "antd/es/select";
import { useState } from "react";
import InvoiceModel from "../../../models/invoice";
import dayjs from "dayjs";

interface NewInvoiceProps {
  invoice?: Invoice;
  categories?: CategoryModel[];
  onFinish: (values: any) => void;
  newInvoiceCategoryId?: string;
};

const NewInvoice = (props: NewInvoiceProps) => {
  const [form] = Form.useForm();

  const [initialValues, setInitialValues] = useState<InvoiceModel>({
    _id: props.invoice?._id || null,
    user_id: props.invoice?.user_id || null,
    category_id: props.invoice?.category_id || props.newInvoiceCategoryId || '',
    description: props.invoice?.description || '',
    amount: props.invoice?.amount || null,
    date: dayjs(props.invoice?.date) || null
  })

  const options: DefaultOptionType[] = [...props.categories].map((category) => ({
    label: category.name,
    value: category._id
  }));

  const onChange: DatePickerProps['onChange'] = (value, dateString) => {
    handleChange('date', dateString);
  };

  const handleChange = (field: string, value: any) => {
    setInitialValues({...initialValues, [field]: value});
  };

  return (
    <div className="inner-page new-invoice-page">
      <Space direction="vertical" className="w-100">
        <div className="inner-page-title">New Invoice</div>

        <Form
          form={form}
          initialValues={initialValues}
          onFinish={() => props.onFinish(initialValues)}
        >
          <Form.Item label="Date" name={'date'} validateTrigger={null}>
            <DatePicker allowClear onChange={onChange} />
          </Form.Item>
          <Form.Item label="Category" name={'category_id'}>
            <Select
              options={options}
              onChange={(e) => handleChange('category_id', e)}
            />
          </Form.Item>
          <Form.Item label="Description" name={'description'}>
            <TextArea
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Amount" name={'amount'}>
            <InputNumber
              placeholder="0" 
              onChange={(e) => handleChange('amount', e)}
            />
          </Form.Item>
          
          <Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default NewInvoice;