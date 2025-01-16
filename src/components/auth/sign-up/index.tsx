import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store";
import UserModel from "../../../models/user-model";
import { signupAction } from "../../../redux/actions/auth-actions";
import { App, Button, Col, Form, Input, Row, Space, Typography } from "antd";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  const onFinish = async (values: UserModel) => {
    try {
      await dispatch(signupAction(values)).unwrap();
      message.success("Sign-up Successfully");
      navigate('/auth/sign-in');
    } catch (err: any) {
      message.error(err);
    }
  };

  return (
    <div className="auth-form-main-container sign-up">
      <div className="auth-form-inner-container">
        <Form
          onFinish={onFinish}
          className='auth-form'
          layout="vertical"
          labelAlign='left'
          scrollToFirstError
        >
          <Typography.Text className="form-title">Sign-Up</Typography.Text>
          <Row gutter={[20, 10]} justify={'space-between'}>
            <Col span={12}>
              <Form.Item
                label={'First name'}
                name={['profile', 'first_name']}
                rules={[
                  { required: true, message: 'Please enter your first name' },
                  { min: 3, message: 'First name must be at least 3 characters long' }
                ]}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={'Last name'}
                name={['profile', 'last_name']}
                rules={[
                  { required: true, message: 'Please enter your last name' },
                  { min: 3, message: 'Last name must be at least 3 characters long' }
                ]}
              >
                <Input type="text" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={'Email'}
            name={['emails', 'email']}
            rules={[
              { required: true, message: 'Please enter your email address' },
              { pattern: emailRegex, message: 'Please enter a valid email address' },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label={'Password'}
            name={['services', 'password']}
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 6, message: 'Password must be at least 6 characters long' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue(['services', 'password']) === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The password you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Space direction="vertical">
            <Button htmlType="submit">Sign-up</Button>
            <p>Already have account? <Link to={'/auth/sign-in'} replace>Sign-in</Link></p>
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;