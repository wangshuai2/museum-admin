import { useState } from 'react';
import { history, useModel } from '@umijs/max';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { login } from '@/services/api';

const Login = () => {
  const [loginType, setLoginType] = useState<'account' | 'phone'>('account');
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const result = await login(values);
      if (result.success) {
        // 保存token
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userInfo', JSON.stringify(result.data.userInfo));
        
        // 更新全局状态
        setInitialState({
          currentUser: result.data.userInfo,
          settings: {},
        });
        
        message.success('登录成功');
        history.push('/dashboard');
      } else {
        message.error(result.message || '登录失败');
      }
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f0f2f5',
        height: '100vh',
      }}
    >
      <LoginFormPage
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqzBKCp.png"
        logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        title="文博通"
        subTitle="博物馆数字化管理平台"
        onFinish={handleSubmit}
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          paddingTop: '100px',
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as 'account' | 'phone')}
        >
          <Tabs.TabPane key="account" tab="账号密码登录" />
        </Tabs>
        {loginType === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className="prefixIcon" />,
              }}
              placeholder="用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className="prefixIcon" />,
              }}
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            />
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <a style={{ float: 'right' }}>忘记密码</a>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default Login;
