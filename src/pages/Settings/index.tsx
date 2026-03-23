import {
  clearSystemCache,
  getApiSettings,
  getBasicSettings,
  getSecuritySettings,
  getSystemInfo,
  getSystemLogs,
  saveApiSettings,
  saveBasicSettings,
  saveSecuritySettings,
  type ApiSettings,
  type BasicSettings,
  type LogItem,
  type SecuritySettings,
  type SystemInfo,
} from "@/services/api";
import {
  CheckCircleOutlined,
  ClearOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { ProCard, ProTable } from "@ant-design/pro-components";
import {
  Alert,
  Button,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Spin,
  Statistic,
  Switch,
  Tabs,
  Tag,
} from "antd";
import { useCallback, useEffect, useState } from "react";

const Settings = () => {
  const [basicForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [apiForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [systemInfoLoading, setSystemInfoLoading] = useState(false);

  // 基础设置
  const handleBasicSubmit = async (values: BasicSettings) => {
    setLoading(true);
    try {
      const result = await saveBasicSettings(values);
      if (result.success) {
        message.success("基础设置保存成功");
      } else {
        message.error(result.message || "保存失败");
      }
    } catch (error: any) {
      message.error(error.message || "保存失败");
    } finally {
      setLoading(false);
    }
  };

  // 安全设置
  const handleSecuritySubmit = async (values: SecuritySettings) => {
    setLoading(true);
    try {
      const result = await saveSecuritySettings(values);
      if (result.success) {
        message.success("安全设置保存成功");
      } else {
        message.error(result.message || "保存失败");
      }
    } catch (error: any) {
      message.error(error.message || "保存失败");
    } finally {
      setLoading(false);
    }
  };

  // API设置
  const handleApiSubmit = async (values: ApiSettings) => {
    setLoading(true);
    try {
      const result = await saveApiSettings(values);
      if (result.success) {
        message.success("API设置保存成功");
      } else {
        message.error(result.message || "保存失败");
      }
    } catch (error: any) {
      message.error(error.message || "保存失败");
    } finally {
      setLoading(false);
    }
  };

  // 清除缓存
  const handleClearCache = async () => {
    setLoading(true);
    try {
      const result = await clearSystemCache();
      if (result.success) {
        message.success("缓存清除成功");
      } else {
        message.error(result.message || "清除失败");
      }
    } catch (error: any) {
      message.error(error.message || "清除失败");
    } finally {
      setLoading(false);
    }
  };

  // 获取系统信息
  const fetchSystemInfo = useCallback(async () => {
    setSystemInfoLoading(true);
    try {
      const result = await getSystemInfo();
      if (result.success && result.data) {
        setSystemInfo(result.data);
      }
    } catch (error) {
      console.error("获取系统信息失败:", error);
    } finally {
      setSystemInfoLoading(false);
    }
  }, []);

  // 加载初始设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [basicResult, securityResult, apiResult] = await Promise.all([
          getBasicSettings(),
          getSecuritySettings(),
          getApiSettings(),
        ]);

        if (basicResult.success && basicResult.data) {
          basicForm.setFieldsValue(basicResult.data);
        }
        if (securityResult.success && securityResult.data) {
          securityForm.setFieldsValue(securityResult.data);
        }
        if (apiResult.success && apiResult.data) {
          apiForm.setFieldsValue(apiResult.data);
        }
      } catch (error) {
        console.error("加载设置失败:", error);
      }
    };
    loadSettings();
  }, [basicForm, securityForm, apiForm]);

  // 日志类型标签
  const getLogTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      login: { color: "blue", text: "登录" },
      operation: { color: "green", text: "操作" },
      error: { color: "red", text: "错误" },
      system: { color: "purple", text: "系统" },
    };
    const { color, text } = typeMap[type] || { color: "default", text: type };
    return <Tag color={color}>{text}</Tag>;
  };

  // Tab 配置
  const items = [
    {
      key: "basic",
      label: "基础设置",
      children: (
        <ProCard>
          <Form
            form={basicForm}
            layout="vertical"
            onFinish={handleBasicSubmit}
            initialValues={{
              siteName: "文博通",
              siteDescription: "博物馆数字化管理平台",
              contactEmail: "contact@museum.com",
              contactPhone: "400-123-4567",
            }}
          >
            <Form.Item
              name="siteName"
              label="站点名称"
              rules={[{ required: true, message: "请输入站点名称" }]}
            >
              <Input placeholder="请输入站点名称" maxLength={50} showCount />
            </Form.Item>
            <Form.Item name="siteLogo" label="站点Logo">
              <Input placeholder="请输入Logo URL" />
            </Form.Item>
            <Form.Item name="siteDescription" label="站点描述">
              <Input.TextArea
                rows={3}
                placeholder="请输入站点描述"
                maxLength={200}
                showCount
              />
            </Form.Item>
            <Form.Item
              name="contactEmail"
              label="联系邮箱"
              rules={[{ type: "email", message: "请输入正确的邮箱" }]}
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
            <Form.Item name="contactPhone" label="联系电话">
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item name="icp" label="ICP备案号">
              <Input placeholder="请输入ICP备案号" />
            </Form.Item>
            <Form.Item name="copyright" label="版权信息">
              <Input placeholder="请输入版权信息" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </ProCard>
      ),
    },
    {
      key: "security",
      label: "安全设置",
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
              passwordRequireSpecial: false,
              twoFactorEnabled: false,
            }}
          >
            <Form.Item
              name="loginCaptcha"
              label="登录验证码"
              valuePropName="checked"
              extra="开启后，登录时需要输入图形验证码"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="maxLoginAttempts"
              label="最大登录尝试次数"
              rules={[{ required: true, message: "请输入最大登录尝试次数" }]}
              extra="超过此次数后账户将被临时锁定"
            >
              <InputNumber min={1} max={10} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="sessionTimeout"
              label="会话超时时间（分钟）"
              rules={[{ required: true, message: "请输入会话超时时间" }]}
              extra="用户无操作超过此时间后需要重新登录"
            >
              <InputNumber min={5} max={1440} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="passwordMinLength"
              label="密码最小长度"
              rules={[{ required: true, message: "请输入密码最小长度" }]}
            >
              <InputNumber min={6} max={20} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="passwordRequireSpecial"
              label="密码要求特殊字符"
              valuePropName="checked"
              extra="开启后，密码必须包含特殊字符"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="twoFactorEnabled"
              label="双因素认证"
              valuePropName="checked"
              extra="开启后，登录时需要进行二次验证"
            >
              <Switch />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </ProCard>
      ),
    },
    {
      key: "api",
      label: "API配置",
      children: (
        <ProCard>
          <Alert
            message="注意"
            description="修改API配置可能会影响系统正常运行，请谨慎操作。"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Form
            form={apiForm}
            layout="vertical"
            onFinish={handleApiSubmit}
            initialValues={{
              apiBaseUrl: "https://api.museumapp.cn",
              apiTimeout: 10000,
              apiRetryCount: 3,
              uploadMaxSize: 10,
              allowedFileTypes: ["jpg", "png", "gif", "pdf"],
            }}
          >
            <Form.Item
              name="apiBaseUrl"
              label="API基础地址"
              rules={[{ required: true, message: "请输入API基础地址" }]}
            >
              <Input placeholder="请输入API基础地址" />
            </Form.Item>
            <Form.Item
              name="apiTimeout"
              label="请求超时时间（毫秒）"
              rules={[{ required: true, message: "请输入超时时间" }]}
            >
              <InputNumber
                min={1000}
                max={60000}
                step={1000}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="apiRetryCount"
              label="请求重试次数"
              rules={[{ required: true, message: "请输入重试次数" }]}
            >
              <InputNumber min={0} max={5} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="uploadMaxSize"
              label="上传文件最大限制（MB）"
              rules={[{ required: true, message: "请输入文件大小限制" }]}
            >
              <InputNumber min={1} max={100} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="allowedFileTypes"
              label="允许上传的文件类型"
              extra="多个类型用逗号分隔"
            >
              <Select
                mode="tags"
                placeholder="请输入或选择文件类型"
                options={[
                  { value: "jpg", label: "JPG" },
                  { value: "png", label: "PNG" },
                  { value: "gif", label: "GIF" },
                  { value: "pdf", label: "PDF" },
                  { value: "doc", label: "DOC" },
                  { value: "docx", label: "DOCX" },
                  { value: "xls", label: "XLS" },
                  { value: "xlsx", label: "XLSX" },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存设置
                </Button>
                <Button onClick={() => apiForm.resetFields()}>重置</Button>
              </Space>
            </Form.Item>
          </Form>
        </ProCard>
      ),
    },
    {
      key: "logs",
      label: "日志管理",
      children: (
        <ProTable<LogItem>
          headerTitle="系统日志"
          search={{
            labelWidth: 120,
          }}
          request={async (params) => {
            const result = await getSystemLogs({
              current: params.current,
              pageSize: params.pageSize,
              type: params.type,
              module: params.module,
            });
            return {
              data: result.data?.list || [],
              success: result.success,
              total: result.data?.total || 0,
            };
          }}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              width: 80,
              search: false,
            },
            {
              title: "类型",
              dataIndex: "type",
              width: 100,
              valueType: "select",
              valueEnum: {
                login: { text: "登录" },
                operation: { text: "操作" },
                error: { text: "错误" },
                system: { text: "系统" },
              },
              render: (type: string) => getLogTypeTag(type),
            },
            {
              title: "模块",
              dataIndex: "module",
              width: 120,
            },
            {
              title: "操作",
              dataIndex: "action",
              ellipsis: true,
            },
            {
              title: "操作人",
              dataIndex: "operator",
              width: 120,
            },
            {
              title: "IP地址",
              dataIndex: "ip",
              width: 140,
            },
            {
              title: "详情",
              dataIndex: "detail",
              ellipsis: true,
              width: 200,
            },
            {
              title: "时间",
              dataIndex: "createTime",
              width: 180,
              search: false,
              sorter: true,
            },
          ]}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
          }}
          scroll={{ x: 1200 }}
        />
      ),
    },
    {
      key: "system",
      label: "系统信息",
      children: (
        <ProCard>
          <div style={{ marginBottom: 24 }}>
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchSystemInfo}
                loading={systemInfoLoading}
              >
                刷新信息
              </Button>
              <Button
                danger
                icon={<ClearOutlined />}
                onClick={handleClearCache}
                loading={loading}
              >
                清除缓存
              </Button>
            </Space>
          </div>

          <Spin spinning={systemInfoLoading}>
            {systemInfo ? (
              <>
                <Descriptions title="系统信息" bordered column={2} size="small">
                  <Descriptions.Item label="系统版本">
                    {systemInfo.version}
                  </Descriptions.Item>
                  <Descriptions.Item label="构建时间">
                    {systemInfo.buildTime}
                  </Descriptions.Item>
                  <Descriptions.Item label="Node版本">
                    {systemInfo.nodeVersion}
                  </Descriptions.Item>
                  <Descriptions.Item label="操作系统">
                    {systemInfo.os}
                  </Descriptions.Item>
                  <Descriptions.Item label="CPU信息">
                    {systemInfo.cpu}
                  </Descriptions.Item>
                  <Descriptions.Item label="内存使用">
                    {systemInfo.memory}
                  </Descriptions.Item>
                  <Descriptions.Item label="磁盘使用">
                    {systemInfo.diskUsage}
                  </Descriptions.Item>
                  <Descriptions.Item label="运行时长">
                    {systemInfo.uptime}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <ProCard title="系统状态" ghost>
                  <Space size="large" wrap>
                    <Statistic
                      title="系统状态"
                      value="正常运行"
                      prefix={
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      }
                      valueStyle={{ color: "#52c41a" }}
                    />
                    <Statistic
                      title="API状态"
                      value="已连接"
                      prefix={
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      }
                      valueStyle={{ color: "#52c41a" }}
                    />
                    <Statistic
                      title="数据库状态"
                      value="正常"
                      prefix={
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      }
                      valueStyle={{ color: "#52c41a" }}
                    />
                    <Statistic
                      title="缓存状态"
                      value="正常"
                      prefix={
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      }
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Space>
                </ProCard>
              </>
            ) : (
              <Alert
                message="暂无系统信息"
                description="点击「刷新信息」按钮获取系统信息"
                type="info"
                showIcon
              />
            )}
          </Spin>
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
