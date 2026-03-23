import { getDashboardStats } from "@/services/api";
import {
  BankOutlined,
  EyeOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ProCard, StatisticCard } from "@ant-design/pro-components";
import { Col, DatePicker, Row, Space } from "antd";
import { useEffect, useState } from "react";

const { Statistic } = StatisticCard;

interface DashboardStats {
  museumCount: number;
  userCount: number;
  ugcCount: number;
  visitCount: number;
  museumTrend: number;
  userTrend: number;
  ugcTrend: number;
  visitTrend: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    museumCount: 0,
    userCount: 0,
    ugcCount: 0,
    visitCount: 0,
    museumTrend: 0,
    userTrend: 0,
    ugcTrend: 0,
    visitTrend: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const result = await getDashboardStats();
      if (result.success) {
        setStats(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <ProCard
        title="数据概览"
        extra={
          <Space>
            <DatePicker.RangePicker />
          </Space>
        }
        headerBordered
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <StatisticCard
              statistic={{
                title: "博物馆数量",
                value: stats.museumCount,
                icon: (
                  <BankOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                ),
                description: (
                  <Statistic.Trend
                    trend={stats.museumTrend >= 0 ? "up" : "down"}
                    value={Math.abs(stats.museumTrend)}
                  />
                ),
              }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatisticCard
              statistic={{
                title: "注册用户",
                value: stats.userCount,
                icon: (
                  <UserOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                ),
                description: (
                  <Statistic.Trend
                    trend={stats.userTrend >= 0 ? "up" : "down"}
                    value={Math.abs(stats.userTrend)}
                  />
                ),
              }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatisticCard
              statistic={{
                title: "UGC内容",
                value: stats.ugcCount,
                icon: (
                  <FileTextOutlined
                    style={{ fontSize: 24, color: "#faad14" }}
                  />
                ),
                description: (
                  <Statistic.Trend
                    trend={stats.ugcTrend >= 0 ? "up" : "down"}
                    value={Math.abs(stats.ugcTrend)}
                  />
                ),
              }}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatisticCard
              statistic={{
                title: "总访问量",
                value: stats.visitCount,
                icon: (
                  <EyeOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                ),
                description: (
                  <Statistic.Trend
                    trend={stats.visitTrend >= 0 ? "up" : "down"}
                    value={Math.abs(stats.visitTrend)}
                  />
                ),
              }}
              loading={loading}
            />
          </Col>
        </Row>
      </ProCard>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ProCard
            title="博物馆分布"
            headerBordered
            style={{ marginBottom: 24 }}
          >
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              图表区域 - 博物馆省市分布
            </div>
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard
            title="用户增长趋势"
            headerBordered
            style={{ marginBottom: 24 }}
          >
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              图表区域 - 用户增长趋势
            </div>
          </ProCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ProCard title="UGC内容统计" headerBordered>
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              图表区域 - UGC内容类型分布
            </div>
          </ProCard>
        </Col>
        <Col xs={24} lg={12}>
          <ProCard title="热门博物馆排行" headerBordered>
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              图表区域 - 热门博物馆TOP10
            </div>
          </ProCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
