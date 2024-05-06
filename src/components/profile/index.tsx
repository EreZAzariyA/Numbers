import { Col, Form, Input, Row } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);

  const verifiedEmail = user.emails.find((email) => (email.isValidate || email.isActive));
  const initialValues = {
    ...user,
    emails: {
      email: verifiedEmail?.email
    }
  };

  return (
    <div className="page-container profile">
      <div className="title-container">
        <div className="page-title">{t('pages.profile')}</div>
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
        <Form.Item wrapperCol={{ span: 16 }} label="Email" name={['emails', 'email']}>
          <Input disabled />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;