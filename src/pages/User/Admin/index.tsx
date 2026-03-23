import {
  createAdmin,
  deleteAdmin,
  getAdminList,
  resetAdminPassword,
  updateAdmin,
  type AdminItem,
  type CreateAdminParams,
  type ResetPasswordParams,
  type UpdateAdminParams,
} from "@/services/api";
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { useAccess } from "@umijs/max";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
} from "antd";
import { memo, useCallback, useRef, useState } from "react";

const AdminTable = memo(ProTable<AdminItem>);

// 输入消毒函数 - 移除潜在XSS字符
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"'&]/g, "");
};

// 表单验证规则
const validationRules = {
  username: [
    { required: true, message: "请输入用户名" },
    { min: 3, max: 20, message: "用户名长度为3-20个字符" },
    { pattern: /^[a-zA-Z0-9_]+$/, message: "用户名只能包含字母、数字和下划线" },
  ],
  password: [
    { required: true, message: "请输入密码" },
    { min: 6, max: 20, message: "密码长度为6-20个字符" },
  ],
  nickname: [
    { required: true, message: "请输入昵称" },
    { min: 2, max: 50, message: "昵称长度为2-50个字符" },
    { pattern: /^[^<>\"'&]*$/, message: "昵称包含非法字符" },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }],
  email: [
    { type: "email" as const, message: "请输入正确的邮箱" },
    { max: 100, message: "邮箱长度不能超过100个字符" },
  ],
};

const AdminList = () => {
  const actionRef = useRef<any>();
  const access = useAccess();
  const [modalVisible, setModalVisible] = useState(false);
  const [resetPwdVisible, setResetPwdVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AdminItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();

  // 检查权限
  const canCreate = access.canAdmin;
  const canEdit = access.canAdmin;
  const canDelete = access.canAdmin;
  const canResetPassword = access.canAdmin;

  const handleAdd = useCallback(() => {
    if (!canCreate) {
      message.error("您没有权限创建管理员");
      return;
    }
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  }, [canCreate, form]);

  const handleEdit = useCallback(
    (record: AdminItem) => {
      if (!canEdit) {
        message.error("您没有权限编辑管理员");
        return;
      }
      setEditingRecord(record);
      form.setFieldsValue({
        username: record.username,
        nickname: record.nickname,
        phone: record.phone,
        email: record.email,
        role: record.role,
        status: record.status,
      });
      setModalVisible(true);
    },
    [canEdit, form]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!canDelete) {
        message.error("您没有权限删除管理员");
        return;
      }
      try {
        setLoading(true);
        const result = await deleteAdmin(id);
        if (result.success) {
          message.success("删除成功");
          actionRef.current?.reload();
        } else {
          message.error(result.message || "删除失败");
        }
      } catch (error: any) {
        message.error(error.message || "删除失败");
      } finally {
        setLoading(false);
      }
    },
    [canDelete]
  );

  const handleResetPwd = useCallback(
    (record: AdminItem) => {
      if (!canResetPassword) {
        message.error("您没有权限重置密码");
        return;
      }
      setEditingRecord(record);
      pwdForm.resetFields();
      setResetPwdVisible(true);
    },
    [canResetPassword, pwdForm]
  );

  const handleSubmit = useCallback(
    async (values: any) => {
      try {
        setLoading(true);

        // 消毒输入
        const sanitizedValues = {
          ...values,
          username: sanitizeInput(values.username),
          nickname: sanitizeInput(values.nickname),
          phone: values.phone ? sanitizeInput(values.phone) : undefined,
          email: values.email ? sanitizeInput(values.email) : undefined,
        };

        if (editingRecord) {
          const updateData: UpdateAdminParams = {
            nickname: sanitizedValues.nickname,
            phone: sanitizedValues.phone,
            email: sanitizedValues.email,
            role: sanitizedValues.role,
            status: sanitizedValues.status,
          };
          const result = await updateAdmin(editingRecord.id, updateData);
          if (result.success) {
            message.success("更新成功");
            setModalVisible(false);
            actionRef.current?.reload();
          } else {
            message.error(result.message || "更新失败");
          }
        } else {
          const createData: CreateAdminParams = {
            username: sanitizedValues.username,
            password: sanitizedValues.password,
            nickname: sanitizedValues.nickname,
            phone: sanitizedValues.phone,
            email: sanitizedValues.email,
            role: sanitizedValues.role,
            status: sanitizedValues.status ?? 1,
          };
          const result = await createAdmin(createData);
          if (result.success) {
            message.success("创建成功");
            setModalVisible(false);
            actionRef.current?.reload();
          } else {
            message.error(result.message || "创建失败");
          }
        }
      } catch (error: any) {
        message.error(error.message || "操作失败");
      } finally {
        setLoading(false);
      }
    },
    [editingRecord]
  );

  const handleResetPwdSubmit = useCallback(
    async (values: any) => {
      if (!editingRecord) return;
      try {
        setLoading(true);
        const data: ResetPasswordParams = {
          newPassword: values.newPassword,
        };
        const result = await resetAdminPassword(editingRecord.id, data);
        if (result.success) {
          message.success("密码重置成功");
          setResetPwdVisible(false);
        } else {
          message.error(result.message || "密码重置失败");
        }
      } catch (error: any) {
        message.error(error.message || "密码重置失败");
      } finally {
        setLoading(false);
      }
    },
    [editingRecord]
  );

  const fetchData = useCallback(async (params: any) => {
    const result = await getAdminList({
      current: params.current,
      pageSize: params.pageSize,
      username: params.username,
      nickname: params.nickname,
      role: params.role,
      status: params.status,
    });
    return {
      data: result.data?.list || [],
      success: result.success,
      total: result.data?.total || 0,
    };
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      search: false,
    },
    {
      title: "用户名",
      dataIndex: "username",
      width: 120,
    },
    {
      title: "昵称",
      dataIndex: "nickname",
      width: 120,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      width: 130,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "角色",
      dataIndex: "role",
      width: 120,
      render: (role: string) => {
        const roleMap: Record<string, { color: string; text: string }> = {
          super: { color: "red", text: "超级管理员" },
          editor: { color: "orange", text: "内容编辑" },
          operator: { color: "blue", text: "运营人员" },
        };
        const { color, text } = roleMap[role] || {
          color: "default",
          text: role,
        };
        return <Tag color={color}>{text}</Tag>;
      },
      valueEnum: {
        super: { text: "超级管理员" },
        editor: { text: "内容编辑" },
        operator: { text: "运营人员" },
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? "success" : "default"}>
          {status === 1 ? "正常" : "禁用"}
        </Tag>
      ),
      valueEnum: {
        1: { text: "正常" },
        0: { text: "禁用" },
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180,
      search: false,
    },
    {
      title: "操作",
      valueType: "option",
      width: 220,
      render: (_: any, record: AdminItem) => {
        const actions = [];

        if (canEdit) {
          actions.push(
            <Button
              key="edit"
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
          );
        }

        if (canResetPassword) {
          actions.push(
            <Button
              key="resetPwd"
              type="link"
              icon={<KeyOutlined />}
              onClick={() => handleResetPwd(record)}
            >
              重置密码
            </Button>
          );
        }

        if (canDelete && record.role !== "super") {
          actions.push(
            <Popconfirm
              key="delete"
              title="确认删除"
              description="确定要删除这个管理员吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                loading={loading}
              >
                删除
              </Button>
            </Popconfirm>
          );
        }

        return <Space size={0}>{actions}</Space>;
      },
    },
  ];

  return (
    <div>
      <AdminTable
        headerTitle="管理员列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          canCreate && (
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增管理员
            </Button>
          ),
        ]}
        request={fetchData}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />

      <Modal
        title={editingRecord ? "编辑管理员" : "新增管理员"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          preserve={false}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={validationRules.username}
          >
            <Input
              placeholder="请输入用户名"
              disabled={!!editingRecord}
              maxLength={20}
              showCount
            />
          </Form.Item>
          {!editingRecord && (
            <Form.Item
              name="password"
              label="初始密码"
              rules={validationRules.password}
            >
              <Input.Password placeholder="请输入初始密码" maxLength={20} />
            </Form.Item>
          )}
          <Form.Item
            name="nickname"
            label="昵称"
            rules={validationRules.nickname}
          >
            <Input placeholder="请输入昵称" maxLength={50} showCount />
          </Form.Item>
          <Form.Item name="phone" label="手机号" rules={validationRules.phone}>
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={validationRules.email}>
            <Input placeholder="请输入邮箱" maxLength={100} />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: "请选择角色" }]}
            initialValue="operator"
          >
            <Select placeholder="请选择角色">
              <Select.Option value="super">超级管理员</Select.Option>
              <Select.Option value="editor">内容编辑</Select.Option>
              <Select.Option value="operator">运营人员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="重置密码"
        open={resetPwdVisible}
        onCancel={() => setResetPwdVisible(false)}
        onOk={() => pwdForm.submit()}
        width={400}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          form={pwdForm}
          layout="vertical"
          onFinish={handleResetPwdSubmit}
          preserve={false}
        >
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, max: 20, message: "密码长度为6-20个字符" },
            ]}
          >
            <Input.Password placeholder="请输入新密码" maxLength={20} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" maxLength={20} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminList;
