import React from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';

type LoginComponentProps = {
  onLoginSuccess?: () => void;
};

class LoginComponent extends React.Component<
  LoginComponentProps & any,
  { errorMsg: string }
> {
  state = { errorMsg: '' };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        const { username, password } = values;
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            if (this.props.onLoginSuccess) {
              this.props.onLoginSuccess();
            }
          } else {
            this.setState({ errorMsg: data.message || 'Invalid credentials' });
          }
        } catch (err) {
          this.setState({ errorMsg: 'Network error' });
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { errorMsg } = this.state;

    return (
      <div
        id='login-component'
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#232b3e',
        }}
      >
        <Card
          style={{
            minWidth: 340,
            boxShadow: '0 2px 16px #0003',
            background: '#232b3e',
            border: '1px solid #3e4a6b',
          }}
          bodyStyle={{ padding: 32 }}
        >
          <Typography.Title
            level={2}
            style={{
              textAlign: 'center',
              marginBottom: 24,
              color: '#fff',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: 2,
              textShadow: '0 1px 2px #0006',
            }}
          >
            Login
          </Typography.Title>
          <Form
            layout='vertical'
            onSubmit={this.handleSubmit}
            autoComplete='off'
          >
            <Form.Item
              label={
                <span style={{ color: '#e0e0e0', fontWeight: 500 }}>
                  Username
                </span>
              }
            >
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: 'Please input your username!' },
                ],
              })(
                <Input
                  autoFocus
                  style={{
                    background: '#232b3e',
                    color: '#fff',
                    border: '1px solid #3e4a6b',
                  }}
                  placeholder='Enter your username'
                />
              )}
            </Form.Item>
            <Form.Item
              label={
                <span style={{ color: '#e0e0e0', fontWeight: 500 }}>
                  Password
                </span>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your password!' },
                ],
              })(
                <Input.Password
                  style={{
                    background: '#232b3e',
                    color: '#fff',
                    border: '1px solid #3e4a6b',
                  }}
                  placeholder='Enter your password'
                />
              )}
            </Form.Item>
            {errorMsg && (
              <Form.Item>
                <Alert message={errorMsg} type='error' showIcon />
              </Form.Item>
            )}
            <Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                block
                style={{
                  fontWeight: 600,
                  letterSpacing: 1,
                  background:
                    'linear-gradient(90deg, #2b3556 0%, #3e4a6b 100%)',
                  border: 'none',
                  color: '#fff',
                  boxShadow: '0 2px 8px #0002',
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default Form.create()(LoginComponent);
