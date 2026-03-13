import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, message, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';

interface CityItem {
  id: string;
  province: string;
  city: string;
  museumCount: number;
  status: number;
  createTime: string;
}

const CityManagement = () => {
  const actionRef = useRef<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CityItem | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: CityItem[] = [
    { id: '1', province: '北京', city: '北京市', museumCount: 15, status: 1, createTime: '2024-01-15 10:30:00' },
    { id: '2', province: '上海', city: '上海市', museumCount: 12, status: 1, createTime: '2024-01-15 10:30:00' },
    { id: '3', province: '陕西', city: '西安市', museumCount: 8, status: 1, createTime: '2024-01-16 14:20:00' },
    { id: '4', province: '江苏', city: '南京市', museumCount: 10, status: 1, createTime: '2024-01-17 09:15:00' },
    { id: '5', province: '浙江', city: '杭州市', museumCount: 7, status: 1, createTime: '2024-01-18 16:45:00' },
  ];

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: CityItem) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    message.success('删除成功');
    actionRef.current?.reload();
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

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '省份',
      dataIndex: 'province',
      width: 120,
    },
    {
      title: '城市',
      dataIndex: 'city',
      width: 150,
    },
    {
      title: '博物馆数量',
      dataIndex: 'museumCount',
      width: 120,
      search: false,
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
      width: 150,
      render: (_: any, record: CityItem) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这个城市吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确认"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div>
      <ProTable<CityItem>
        headerTitle="省市管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增城市
          </Button>,
        ]}
        request={async (params) => {
          // 模拟API调用
          const filteredData = mockData.filter(item => {
            if (params.province && !item.province.includes(params.province)) return false;
            if (params.city && !item.city.includes(params.city)) return false;
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
        title={editingRecord ? '编辑城市' : '新增城市'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="province"
            label="省份"
            rules={[{ required: true, message: '请输入省份' }]}
          >
            <Input placeholder="请输入省份" />
          </Form.Item>
          <Form.Item
            name="city"
            label="城市"
            rules={[{ required: true, message: '请输入城市' }]}
          >
            <Input placeholder="请输入城市" />
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
    </div>
  );
};

export default CityManagement;
