import { Link } from "react-router-dom";
import authServices from "../../../services/authentication";
import CredentialsModel from "../../../models/credentials-model";
import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { getError } from "../../../utils/helpers";
import { Button, Form, Input, message } from "antd";
import "../auth.css";

const SignIn = () => {
  const [form] = Form.useForm();

  const onFinish = async (credentials: CredentialsModel) => {
    try {
      const res = await authServices.signin(credentials);
      if (res) {
        message.success("Logged-in successfully");
      }
    } catch (err: any) {
      message.error(getError(err));
    }
  };

  const onSuccess = async (tokenResponse: TokenResponse) => {
    try {
      await authServices.googleSignIn(tokenResponse);
      message.success("Logged-in successfully");
    } catch (err: any) {
      message.error(err.message);
    }
  }

  const onError = (errResponse: any) => {
    console.log(errResponse);
  };

  const login = useGoogleLogin({
    flow: 'implicit',
    onSuccess,
    onError
  });

  return (
    <div className="auth-form-main-container">
      <div className="auth-form-inner-container">
        <Form
          form={form}
          onFinish={onFinish}
          className='auth-form sign-in'
          layout="horizontal"
          labelAlign='left'
          labelCol={{
            sm: { span: 6 },
            lg: { span: 4 },
          }}
          wrapperCol={{ span: 24 }}
        >
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

          <Button htmlType="submit">Sign-in</Button>
          <p>D`ont have account? <Link to={'/auth/sign-up'}>Sign-Up</Link></p>

          <Form.Item style={{ width: '200px', margin: 'auto' }}>
            <Button onClick={() => login()}>Google</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;