import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Button, DatePicker, Form, InputNumber, Space, Input } from "antd";
import { SavingsGoalModel } from "../../utils/types";

interface SavingsGoalFormProps {
  goal?: Partial<SavingsGoalModel>;
  isLoading: boolean;
  onFinish: (values: Partial<SavingsGoalModel>) => void;
  onBack: () => void;
}

const SavingsGoalForm = ({ goal, isLoading, onFinish, onBack }: SavingsGoalFormProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const initialValues = goal
    ? { ...goal, targetDate: goal.targetDate ? dayjs(goal.targetDate) : undefined }
    : { currentAmount: 0 };

  const handleFinish = (values: any) => {
    onFinish({
      ...values,
      _id: goal?._id,
      targetDate: values.targetDate ? values.targetDate.format('YYYY-MM-DD') : undefined,
    });
  };

  return (
    <div className="page-card" style={{ maxWidth: 500 }}>
      <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label={t('savingsGoals.form.name')}
          rules={[{ required: true, message: t('savingsGoals.form.nameRequired') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="targetAmount"
          label={t('savingsGoals.form.targetAmount')}
          rules={[{ required: true, message: t('savingsGoals.form.targetRequired') }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} prefix="₪" />
        </Form.Item>

        <Form.Item name="currentAmount" label={t('savingsGoals.form.currentAmount')}>
          <InputNumber min={0} style={{ width: '100%' }} prefix="₪" />
        </Form.Item>

        <Form.Item
          name="targetDate"
          label={t('savingsGoals.form.targetDate')}
          rules={[{ required: true, message: t('savingsGoals.form.dateRequired') }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(d) => d.isBefore(dayjs(), 'day')}
            format="MMM YYYY"
            picker="month"
          />
        </Form.Item>

        <Space>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {t('savingsGoals.buttons.save')}
          </Button>
          <Button onClick={onBack}>
            {t('savingsGoals.buttons.cancel')}
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default SavingsGoalForm;
