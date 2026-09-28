import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import API from "../../services/api";
import AuthLayout from "../../components/auth/AuthLayout";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        roleId: 2,
      });

      if (res.data.status === "success") {
        message.success(res.data.message || "Account created successfully.");
        navigate("/");
      } else {
        message.error(res.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        message.error(err.response.data.message || "Registration failed.");
      } else {
        message.error("Unable to reach the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join FlowLogic to automate workflows, track approvals, and manage requests efficiently."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          name="fullName"
          label="Full name"
          rules={[{ required: true, message: "Please enter your full name" }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="John Doe"
            autoComplete="name"
            size="large"
          />
        </Form.Item>

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
          label="Password"
          rules={[
            {
              required: true,
              message: "Please enter a password",
            },
            {
              pattern:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
              message:
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
            },
          ]}
        >
           <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Create a password"
              autoComplete="new-password"
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
          Create account
        </Button>
      </Form>
    </AuthLayout>
  );
}

export default Register;
