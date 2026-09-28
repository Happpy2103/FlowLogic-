import {
  Row,
  Col,
  Card,
  Button,
  Input,
  Modal,
  Form,
  Typography,
  Space,
  Tag,
  Empty,
  Statistic,
  message,
  Tooltip,
  Divider,
  Drawer,
} from "antd";

import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  BuildOutlined,
  SearchOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  StopOutlined,
  FileAddOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../../services/api";

import { getUser } from "../../services/auth";

const { Title, Text } = Typography;

function ManageWorkflows() {

  const navigate = useNavigate();

  const user = getUser();

  const [form] = Form.useForm();

  const [loading, setLoading] =
    useState(false);

  const [workflows, setWorkflows] =
    useState([]);

  const [
    filteredWorkflows,
    setFilteredWorkflows,
  ] = useState([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);
const [search, setSearch] = useState("");
const [editOpen, setEditOpen] = useState(false);

  const [
    selectedWorkflow,
    setSelectedWorkflow,
  ] = useState(null);

  const [editName, setEditName] =
    useState("");

  const [
    editDescription,
    setEditDescription,
  ] = useState("");

  // FETCH WORKFLOWS

  const fetchWorkflows = async () => {

  if (!user?.userId) {
    console.error("User not found");
    return;
  }

  try {

    setLoading(true);

    const res = await API.get(
      `/workflows/admin/${user.userId}`
    );


    setWorkflows(res.data || []);
    setFilteredWorkflows(res.data || []);

  } catch (err) {

    console.error(
      "Workflow Error:",
      err.response?.data || err
    );

    message.error(
      "Failed to fetch workflows"
    );

  } finally {

    setLoading(false);
  }
};

  // SEARCH

  const handleSearch = (value) => {

    setSearch(value);

    const filtered = workflows.filter(
      (wf) =>
        wf.workflowName
          ?.toLowerCase()
          .includes(
            value.toLowerCase()
          )
    );

    setFilteredWorkflows(filtered);
  };

// LOAD WORKFLOWS ON PAGE LOAD

useEffect(() => {

  if (user?.userId) {

    fetchWorkflows();

  } else {

    message.error(
      "User session not found. Please login again."
    );
  }

}, []);

// CREATE WORKFLOW

  const createWorkflow = async (
    values
  ) => {

    try {

      setLoading(true);

      await API.post(
        "/workflows/create",
        {
          workflowName:
            values.workflowName,

          description:
            values.description,

          createdBy: user.userId,
        }
      );

      message.success(
        "Workflow created successfully"
      );

      form.resetFields();

      setIsModalOpen(false);

      fetchWorkflows();

    } catch (err) {

      console.error(err);

      message.error(
        "Failed to create workflow"
      );

    } finally {

      setLoading(false);
    }
  };


  // DELETE WORKFLOW


  const deleteWorkflow = async (
    workflowId
  ) => {

    try {

      setLoading(true);

      await API.delete(
        `/workflows/${workflowId}`
      );

      message.success(
        "Workflow deleted successfully"
      );

      fetchWorkflows();

    } catch (err) {

      console.error(err);

      message.error(
        "Delete failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // TOGGLE STATUS

  const toggleWorkflowStatus =
    async (workflowId) => {

      try {

        setLoading(true);

        await API.put(
          `/workflows/toggle-status/${workflowId}`
        );

        message.success(
          "Workflow status updated"
        );

        fetchWorkflows();

      } catch (err) {

        console.error(err);

        message.error(
          "Failed to update workflow status"
        );

      } finally {

        setLoading(false);
      }
    };

    const publishWorkflow = async (
  workflowId
) => {

  try {

    setLoading(true);

    const res =
      await API.put(
        `/workflows/publish/${workflowId}`
      );

    message.success(
      res.data.message
    );

    fetchWorkflows();

  } catch (err) {

    console.error(err);

    message.error(
      err?.response?.data?.message ||
      "Publish failed"
    );

  } finally {

    setLoading(false);
  }
};
  // OPEN EDIT

  const openEditDrawer = (
    workflow
  ) => {

    setSelectedWorkflow(workflow);

    setEditName(
      workflow.workflowName
    );

    setEditDescription(
      workflow.description || ""
    );

    setEditOpen(true);
  };

  // UPDATE WORKFLOW
  const updateWorkflow = async () => {

    try {

      setLoading(true);

      await API.put(
        `/workflows/update/${selectedWorkflow.workflowId}`,
        {
          workflowName: editName,

          description:
            editDescription,
        }
      );

      message.success(
        "Workflow updated successfully"
      );

      setEditOpen(false);

      fetchWorkflows();

    } catch (err) {

      console.error(err);

      message.error(
        "Failed to update workflow"
      );

    } finally {

      setLoading(false);
    }
  };

  // STATISTICS
  const totalWorkflows =
    workflows.length;

  const activeWorkflows =
    workflows.filter(
      (wf) => wf.isActive
    ).length;

  const inactiveWorkflows =
    workflows.filter(
      (wf) => !wf.isActive
    ).length;

  return (
    <div>

      {/* HEADER */}

      <Row
  justify="end"
  style={{
    marginBottom: 24,
  }}
>
  <Space>
    <Input
      placeholder="Search workflows"
      prefix={<SearchOutlined />}
      value={search}
      onChange={(e) =>
        handleSearch(e.target.value)
      }
      style={{
        width: 260,
      }}
      allowClear
    />

    <Button
      type="primary"
      size="large"
      icon={<PlusOutlined />}
      onClick={() =>
        setIsModalOpen(true)
      }
    >
      Create Workflow
    </Button>
  </Space>
</Row>

      {/* STATS */}

      <Row
        gutter={[16, 16]}
        style={{
          marginBottom: 24,
        }}
      >

        <Col
          xs={24}
          sm={12}
          md={12}
          lg={8}
        >

          <Card
            variant="borderless"
            style={{
              borderLeft: "4px solid #1677ff",
              borderRadius: 12,
            }}
          >

            <Statistic
              title="Total Workflows"
              value={totalWorkflows}
              prefix={
                <SyncOutlined />
              }
            />

          </Card>

        </Col>

        <Col
          xs={24}
          sm={12}
          md={12}
          lg={8}
        >

          <Card
            variant="borderless"
            style={{
              borderLeft: "4px solid #52c41a",
              borderRadius: 12,
            }}
          >

            <Statistic
              title="Active Workflows"
              value={activeWorkflows}
              prefix={
                <CheckCircleOutlined />
              }
            />

          </Card>

        </Col>

        <Col
          xs={24}
          sm={12}
          md={12}
          lg={8}
          
        >

          <Card variant="borderless"
            style={{
              borderLeft: "4px solid #ff4d4f",
              borderRadius: 12,
            }}
          >

            <Statistic
              title="Inactive Workflows"
              value={inactiveWorkflows}
              prefix={
                <StopOutlined />
              }
            />

          </Card>

        </Col>

      </Row>

      {/* WORKFLOW GRID */}

      {filteredWorkflows.length ===
      0 ? (

        <Card>

          <Empty
            description="No workflows found"
            image={
              Empty.PRESENTED_IMAGE_SIMPLE
            }
          >

            <Button
              type="primary"
              onClick={() =>
                setIsModalOpen(true)
              }
            >
              Create First Workflow
            </Button>

          </Empty>

        </Card>

      ) : (

        <Row gutter={[20, 20]}>

          {filteredWorkflows.map(
            (wf) => (

              <Col xs={24}
                sm={12}
                md={12}
                lg={8}
                key={wf.workflowId}
              >

              <Card
                hoverable
                loading={loading}
                style={{
                  borderRadius: 14,
                  height: "100%",
                  borderTop: `4px solid ${
                    wf.isActive ? "#52c41a" : "#ff4d4f"
                  }`,
                }}
              >
                

                  {/* HEADER */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",

                      alignItems:
                        "start",

                      marginBottom: 12,
                    }}
                  >

                    <div>

                      <Title
                        level={5}
                        style={{
                          marginBottom: 4,
                        }}
                      >
                        {
                          wf.workflowName
                        }
                      </Title>

                      <Text type="secondary">
                        Workflow #
                        {
                          wf.workflowId
                        }
                      </Text>

                    </div>

                    <div>
                      <Tag
                        color={
                          wf.isActive
                            ? "green"
                            : "red"
                        }
                      >
                        {wf.isActive
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </Tag>

                      <br />

                      <Tag
                        color={
                          wf.workflowStatus === "READY"
                            ? "blue"
                            : "orange"
                        }
                        style={{
                          marginTop: 6,
                        }}
                      >
                        {wf.workflowStatus || "DRAFT"}
                      </Tag>

                    </div>

                  </div>

                  <Divider
                    style={{
                      margin:
                        "12px 0",
                    }}
                  />

                  <div
                    style={{
                      minHeight: 50,
                    }}
                  >
                    <Text type="secondary">
                      {wf.description ||
                        "No workflow description added."}
                    </Text>
                  </div>

                  <Divider
                    style={{
                      margin:
                        "16px 0",
                    }}
                  />

                  {/* ACTIONS */}

                  <Space
                    wrap
                    style={{
                      width: "100%",
                    }}
                  >

                    {/* BUILDER */}

                    <Tooltip
                      title={
                        wf.isActive
                          ? "Open Workflow Builder"
                          : "Activate workflow to open builder"
                      }
                    >

                      <Button
                        block
                        type="primary"
                        icon={
                          <BuildOutlined />
                        }
                        disabled={
                          !wf.isActive
                        }
                        onClick={() => {

                          if (
                            !wf.isActive
                          ) {

                            message.warning(
                              "Inactive workflows cannot open builder"
                            );

                            return;
                          }

                          navigate(
                            `/builder/${wf.workflowId}`
                          );
                        }}
                      >
                        Builder
                      </Button>

                    </Tooltip>

                    {/* FIELDS */}

                    <Tooltip
                      title={
                        wf.isActive
                          ? "Manage Workflow Fields"
                          : "Activate workflow to manage fields"
                      }
                    >

                      <Button
                        icon={
                          <FileAddOutlined />
                        }
                        disabled={
                          !wf.isActive
                        }
                        onClick={() => {

                          if (
                            !wf.isActive
                          ) {

                            message.warning(
                              "Inactive workflows cannot manage fields"
                            );

                            return;
                          }

                          localStorage.setItem(
                              "adminSelectedMenu",
                              "workflow"
                            );

                            navigate(
                              `/admin/workflow-fields/${wf.workflowId}`
                            );
                        }}
                      >
                        Fields
                      </Button>

                    </Tooltip>

                    {/* EDIT */}

                    <Tooltip
                      title={
                        wf.isActive
                          ? "Edit Workflow"
                          : "Activate workflow to edit"
                      }
                    >

                      <Button
                        icon={
                          <EditOutlined />
                        }
                        disabled={
                          !wf.isActive
                        }
                        onClick={() => {

                          if (
                            !wf.isActive
                          ) {

                            message.warning(
                              "Inactive workflows cannot be edited"
                            );

                            return;
                          }

                          openEditDrawer(
                            wf
                          );
                        }}
                      >
                        Edit
                      </Button>

                    </Tooltip>

                    {/* STATUS */}

                    <Button
                      type={
                        wf.isActive
                          ? "default"
                          : "primary"
                      }
                      onClick={() =>
                        toggleWorkflowStatus(
                          wf.workflowId
                        )
                      }
                    >
                      {wf.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </Button>

                    <Button
                      type="primary"
                      disabled={
                        wf.workflowStatus ===
                        "READY"
                      }
                      onClick={() =>
                        publishWorkflow(
                          wf.workflowId
                        )
                      }
                    >
                      {wf.workflowStatus ===
                      "READY"
                        ? "Published"
                        : "Publish"}
                    </Button>
                    {/* DELETE */}

                    <Tooltip title="Delete Workflow">

                      <Button
                        danger
                        icon={
                          <DeleteOutlined />
                        }
                        onClick={() =>
                          deleteWorkflow(
                            wf.workflowId
                          )
                        }
                      >
                        Delete
                      </Button>

                    </Tooltip>

                  </Space>

                </Card>

              </Col>
            )
          )}

        </Row>

      )}

      {/* CREATE MODAL */}

      <Modal
        title="Create Workflow"
        open={isModalOpen}
        onCancel={() =>
          setIsModalOpen(false)
        }
        footer={null}
        centered
      >

        <Form
          layout="vertical"
          form={form}
          onFinish={
            createWorkflow
          }
        >

          <Form.Item
            label="Workflow Name"
            name="workflowName"
            rules={[
              {
                required: true,

                message:
                  "Please enter workflow name",
              },
            ]}
          >

            <Input
              size="large"
              placeholder="Example: Leave Approval Workflow"
            />

          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >

            <Input.TextArea
              rows={4}
              placeholder="Enter workflow description"
            />

          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Create Workflow
          </Button>

        </Form>

      </Modal>

      {/* EDIT DRAWER */}

      <Drawer
        title="Edit Workflow"
        open={editOpen}
        onClose={() =>
          setEditOpen(false)
        }
        size="default"
      >

        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
          size={16}
        >

          <Input
            placeholder="Workflow Name"
            value={editName}
            onChange={(e) =>
              setEditName(
                e.target.value
              )
            }
          />

          <Input.TextArea
            rows={4}
            placeholder="Workflow Description"
            value={editDescription}
            onChange={(e) =>
              setEditDescription(
                e.target.value
              )
            }
          />

          <Button
            type="primary"
            block
            loading={loading}
            onClick={
              updateWorkflow
            }
          >
            Update Workflow
          </Button>

        </Space>

      </Drawer>

    </div>
  );
}

export default ManageWorkflows;