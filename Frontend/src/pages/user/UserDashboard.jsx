import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Table,
  Button,
  Space,
  Tag,
} from "antd";

import {
  DashboardOutlined,
  FormOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import API from "../../services/api";

import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import ApplyWorkflow from "./ApplyWorkflow";
import DashboardShell from "../../components/layout/DashboardShell";
import { useChartTheme } from "../../hooks/useChartTheme";
import { getUser, logout } from "../../services/auth";
import MyRequests from "./MyRequests";
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

const { Title, Text } = Typography;

const USER_NAV = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "apply", icon: <FormOutlined />, label: "Apply Workflow" },
  { key: "requests", icon: <FileDoneOutlined />, label: "My Requests" },
  
];

function UserDashboard() {
  const navigate = useNavigate();
  const chartTheme = useChartTheme();

  const [collapsed,
    setCollapsed] =
    useState(false);

const [selectedMenu, setSelectedMenu] =
  useState(
    localStorage.getItem("userMenu") || "dashboard"
  );

  const changeMenu = (menu) => {
  setSelectedMenu(menu);
  localStorage.setItem("userMenu", menu);
};

  const user = getUser();

  const [stats, setStats] = useState({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  completion: 0,
});

const [barData, setBarData] =
  useState([]);

const [activityData, setActivityData] =
  useState([]);

const handleLogout = () => {
  localStorage.removeItem("userMenu");
  logout();
  navigate("/");
};

  const fetchDashboardData =
  async () => {

    try {

      const summary =
        await API.get(
          `/user-dashboard/summary/${user.userId}`
        );

      setStats(
        summary.data
      );

      const monthly =
        await API.get(
          `/user-dashboard/monthly/${user.userId}`
        );

      setBarData(
        monthly.data || []
      );

      const recent =
        await API.get(
          `/user-dashboard/recent/${user.userId}`
        );

      setActivityData(
        recent.data || []
      );

    } catch (err) {

      console.error(
        "Dashboard Error:",
        err
      );
    }
  };

useEffect(() => {

  if (user?.userId) {
    fetchDashboardData();
  }

}, []);



  const activityColumns = [

    {
      title: "Workflow",
      dataIndex: "workflow",
    },

    {
      title: "Status",
      dataIndex: "status",

      render: (status) => {

        let color =
          "blue";

        if (
          status ===
          "APPROVED"
        )
          color = "green";

        if (
          status ===
          "REJECTED"
        )
          color = "red";

        if (
          status ===
          "PENDING"
        )
          color = "orange";

        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },

    {
      title: "Date",
      dataIndex: "date",
    },
  ];

  const pieData = [

  {
    name: "Approved",
    value: stats.approved,
    color: "#52c41a",
  },

  {
    name: "Pending",
    value: stats.pending,
    color: "#faad14",
  },

  {
    name: "Rejected",
    value: stats.rejected,
    color: "#ff4d4f",
  },
];

 
  return (
    <DashboardShell
      collapsed={collapsed}
      onCollapse={setCollapsed}
      selectedKey={selectedMenu}
      onSelect={changeMenu}
      onLogout={handleLogout}
      subtitle="Employee"
      navItems={USER_NAV}
      userName={user?.fullName || "User"}
      userRole="Employee"
    >
      {selectedMenu === "dashboard" && (

            <>

              {/* TITLE */}

              <div
                style={{
                  marginBottom: 28,
                }}
              >

                <Title
                  level={2}
                  style={{
                    marginBottom: 4,
                  }}
                >
                  Dashboard Overview
                </Title>

                <Text
                  type="secondary"
                >
                  Monitor workflow activities and requests
                </Text>

              </div>

              {/* STAT CARDS */}

              <Row
                gutter={[20, 20]}
                style={{
                  marginBottom: 28,
                }}
              >

                <Col
                  xs={24}
                  sm={12}
                  md={6}
                >

                  <Card
                    variant="borderless"
                    className="fl-card"
                  >

                    <Statistic
                      title="Total Requests"
                      value={stats.total}
                      prefix={
                        <FileDoneOutlined />
                      }
                    />

                  </Card>

                </Col>

                <Col
                  xs={24}
                  sm={12}
                  md={6}
                >

                  <Card
                    variant="borderless"
                    className="fl-card"
                  >

                    <Statistic
                      title="Pending"
                      value={stats.pending}
                      style={{
                        content: {
                          color:
                            "#faad14",
                        }
                      }}
                      prefix={
                        <ClockCircleOutlined />
                      }
                    />

                  </Card>

                </Col>

                <Col
                  xs={24}
                  sm={12}
                  md={6}
                >

                  <Card
                    variant="borderless"
                    className="fl-card"
                  >

                    <Statistic
                      title="Approved"
                      value={stats.approved}
                      style={{
                        content: {
                          color:
                            "#52c41a",
                        }
                      }}
                      prefix={
                        <CheckCircleOutlined />
                      }
                    />

                  </Card>

                </Col>

                <Col
                  xs={24}
                  sm={12}
                  md={6}
                >

                  <Card
                    variant="borderless"
                    className="fl-card"
                  >

                    <Statistic
                      title="Rejected"
                      value={stats.rejected}
                      style={{
                        content: {
                          color:
                            "#ff4d4f",
                        }
                      }}
                      prefix={
                        <CloseCircleOutlined />
                      }
                    />

                  </Card>

                </Col>

              </Row>

              {/* CHARTS */}

              <Row
                gutter={[20, 20]}
                style={{
                  marginBottom: 28,
                }}
              >

                {/* PIE */}

                <Col
                  xs={24}
                  lg={10}
                >

                  <Card
                    title="Workflow Status"
                    variant="borderless"
                    className="fl-card"
                  >

                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >

                      <PieChart>

                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          label
                        >

                          {pieData.map(
                            (
                              entry,
                              index
                            ) => (

                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.color
                                }
                              />
                            )
                          )}

                        </Pie>

                        <Tooltip contentStyle={chartTheme.tooltipStyle} />

                      </PieChart>

                    </ResponsiveContainer>

                  </Card>

                </Col>

                {/* BAR */}

                <Col
                  xs={24}
                  lg={14}
                >

                  <Card
                    title="Monthly Workflow Activity"
                    variant="borderless"
                    className="fl-card"
                  >

                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >

                      <BarChart
                        data={barData}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chartTheme.grid}
                        />

                        <XAxis
                          dataKey="month"
                          tick={{ fill: chartTheme.axis }}
                        />

                        <YAxis tick={{ fill: chartTheme.axis }} />

                        <Tooltip contentStyle={chartTheme.tooltipStyle} />

                        <Bar
                          dataKey="workflows"
                          fill={chartTheme.bar}
                          radius={[
                            8,
                            8,
                            0,
                            0,
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </Card>

                </Col>

              </Row>

              {/* LOWER SECTION */}

              <Row
                gutter={[20, 20]}
              >

                {/* RECENT ACTIVITY */}

                <Col
                  xs={24}
                  lg={16}
                >

                  <Card
                    title="Recent Workflow Activity"
                    variant="borderless"
                    className="fl-card"
                  >

                    <Table
                      rowKey={(record) => record.activityId}
                      columns={
                        activityColumns
                      }
                      dataSource={
                        activityData
                      }
                      pagination={false}
                    />

                  </Card>

                </Col>

                {/* QUICK ACTIONS */}

                <Col
                  xs={24}
                  lg={8}
                >

                  <Card
                    title="Quick Actions"
                    variant="borderless"
                    className="fl-card"
                  >

                    <Space
                      orientation="vertical"
                      size={18}
                      style={{
                        width: "100%",
                      }}
                    >

                      <Button
                        type="primary"
                        size="large"
                        block
                        icon={
                          <FormOutlined />
                        }
                        onClick={() =>
                            changeMenu("apply")
                          }
                      >
                      Apply Workflow
                      </Button>

                      <Button
                        size="large"
                        block
                        icon={
                          <BarChartOutlined />
                        }
                        onClick={() =>
                           changeMenu("requests")
                        }
                      >
                        Track Requests
                      </Button>

                      <Button
                        size="large"
                        block
                        icon={
                          <ThunderboltOutlined />
                        }
                      >
                        Workflow Insights
                      </Button>

                    </Space>

                    <div
                      style={{
                        marginTop: 28,
                      }}
                    >

                      <Text strong>
                        Workflow Completion
                      </Text>

                      <Progress
                        percent={stats.completion}
                        status="active"
                        strokeColor={chartTheme.bar}
                      />

                    </div>

                  </Card>

                </Col>

              </Row>

            </>
          )}

          {/* APPLY WORKFLOW */}

          {selectedMenu ===
            "apply" && (

            <ApplyWorkflow />

          )}

         {selectedMenu === "requests" && (
            <MyRequests />
          )}

    </DashboardShell>
  );
}

export default UserDashboard;