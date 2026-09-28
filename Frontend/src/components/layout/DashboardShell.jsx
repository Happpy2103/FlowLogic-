import { Layout, Typography, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import AppSidebar from "./AppSidebar";
import "./dashboard.css";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

function DashboardShell({
  collapsed,
  onCollapse,
  selectedKey,
  onSelect,
  onLogout,
  subtitle,
  navItems,
  userName,
  userRole,
  pageTitle,
  pageSubtitle,
  headerExtra,
  children,
}) {
  return (
    <Layout className="dashboard-layout">
      <AppSidebar
        collapsed={collapsed}
        onCollapse={onCollapse}
        selectedKey={selectedKey}
        onSelect={onSelect}
        onLogout={onLogout}
        subtitle={subtitle}
        items={navItems}
      />

      <Layout>
        <Header className="dashboard-header">
          <div>
            <Title level={3} className="dashboard-header-title">
              {userName}
            </Title>
            <Text type="secondary">{userRole}</Text>
          </div>

          <Space size={16}>
            {headerExtra}
            <div className="dashboard-user">
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className="dashboard-avatar"
              />
              <div>
                <Text strong style={{ display: "block", fontSize: 14 }}>
                  {userName}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {userRole}
                </Text>
              </div>
            </div>
          </Space>
        </Header>

        <Content className="dashboard-content">
          {(pageTitle || pageSubtitle) && (
            <div className="dashboard-page-header">
              {pageTitle && (
                <Title level={2} style={{ marginBottom: 4 }}>
                  {pageTitle}
                </Title>
              )}
              {pageSubtitle && (
                <Text type="secondary">{pageSubtitle}</Text>
              )}
            </div>
          )}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardShell;


