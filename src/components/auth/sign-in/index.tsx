import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { googleSignInAction, signinAction } from "../../../redux/actions/auth-actions";
import CredentialsModel from "../../../models/credentials-model";
import { App, Button, Card, Divider, Form, Input, Typography } from "antd";
import Logo from "../../components/logo/logo";
import "../auth.css";

const SignIn = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { loading } = useAppSelector((state) => state.auth);

  const onFinish = async (credentials: CredentialsModel) => {
    try {
      await dispatch(signinAction(credentials)).unwrap();
      message.success(t('auth.signIn.success'));
    } catch (err: any) {
      message.error(err);
    }
  };

  const onGoogleLoginSuccess = async (tokenResponse: CredentialResponse) => {
    try {
      await dispatch(googleSignInAction(tokenResponse)).unwrap();
      message.success(t('auth.signIn.success'));
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <Card className="auth-card" bordered={false}>
      <Logo />
      <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 24 }}>
        <Typography.Title level={3} style={{ color: '#fff', marginBottom: 4 }}>
          {t('auth.signIn.title')}
        </Typography.Title>
        <Typography.Text style={{ color: 'rgba(255,255,255,0.55)' }}>
          {t('auth.signIn.subtitle')}
        </Typography.Text>
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        labelAlign="left"
        scrollToFirstError
      >
        <Form.Item
          label={t('auth.form.email.label')}
          name="email"
          rules={[{ required: true, message: t('auth.form.email.required') }]}
        >
          <Input type="email" size="large" placeholder={t('auth.form.email.placeholder')} />
        </Form.Item>

        <Form.Item
          label={t('auth.form.password.label')}
          name="password"
          rules={[
            { required: true, message: t('auth.form.password.required') },
            { min: 6, message: t('auth.form.password.min') },
          ]}
        >
          <Input.Password size="large" placeholder={t('auth.form.password.placeholder')} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
          style={{ marginTop: 4 }}
        >
          {t('auth.signIn.button')}
        </Button>
      </Form>

      <Divider style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.4)' }}>
        {t('auth.signIn.or')}
      </Divider>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin
          onSuccess={onGoogleLoginSuccess}
          onError={() => message.error(t('auth.signIn.error'))}
          shape="pill"
          theme="filled_blue"
          text="continue_with"
          size="large"
          width={300}
        />
      </div>

      <Typography.Text style={{ display: 'block', textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.5)' }}>
        {t('auth.signIn.noAccount')}{' '}
        <Link to="/auth/sign-up" replace style={{ color: 'var(--color-primary)' }}>
          {t('auth.signIn.signUpLink')}
        </Link>
      </Typography.Text>
    </Card>
  );
};

export default SignIn;
