import { Col, Divider, Flex, Form, Input, InputNumber, Row, Typography } from "antd";
import { useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { asNumString, getBanksTotal } from "../../utils/helpers";

const Profile = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const banks = useAppSelector((state) => state.userBanks.account?.banks);

  const verifiedEmail = user.emails.find((email) => (email.isValidate || email.isActive));
  const initialValues = {
    ...user,
    emails: {
      email: verifiedEmail?.email
    },
    current_balance: asNumString(getBanksTotal(banks)),
    currency: "NIS"
  };

  return (
    <Flex vertical gap={5} className="page-container profile">
      <div className="title-container">
        <Typography.Title level={2} className="page-title">{t('pages.profile')}</Typography.Title>
      </div>
      <Form initialValues={initialValues} layout="horizontal">
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label="First name" name={['profile', 'first_name']}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last name" name={['profile', 'last_name']}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item wrapperCol={{ span: 10 }} label="Email" name={['emails', 'email']}>
          <Input disabled />
        </Form.Item>

        <Divider />

        <Form.Item wrapperCol={{ span: 6 }} label="Current balance" name={'current_balance'}>
          <InputNumber disabled style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Profile;