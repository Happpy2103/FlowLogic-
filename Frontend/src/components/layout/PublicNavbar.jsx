import { Layout, Menu, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#fff",
      }}
    >
     <div
        onClick={() => navigate("/")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
        }}
    >
  <img
    src="/images/flow_logo.png"
    alt="FlowLogic Logo"
    style={{
      width: "42px",
      height: "42px",
      objectFit: "contain",
    }}
  />

  <h2
    style={{
      margin: 0,
      fontWeight: 700,
      color: "#111827",
    }}
  >
    FlowLogic
  </h2>
</div>

      <Menu
        mode="horizontal"
        items={[
          { key: "/", label: "Home" },
          { key: "/about", label: "About" },
          { key: "/contact", label: "Contact Us" },
        ]}
        onClick={({ key }) => navigate(key)}
      />

      <Space>
        <Button onClick={() => navigate("/register")}>
          Register
        </Button>

        <Button
          type="primary"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Space>
    </Header>
  );
}

export default PublicNavbar;