import { Form, Input, Button } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { message } from "antd";
import API from "../../services/api";
import { getUser } from "../../services/auth";
import AuthLayout from "../../components/auth/AuthLayout";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] =
  message.useMessage();

  useEffect(() => {
    const user = getUser();

    if (user?.roleId) {
      if (user.roleId === 1) navigate("/admin");
      else if (user.roleId === 2) navigate("/user");
      else if (user.roleId === 3) navigate("/manager");
    }
  }, [navigate]);

  const redirectByRole = (roleId) => {
    if (roleId === 1) navigate("/admin");
    else if (roleId === 2) navigate("/user");
    else if (roleId === 3) navigate("/manager");
    else messageApi.warning("Unknown role. Contact your administrator.");
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      console.log("LOGIN RESPONSE =", res.data);

      const user = res.data;

      if (user.status !== "success") {
        messageApi.error(user.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: user.userId,
          roleId: user.roleId,
          roleName: user.roleName,
          fullName: user.fullName,
          email: user.email
        })
      );

      console.log(
  "Saved User:",
  JSON.parse(localStorage.getItem("user"))
);



redirectByRole(user.roleId);

      messageApi.success("Signed in successfully.");
      redirectByRole(user.roleId);
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        messageApi.error(err.response.data.message || "Invalid email or password.");
      } else {
        messageApi.error("Unable to reach the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Enter your credentials to access your account."
      footerText="Don't have an account?"
      footerLinkText="Create account"
      footerLinkTo="/register"
    >
      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="you@company.com"
            autoComplete="email"
            size="large"
          />
        </Form.Item>

        <Form.Item
            name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="Enter your password"
            autoComplete="current-password"
            size="large"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
          className="auth-submit-btn"
        >
          Sign in
        </Button>
      </Form>
    </AuthLayout>
  );
}

export default Login;
