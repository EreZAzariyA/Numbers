import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import UserModel, { EmailModel } from "../../../models/user-model";
import { useState } from "react";
import Role from "../../../models/role";
import authServices from "../../../services/authentication";
import { getError } from "../../../utils/helpers";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const SignUp = () => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<UserModel>({
    _id: null,
    emails:[],
    profile: {
      first_name: '',
      last_name: ''
    },
    services: {
      password: ''
    },
    role: Role.User
  });

  const onFinish = async () => {
    const newUser = new UserModel({...initialValues});
    try {
      const res = await authServices.signup(newUser);
      if (res) {
        message.success("Sign-up Successfully");
        navigate('/auth/sign-in');
      }
    } catch (err: any) {
      message.error(getError(err));
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'email') {
      const emailObj = new EmailModel(value);
      setInitialValues({...initialValues, emails: [emailObj]});
    }
    if (['first_name', 'last_name'].includes(field)) {
      setInitialValues({
        ...initialValues,
        profile: {
          ...initialValues.profile,
          [field]: value
        }
      });
    }
    if (field === 'password') {
      setInitialValues({
        ...initialValues,
        services: {
          [field]: value
        }
      });
    }
  };

  return (
    <div className="auth-form-main-container">
      <div className="auth-form-inner-container">
        <Form onFinish={onFinish} initialValues={initialValues}>
            <Form.Item
              label={'First-name'}
              name={'first_name'}
              rules={[
                { required: true, message: 'Please enter your first name' },
                { min: 3, message: 'First name must be at least 3 characters long' }
              ]}
            >
              <Input type="text" onChange={(e) => handleChange('first_name', e.target.value)} />
            </Form.Item>
            <Form.Item
              label={'Last-name'}
              name={'last_name'}
              rules={[
                { required: true, message: 'Please enter your last name' },
                { min: 3, message: 'Last name must be at least 3 characters long' }
              ]}
            >
              <Input type="text" onChange={(e) => handleChange('last_name', e.target.value)} />
            </Form.Item>

            <Form.Item
              label={'Email'}
              name={'email'}
              rules={[
                { required: true, message: 'Please enter your email address' },
                { pattern: emailRegex, message: 'Please enter a valid email address' },
              ]}
            >
              <Input type="email" onChange={(e) => handleChange('email', e.target.value)} />
            </Form.Item>

            <Form.Item
              label={'Password'}
              name={'password'}
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters long' },
              ]}
            >
              <Input.Password  onChange={(e) => handleChange('password', e.target.value)} />
            </Form.Item>

            <Button htmlType="submit">Sign-up</Button>
            <p>Already have account? <Link to={'/auth/sign-in'}>Sign-in</Link></p>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;