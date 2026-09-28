import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
} from "antd";

import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";

import PublicLayout from "../components/layout/PublicLayout";

function Contact() {
  const onFinish = () => {
    message.success(
      "Message sent successfully."
    );
  };

  return (
    <PublicLayout>
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          padding: "60px 20px",
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
          <Row gutter={[40, 40]}>
            {/* Left Side */}
            <Col xs={24} md={10}>
              <h1>Contact FlowLogic</h1>

              <p
                style={{
                  color: "#595959",
                  lineHeight: 1.8,
                }}
              >
                Have a question, feature request,
                or need support?
              </p>

              <p
                style={{
                  color: "#595959",
                  lineHeight: 1.8,
                }}
              >
                Fill out the form and our team
                will get back to you within
                1–2 business days.
              </p>

              <Card
                style={{
                  marginTop: 20,
                  background: "#f5f7ff",
                  borderRadius: 16,
                }}
              >
                <h3>Reach Us Directly</h3>

                <p>
                  <MailOutlined
                    style={{
                      color: "#1677ff",
                    }}
                  />{" "}
                  support@flowlogic.com
                </p>

                <p>
                  <PhoneOutlined
                    style={{
                      color: "#52c41a",
                    }}
                  />{" "}
                  +91 00000 00000
                </p>

                <p>
                  <EnvironmentOutlined
                    style={{
                      color: "#722ed1",
                    }}
                  />{" "}
                  Surat, Gujarat, India
                </p>

                <p>
                  Monday – Friday
                  <br />
                  10:00 AM – 6:00 PM IST
                </p>
              </Card>
            </Col>

            {/* Right Side */}
            <Col xs={24} md={14}>
              <Form
                layout="vertical"
                onFinish={onFinish}
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter your name",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your name"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter email",
                    },
                    {
                      type: "email",
                      message:
                        "Invalid email",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Subject"
                  name="subject"
                >
                  <Input
                    placeholder="What is this regarding?"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Message"
                  name="message"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter message",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Your message..."
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  size="large"
                  block
                >
                  Send Message
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>
      </div>
    </PublicLayout>
  );
}

export default Contact;