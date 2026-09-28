import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Timeline,
  Badge,
  Button,
  Space,
  Progress,
  Skeleton,
  Tooltip,
  Divider,
} from "antd";

import {
  DashboardOutlined,
  UserOutlined,
  SyncOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  SettingOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ApiOutlined,
  DatabaseOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
NodeIndexOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../../services/auth";
import { useEffect, useState } from "react";
import API from "../../services/api";
import AssignManagers from "./AssignManagers";
import WorkflowMonitor from "./WorkflowMonitor";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import ManageUsers from "./ManageUsers";
import ManageWorkflows from "./ManageWorkflows";
import DashboardShell from "../../components/layout/DashboardShell";
import { useChartTheme } from "../../hooks/useChartTheme";

const ADMIN_NAV = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "users", icon: <TeamOutlined />, label: "Users" },
  { key: "workflow", icon: <SyncOutlined />, label: "Workflows" },
  { key: "assign-manager", icon: <TeamOutlined />, label: "Assign Managers",},
  { key: "workflow-monitor",icon: <BarChartOutlined />, label: "Workflow Monitor", }
];
const { Title, Text } = Typography;

const ICON_BOX = (bg, color) => ({
  width: 52,
  height: 52,
  borderRadius: 14,
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  color,
  flexShrink: 0,
});

const PAGE_META = {
  dashboard: {
  title: "Admin Dashboard",
  subtitle:
    "Monitor users, workflows, requests, and system performance",
},
  users: {
    title: "Manage Users",
    subtitle: "Create, edit, and manage user accounts and roles",
  },
  workflow: {
    title: "Manage Workflows",
    subtitle: "Manage Workflows Build, publish, and monitor workflow processes across your organization."
  },
  "assign-manager": {
  title: "Assign Managers",
  subtitle:
    "Assign workflow requests to managers for approval processing",
},
"workflow-monitor": {
  title: "Workflow Monitor",
  subtitle: "Track workflow execution node by node",
},
};



