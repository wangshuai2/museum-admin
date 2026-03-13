import { ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, Tag, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useRef } from 'react';

interface CommentItem {
  id: string;
  content: string;
  author: string;
  targetType: string;
  targetName: string;
  status: number;
  createTime: string;
}

const CommentList = () => {
  const actionRef = useRef<any>();

  // 模拟数据
  const mockData: CommentItem[] = [
    { id: '1', content: '这个博物馆真的很棒！', author: '用户A', targetType: '博物馆', targetName: '故宫博物院', status: 1, createTime: '2024-03-10 10:30:00' },
    { id: '2', content: '展品非常丰富，值得一看。', author: '用户B', targetType: '博物馆', targetName: '国家博物馆', status: 1, createTime: '2024-03-10 14:20:00' },
    { id: '3', content: '讲解很专业，学到了很多知识。', author: '用户C', targetType: 'UGC', targetName: '故宫一日游攻略', status: 1, createTime: '2024-03-11 09:15:00' },
  ];

  const handleDelete = async (id: string) => {
    message.success('删除成功');
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
      title: '评论内容',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '评论者',
      dataIndex: 'author',
      width: 120,
    },
    {
      title: '评论对象类型',
      dataIndex: 'targetType',
      width: 120,
    },
    {
      title: '评论对象',
      dataIndex: 'targetName',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '正常' : '已屏蔽'}
        </Tag>
      ),
      valueEnum: {
        1: { text: '正常' },
        0: { text: '已屏蔽' },
      },
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      width: 180,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (_: any, record: CommentItem) => [
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这条评论吗？"
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
      <ProTable<CommentItem>
        headerTitle="评论管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params) => {
          // 模拟API调用
          const filteredData = mockData.filter(item => {
            if (params.content && !item.content.includes(params.content)) return false;
            if (params.author && !item.author.includes(params.author)) return false;
            if (params.targetType && !item.targetType.includes(params.targetType)) return false;
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
    </div>
  );
};

export default CommentList;
