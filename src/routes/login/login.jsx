import React, { useState } from 'react';
import { Layout, Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmail, signInWithGoogle } from '../../utility/firebase/firebase';
import './login.style.scss';

const { Content } = Layout;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, default to '/profile' if none exists
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await signInWithEmail(values.email, values.password);
      message.success('Login successful!');
      navigate(from, { replace: true }); // Navigate to the previous location
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      if (provider === 'Google') {
        await signInWithGoogle();
        message.success('Google sign-in successful!');
        navigate(from, { replace: true }); // Navigate to the previous location
      } else {
        message.info(`${provider} login will be implemented soon.`);
      }
    } catch (error) {
      message.error('Social login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
                { type: 'email', message: 'Please enter a valid email address!' }
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
