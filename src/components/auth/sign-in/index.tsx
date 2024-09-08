import { Link } from "react-router-dom";
import { CredentialResponse, GoogleLogin, TokenResponse } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { googleSignInAction, signinAction } from "../../../redux/actions/auth-actions";
import CredentialsModel from "../../../models/credentials-model";
import { App, Button, Form, Input, Space, Typography } from "antd";
import "../auth.css";

type TokenResponseErrorType = Pick<TokenResponse, "error" | "error_description" | "error_uri">;

const SignIn = () => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { loading } = useAppSelector((state) => state.auth);

  const onFinish = async (credentials: CredentialsModel) => {
    try {
      await dispatch(signinAction(credentials)).unwrap()
      message.success('Logged-in successfully');
    } catch (err: any) {
      message.error(err);
    }
  };

  const onGoogleLoginSuccess = async (tokenResponse: CredentialResponse) => {
    try {
      await dispatch(googleSignInAction(tokenResponse)).unwrap();
      message.success('Logged-in successfully');
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const onError = (errResponse?: TokenResponseErrorType): void => {
    message.error(errResponse.error || errResponse.error);
  };

  return (
    <div className="auth-form-main-container sign-in">
      <div className="auth-form-inner-container">
        <Form
          form={form}
          onFinish={onFinish}
          className='auth-form'
          layout="vertical"
          labelAlign='left'
          scrollToFirstError
        >
          <Typography.Text className="form-title">Sign-In</Typography.Text>
          <Form.Item
            label={'Email'}
            name={'email'}
            rules={[
              { required: true, message: 'Please enter your email' },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label={'Password'}
            name={'password'}
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters long' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Space direction="vertical">
            <Button htmlType="submit" loading={loading}>Sign-in</Button>
            <p>D`ont have account? <Link to={'/auth/sign-up'}>Sign-Up</Link></p>
          </Space>

          <div className="google-login">
            <GoogleLogin
              onSuccess={onGoogleLoginSuccess}
              onError={onError}
              shape="pill"
              theme="filled_blue"
              text="continue_with"
              ux_mode="popup"
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;