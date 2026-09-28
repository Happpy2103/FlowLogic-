import {
  Button,
  Card,
  Col,
  Row,
  Statistic,
} from "antd";

import {
  NodeIndexOutlined,
  FormOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";

function Home() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div
        style={{
          minHeight: "85vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('/images/home-hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          padding: "0 20px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Automate Approvals.
            <br />
            Accelerate Work.
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              maxWidth: 750,
              margin: "0 auto 30px",
              color: "rgba(255,255,255,.9)",
              lineHeight: 1.8,
            }}
          >
            FlowLogic helps organizations build
            workflows, automate approvals,
            manage requests and improve
            operational efficiency from a
            single intelligent platform.
          </p>

          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Why Choose */}
      <div
        style={{
          padding: "90px 60px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 36,
            marginBottom: 12,
          }}
        >
          Why Choose FlowLogic?
        </h2>

        <p
          style={{
            color: "#8c8c8c",
            maxWidth: 700,
            margin: "auto",
          }}
        >
          Modern workflow automation for
          organizations seeking transparency,
          efficiency and accountability.
        </p>

        <Row
          gutter={[24, 24]}
          style={{ marginTop: 50 }}
        >
          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <NodeIndexOutlined
                style={{
                  fontSize: 42,
                  color: "#1677ff",
                }}
              />

              <h3 style={{ marginTop: 20 }}>
                Workflow Automation
              </h3>

              <p>
                Automate repetitive business
                processes and approval routing.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ borderRadius: 16 }}
            >
              <CheckCircleOutlined
                style={{
                  fontSize: 42,
                  color: "#52c41a",
                }}
              />

              <h3 style={{ marginTop: 20 }}>
                Approval Management
              </h3>

              <p>
                Track approvals and decisions
                with complete visibility.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              hoverable
              style={{ borderRadius: 16 }}
            >
              <BarChartOutlined
                style={{
                  fontSize: 42,
                  color: "#722ed1",
                }}
              />

              <h3 style={{ marginTop: 20 }}>
                Analytics & Insights
              </h3>

              <p>
                Monitor workflow performance
                using real-time dashboards.
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Features */}
      <div
        style={{
          padding: "90px 60px",
          background: "#fafafa",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 36,
            marginBottom: 50,
          }}
        >
          What You Can Do With FlowLogic
        </h2>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <Card hoverable>
              <NodeIndexOutlined
                style={{
                  fontSize: 40,
                  color: "#1677ff",
                }}
              />

              <h3>Workflow Builder</h3>

              <p>
                Design custom workflow
                structures visually.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card hoverable>
              <FormOutlined
                style={{
                  fontSize: 40,
                  color: "#52c41a",
                }}
              />

              <h3>Request Submission</h3>

              <p>
                Submit workflow requests with
                dynamic forms.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card hoverable>
              <CheckCircleOutlined
                style={{
                  fontSize: 40,
                  color: "#fa8c16",
                }}
              />

              <h3>Approvals</h3>

              <p>
                Managers can review and
                approve requests efficiently.
              </p>
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card hoverable>
              <BarChartOutlined
                style={{
                  fontSize: 40,
                  color: "#722ed1",
                }}
              />

              <h3>Reporting</h3>

              <p>
                Analyze workflow metrics and
                approval trends.
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Statistics */}
      <div
        style={{
          padding: "90px 60px",
        }}
      >
        <Row
          gutter={[24, 24]}
          justify="center"
        >
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Requests Processed"
                value={1240}
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Approval Rate"
                value={98}
                suffix="%"
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={245}
              />
            </Card>
          </Col>

          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Workflows Created"
                value={57}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* CTA */}
      <div
        style={{
          background:
            "linear-gradient(90deg,#1677ff,#722ed1)",
          textAlign: "center",
          color: "#fff",
          padding: "90px 20px",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: 36,
          }}
        >
          Ready to Transform Your
          Workflow Process?
        </h2>

        <p
          style={{
            maxWidth: 700,
            margin: "20px auto",
            color: "rgba(255,255,255,.9)",
          }}
        >
          Start building workflows,
          automating approvals and improving
          productivity today.
        </p>

        <Button
          size="large"
          onClick={() => navigate("/register")}
        >
          Get Started
        </Button>
      </div>
    </PublicLayout>
  );
}

export default Home;