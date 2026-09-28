import { useEffect, useState } from "react";

import {
  Card,
  Row,
  Col,
  Table,
  Timeline,
  Button,
  Space,
} from "antd";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  DashboardOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import API from "../../services/api";
import { logout, getUser } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../../components/layout/DashboardShell";
import { useChartTheme } from "../../hooks/useChartTheme";
import ManageRequests from "./ManageRequests";

const MANAGER_NAV = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
   { key: "requests", icon: <FileDoneOutlined />,  label: "Manage Requests", },
   
];
const COLORS = [
  "#52c41a", // approved
  "#faad14", // pending
  "#ff4d4f", // rejected
  "#fa8c16", // on hold
  "#722ed1", // send back
  "#13c2c2", // closed
];

function ManagerDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const chartTheme = useChartTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(
  localStorage.getItem("managerMenu") || "dashboard");
  const [monthlyData, setMonthlyData] = useState([]);

  const changeMenu = (menu) => {
  setSelectedMenu(menu);
  localStorage.setItem("managerMenu", menu);
};

const [refreshing, setRefreshing] =
  useState(false);



  const [recentActivities, setRecentActivities] = useState([]);
  const [workflowPerformance, setWorkflowPerformance] = useState([]);
  const [workflowStats, setWorkflowStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    onHold: 0,
    sendBack: 0,
    closedCount: 0,
    total: 0,
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchDashboardData = async (silent = false) => {
  try {
    if (silent) setRefreshing(true);

    const user = getUser();

    const statsRes = await API.get(
      `/manager/${user.userId}/dashboard/stats`
    );
    setWorkflowStats(statsRes.data);

    const monthlyRes = await API.get(
      "/manager/monthly-stats"
    );
    setMonthlyData(monthlyRes.data || []);

    const activityRes = await API.get(
      "/manager/recent-activities"
    );
    setRecentActivities(activityRes.data || []);

    const performanceRes = await API.get(
      "/manager/workflow-performance"
    );
    setWorkflowPerformance(
      performanceRes.data || []
    );

  } catch (err) {
    console.error("Dashboard Error:", err);
  } finally {
    setRefreshing(false);
  }
};

useEffect(() => {
  fetchDashboardData();
}, []);

  const pieData = [
    { name: "Approved", value: workflowStats.approved },
    { name: "Pending", value: workflowStats.pending },
    { name: "Rejected", value: workflowStats.rejected },
    { name: "On Hold", value: workflowStats.onHold },
    { name: "Send Back", value: workflowStats.sendBack },
    { name: "Closed", value: workflowStats.closedCount },
  ];

  const MANAGER_STATS = [
  {
    title: "Pending",
    value: workflowStats.pending,
    icon: <ClockCircleOutlined />,
    color: "#faad14",
    bg: "#fff7e6",
  },
  {
    title: "Approved",
    value: workflowStats.approved,
    icon: <CheckCircleOutlined />,
    color: "#52c41a",
    bg: "#f6ffed",
  },
  {
    title: "Rejected",
    value: workflowStats.rejected,
    icon: <CloseCircleOutlined />,
    color: "#ff4d4f",
    bg: "#fff1f0",
  },
  {
    title: "Closed",
    value: workflowStats.closedCount,
    icon: <FileDoneOutlined />,
    color: "#13c2c2",
    bg: "#e6fffb",
  },
];  

  return (
    <DashboardShell
  collapsed={collapsed}
  onCollapse={setCollapsed}
  selectedKey={selectedMenu}
  onSelect={changeMenu}
  onLogout={handleLogout}
  subtitle="Manager"
  navItems={MANAGER_NAV}
  userName={user?.fullName || "Manager"}
  userRole="Manager"
  pageTitle="Dashboard Overview"
  pageSubtitle="Monitor approvals and workflow performance"
  headerExtra={
    <Button
      icon={<ReloadOutlined spin={refreshing} />}
      loading={refreshing}
      onClick={() => fetchDashboardData(true)}
    >
      Refresh
    </Button>
  }
>
    {selectedMenu === "requests" && (
    <ManageRequests />
  )}


  {selectedMenu === "dashboard" && (
    <>


      
      <Row gutter={[20,20]} style={{ marginBottom: 28 }}>
  {MANAGER_STATS.map((item) => (
    <Col xs={24} sm={12} lg={6}>
      <Card variant="borderless" className="fl-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ color: "#8c8c8c" }}>
              {item.title}
            </div>

            <h2
              style={{
                marginTop: 8,
                color: item.color,
              }}
            >
              {item.value}
            </h2>
          </div>

          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: item.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: item.color,
              fontSize: 24,
            }}
          >
            {item.icon}
          </div>
        </div>
      </Card>
    </Col>
  ))}
</Row>

      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
  {/* Manager Overview */}
  <Col xs={24} lg={16}>
    <Card
      title="Manager Overview"
      variant="borderless"
      className="fl-card"
      style={{ height: "100%" }}
    >
      <p>
        Monitor approval requests, review workflow
        performance and manage pending actions.
      </p>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <div className="fl-feature-tile">
            <CheckCircleOutlined />
            <div>Approved Requests</div>
          </div>
        </Col>

        <Col span={12}>
          <div className="fl-feature-tile">
            <ClockCircleOutlined />
            <div>Pending Reviews</div>
          </div>
        </Col>
      </Row>
    </Card>
  </Col>

  {/* Quick Actions */}
  <Col xs={24} lg={8}>
    <Card
      title="Quick Actions"
      variant="borderless"
      className="fl-card"
      style={{ height: "100%" }}
    >
      <Space
        direction="vertical"
        size={12}
        style={{ width: "100%" }}
      >
        <Button
          type="primary"
          block
          size="large"
          icon={<FileDoneOutlined />}
          onClick={() => changeMenu("requests")}
        >
          Manage Requests
        </Button>

        <Button
          block
          size="large"
          icon={<DashboardOutlined />}
          onClick={() => changeMenu("dashboard")}
        >
          Dashboard
        </Button>

        <Button
          block
          size="large"
          icon={<ReloadOutlined />}
          loading={refreshing}
          onClick={() => fetchDashboardData(true)}
        >
          Refresh Dashboard
        </Button>
      </Space>
    </Card>
  </Col>
</Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activities" variant="borderless" className="fl-card">
            <Timeline
              items={recentActivities.map(item => ({
                color: "blue",
                children: (
                  <>
                    <strong>{item.activity}</strong>
                    <br />
                    <span style={{ color: "#8c8c8c" }}>
                      {item.createdAt}
                    </span>
                  </>
                )
              }))}  
                />
          </Card>
        </Col>
        

        <Col xs={24} lg={12}>
          <Card title="Workflow Performance" variant="borderless" className="fl-card">
            <Table
              rowKey="workflow"
              pagination={false}
              dataSource={workflowPerformance}
              columns={[
                { title: "Workflow", dataIndex: "workflow" },
                { title: "Requests", dataIndex: "count" },
              ]}
            />
          </Card>
        </Col>
      </Row>
     </>
    )}
    </DashboardShell>
  );
}

export default ManagerDashboard;
