
import { ReactFlow,Background,Controls, MiniMap,addEdge,useNodesState,useEdgesState,MarkerType,Handle,Position,} from "reactflow";

import "reactflow/dist/style.css";

import {
  Layout,
  Typography,
  Button,
  Divider,
  Input,
  Drawer,
  Form,
  Select,
  Space,
  message,
} from "antd";

import {
  PlayCircleOutlined,
  ThunderboltOutlined,
  BranchesOutlined,
  DatabaseOutlined,
  BellOutlined,
  StopOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  useEffect,
  useCallback,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/layout/ThemeToggle";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// COMMON STYLE

const commonStyle = {
  padding: 18,
  borderRadius: 18,
  minWidth: 240,
  color: "white",
  boxShadow:
    "0 12px 30px rgba(0,0,0,0.3)",
  border:
    "1px solid rgba(255,255,255,0.08)",
  textAlign: "center",
  backdropFilter: "blur(10px)",
};

// START NODE

function StartNode({ data }) {

  return (
    <div
      style={{
        ...commonStyle,
        background:
          "linear-gradient(135deg,#22c55e,#16a34a)",
      }}
    >

      <Handle
        type="source"
        position={Position.Bottom}
      />

      <PlayCircleOutlined
        style={{ fontSize: 24 }}
      />

      <div
        style={{
          fontWeight: 700,
          marginTop: 8,
          fontSize: 18,
        }}
      >
        {data.label}
      </div>

      <div style={{ opacity: 0.9 }}>
        {data.description}
      </div>

    </div>
  );
}

// ACTION NODE


function ActionNode({ data }) {

  return (
    <div
      style={{
        ...commonStyle,
        background:
          "linear-gradient(135deg,#3b82f6,#2563eb)",
      }}
    >

      <Handle
        type="target"
        position={Position.Top}
      />

      <Handle
        type="source"
        position={Position.Bottom}
      />

      <ThunderboltOutlined
        style={{ fontSize: 24 }}
      />

      <div
        style={{
          fontWeight: 700,
          marginTop: 8,
          fontSize: 18,
        }}
      >
        {data.label}
      </div>

      <div style={{ opacity: 0.9 }}>
        {data.description}
      </div>

    </div>
  );
}

// CONDITION NODE

function ConditionNode({ data }) {

  return (
    <div
      style={{
        ...commonStyle,
        background:
          "linear-gradient(135deg,#9333ea,#7e22ce)",
      }}
    >

      <Handle
        type="target"
        position={Position.Top}
      />

      <Handle
        id="yes"
        type="source"
        position={Position.Left}
        style={{
          background: "#22c55e",
        }}
      />

      <Handle
        id="no"
        type="source"
        position={Position.Right}
        style={{
          background: "#ef4444",
        }}
      />

      <BranchesOutlined
        style={{ fontSize: 24 }}
      />

      <div
        style={{
          fontWeight: 700,
          marginTop: 8,
          fontSize: 18,
        }}
      >
        {data.label}
      </div>

      <div style={{ opacity: 0.9 }}>
        {data.description}
      </div>

    </div>
  );
}

// VARIABLE NODE

function VariableNode({ data }) {

  return (
    <div
      style={{
        ...commonStyle,
        background:
          "linear-gradient(135deg,#eab308,#ca8a04)",
      }}
    >

      <Handle
        type="target"
        position={Position.Top}
      />

      <Handle
        type="source"
        position={Position.Bottom}
      />

      <DatabaseOutlined
        style={{ fontSize: 24 }}
      />

      <div
        style={{
          fontWeight: 700,
          marginTop: 8,
          fontSize: 18,
        }}
      >
        {data.label}
      </div>

      <div style={{ opacity: 0.9 }}>
        {data.description}
      </div>

    </div>
  );
}

// NOTIFICATION NODE

function NotificationNode({ data }) {

  return (
    <div
      style={{
        ...commonStyle,
        background:
          "linear-gradient(135deg,#f97316,#ea580c)",
      }}
    >

      <Handle
        type="target"
        position={Position.Top}
      />

      <Handle
        type="source"
        position={Position.Bottom}
      />

      <BellOutlined
        style={{ fontSize: 24 }}
      />

      <div
        style={{
          fontWeight: 700,
          marginTop: 8,
          fontSize: 18,
        }}
      >
        {data.label}
      </div>

      <div style={{ opacity: 0.9 }}>
        {data.description}
      </div>

    </div>
  );
}

// END NODE

function EndNode({ data }) {

  return (
    <div
      style={{
        ...commonStyle,
        background:
          "linear-gradient(135deg,#ef4444,#dc2626)",
      }}
    >

      <Handle
        type="target"
        position={Position.Top}
      />

      <StopOutlined
        style={{ fontSize: 24 }}
      />

      <div
        style={{
          fontWeight: 700,
          marginTop: 8,
          fontSize: 18,
        }}
      >
        {data.label}
      </div>

      <div style={{ opacity: 0.9 }}>
        {data.description}
      </div>

    </div>
  );
}

// NODE TYPES

const nodeTypes = {
  startNode: StartNode,
  actionNode: ActionNode,
  conditionNode: ConditionNode,
  variableNode: VariableNode,
  notificationNode: NotificationNode,
  endNode: EndNode,
};

// MAIN COMPONENT

function WorkflowBuilder() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { id } = useParams();

  const [form] = Form.useForm();

  const initialNodes = [
    {
      id: "1",
      type: "startNode",
      position: { x: 500, y: 100 },
      data: {
        label: "START",
        description: "Start Workflow",
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState([]);

  const [selectedNode, setSelectedNode] =
    useState(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  // LOAD WORKFLOW

  const loadWorkflow = async () => {

  try {

    const res = await API.get(
      `/workflow-states/workflow/${id}`
    );

    if (res.data && res.data.length > 0) {

      const loadedNodes = res.data.map((node) => {

        const dbType =
          node.type?.toUpperCase();

        let mappedType = "actionNode";

        if (dbType === "START") {
          mappedType = "startNode";
        }

        else if (dbType === "ACTION") {
          mappedType = "actionNode";
        }

        else if (dbType === "CONDITION") {
          mappedType = "conditionNode";
        }

        else if (dbType === "VARIABLE") {
          mappedType = "variableNode";
        }

        else if (dbType === "NOTIFICATION") {
          mappedType = "notificationNode";
        }

        else if (dbType === "END") {
          mappedType = "endNode";
        }

        return {

          id: node.id,

          type: mappedType,

          position: {
            x: node.position?.x ?? 300,
            y: node.position?.y ?? 100,
          },

          data: {
            label:
              node.data?.label || "",

            description:
              node.data?.description || "",
          },
        };
      });

      setNodes(loadedNodes);

      // LOAD TRANSITIONS
      try {

        const transitionRes = await API.get(
          `/workflow-transitions/workflow/${id}`
        );

        const loadedEdges =
          transitionRes.data.map((tr) => ({
            id: `e${tr.fromState}-${tr.toState}`,

            source: tr.fromState.toString(),

            target: tr.toState.toString(),

            animated: true,

            type: "smoothstep",

            markerEnd: {
              type: MarkerType.ArrowClosed,
            },

            style: {
              stroke: "#94a3b8",
              strokeWidth: 2,
            },
          }));

        setEdges(loadedEdges);

      } catch (err) {

        console.error(
          "Failed to load transitions",
          err
        );
      }

    } else {

      setNodes(initialNodes);
      setEdges([]);
    }

  } catch (err) {

    console.error(err);

    message.error(
      "Failed to load workflow"
    );
  }
};

  
  useEffect(() => {

    loadWorkflow();

  }, []);

  // CONNECT

  const onConnect = useCallback(
    (params) => {

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            type: "smoothstep",

            markerEnd: {
              type:
                MarkerType.ArrowClosed,
            },

            style: {
              stroke: "#94a3b8",
              strokeWidth: 2,
            },
          },
          eds
        )
      );
    },
    []
  );

  // ADD NODE

  const addNode = (
    type,
    label,
    description
  ) => {

    const nodeId =
      `${Date.now()}`;

    const newNode = {
      id: nodeId,

      type,

      position: {
        x: 500,
        y: nodes.length * 180,
      },

      data: {
        label,
        description,
      },
    };

    setNodes((nds) => [
      ...nds,
      newNode,
    ]);
  };

  // NODE CLICK

  const onNodeClick = (
    _,
    node
  ) => {

    setSelectedNode(node);

    form.setFieldsValue({
      label: node.data.label,
      description:
        node.data.description,
      type: node.type,
    });

    setDrawerOpen(true);
  };

  // UPDATE NODE

  const updateNode = (
    values
  ) => {

    const updatedNodes =
      nodes.map((node) => {

        if (
          node.id ===
          selectedNode.id
        ) {

          return {
            ...node,

            data: {
              ...node.data,
              label:
                values.label,

              description:
                values.description,
            },

            type: values.type,
          };
        }

        return node;
      });

    setNodes(updatedNodes);

    message.success(
      "Node updated successfully"
    );

    setDrawerOpen(false);
  };

  // DELETE NODE

  const deleteNode = () => {

    if (!selectedNode) return;

    const updatedNodes =
      nodes.filter(
        (node) =>
          node.id !==
          selectedNode.id
      );

    const updatedEdges =
      edges.filter(
        (edge) =>
          edge.source !==
            selectedNode.id &&
          edge.target !==
            selectedNode.id
      );

    setNodes(updatedNodes);

    setEdges(updatedEdges);

    message.success(
      "Node deleted successfully"
    );

    setDrawerOpen(false);

    setSelectedNode(null);
  };

  // SAVE WORKFLOW

  const saveWorkflow = async () => {

    try {

      setLoading(true);

      await API.post(
        "/workflow-states/save",
        {
          workflowId: id,
          nodes,
          edges,
        }
      );

      message.success(
        "Workflow saved successfully"
      );

    } catch (err) {

      console.error(err);

      message.error(
        "Failed to save workflow"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        height: "100vh",
        background: isDark ? "#020617" : "var(--fl-bg-subtle)",
      }}
    >

      <Sider
        width={320}
        theme={isDark ? "dark" : "light"}
        style={{
          background: isDark ? "#0f172a" : "var(--fl-sidebar-bg)",
          padding: 20,
          borderRight: isDark ? "none" : "1px solid var(--fl-border)",
        }}
      >

        <Title level={3} style={{ color: isDark ? "white" : "var(--fl-text)" }}>
          Workflow Builder
        </Title>

        <Text type="secondary">Workflow ID #{id}</Text>

        <Divider />

        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
        >

          <Button
            block
            onClick={() =>
              addNode(
                "actionNode",
                "Action",
                "Execute Action"
              )
            }
          >
            Add Action
          </Button>

          <Button
            block
            onClick={() =>
              addNode(
                "conditionNode",
                "Condition",
                "If / Else"
              )
            }
          >
            Add Condition
          </Button>

          <Button
            block
            onClick={() =>
              addNode(
                "variableNode",
                "Variable",
                "Store Variable"
              )
            }
          >
            Add Variable
          </Button>

          <Button
            block
            onClick={() =>
              addNode(
                "notificationNode",
                "Notification",
                "Send Alert"
              )
            }
          >
            Add Notification
          </Button>

          <Button
            block
            onClick={() =>
              addNode(
                "endNode",
                "END",
                "End Workflow"
              )
            }
          >
            Add End
          </Button>

        </Space>

        <Divider />

        <Button
          type="primary"
          block
          size="large"
          icon={<SaveOutlined />}
          loading={loading}
          onClick={saveWorkflow}
        >
          Save Workflow
        </Button>

        <Button
          block
          style={{
            marginTop: 12,
          }}
          icon={<ArrowLeftOutlined />}
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

        <div style={{ marginTop: 16 }}>
          <ThemeToggle collapsed={false} />
        </div>

      </Sider>

      <Content>

        <div
          style={{
            width: "100%",
            height: "100vh",
          }}
        >

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodesChange={
              onNodesChange
            }
            onEdgesChange={
              onEdgesChange
            }
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
          >

            <Background />

            <MiniMap />

            <Controls />

          </ReactFlow>

        </div>

      </Content>

      <Drawer
        title="Edit Node"
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
      >

        <Form
          layout="vertical"
          form={form}
          onFinish={updateNode}
        >

          <Form.Item
            label="Node Label"
            name="label"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Node Type"
            name="type"
          >

            <Select
              options={[
                {
                  label: "Start",
                  value: "startNode",
                },
                {
                  label: "Action",
                  value: "actionNode",
                },
                {
                  label: "Condition",
                  value:
                    "conditionNode",
                },
                {
                  label: "Variable",
                  value:
                    "variableNode",
                },
                {
                  label:
                    "Notification",
                  value:
                    "notificationNode",
                },
                {
                  label: "End",
                  value: "endNode",
                },
              ]}
            />

          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<EditOutlined />}
          >
            Update Node
          </Button>

          <Button
            danger
            block
            icon={<DeleteOutlined />}
            style={{
              marginTop: 12,
            }}
            onClick={deleteNode}
          >
            Delete Node
          </Button>

        </Form>

      </Drawer>

    </Layout>
  );
}

export default WorkflowBuilder;