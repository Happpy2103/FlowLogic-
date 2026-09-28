import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../../services/auth";

const { Header, Sider, Content } = Layout;

function DashboardLayout({ children, role }) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getMenuItems = () => {
    if (role === 1) {
      return [
        { key: "1", icon: <DashboardOutlined />, label: "Admin Dashboard" },
        { key: "2", icon: <UserOutlined />, label: "Manage Users" },
      ];
    } else if (role === 2) {
      return [
        { key: "1", icon: <DashboardOutlined />, label: "User Dashboard" },
        { key: "2", icon: <UserOutlined />, label: "My Requests" },
      ];
    } else if (role === 3) {
      return [
        { key: "1", icon: <DashboardOutlined />, label: "Manager Dashboard" },
        { key: "2", icon: <UserOutlined />, label: "Approvals" },
      ];
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider>
        <h2 style={{ color: "white", textAlign: "center", padding: "10px" }}>
          FlowEngine
        </h2>

        <Menu theme="dark" mode="inline" items={getMenuItems()} />

        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: handleLogout,
            },
          ]}
        />
      </Sider>

      {/* Main */}
      <Layout>
        <Header style={{ background: "#fff" }}>
          <h3>Welcome, {user?.fullName}</h3>
        </Header>

        <Content style={{ margin: "20px", background: "#fff", padding: "20px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;