const STAT_CARDS = [
  {
    key: "users",
    title: "Total Users",
    field: "totalUsers",
    icon: <UserOutlined />,
    color: "#1677ff",
    bg: "#e6f4ff",
    menu: "users",
  },
  {
    key: "workflows",
    title: "Total Workflows",
    field: "totalWorkflows",
    icon: <SyncOutlined />,
    color: "#52c41a",
    bg: "#f6ffed",
    menu: "workflow",
  },
  {
    key: "requests",
    title: "Total Requests",
    field: "totalRequests",
    icon: <FileTextOutlined />,
    color: "#fa8c16",
    bg: "#fff7e6",
    menu: null,
  },
  {
    key: "pending",
    title: "Pending Requests",
    field: "pendingRequests",
    icon: <ClockCircleOutlined />,
    color: "#722ed1",
    bg: "#f9f0ff",
    menu: null,
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const chartTheme = useChartTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(() => {
  return localStorage.getItem("adminSelectedMenu") || "dashboard";
});
  const [refreshing, setRefreshing] = useState(false);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWorkflows, setTotalWorkflows] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  const stats = {
    totalUsers,
    totalWorkflows,
    totalRequests,
    pendingRequests,
  };

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const [userRes, workflowRes] = await Promise.all([
        API.get("/users/count"),
        API.get("/workflows/count"),
      ]);

      setTotalUsers(userRes.data?.count || 0);
      setTotalWorkflows(workflowRes.data?.count || 0);

      try {
        const requestRes = await API.get("/workflow-submissions/count");
        setTotalRequests(requestRes.data?.count || 0);
      } catch {
        setTotalRequests(0);
      }

      try {
        const pendingRes = await API.get("/workflow-submissions/pending-count");
        setPendingRequests(pendingRes.data?.count || 0);
      } catch {
        setPendingRequests(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

const handleLogout = () => {
  localStorage.removeItem("adminSelectedMenu");
  logout();
  navigate("/");
};

const handleMenuSelect = (key) => {
  setSelectedMenu(key);
  localStorage.setItem("adminSelectedMenu", key);
};

  const processedRequests = Math.max(0, totalRequests - pendingRequests);

  const pieData = [
    { name: "Pending", value: pendingRequests, color: "#faad14" },
    { name: "Processed", value: processedRequests, color: "#52c41a" },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: "Users", count: totalUsers },
    { name: "Workflows", count: totalWorkflows },
    { name: "Requests", count: totalRequests },
    { name: "Pending", count: pendingRequests },
  ];

  const pageMeta = PAGE_META[selectedMenu] || PAGE_META.dashboard;

  const renderStatCard = ({ title, field, icon, color, bg, menu }) => (
  <Card
  variant="borderless"
  hoverable={!!menu}
  className="fl-card"
  style={{
    cursor: menu ? "pointer" : "default",
    overflow: "hidden",
    position: "relative",
  }}
  onClick={() => menu && handleMenuSelect(menu)}
>
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: color,
    }}
  />

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div>
      <Text type="secondary">{title}</Text>

      <Title
        level={2}
        style={{
          margin: "8px 0 0",
          color,
        }}
      >
        {stats[field]}
      </Title>
    </div>

    <div
      style={{
        ...ICON_BOX(bg, color),
        width: 60,
        height: 60,
        borderRadius: 18,
      }}
    >
      {icon}
    </div>
  </div>
</Card>
  );

  const renderDashboard = () => {
    if (loading) {
      return (
        <>
          <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
            {[1, 2, 3, 4].map((i) => (
              <Col key={i} xs={24} sm={12} lg={6}>
                <Card variant="borderless" className="fl-card">
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
          </Row>
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={14}>
              <Card variant="borderless" className="fl-card">
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card variant="borderless" className="fl-card">
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
          </Row>
        </>
      );
    }

    return (
      <>

        <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
          {STAT_CARDS.map((card) => (
            <Col key={card.key} xs={24} sm={12} lg={6}>
              {renderStatCard(card)}
            </Col>
          ))}
        </Row>

        <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
          <Col xs={24} lg={10}>
            <Card
              title="Request Status Distribution"
              variant="borderless"
              className="fl-card"
              style={{ height: "100%" }}
            >
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip contentStyle={chartTheme.tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 280,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text type="secondary">No request data available yet</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={14}>
            <Card
              title="System Metrics"
              variant="borderless"
              className="fl-card"
              style={{ height: "100%" }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis dataKey="name" tick={{ fontSize: 13, fill: chartTheme.axis }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 13, fill: chartTheme.axis }} />
                  <ChartTooltip contentStyle={chartTheme.tooltipStyle} />
                  <Bar dataKey="count" fill={chartTheme.bar} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
          <Col xs={24} lg={14}>
            <Card
              title="System Overview"
              variant="borderless"
              className="fl-card"
              style={{ height: "100%" }}
            >
              <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
                Welcome to the Workflow Management System. Use the tools below to
                administer users, workflows, and monitor organizational processes.
              </Text>

              <Row gutter={[16, 16]}>
                {[
                  {
                    icon: <TeamOutlined />,
                    title: "User Management",
                    desc: "Add, edit, and assign roles to users",
                    color: "#1677ff",
                    bg: "#e6f4ff",
                    menu: "users",
                  },
                  {
                    icon: <SyncOutlined />,
                    title: "Workflow Builder",
                    desc: "Design and manage approval workflows",
                    color: "#52c41a",
                    bg: "#f6ffed",
                    menu: "workflow",
                  },
                  {
                    icon: <SafetyCertificateOutlined />,
                    title: "Approvals",
                    desc: "Track submissions and approval states",
                    color: "#722ed1",
                    bg: "#f9f0ff",
                    menu: null,
                  },
                  {
                    icon: <ThunderboltOutlined />,
                    title: "Real-time Stats",
                    desc: "Live counts from your backend services",
                    color: "#fa8c16",
                    bg: "#fff7e6",
                    menu: null,
                  },
                ].map((item) => (
                  <Col key={item.title} xs={24} sm={12}>
                    <div
                      role={item.menu ? "button" : undefined}
                      tabIndex={item.menu ? 0 : undefined}
                      onClick={() => item.menu && handleMenuSelect(item.menu)}
                      onKeyDown={(e) =>
                        item.menu &&
                        e.key === "Enter" &&
                        handleMenuSelect(item.menu)
                      }
                      className={`fl-feature-tile${item.menu ? " fl-feature-tile--clickable" : ""}`}
                    >
                      <div style={ICON_BOX(item.bg, item.color)}>{item.icon}</div>
                      <div>
                        <Text strong style={{ display: "block" }}>
                          {item.title}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {item.desc}
                        </Text>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card
              title="System Status"
              variant="borderless"
              className="fl-card"
              style={{ height: "100%" }}
            >
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Badge status="success" text="All Systems Operational" />
                <div style={{ marginTop: 16 }}>
                  <Progress
                   type="dashboard"
                    percent={100}
                    size={100}
                    strokeColor="#52c41a"
                    format={() => (
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#52c41a" }}>
                        ACTIVE
                      </span>
                    )}
                  />
                </div>
                <Text type="secondary" style={{ display: "block", marginTop: 12 }}>
                  All services are running normally
                </Text>
              </div>

              <Divider style={{ margin: "16px 0" }} />

              <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                {[
                  { icon: <ApiOutlined />, label: "API Server", status: "Connected" },
                  { icon: <DatabaseOutlined />, label: "Database", status: "Healthy" },
                  { icon: <SyncOutlined />, label: "Workflow Engine", status: "Running" },
                ].map((service) => (
                  <div
                    key={service.label}
                    className="fl-surface"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                    }}
                  >
                    <Space>
                      <span style={{ color: "#1677ff" }}>{service.icon}</span>
                      <Text>{service.label}</Text>
                    </Space>
                    <Space size={4}>
                      <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      <Text type="success" style={{ fontSize: 13 }}>
                        {service.status}
                      </Text>
                    </Space>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={16}>
            <Card title="Recent Activity" variant="borderless" className="fl-card">
              <Timeline
                items={[
                  {
                    color: "green",
                    icon: <CheckCircleOutlined />,
                    content: (
                      <>
                        <Text strong>System initialized</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          Workflow Management System started successfully
                        </Text>
                      </>
                    ),
                  },
                  {
                    color: "blue",
                    icon: <UserOutlined />,
                    content: (
                      <>
                        <Text strong>{totalUsers} users registered</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          User accounts loaded from database
                        </Text>
                      </>
                    ),
                  },
                  {
                    color: "green",
                    icon: <SyncOutlined />,
                    content: (
                      <>
                        <Text strong>{totalWorkflows} workflows configured</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          Workflow definitions are active and ready
                        </Text>
                      </>
                    ),
                  },
                  {
                    color: pendingRequests > 0 ? "orange" : "green",
                    icon: <ClockCircleOutlined />,
                    content: (
                      <>
                        <Text strong>
                          {pendingRequests > 0
                            ? `${pendingRequests} requests awaiting review`
                            : "No pending requests"}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {totalRequests} total submissions processed
                        </Text>
                      </>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Quick Actions" variant="borderless" className="fl-card">
              <Space orientation="vertical" style={{ width: "100%" }} size={12}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<TeamOutlined />}
                  onClick={() => handleMenuSelect("users")}
                  style={{
                      borderRadius: 14,
                      height: 52,
                      fontWeight: 600,
                    }}
                  >
                  Manage Users
                </Button>
                <Button
                  size="large"
                  block
                  icon={<SettingOutlined />}
                  onClick={() => handleMenuSelect("workflow")}
                  style={{ borderRadius: 10, height: 48 }}
                >
                  Manage Workflows
                </Button>
                <Button
                  size="large"
                  block
                  icon={<ReloadOutlined spin={refreshing} />}
                  onClick={() => fetchDashboardData(true)}
                  loading={refreshing}
                  style={{ borderRadius: 10, height: 48 }}
                >
                  Refresh Dashboard
                </Button>
              </Space>

              <Divider />

              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: "var(--fl-tip-bg)",
                }}
              >
                <Space>
                  <ThunderboltOutlined style={{ fontSize: 20, color: "#1677ff" }} />
                  <div>
                    <Text strong style={{ display: "block" }}>
                      Pro Tip
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Click stat cards to jump directly to Users or Workflows.
                    </Text>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>
      </>
    );
  };

  const renderContent = () => {
    if (selectedMenu === "users") {
      return (
        <Card variant="borderless" className="fl-card">
          <ManageUsers />
        </Card>
      );
    }

    if (selectedMenu === "workflow") {
      return <ManageWorkflows />;
    }
    if (selectedMenu === "assign-manager") {
  return <AssignManagers />;
}
if (selectedMenu === "workflow-monitor") {
  return <WorkflowMonitor />;
}

    return renderDashboard();
  };

  const headerExtra =
    selectedMenu === "dashboard" && !loading ? (
      <Tooltip title="Refresh dashboard data">
        <Button
          icon={<ReloadOutlined spin={refreshing} />}
          onClick={() => fetchDashboardData(true)}
          loading={refreshing}
        >
          Refresh
        </Button>
      </Tooltip>
    ) : null;

  return (
    <DashboardShell
      collapsed={collapsed}
      onCollapse={setCollapsed}
      selectedKey={selectedMenu}
      onSelect={handleMenuSelect}
      onLogout={handleLogout}
      subtitle="Admin"
      navItems={ADMIN_NAV}
      userName={user?.fullName || "Admin"}
      userRole="Administrator"
      pageTitle={
        selectedMenu === "dashboard"
          ? "Admin Dashboard"
          : pageMeta.title
      }

      

      pageSubtitle={
        selectedMenu === "dashboard"
          ? "Monitor users, workflows, requests and system performance."
          : pageMeta.subtitle
      }
      headerExtra={headerExtra}
    >
      {renderContent()}
    </DashboardShell>
  );
}

export default AdminDashboard;
