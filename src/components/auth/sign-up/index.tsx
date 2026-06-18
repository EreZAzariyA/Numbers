import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../../../redux/store";
import UserModel from "../../../models/user-model";
import { googleSignInAction, signupAction } from "../../../redux/actions/auth-actions";
import { App, Button, Card, Col, Divider, Form, Input, Row, Typography } from "antd";
import Logo from "../../components/logo/logo";
import "../auth.css";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  const onFinish = async (values: UserModel) => {
    try {
      await dispatch(signupAction(values)).unwrap();
      message.success(t('auth.signUp.success'));
      navigate('/auth/sign-in');
    } catch (err: any) {
      message.error(err);
    }
  };

  const onGoogleSignUpSuccess = async (tokenResponse: CredentialResponse) => {
    try {
      await dispatch(googleSignInAction(tokenResponse)).unwrap();
      message.success(t('auth.signUp.googleSuccess'));
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <Card className="auth-card auth-card-wide" bordered={false}>
      <Logo />
      <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 24 }}>
        <Typography.Title level={3} style={{ color: '#fff', marginBottom: 4 }}>
          {t('auth.signUp.title')}
        </Typography.Title>
        <Typography.Text style={{ color: 'rgba(255,255,255,0.55)' }}>
          {t('auth.signUp.subtitle')}
        </Typography.Text>
      </div>

      <Form
        onFinish={onFinish}
        layout="vertical"
        labelAlign="left"
        scrollToFirstError
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('auth.form.firstName.label')}
              name={['profile', 'first_name']}
              rules={[
                { required: true, message: t('auth.form.firstName.required') },
                { min: 3, message: t('auth.form.firstName.min') },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('auth.form.lastName.label')}
              name={['profile', 'last_name']}
              rules={[
                { required: true, message: t('auth.form.lastName.required') },
                { min: 3, message: t('auth.form.lastName.min') },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('auth.form.email.label')}
          name={['emails', 'email']}
          rules={[
            { required: true, message: t('auth.form.email.required') },
            { pattern: emailRegex, message: t('auth.form.email.invalid') },
          ]}
        >
          <Input type="email" size="large" placeholder={t('auth.form.email.placeholder')} />
        </Form.Item>

        <Form.Item
          label={t('auth.form.password.label')}
          name={['services', 'password']}
          rules={[
            { required: true, message: t('auth.form.password.required') },
            { min: 6, message: t('auth.form.password.min') },
          ]}
        >
          <Input.Password size="large" placeholder={t('auth.form.password.placeholder')} />
        </Form.Item>

        <Form.Item
          name="confirm"
          label={t('auth.form.confirmPassword.label')}
          dependencies={[['services', 'password']]}
          hasFeedback
          rules={[
            { required: true, message: t('auth.form.confirmPassword.required') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue(['services', 'password']) === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('auth.form.confirmPassword.mismatch')));
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder={t('auth.form.password.placeholder')} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          style={{ marginTop: 4 }}
        >
          {t('auth.signUp.button')}
        </Button>
      </Form>

      <Divider style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>
        {t('auth.signIn.or')}
      </Divider>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={onGoogleSignUpSuccess}
          onError={() => message.error(t('auth.signUp.error'))}
          shape="pill"
          theme="filled_blue"
          text="signup_with"
          size="large"
          width={300}
        />
      </div>

      <Typography.Text style={{ display: 'block', textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.5)' }}>
        {t('auth.signUp.alreadyHaveAccount')}{' '}
        <Link to="/auth/sign-in" replace style={{ color: 'var(--color-primary)' }}>
          {t('auth.signUp.signInLink')}
        </Link>
      </Typography.Text>
    </Card>
  );
};

export default SignUp;
