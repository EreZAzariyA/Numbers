import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { googleSignInAction, signinAction } from "../../../redux/actions/auth-actions";
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import CredentialsModel from "../../../models/credentials-model";
import { RootState, useAppDispatch } from "../../../redux/store";
import { App, Button, Form, Input, Space, Typography } from "antd";
import { FcGoogle } from "react-icons/fc";
import "../auth.css";

const SignIn = () => {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { loading } = useSelector((state: RootState) => state.auth);

  const onFinish = async (credentials: CredentialsModel) => {
    try {
      await dispatch(signinAction(credentials)).unwrap()
      message.success('Logged-in successfully');
    } catch (err: any) {
      message.error(err);
    }
  };

  const onGoogleLoginSuccess = async (tokenResponse: TokenResponse) => {
    try {
      const result = dispatch(googleSignInAction(tokenResponse))
      console.log({ result });
    } catch (err: any) {
      message.error(err.message);
    }
  };

  const onError = (errResponse: any) => {
    console.log(errResponse);
  };

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: onGoogleLoginSuccess,
    onError
  });

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
            <Button onClick={() => googleLogin()}>
              Login with google
              <FcGoogle size={20} />
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;