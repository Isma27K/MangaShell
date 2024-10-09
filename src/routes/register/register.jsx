import React, { useState } from 'react';
import { Layout, Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './register.style.scss';

const { Content } = Layout;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Here you would typically make an API call to register the user
      console.log('Registration attempt with:', values);
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Registration successful!');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    // This function will be implemented later with Firebase
    console.log(`${provider} registration clicked`);
    message.info(`${provider} registration will be implemented soon.`);
  };

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (
    <Layout className="register-layout">
      <Content className="register-content">
        <div className="register-container">
          <h1>Join MangaShell</h1>
          <Form
            form={form}
            name="register"
            className="register-form"
            onFinish={onFinish}
            validateTrigger={[]}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your Email!' },
                { 
                  pattern: emailRegex, 
                  message: 'Please enter a valid email address!' 
                }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
                { min: 6, message: 'Password must be at least 6 characters long!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your Password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="register-form-button" 
                loading={loading}
                onClick={() => {
                  form.validateFields().then(
                    () => {},
                    () => {}
                  );
                }}
              >
                Register
              </Button>
            </Form.Item>

            <Divider>Or</Divider>

            <Form.Item>
              <Button 
                icon={<GoogleOutlined />} 
                onClick={() => handleSocialRegister('Google')}
                className="social-button google-button"
              >
                Register with Google
              </Button>
            </Form.Item>

            <Form.Item>
              <Button 
                icon={<FacebookOutlined />} 
                onClick={() => handleSocialRegister('Facebook')}
                className="social-button facebook-button"
              >
                Register with Facebook
              </Button>
            </Form.Item>
          </Form>
          <div className="register-links">
            <span>Already have an account? <Link to="/login">Login now!</Link></span>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Register;
