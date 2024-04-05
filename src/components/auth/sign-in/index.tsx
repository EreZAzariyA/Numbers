import { Button, Form, Input, message } from "antd";
import CredentialsModel from "../../../models/credentials-model";
import authServices from "../../../services/authentication";
import { Link, useNavigate } from "react-router-dom";
import { getError } from "../../../utils/helpers";

// const formLayout = {
//   className: 'auth-form login',
//   layout: "horizontal",
//   labelAlign: 'left',
//   labelCol: {
//     sm: { span: 6 },
//     lg: { span: 4 },
//   },
//   wrapperCol: {span: 24},
// };

const SignIn = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (credentials: CredentialsModel) => {
    try {
      await authServices.signin(credentials);
      message.success("Logged-in successfully");
      navigate('/');
    } catch (err: any) {
      message.error(getError(err));
    }
  };

  return (
    <div className="auth-form-main-container">
      <div className="auth-form-inner-container">
        <Form form={form} onFinish={onFinish}>
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
        </Form>
      </div>
    </div>
  );
};

export default SignIn;