import { ProCard } from '@ant-design/pro-components';
import { Form, Input, Button, message, Tabs, Switch, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const Settings = () => {
  const [basicForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  const handleBasicSubmit = (values: any) => {
    message.success('基础设置保存成功');
  };

  const handleSecuritySubmit = (values: any) => {
    message.success('安全设置保存成功');
  };

  const items = [
    {
      key: 'basic',
      label: '基础设置',
      children: (
        <ProCard>
          <Form
            form={basicForm}
            layout="vertical"
            onFinish={handleBasicSubmit}
            initialValues={{
              siteName: '文博通',
              siteLogo: '',
              siteDescription: '博物馆数字化管理平台',
              contactEmail: 'contact@museum.com',
              contactPhone: '400-123-4567',
            }}
          >
            <Form.Item
              name="siteName"
              label="站点名称"
              rules={[{ required: true, message: '请输入站点名称' }]}
            >
              <Input placeholder="请输入站点名称" />
            </Form.Item>
            <Form.Item
              name="siteLogo"
              label="站点Logo"
            >
              <Upload
                name="logo"
                action="/upload"
                listType="picture"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>上传Logo</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              name="siteDescription"
              label="站点描述"
            >
              <Input.TextArea rows={3} placeholder="请输入站点描述" />
            </Form.Item>
            <Form.Item
              name="contactEmail"
              label="联系邮箱"
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
            <Form.Item
              name="contactPhone"
              label="联系电话"
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </ProCard>
      ),
    },
    {
      key: 'security',
      label: '安全设置',
      children: (
        <ProCard>
          <Form
            form={securityForm}
            layout="vertical"
            onFinish={handleSecuritySubmit}
            initialValues={{
              loginCaptcha: true,
              maxLoginAttempts: 5,
              sessionTimeout: 30,
              passwordMinLength: 6,
            }}
          >
            <Form.Item
              name="loginCaptcha"
              label="登录验证码"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="maxLoginAttempts"
              label="最大登录尝试次数"
              rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
            >
              <Input type="number" placeholder="请输入最大登录尝试次数" />
            </Form.Item>
            <Form.Item
              name="sessionTimeout"
              label="会话超时时间（分钟）"
              rules={[{ required: true, message: '请输入会话超时时间' }]}
            >
              <Input type="number" placeholder="请输入会话超时时间" />
            </Form.Item>
            <Form.Item
              name="passwordMinLength"
              label="密码最小长度"
              rules={[{ required: true, message: '请输入密码最小长度' }]}
            >
              <Input type="number" placeholder="请输入密码最小长度" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </ProCard>
      ),
    },
  ];

  return (
    <div>
      <Tabs items={items} />
    </div>
  );
};

export default Settings;
