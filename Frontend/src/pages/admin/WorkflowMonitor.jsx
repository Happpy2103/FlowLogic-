import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Typography,
  Tag,
  Steps,
  Empty,
  Spin,
  message,
} from "antd";

import {
  EyeOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";

import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

const { Title, Text } = Typography;

function WorkflowMonitor() {

  const [instances, setInstances] =
    useState([]);

  const [states, setStates] =
    useState([]);

  const [currentStateId, setCurrentStateId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [selectedInstance, setSelectedInstance] =
    useState(null);

  // LOAD INSTANCES

  const fetchInstances = async () => {

    try {

      const res =
        await API.get(
          "/workflow-monitor"
        );

      setInstances(
        res.data || []
      );

    } catch (err) {

      console.error(err);

      message.error(
        "Failed to load workflow instances"
      );
    }
  };

  // LOAD WORKFLOW

  const loadWorkflow = async (
    instanceId
  ) => {

    try {

      setLoading(true);

      const stateRes =
        await API.get(
          `/workflow-monitor/states/${instanceId}`
        );

      const currentRes =
        await API.get(
          `/workflow-monitor/current/${instanceId}`
        );

      setStates(
        stateRes.data || []
      );

      setCurrentStateId(
        currentRes.data.currentStateId
      );

      setSelectedInstance(
        instanceId
      );

    } catch (err) {

      console.error(err);

      message.error(
        "Failed to load workflow"
      );

    } finally {

      setLoading(false);
    }
  };

  // AUTO REFRESH

  useEffect(() => {

    if (!selectedInstance)
      return;

    const interval =
      setInterval(
        async () => {

          try {

            const res =
              await API.get(
                `/workflow-monitor/current/${selectedInstance}`
              );

            setCurrentStateId(
              res.data.currentStateId
            );

          } catch (err) {

            console.error(err);
          }

        },
        2000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [selectedInstance]);

  useEffect(() => {

    fetchInstances();

  }, []);

  // TABLE
  // ============================

  const columns = [

    {
      title: "Instance ID",
      dataIndex: "instanceId",
      width: 120,
    },

    {
      title: "Workflow",
      dataIndex: "workflowName",
    },

    {
      title: "Employee",
      dataIndex: "employee",
    },

    {
      title: "Status",

      dataIndex: "status",

      render: (status) => {

        let color =
          "orange";

        if (
          status ===
          "APPROVED"
        )
          color = "green";

        if (
          status ===
          "REJECTED"
        )
          color = "red";

        if (
          status ===
          "COMPLETED"
        )
          color = "blue";

        return (
          <Tag color={color}>
            {status}
          </Tag>
        );
      },
    },

    {
      title: "Action",

      render: (_, record) => (

        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() =>
            loadWorkflow(
              record.instanceId
            )
          }
        >
          View Flow
        </Button>

      ),
    },
  ];

  return (

    <div>

      {/* HEADER */}

      

      <Row gutter={[20, 20]}>

        {/* LEFT */}

        <Col
          xs={24}
          lg={14}
        >

          <Card
            title="Workflow Instances"
            variant="borderless"
            className="fl-card"
          >

            <Table
              rowKey="instanceId"
              columns={columns}
              dataSource={instances}
              pagination={{
                pageSize: 10,
              }}
            />

          </Card>

        </Col>

        {/* RIGHT */}

        <Col
          xs={24}
          lg={10}
        >

          <Card
            title="Workflow Execution"
            variant="borderless"
            className="fl-card"
          >

            {loading ? (

              <div
                style={{
                  textAlign:
                    "center",
                  padding: 50,
                }}
              >

                <Spin />

              </div>

            ) : states.length === 0 ? (

              <Empty
                description="Select workflow"
              />

            ) : (

              <>

                <div
                  style={{
                    marginBottom: 16,
                  }}
                >

                  <Tag color="blue">
                    Instance #
                    {
                      selectedInstance
                    }
                  </Tag>

                </div>

                <Steps
                  direction="vertical"
                  current={
                    states.findIndex(
                      (s) =>
                        s.stateId ===
                        currentStateId
                    )
                  }
                  items={states.map(
                    (state) => ({

                      title:
                        state.stateName,

                      description:
                        state.stateType,

                      status:
                        state.stateId <
                        currentStateId
                          ? "finish"
                          : state.stateId ===
                            currentStateId
                          ? "process"
                          : "wait",
                    })
                  )}
                />

              </>

            )}

          </Card>

        </Col>

      </Row>

      {/* FOOTER */}

      <Card
        variant="borderless"
        className="fl-card"
        style={{
          marginTop: 20,
        }}
      >

        <Row>

          <Col span={24}>

            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: 12,
              }}
            >

              <NodeIndexOutlined
                style={{
                  fontSize: 24,
                  color:
                    "#1677ff",
                }}
              />

              <div>

                <Text strong>
                  FlowLogic Engine
                </Text>

                <br />

                <Text type="secondary">
                  Monitor workflow node execution and live process movement.
                </Text>

              </div>

            </div>

          </Col>

        </Row>

      </Card>

    </div>
  );
}

export default WorkflowMonitor;