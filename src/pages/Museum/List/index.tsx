import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, message, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { getMuseumList, createMuseum, updateMuseum, deleteMuseum } from '@/services/api';

interface MuseumItem {
  id: string;
  name: string;
  province: string;
  city: string;
  address: string;
  level: string;
  type: string;
  status: number;
  createTime: string;
}

const MuseumList = () => {
  const actionRef = useRef<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MuseumItem | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: MuseumItem) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMuseum(id);
      if (result.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        const result = await updateMuseum(editingRecord.id, values);
        if (result.success) {
          message.success('更新成功');
          setModalVisible(false);
          actionRef.current?.reload();
        } else {
          message.error(result.message || '更新失败');
        }
      } else {
        const result = await createMuseum(values);
        if (result.success) {
          message.success('创建成功');
          setModalVisible(false);
          actionRef.current?.reload();
        } else {
          message.error(result.message || '创建失败');
        }
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '博物馆名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '省份',
      dataIndex: 'province',
      width: 100,
    },
    {
      title: '城市',
      dataIndex: 'city',
      width: 100,
    },
    {
      title: '级别',
      dataIndex: 'level',
      width: 120,
      valueEnum: {
        '一级': { text: '一级', status: 'success' },
        '二级': { text: '二级', status: 'processing' },
        '三级': { text: '三级', status: 'default' },
        '未定级': { text: '未定级', status: 'warning' },
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
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
      render: (_: any, record: MuseumItem) => [
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
          description="确定要删除这个博物馆吗？"
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
      <ProTable<MuseumItem>
        headerTitle="博物馆列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增博物馆
          </Button>,
        ]}
        request={async (params) => {
          const result = await getMuseumList(params);
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
        }}
      />

      <Modal
        title={editingRecord ? '编辑博物馆' : '新增博物馆'}
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
            name="name"
            label="博物馆名称"
            rules={[{ required: true, message: '请输入博物馆名称' }]}
          >
            <Input placeholder="请输入博物馆名称" />
          </Form.Item>
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
            name="address"
            label="详细地址"
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          <Form.Item
            name="level"
            label="级别"
            rules={[{ required: true, message: '请选择级别' }]}
          >
            <Select placeholder="请选择级别">
              <Select.Option value="一级">一级</Select.Option>
              <Select.Option value="二级">二级</Select.Option>
              <Select.Option value="三级">三级</Select.Option>
              <Select.Option value="未定级">未定级</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请输入类型' }]}
          >
            <Input placeholder="请输入类型，如：综合博物馆、历史博物馆等" />
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

export default MuseumList;
