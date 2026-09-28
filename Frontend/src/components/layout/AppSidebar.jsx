import { Layout, Menu, Button } from "antd";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import ThemeToggle from "./ThemeToggle";
import "./AppSidebar.css";

const { Sider } = Layout;

function AppSidebar({
  collapsed,
  onCollapse,
  selectedKey,
  onSelect,
  items,
  onLogout,
  subtitle,
}) {
  const menuItems = items.map(({ key, icon, label }) => ({
    key,
    icon,
    label,
  }));

  return (
    <Sider
      className="app-sidebar"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={232}
      collapsedWidth={68}
      trigger={null}
    >
      <div className="app-sidebar-shell">
        <div className="app-sidebar-brand">
          <div className="app-sidebar-brand-icon">
            <ThunderboltOutlined />
          </div>
          {!collapsed && (
            <div className="app-sidebar-brand-text">
              <span className="app-sidebar-brand-name">FlowLogic</span>
              {subtitle && (
                <span className="app-sidebar-brand-sub">{subtitle}</span>
              )}
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => onSelect(key)}
          className="app-sidebar-menu"
        />

        <div className="app-sidebar-footer">
          <ThemeToggle
            collapsed={collapsed}
            className="app-sidebar-theme"
          />

          <Button
            type="text"
            block
            icon={<LogoutOutlined />}
            onClick={onLogout}
            className="app-sidebar-logout"
          >
            {!collapsed && "Sign out"}
          </Button>

          <Button
            type="text"
            block
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => onCollapse(!collapsed)}
            className="app-sidebar-collapse"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!collapsed && "Collapse"}
          </Button>
        </div>
      </div>
    </Sider>
  );
}

export default AppSidebar;
