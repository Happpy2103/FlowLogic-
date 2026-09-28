import {
  Card,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Table,
  Space,
  message,
  Popconfirm,
  Tag,
  Divider,
  Row,
  Col,
} from "antd";

import {
  DeleteOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import API from "../../services/api";
import StandalonePage from "../../components/layout/StandalonePage";

const { Title, Text } = Typography;

const { Option } = Select;

function ManageWorkflowFields() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [fields, setFields] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form] = Form.useForm();

  // FETCH FIELDS

  const fetchFields = async () => {

    try {

      setLoading(true);

      const res =
        await API.get(
          `/workflows/${id}/fields`
        );

      setFields(res.data || []);

    } catch (err) {

      console.error(err);

      message.error(
        "Failed to load fields ❌"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchFields();

  }, []);

  // ADD FIELD

  const handleAddField =
    async (values) => {

      try {

        await API.post(
          `/workflows/${id}/fields`,
          values
        );

        message.success(
          "Field Added Successfully "
        );

        form.resetFields();

        fetchFields();

      } catch (err) {

        console.error(err);

        message.error(
          "Failed to add field "
        );
      }
    };

  // DELETE FIELD

  const handleDelete =
    async (fieldId) => {

      try {

        await API.delete(
          `/workflows/fields/${fieldId}`
        );

        message.success(
          "Field Deleted "
        );

        fetchFields();

      } catch (err) {

        console.error(err);

        message.error(
          "Delete Failed "
        );
      }
    };

  // TABLE COLUMNS

  const columns = [

    {
      title: "Field Name",

      dataIndex: "variableName",

      key: "variableName",

      render: (text) => (

        <Text strong>
          {text}
        </Text>
      ),
    },

    {
      title: "Field Type",

      dataIndex: "dataType",

      key: "dataType",

      render: (type) => (

        <Tag
          color="blue"
          style={{
            padding:
              "4px 10px",
            borderRadius: 10,
          }}
        >
          {type}
        </Tag>
      ),
    },

    {
      title: "Action",

      key: "action",

      render: (_, record) => (

        <Popconfirm
          title="Delete Field?"
          onConfirm={() =>
            handleDelete(
              record.variableId
            )
          }
        >

          <Button
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>

        </Popconfirm>
      ),
    },
  ];

  // FORM PREVIEW

  const renderPreviewField =
    (field) => {

      switch (
        field.dataType?.toUpperCase()
      ) {

        case "DATE":

          return (
            <Input
              type="date"
            />
          );

        case "NUMBER":

          return (
            <Input
              type="number"
              placeholder={`Enter ${field.variableName}`}
            />
          );

        case "BOOLEAN":

          return (
            <Select
              placeholder="Select"
            >
              <Option value="true">
                Yes
              </Option>

              <Option value="false">
                No
              </Option>
            </Select>
          );

        default:

          return (
            <Input
              placeholder={`Enter ${field.variableName}`}
            />
          );
      }
    };

  return (
    <StandalonePage>
    <div style={{ padding: 24 }}>

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: 24,
        }}
      >

        <div>

          <Title
            level={2}
            style={{
              marginBottom: 4,
            }}
          >
            Workflow Form Builder
          </Title>

          <Text type="secondary">
            Create dynamic form fields
            for this workflow
          </Text>

        </div>

        <Space>

          <Button
            onClick={() => {
              localStorage.setItem(
                "adminSelectedMenu",
                "workflows"
              );

              navigate("/admin");
            }}
          >
            Back
          </Button>

          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() =>
              navigate(
                "/admin"
              )
            }
          >
            Done
          </Button>

        </Space>

      </div>

      <Row gutter={[24, 24]}>

        {/* LEFT SIDE */}

        <Col
          xs={24}
          lg={14}
        >

          {/* ADD FIELD */}

          <Card
            style={{
              borderRadius: 18,
              marginBottom: 24,
            }}
          >

            <Title
              level={4}
              style={{
                marginBottom: 20,
              }}
            >
              Add New Field
            </Title>

            <Form
              form={form}
              layout="vertical"
              onFinish={
                handleAddField
              }
            >

              <Row gutter={16}>

                {/* FIELD NAME */}

                <Col
                  xs={24}
                  md={10}
                >

                  <Form.Item
                    name="variableName"
                    label="Field Name"
                    rules={[
                      {
                        required: true,
                        message:
                          "Enter field name",
                      },
                    ]}
                  >

                    <Input
                      placeholder="Example: Expense Amount"
                      size="large"
                    />

                  </Form.Item>

                </Col>

                {/* FIELD TYPE */}

                <Col
                  xs={24}
                  md={8}
                >

                  <Form.Item
                    name="dataType"
                    label="Field Type"
                    rules={[
                      {
                        required: true,
                        message:
                          "Select field type",
                      },
                    ]}
                  >

                    <Select
                      placeholder="Select Type"
                      size="large"
                    >

                      <Option value="TEXT">
                        TEXT
                      </Option>

                      <Option value="NUMBER">
                        NUMBER
                      </Option>

                      <Option value="DATE">
                        DATE
                      </Option>

                      <Option value="BOOLEAN">
                        BOOLEAN
                      </Option>

                    </Select>

                  </Form.Item>

                </Col>

                {/* BUTTON */}

                <Col
                  xs={24}
                  md={6}
                >

                  <Form.Item
                    label=" "
                  >

                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={
                        <PlusOutlined />
                      }
                      size="large"
                      block
                    >
                      Add
                    </Button>

                  </Form.Item>

                </Col>

              </Row>

            </Form>

          </Card>

          {/* FIELD TABLE */}

          <Card
            style={{
              borderRadius: 18,
            }}
          >

            <Title
              level={4}
              style={{
                marginBottom: 20,
              }}
            >
              Workflow Fields
            </Title>

            <Table
              loading={loading}
              columns={columns}
              dataSource={fields}
              rowKey="variableId"
              pagination={false}
            />

          </Card>

        </Col>

        {/* RIGHT SIDE */}

        <Col
          xs={24}
          lg={10}
        >

          <Card
            style={{
              borderRadius: 18,
              position: "sticky",
              top: 20,
            }}
          >

            <Title
              level={4}
              style={{
                marginBottom: 4,
              }}
            >
              Form Preview
            </Title>

            <Text type="secondary">
              User application form preview
            </Text>

            <Divider />

            {fields.length === 0 ? (

              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "#999",
                }}
              >
                No fields added yet
              </div>

            ) : (

              <Form layout="vertical">

                {fields.map(
                  (field) => (

                    <Form.Item
                      key={
                        field.variableId
                      }
                      label={

                        <span
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          {
                            field.variableName
                          }
                        </span>
                      }
                    >

                      {renderPreviewField(
                        field
                      )}

                    </Form.Item>
                  )
                )}

              </Form>

            )}

          </Card>

        </Col>

      </Row>

    </div>
    </StandalonePage>
  );
}

export default ManageWorkflowFields;