import {
  auditComment,
  batchAuditComments,
  batchDeleteComments,
  deleteComment,
  getCommentDetail,
  getCommentList,
  type CommentItem,
} from "@/services/api";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import type { MenuProps } from "antd";
import {
  Avatar,
  Button,
  Dropdown,
  message,
  Modal,
  Popconfirm,
  Space,
  Tag,
} from "antd";
import { useCallback, useRef, useState } from "react";

const CommentList = () => {
  const actionRef = useRef<any>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CommentItem | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 审核评论
  const handleAudit = useCallback(async (id: string, status: number) => {
    try {
      const result = await auditComment(id, { status });
      if (result.success) {
        message.success(status === 1 ? "审核通过" : "已屏蔽");
        actionRef.current?.reload();
      } else {
        message.error(result.message || "操作失败");
      }
    } catch (error: any) {
      message.error(error.message || "操作失败");
    }
  }, []);

  // 删除评论
  const handleDelete = useCallback(async (id: string) => {
    try {
      const result = await deleteComment(id);
      if (result.success) {
        message.success("删除成功");
        actionRef.current?.reload();
      } else {
        message.error(result.message || "删除失败");
      }
    } catch (error: any) {
      message.error(error.message || "删除失败");
    }
  }, []);

  // 查看详情
  const handleViewDetail = useCallback(async (id: string) => {
    try {
      const result = await getCommentDetail(id);
      if (result.success && result.data) {
        setCurrentRecord(result.data);
        setDetailVisible(true);
      } else {
        message.error("获取详情失败");
      }
    } catch (error: any) {
      message.error(error.message || "获取详情失败");
    }
  }, []);

  // 批量删除
  const handleBatchDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning("请选择要删除的评论");
      return;
    }
    Modal.confirm({
      title: "确认批量删除",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 条评论吗？此操作不可恢复。`,
      okText: "确认删除",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          const result = await batchDeleteComments(selectedRowKeys as string[]);
          if (result.success) {
            message.success(`成功删除 ${selectedRowKeys.length} 条评论`);
            setSelectedRowKeys([]);
            actionRef.current?.reload();
          } else {
            message.error(result.message || "批量删除失败");
          }
        } catch (error: any) {
          message.error(error.message || "批量删除失败");
        }
      },
    });
  }, [selectedRowKeys]);

  // 批量审核
  const handleBatchAudit = useCallback(
    (status: number) => {
      if (selectedRowKeys.length === 0) {
        message.warning("请选择要操作的评论");
        return;
      }
      Modal.confirm({
        title: status === 1 ? "确认批量通过" : "确认批量屏蔽",
        icon: <ExclamationCircleOutlined />,
        content: `确定要${status === 1 ? "通过" : "屏蔽"}选中的 ${
          selectedRowKeys.length
        } 条评论吗？`,
        okText: "确认",
        cancelText: "取消",
        onOk: async () => {
          try {
            const result = await batchAuditComments(
              selectedRowKeys as string[],
              status
            );
            if (result.success) {
              message.success(
                `成功${status === 1 ? "通过" : "屏蔽"} ${
                  selectedRowKeys.length
                } 条评论`
              );
              setSelectedRowKeys([]);
              actionRef.current?.reload();
            } else {
              message.error(result.message || "操作失败");
            }
          } catch (error: any) {
            message.error(error.message || "操作失败");
          }
        },
      });
    },
    [selectedRowKeys]
  );

  // 获取状态标签
  const getStatusTag = (status: number) => {
    const statusMap: Record<number, { color: string; text: string }> = {
      0: { color: "warning", text: "待审核" },
      1: { color: "success", text: "正常" },
      2: { color: "error", text: "已屏蔽" },
    };
    const { color, text } = statusMap[status] || {
      color: "default",
      text: "未知",
    };
    return <Tag color={color}>{text}</Tag>;
  };

  // 获取目标类型标签
  const getTargetTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      museum: { color: "blue", text: "博物馆" },
      ugc: { color: "green", text: "UGC" },
      exhibition: { color: "purple", text: "展览" },
    };
    const { color, text } = typeMap[type] || { color: "default", text: type };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
      search: false,
    },
    {
      title: "评论内容",
      dataIndex: "content",
      ellipsis: true,
      width: 250,
      render: (text: string) => <span title={text}>{text}</span>,
    },
    {
      title: "评论者",
      dataIndex: "authorName",
      width: 120,
      render: (text: string, record: CommentItem) => (
        <Space>
          <Avatar src={record.authorAvatar} size="small">
            {text?.[0] || "U"}
          </Avatar>
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "评论对象类型",
      dataIndex: "targetType",
      width: 120,
      valueType: "select",
      valueEnum: {
        museum: { text: "博物馆" },
        ugc: { text: "UGC" },
        exhibition: { text: "展览" },
      },
      render: (type: string) => getTargetTypeTag(type),
    },
    {
      title: "评论对象",
      dataIndex: "targetName",
      width: 150,
    },
    {
      title: "点赞数",
      dataIndex: "likes",
      width: 80,
      search: false,
      sorter: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      valueType: "select",
      valueEnum: {
        0: { text: "待审核", status: "Warning" },
        1: { text: "正常", status: "Success" },
        2: { text: "已屏蔽", status: "Error" },
      },
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "评论时间",
      dataIndex: "createTime",
      width: 180,
      search: false,
      sorter: true,
    },
    {
      title: "操作",
      valueType: "option",
      width: 200,
      fixed: "right" as const,
      render: (_: any, record: CommentItem) => {
        const items: MenuProps["items"] = [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: "查看详情",
            onClick: () => handleViewDetail(record.id),
          },
        ];

        if (record.status === 0) {
          items.push({
            key: "approve",
            icon: <CheckOutlined />,
            label: "审核通过",
            onClick: () => handleAudit(record.id, 1),
          });
          items.push({
            key: "reject",
            icon: <CloseOutlined />,
            label: "屏蔽评论",
            onClick: () => handleAudit(record.id, 2),
          });
        } else if (record.status === 1) {
          items.push({
            key: "block",
            icon: <CloseOutlined />,
            label: "屏蔽评论",
            onClick: () => handleAudit(record.id, 2),
          });
        } else if (record.status === 2) {
          items.push({
            key: "restore",
            icon: <CheckOutlined />,
            label: "恢复显示",
            onClick: () => handleAudit(record.id, 1),
          });
        }

        items.push({ type: "divider" as const });
        items.push({
          key: "delete",
          icon: <DeleteOutlined />,
          label: "删除评论",
          danger: true,
          onClick: () => {
            Modal.confirm({
              title: "确认删除",
              icon: <ExclamationCircleOutlined />,
              content: "确定要删除这条评论吗？此操作不可恢复。",
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
            <Dropdown menu={{ items }} trigger={["click"]}>
              <Button type="link" size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
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
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertRender={({ selectedRowKeys }) => (
          <span>
            已选择 <strong>{selectedRowKeys.length}</strong> 条评论
          </span>
        )}
        tableAlertOptionRender={() => (
          <Space size="middle">
            <Button
              size="small"
              onClick={() => handleBatchAudit(1)}
              disabled={selectedRowKeys.length === 0}
              icon={<CheckOutlined />}
            >
              批量通过
            </Button>
            <Button
              size="small"
              onClick={() => handleBatchAudit(2)}
              disabled={selectedRowKeys.length === 0}
              icon={<CloseOutlined />}
            >
              批量屏蔽
            </Button>
            <Popconfirm
              title="确认批量删除"
              description={`确定要删除选中的 ${selectedRowKeys.length} 条评论吗？`}
              onConfirm={handleBatchDelete}
              okText="确认"
              cancelText="取消"
              disabled={selectedRowKeys.length === 0}
            >
              <Button
                size="small"
                danger
                disabled={selectedRowKeys.length === 0}
                icon={<DeleteOutlined />}
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
        request={async (params) => {
          const result = await getCommentList({
            current: params.current,
            pageSize: params.pageSize,
            content: params.content,
            authorName: params.authorName,
            targetType: params.targetType,
            targetName: params.targetName,
            status: params.status,
          });
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
        scroll={{ x: 1400 }}
      />

      <Modal
        title="评论详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={
          currentRecord && currentRecord.status === 0 ? (
            <Space>
              <Button onClick={() => setDetailVisible(false)}>关闭</Button>
              <Button
                danger
                onClick={() => {
                  handleAudit(currentRecord.id, 2);
                  setDetailVisible(false);
                }}
              >
                屏蔽
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  handleAudit(currentRecord.id, 1);
                  setDetailVisible(false);
                }}
              >
                通过审核
              </Button>
            </Space>
          ) : currentRecord && currentRecord.status === 1 ? (
            <Space>
              <Button onClick={() => setDetailVisible(false)}>关闭</Button>
              <Button
                danger
                onClick={() => {
                  handleAudit(currentRecord.id, 2);
                  setDetailVisible(false);
                }}
              >
                屏蔽评论
              </Button>
            </Space>
          ) : currentRecord && currentRecord.status === 2 ? (
            <Space>
              <Button onClick={() => setDetailVisible(false)}>关闭</Button>
              <Button
                type="primary"
                onClick={() => {
                  handleAudit(currentRecord.id, 1);
                  setDetailVisible(false);
                }}
              >
                恢复显示
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
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar src={currentRecord.authorAvatar} size={48}>
                {currentRecord.authorName?.[0] || "U"}
              </Avatar>
              <div style={{ marginLeft: 12 }}>
                <div style={{ fontWeight: 500 }}>
                  {currentRecord.authorName}
                </div>
                <div style={{ color: "#999", fontSize: 12 }}>
                  ID: {currentRecord.authorId}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>评论对象：</strong>
              <Space style={{ marginLeft: 8 }}>
                {getTargetTypeTag(currentRecord.targetType)}
                <span>{currentRecord.targetName}</span>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>状态：</strong>
              <span style={{ marginLeft: 8 }}>
                {getStatusTag(currentRecord.status)}
              </span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>点赞数：</strong>
              <span style={{ marginLeft: 8 }}>{currentRecord.likes}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>评论时间：</strong>
              <span style={{ marginLeft: 8 }}>{currentRecord.createTime}</span>
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>评论内容：</strong>
              <div
                style={{
                  marginTop: 8,
                  padding: 12,
                  background: "#f5f5f5",
                  borderRadius: 4,
                  whiteSpace: "pre-wrap",
                }}
              >
                {currentRecord.content}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CommentList;
