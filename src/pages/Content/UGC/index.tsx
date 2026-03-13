import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, message, Modal, Image, Space } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { getUGCList, approveUGC, rejectUGC } from '@/services/api';

interface UGCItem {
  id: string;
  content: string;
  images: string[];
  author: string;
  authorAvatar: string;
  museum: string;
  status: number;
  createTime: string;
}

const UGCList = () => {
  const actionRef = useRef<any>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<UGCItem | null>(null);

  const handleApprove = async (id: string) => {
    try {
      const result = await approveUGC(id);
      if (result.success) {
        message.success('审核通过');
        actionRef.current?.reload();
      } else {
        message.error(result.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const result = await rejectUGC(id);
      if (result.success) {
        message.success('已拒绝');
        actionRef.current?.reload();
      } else {
        message.error(result.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleViewDetail = (record: UGCItem) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      search: false,
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
      width: 300,
    },
    {
      title: '图片',
      dataIndex: 'images',
      width: 100,
      search: false,
      render: (images: string[]) => (
        images && images.length > 0 ? (
          <Image.PreviewGroup>
            <Image
              src={images[0]}
              width={60}
              height={60}
              style={{ objectFit: 'cover', borderRadius: 4 }}
            />
          </Image.PreviewGroup>
        ) : (
          <span style={{ color: '#999' }}>无图片</span>
        )
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 120,
    },
    {
      title: '关联博物馆',
      dataIndex: 'museum',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => {
        const statusMap: Record<number, { color: string; text: string }> = {
          0: { color: 'warning', text: '待审核' },
          1: { color: 'success', text: '已通过' },
          2: { color: 'error', text: '已拒绝' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={color}>{text}</Tag>;
      },
      valueEnum: {
        0: { text: '待审核' },
        1: { text: '已通过' },
        2: { text: '已拒绝' },
      },
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      width: 180,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_: any, record: UGCItem) => [
        <Button
          key="view"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>,
        record.status === 0 && (
          <>
            <Button
              key="approve"
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id)}
              style={{ color: '#52c41a' }}
            >
              通过
            </Button>
            <Popconfirm
              key="reject"
              title="确认拒绝"
              description="确定要拒绝这条内容吗？"
              onConfirm={() => handleReject(record.id)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" danger icon={<CloseOutlined />}>
                拒绝
              </Button>
            </Popconfirm>
          </>
        ),
      ],
    },
  ];

  return (
    <div>
      <ProTable<UGCItem>
        headerTitle="UGC审核"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          const result = await getUGCList(params);
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
        title="UGC详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          currentRecord?.status === 0 ? (
            <Space>
              <Button onClick={() => setDetailVisible(false)}>关闭</Button>
              <Button danger onClick={() => { handleReject(currentRecord.id); setDetailVisible(false); }}>
                拒绝
              </Button>
              <Button type="primary" onClick={() => { handleApprove(currentRecord.id); setDetailVisible(false); }}>
                通过
              </Button>
            </Space>
          ) : (
            <Button onClick={() => setDetailVisible(false)}>关闭</Button>
          )
        }
        width={700}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>作者：</strong>{currentRecord.author}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>关联博物馆：</strong>{currentRecord.museum}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>状态：</strong>
              <Tag color={
                currentRecord.status === 0 ? 'warning' :
                currentRecord.status === 1 ? 'success' : 'error'
              }>
                {currentRecord.status === 0 ? '待审核' :
                 currentRecord.status === 1 ? '已通过' : '已拒绝'}
              </Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>发布时间：</strong>{currentRecord.createTime}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>内容：</strong>
              <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                {currentRecord.content}
              </div>
            </div>
            {currentRecord.images && currentRecord.images.length > 0 && (
              <div>
                <strong>图片：</strong>
                <div style={{ marginTop: 8 }}>
                  <Image.PreviewGroup>
                    <Space>
                      {currentRecord.images.map((img, index) => (
                        <Image
                          key={index}
                          src={img}
                          width={120}
                          height={120}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                      ))}
                    </Space>
                  </Image.PreviewGroup>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UGCList;
