import { Button, Tooltip } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle({ collapsed = false, className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <Button
        type="text"
        block={!collapsed}
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={toggleTheme}
        className={className}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {!collapsed && (isDark ? "Light mode" : "Dark mode")}
      </Button>
    </Tooltip>
  );
}

export default ThemeToggle;
