import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, message, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';

interface AdminItem {
  id: string;
  username: string;
  nickname: string;
  phone: string;
  email: string;
  status: number;
  role: string;
  permissions: string[];
  createTime: string;
}

const AdminList = () => {
  const actionRef = useRef<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [resetPwdVisible, setResetPwdVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AdminItem | null>(null);
  const [form] = Form.useForm();
  const [pwdForm] = Form.useForm();

  // 模拟数据
  const mockData: AdminItem[] = [
    { id: '1', username: 'admin', nickname: '超级管理员', phone: '13800138000', email: 'admin@museum.com', status: 1, role: 'super', permissions: ['all'], createTime: '2024-01-01 00:00:00' },
    { id: '2', username: 'editor', nickname: '内容编辑', phone: '13800138001', email: 'editor@museum.com', status: 1, role: 'editor', permissions: ['content', 'ugc'], createTime: '2024-01-15 10:30:00' },
    { id: '3', username: 'operator', nickname: '运营人员', phone: '13800138002', email: 'operator@museum.com', status: 1, role: 'operator', permissions: ['user', 'museum'], createTime: '2024-02-01 14:20:00' },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: AdminItem) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    message.success('删除成功');
    actionRef.current?.reload();
  };

  const handleResetPwd = (record: AdminItem) => {
    setEditingRecord(record);
    pwdForm.resetFields();
    setResetPwdVisible(true);
  };

  const handleSubmit = async (values: any) => {
    if (editingRecord) {
      message.success('更新成功');
    } else {
      message.success('创建成功');
    }
    setModalVisible(false);
    actionRef.current?.reload();
  };

  const handleResetPwdSubmit = async (values: any) => {
    message.success('密码重置成功');
    setResetPwdVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 120,
      render: (role: string) => {
        const roleMap: Record<string, { color: string; text: string }> = {
          'super': { color: 'red', text: '超级管理员' },
          'editor': { color: 'orange', text: '内容编辑' },
          'operator': { color: 'blue', text: '运营人员' },
        };
        const { color, text } = roleMap[role] || { color: 'default', text: role };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '正常' : '禁用'}
        </Tag>
      ),
      valueEnum: {
        1: { text: '正常' },
        0: { text: '禁用' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 220,
      render: (_: any, record: AdminItem) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
        <Button
          key="resetPwd"
          type="link"
          icon={<KeyOutlined />}
          onClick={() => handleResetPwd(record)}
        >
          重置密码
        </Button>,
        record.role !== 'super' && (
          <Popconfirm
            key="delete"
            title="确认删除"
            description="确定要删除这个管理员吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        ),
      ],
    },
  ];

  return (
    <div>
      <ProTable<AdminItem>
        headerTitle="管理员列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增管理员
          </Button>,
        ]}
        request={async (params) => {
          // 模拟API调用
          const filteredData = mockData.filter(item => {
            if (params.username && !item.username.includes(params.username)) return false;
            if (params.nickname && !item.nickname.includes(params.nickname)) return false;
            if (params.role && item.role !== params.role) return false;
            if (params.status !== undefined && item.status !== params.status) return false;
            return true;
          });
          return {
            data: filteredData,
            success: true,
            total: filteredData.length,
          };
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
      />

      <Modal
        title={editingRecord ? '编辑管理员' : '新增管理员'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          {!editingRecord && (
            <Form.Item
              name="password"
              label="初始密码"
              rules={[{ required: true, message: '请输入初始密码' }]}
            >
              <Input.Password placeholder="请输入初始密码" />
            </Form.Item>
          )}
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ required: true, message: '请输入昵称' }]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
            initialValue="operator"
          >
            <Select placeholder="请选择角色">
              <Select.Option value="super">超级管理员</Select.Option>
              <Select.Option value="editor">内容编辑</Select.Option>
              <Select.Option value="operator">运营人员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
          >
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
      >
        <Form
          form={pwdForm}
          layout="vertical"
          onFinish={handleResetPwdSubmit}
        >
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminList;