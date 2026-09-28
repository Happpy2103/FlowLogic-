import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Spin,
  Empty,
  message,
} from "antd";

import {
  ProfileOutlined,
} from "@ant-design/icons";

import {
  useEffect,
  useState,
} from "react";

import API
from "../../services/api";

import WorkflowFormModal
from "./WorkflowFormModal";

const { Title, Text } =
  Typography;

function ApplyWorkflow() {

  const [workflows,
    setWorkflows] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [selectedWorkflow,
    setSelectedWorkflow] =
    useState(null);

  const [open,
    setOpen] =
    useState(false);

  // FETCH ACTIVE WORKFLOWS
  const fetchWorkflows =
    async () => {

      try {

        setLoading(true);

        const res =
          await API.get(
            "/workflows/active"
          );

        setWorkflows(
          res.data || []
        );

      } catch (err) {

        console.error(err);

        message.error(
          "Failed to load workflows ❌"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchWorkflows();

  }, []);

  // OPEN FORM

  const openWorkflow =
    (workflow) => {

      setSelectedWorkflow(
        workflow
      );

      setOpen(true);
    };

  return (

    <>

      {/* HEADER */}

      <div
        style={{
          marginBottom: 28,
        }}
      >

        <Title
          level={2}
          style={{
            marginBottom: 4,
          }}
        >
          Apply Workflow
        </Title>

        <Text
          type="secondary"
        >
          Select workflow and
          submit request
        </Text>

      </div>

      {/* LOADING */}

      {loading ? (

        <div
          style={{
            height: 300,
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >

          <Spin size="large" />

        </div>

      ) : workflows.length ===
        0 ? (

        <Card
          style={{
            borderRadius: 18,
          }}
        >

          <Empty
            description="No active workflows found"
          />

        </Card>

      ) : (

        <Row
          gutter={[22, 22]}
        >

          {workflows.map(
            (workflow) => (

              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                key={
                  workflow.workflowId
                }
              >

                <Card
                  hoverable
                  style={{
                    borderRadius: 20,
                    border:
                      "1px solid #edf1f7",

                    boxShadow:
                      "0 4px 18px rgba(15,23,42,0.06)",
                  }}
                  styles={{
                    body: {
                      padding: 20,
                    },
                  }}
                >

                  {/* TOP */}

                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap: 14,

                      marginBottom: 18,
                    }}
                  >

                    {/* ICON */}

                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background:
                          "#eff6ff",

                        display:
                          "flex",

                        justifyContent:
                          "center",

                        alignItems:
                          "center",
                      }}
                    >

                      <ProfileOutlined
                        style={{
                          fontSize: 24,
                          color:
                            "#1677ff",
                        }}
                      />

                    </div>

                    {/* TITLE */}

                    <div>

                      <Title
                        level={5}
                        style={{
                          margin: 0,
                        }}
                      >
                        {
                          workflow.workflowName
                        }
                      </Title>

                      <Text
                        type="secondary"
                      >
                        Workflow
                      </Text>

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <Text
                    style={{
                      color:
                        "#64748b",

                      lineHeight:
                        1.6,
                    }}
                  >
                    {
                      workflow.description
                    }
                  </Text>

                  {/* BUTTON */}

                  <Button
                    type="primary"
                    block
                    style={{
                      marginTop: 20,
                      height: 42,
                      borderRadius: 12,
                    }}
                    onClick={() =>
                      openWorkflow(
                        workflow
                      )
                    }
                  >
                    Apply Now
                  </Button>

                </Card>

              </Col>
            )
          )}

        </Row>

      )}

      {/* FORM MODAL */}

      <WorkflowFormModal
        open={open}
        setOpen={setOpen}
        workflow={
          selectedWorkflow
        }
      />

    </>
  );
}

export default ApplyWorkflow;