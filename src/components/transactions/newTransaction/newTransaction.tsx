import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import CategoryModel from "../../../models/category-model";
import { Button, DatePicker, Divider, Flex, Form, InputNumber, Select, Space, Typography } from "antd";
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
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const options: DefaultOptionType[] = [...props.categories || []].map((category) => ({
    label: category.name,
    value: category._id
  }));
  const typeOptions: DefaultOptionType[] = [
    {
      label: t('transactions.transactionsType.transactions'),
      value: TransactionsType.ACCOUNT
    },
    {
      label: t('transactions.transactionsType.creditcards'),
      value: TransactionsType.CARD_TRANSACTIONS
    }
  ];

  return (
    <Flex vertical align="center">
      <Typography.Title level={3} className="text-center">{props.transaction?._id ? t('transactions.form.titleUpdate') : t('transactions.form.titleNew')}</Typography.Title>
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
          label={t('transactions.form.date')}
          name={'date'}
          rules={[{ required: true, message: t('transactions.form.dateRequired') }]}
        >
          <DatePicker allowClear style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('transactions.form.category')}
          name={'category_id'}
          rules={[{ required: true, message: t('transactions.form.categoryRequired') }]}
        >
          <Select
            options={options}
            placeholder={t('transactions.form.selectCategory')}
          />
        </Form.Item>

        <Form.Item
          label={t('transactions.form.type')}
          name={'type'}
          rules={[{ required: true, message: t('transactions.form.typeRequired') }]}
        >
          <Select
            options={typeOptions}
            placeholder={t('transactions.form.selectType')}
          />
        </Form.Item>

        <Form.Item
          label={t('transactions.form.description')}
          name={'description'}
          rules={[
            { required: true, message: t('transactions.form.descriptionRequired') },
            { min: 10, message: t('transactions.form.descriptionMin') },
          ]}
        >
          <TextArea
            placeholder={t('transactions.form.enterDescription')}
          />
        </Form.Item>

        <Form.Item
          label={t('transactions.form.amount')}
          name={'amount'}
          rules={[
            { required: true, message: t('transactions.form.amountRequired') },
          ]}
        >
          <InputNumber
            placeholder={t('transactions.form.placeholderAmount')}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
            style={{ minWidth: '100%' }}
          />
        </Form.Item>

        <Form.Item label={null} style={{ justifySelf: 'center' }}>
          <Space size={"middle"}>
            <Button type="primary" htmlType="submit" loading={props.isLoading || false}>{t('common.buttons.submit')}</Button>
            <Button type="primary" danger onClick={props?.onBack}>{t('common.buttons.cancel')}</Button>
          </Space>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default NewTransaction;