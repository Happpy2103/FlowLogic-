import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Typography,
  Button,
  Space,
  message,
  Spin,
} from "antd";

import {
  ArrowLeftOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import API from "../../services/api";
import { getUser } from "../../services/auth";
import ViewRequest from "./ViewRequest";

const { Title, Text } = Typography;

function ManageRequests() {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

    const [selectedRequest,
        setSelectedRequest] =
        useState(null);

  const fetchRequests =
  async () => {

    try {

      setLoading(true);

      const user = getUser();

      const res =
        await API.get(
          `/manager/${user.userId}/requests`
        );

      setRequests(
        res.data || []
      );

    } catch (err) {

      console.error(err);

      message.error(
        "Failed to load requests"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchRequests();

  }, []);

  const columns = [

    {
      title: "Request ID",
      dataIndex: "instance_id",
      width: 120,
    },

    {
      title: "Workflow",
      dataIndex: "workflow_name",
    },

    {
  title: "Applicant",
  render: (_, record) => (
    <div>
      <div style={{ fontWeight: 600 }}>
        {record.employee_name}
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#888"
        }}
      >
        {record.email}
      </div>
    </div>
  ),
},

    {
      title: "Applied On",
      dataIndex: "started_at",
    },

    {
      title: "Status",
      dataIndex: "status",

      render: (status) => {

        let color = "orange";

        if (status === "APPROVED") {
          color = "green";
        }

        if (status === "REJECTED") {
          color = "red";
        }

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

        <Space>

          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => setSelectedRequest(record)}
            >
            View
            </Button>

        </Space>
      ),
    },
  ];

  if (selectedRequest) {
    return (
      <ViewRequest
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
      />
    );
  }

  return (

    

    <>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: 24,
        }}
      >

        <div>

          <Title
            level={2}
            style={{
              marginBottom: 0,
            }}
          >
            Manage Requests
          </Title>

          <Text type="secondary">
            Review and process workflow requests
          </Text>

        </div>

      </div>

      <Card
        variant="borderless"
        className="fl-card"
      >

        {loading ? (

          <div
            style={{
              padding: 50,
              textAlign:
                "center",
            }}
          >
            <Spin size="large" />
          </div>

        ) : (

          <Table
            rowKey="instance_id"
            columns={columns}
            dataSource={requests}
            pagination={{
              pageSize: 10,
            }}
          />

        )}

      </Card>
    </>
  );
}

export default ManageRequests;