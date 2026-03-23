import {
  batchOperateUsers,
  createUser,
  deleteUser,
  getUserDetail,
  getUserList,
  updateUser,
  type UserItem,
} from "@/services/api";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tag,
} from "antd";
import { useCallback, useRef, useState } from "react";

const UserList = () => {
  const actionRef = useRef<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UserItem | null>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(false);

  // 新增用户
  const handleAdd = useCallback(() => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  }, [form]);

  // 编辑用户
  const handleEdit = useCallback(
    (record: UserItem) => {
      setEditingRecord(record);
      form.setFieldsValue(record);
      setModalVisible(true);
    },
    [form]
  );

  // 删除用户
  const handleDelete = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const result = await deleteUser(id);
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
  }, []);

  // 查看用户详情
  const handleViewDetail = useCallback(async (id: string) => {
    try {
      const result = await getUserDetail(id);
      if (result.success && result.data) {
        setCurrentUser(result.data);
        setDetailVisible(true);
      } else {
        message.error("获取用户详情失败");
      }
    } catch (error: any) {
      message.error(error.message || "获取用户详情失败");
    }
  }, []);

  // 提交表单
  const handleSubmit = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        if (editingRecord) {
          const result = await updateUser(editingRecord.id, values);
          if (result.success) {
            message.success("更新成功");
            setModalVisible(false);
            actionRef.current?.reload();
          } else {
            message.error(result.message || "更新失败");
          }
        } else {
          const result = await createUser(values);
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

  // 批量操作
  const handleBatchOperate = useCallback(
    (action: "delete" | "enable" | "disable") => {
      if (selectedRowKeys.length === 0) {
        message.warning("请选择要操作的用户");
        return;
      }

      const actionText = {
        delete: "删除",
        enable: "启用",
        disable: "禁用",
      };

      Modal.confirm({
        title: `确认批量${actionText[action]}`,
        icon: <ExclamationCircleOutlined />,
        content: `确定要${actionText[action]}选中的 ${
          selectedRowKeys.length
        } 个用户吗？${action === "delete" ? "此操作不可恢复。" : ""}`,
        okText: "确认",
        okType: action === "delete" ? "danger" : undefined,
        cancelText: "取消",
        onOk: async () => {
          try {
            const result = await batchOperateUsers({
              ids: selectedRowKeys as string[],
              action,
            });
            if (result.success) {
              message.success(
                `成功${actionText[action]} ${selectedRowKeys.length} 个用户`
              );
              setSelectedRowKeys([]);
              actionRef.current?.reload();
            } else {
              message.error(result.message || `批量${actionText[action]}失败`);
            }
          } catch (error: any) {
            message.error(error.message || `批量${actionText[action]}失败`);
          }
        },
      });
    },
    [selectedRowKeys]
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      search: false,
    },
    {
      title: "头像",
      dataIndex: "avatar",
      width: 80,
      search: false,
      render: (avatar: string, record: UserItem) => (
        <Avatar
          src={avatar}
          icon={<UserOutlined />}
          size="large"
          style={{ cursor: "pointer" }}
          onClick={() => handleViewDetail(record.id)}
        />
      ),
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
      width: 100,
      valueType: "select",
      valueEnum: {
        admin: { text: "管理员", status: "Error" },
        user: { text: "普通用户", status: "Default" },
      },
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role === "admin" ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      valueType: "select",
      valueEnum: {
        1: { text: "正常", status: "Success" },
        0: { text: "禁用", status: "Default" },
      },
      render: (status: number) => (
        <Tag color={status === 1 ? "success" : "default"}>
          {status === 1 ? "正常" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "注册时间",
      dataIndex: "createTime",
      width: 180,
      search: false,
      sorter: true,
    },
    {
      title: "操作",
      valueType: "option",
      width: 180,
      fixed: "right" as const,
      render: (_: any, record: UserItem) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "查看详情",
            onClick: () => handleViewDetail(record.id),
          },
          {
            key: "edit",
            icon: <EditOutlined />,
            label: "编辑",
            onClick: () => handleEdit(record),
          },
          { type: "divider" as const },
        ];

        if (record.status === 1) {
          items.push({
            key: "disable",
            label: "禁用账户",
            onClick: () => {
              Modal.confirm({
                title: "确认禁用",
                content: `确定要禁用用户 "${
                  record.nickname || record.username
                }" 吗？`,
                okText: "确认",
                cancelText: "取消",
                onOk: async () => {
                  const result = await updateUser(record.id, { status: 0 });
                  if (result.success) {
                    message.success("已禁用");
                    actionRef.current?.reload();
                  } else {
                    message.error("操作失败");
                  }
                },
              });
            },
          });
        } else {
          items.push({
            key: "enable",
            label: "启用账户",
            onClick: async () => {
              const result = await updateUser(record.id, { status: 1 });
              if (result.success) {
                message.success("已启用");
                actionRef.current?.reload();
              } else {
                message.error("操作失败");
              }
            },
          });
        }

        items.push({
          key: "delete",
          icon: <DeleteOutlined />,
          label: "删除",
          danger: true,
          onClick: () => {
            Modal.confirm({
              title: "确认删除",
              icon: <ExclamationCircleOutlined />,
              content: `确定要删除用户 "${
                record.nickname || record.username
              }" 吗？此操作不可恢复。`,
              okText: "确认删除",
              okType: "danger",
              cancelText: "取消",
              onOk: () => handleDelete(record.id),
            });
          },
        });

        return (
          <Space>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record.id)}
            >
              详情
            </Button>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除"
              description="确定要删除这个用户吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={loading}
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <ProTable<UserItem>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertRender={({ selectedRowKeys }) => (
          <span>
            已选择 <strong>{selectedRowKeys.length}</strong> 个用户
          </span>
        )}
        tableAlertOptionRender={() => (
          <Space size="middle">
            <Button
              size="small"
              onClick={() => handleBatchOperate("enable")}
              disabled={selectedRowKeys.length === 0}
            >
              批量启用
            </Button>
            <Button
              size="small"
              onClick={() => handleBatchOperate("disable")}
              disabled={selectedRowKeys.length === 0}
            >
              批量禁用
            </Button>
            <Popconfirm
              title="确认批量删除"
              description={`确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`}
              onConfirm={() => handleBatchOperate("delete")}
              okText="确认"
              cancelText="取消"
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                size="small"
                danger
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
            </Popconfirm>
            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
              disabled={selectedRowKeys.length === 0}
            >
              取消选择
            </Button>
          </Space>
        )}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新增用户
          </Button>,
        ]}
        request={async (params) => {
          const result = await getUserList(params);
          return {
            data: result.data?.list || [],
            success: result.success,
            total: result.data?.total || 0,
          };
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 1300 }}
      />

      {/* 新增/编辑用户弹窗 */}
      <Modal
        title={editingRecord ? "编辑用户" : "新增用户"}
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
            rules={[
              { required: true, message: "请输入用户名" },
              { min: 3, max: 20, message: "用户名长度为3-20个字符" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "用户名只能包含字母、数字和下划线",
              },
            ]}
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
              label="密码"
              rules={[
                { required: true, message: "请输入密码" },
                { min: 6, max: 20, message: "密码长度为6-20个字符" },
              ]}
            >
              <Input.Password placeholder="请输入密码" maxLength={20} />
            </Form.Item>
          )}
          <Form.Item
            name="nickname"
            label="昵称"
            rules={[{ max: 50, message: "昵称最长50个字符" }]}
          >
            <Input placeholder="请输入昵称" maxLength={50} showCount />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" },
            ]}
          >
            <Input placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: "email", message: "请输入正确的邮箱" }]}
          >
            <Input placeholder="请输入邮箱" maxLength={100} />
          </Form.Item>
          <Form.Item name="role" label="角色" initialValue="user">
            <Select>
              <Select.Option value="user">普通用户</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
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

      {/* 用户详情抽屉 */}
      <Drawer
        title="用户详情"
        placement="right"
        width={600}
        onClose={() => setDetailVisible(false)}
        open={detailVisible}
      >
        {currentUser && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Avatar
                src={currentUser.avatar}
                icon={<UserOutlined />}
                size={80}
              />
              <div style={{ marginTop: 12, fontSize: 18, fontWeight: 500 }}>
                {currentUser.nickname || currentUser.username}
              </div>
              <Space style={{ marginTop: 8 }}>
                <Tag color={currentUser.role === "admin" ? "red" : "blue"}>
                  {currentUser.role === "admin" ? "管理员" : "普通用户"}
                </Tag>
                <Tag color={currentUser.status === 1 ? "success" : "default"}>
                  {currentUser.status === 1 ? "正常" : "禁用"}
                </Tag>
              </Space>
            </div>

            <Divider />

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="用户ID">
                {currentUser.id}
              </Descriptions.Item>
              <Descriptions.Item label="用户名">
                {currentUser.username}
              </Descriptions.Item>
              <Descriptions.Item label="昵称">
                {currentUser.nickname || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="手机号">
                {currentUser.phone || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="邮箱" span={2}>
                {currentUser.email || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间" span={2}>
                {currentUser.createTime}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div style={{ marginTop: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setDetailVisible(false);
                    handleEdit(currentUser);
                  }}
                >
                  编辑用户
                </Button>
                {currentUser.status === 1 ? (
                  <Button
                    danger
                    onClick={async () => {
                      const result = await updateUser(currentUser.id, {
                        status: 0,
                      });
                      if (result.success) {
                        message.success("已禁用");
                        setDetailVisible(false);
                        actionRef.current?.reload();
                      } else {
                        message.error("操作失败");
                      }
                    }}
                  >
                    禁用账户
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    ghost
                    onClick={async () => {
                      const result = await updateUser(currentUser.id, {
                        status: 1,
                      });
                      if (result.success) {
                        message.success("已启用");
                        setDetailVisible(false);
                        actionRef.current?.reload();
                      } else {
                        message.error("操作失败");
                      }
                    }}
                  >
                    启用账户
                  </Button>
                )}
              </Space>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UserList;
