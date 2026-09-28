import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Divider,
} from "antd";

import {
  InfoCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";

function About() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "60px 20px",
          minHeight: "100vh",
        }}
      >
        <Card
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            borderRadius: 24,
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            <InfoCircleOutlined
              style={{
                fontSize: 42,
                color: "#1677ff",
              }}
            />

            <h1
              style={{
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              About FlowLogic
            </h1>

            <p
              style={{
                color: "#8c8c8c",
              }}
            >
              A workflow automation platform
              designed to simplify approvals,
              streamline business processes and
              improve productivity.
            </p>
          </div>

          <Row gutter={[32, 32]}>
            {/* Left */}
            <Col xs={24} lg={14}>
              <p>
                <strong>FlowLogic</strong> is a
                modern workflow management
                platform that enables organizations
                to automate approval processes,
                manage requests efficiently and
                improve operational transparency.
              </p>

              <p>
                Instead of relying on manual
                approvals, emails and spreadsheets,
                FlowLogic centralizes workflow
                execution into a single system
                where employees, managers and
                administrators collaborate
                effectively.
              </p>

              <Divider />

              <h2>Our Mission</h2>

              <p>
                To simplify business operations
                through workflow automation,
                intelligent approval routing and
                transparent process management.
              </p>

              <h2>Our Vision</h2>

              <p>
                To empower organizations with a
                scalable workflow platform that
                increases efficiency, accountability
                and digital transformation.
              </p>
            </Col>

            {/* Right */}
            <Col xs={24} lg={10}>
              <Card
                style={{
                  background: "#f0f7ff",
                  borderRadius: 16,
                  marginBottom: 20,
                }}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Requests"
                      value={1240}
                    />
                  </Col>

                  <Col span={8}>
                    <Statistic
                      title="Users"
                      value={245}
                    />
                  </Col>

                  <Col span={8}>
                    <Statistic
                      title="Success"
                      value={98}
                      suffix="%"
                    />
                  </Col>
                </Row>
              </Card>

              <Card
                style={{
                  background: "#f6ffed",
                  borderRadius: 16,
                }}
              >
                <h3>Built for Business Automation</h3>

                <p>
                  Visual workflow builder,
                  approval routing and request
                  tracking.
                </p>

                <h3>Secure & Scalable</h3>

                <p>
                  Role-based access control,
                  JWT authentication and
                  enterprise-ready architecture.
                </p>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Features */}
          <h2>What You Can Do With FlowLogic</h2>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <p>
                <CheckCircleOutlined
                  style={{ color: "#52c41a" }}
                />{" "}
                Create workflow requests
              </p>

              <p>
                <CheckCircleOutlined
                  style={{ color: "#52c41a" }}
                />{" "}
                Upload supporting documents
              </p>

              <p>
                <CheckCircleOutlined
                  style={{ color: "#52c41a" }}
                />{" "}
                Track approval status
              </p>

              <p>
                <CheckCircleOutlined
                  style={{ color: "#52c41a" }}
                />{" "}
                Receive workflow notifications
              </p>
            </Col>

            <Col xs={24} md={12}>
              <p>
                <CheckCircleOutlined
                  style={{ color: "#52c41a" }}
                />{" "}
                Build custom workflows
              </p>

              <p>
                <CheckCircleOutlined
                  style={{ color: "#52c41a" }}
                />{" "}
                Manage users and roles
              </p>

              <p>
                <CheckCircleOutlined
                  style={{ color: "#52c41a" }}
                />{" "}
                Monitor workflow performance
              </p>

              <p>
                <CheckCircleOutlined
                  style={{ color: "#52c41a" }}
                />{" "}
                Generate reports and analytics
              </p>
            </Col>
          </Row>

          <Divider />

          {/* Roles */}
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card>
                <h3>For Employees</h3>

                <p>
                  Submit workflow requests,
                  monitor approvals and receive
                  real-time updates.
                </p>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card>
                <h3>For Managers & Admins</h3>

                <p>
                  Review requests, manage
                  workflows, configure approvals
                  and monitor system activity.
                </p>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* CTA */}
          <div
            style={{
              textAlign: "center",
            }}
          >
            <p>
              Interested in workflow automation?
              Contact our team today.
            </p>

            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/contact")}
            >
              Contact Our Team
            </Button>
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}

export default About;