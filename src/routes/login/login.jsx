import React, { useState } from 'react';
import { Layout, Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './login.style.scss';

const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Here you would typically make an API call to authenticate the user
      console.log('Login attempt with:', values);
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Login successful!');
      navigate('/'); // Redirect to home page after successful login
    } catch (error) {
      message.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    // This function will be implemented later with Firebase
    console.log(`${provider} login clicked`);
    message.info(`${provider} login will be implemented soon.`);
  };

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (
    <Layout className="login-layout">
      <Content className="login-content">
        <div className="login-container">
          <h1>MangaShell</h1>
          <Form
            form={form}
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            validateTrigger={[]}
          >
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
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="login-form-button" 
                loading={loading}
                onClick={() => {
                  form.validateFields().then(
                    () => {},
                    () => {}
                  );
                }}
              >
                Log in
              </Button>
            </Form.Item>

            <Divider>Or</Divider>

            <Form.Item>
              <Button 
                icon={<GoogleOutlined />} 
                onClick={() => handleSocialLogin('Google')}
                className="social-button google-button"
              >
                Continue with Google
              </Button>
            </Form.Item>

            <Form.Item>
              <Button 
                icon={<FacebookOutlined />} 
                onClick={() => handleSocialLogin('Facebook')}
                className="social-button facebook-button"
              >
                Continue with Facebook
              </Button>
            </Form.Item>
          </Form>
          <div className="login-links">
            <Link to="/forgot-password">Forgot password</Link>
            <Link to="/register">Register now!</Link>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
