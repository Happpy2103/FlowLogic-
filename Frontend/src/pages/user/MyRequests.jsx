import {
  Card,
  Table,
  Tag,
  Typography,
  message,
  Row,
  Col,
  Statistic,
  Button,
} from "antd";
import {
  useEffect,
  useState,
} from "react";

import ViewMyRequest
from "./ViewMyRequest";
import API from "../../services/api";
import { getUser } from "../../services/auth";

const { Title, Text } = Typography;

function MyRequests() {

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

    const [openDrawer,
      setOpenDrawer] =
      useState(false);

const [selectedRequest,
      setSelectedRequest] =
      useState(null);

const [requestDetails,
      setRequestDetails] =
      useState([]);

const [detailsLoading,
      setDetailsLoading] =
      useState(false);

const viewRequest =
  async (record) => {

    try {

      setSelectedRequest(
        record
      );

      setOpenDrawer(
        true
      );

      setDetailsLoading(
        true
      );

      const res =
        await API.get(
          `/manager/request/${record.instance_id}`
        );

      setRequestDetails(
        res.data || []
      );

    } catch (err) {

      console.error(err);

      message.error(
        "Failed to load details"
      );

    } finally {

      setDetailsLoading(
        false
      );
    }
  };

  const fetchRequests =
    async () => {

      try {

        setLoading(true);

        const user = getUser();

        const res =
          await API.get(
            `/workflow-submissions/user/${user.userId}`
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
    width: 100,
  },

  {
    title: "Workflow",
    dataIndex: "workflow_name",
  },

  {
    title: "Assigned Manager",

    render: (_, record) => (

      <div>
        <strong>
          {record.manager_name ||
            "Not Assigned Yet"}
        </strong>
      </div>

    ),
  },

  {
    title: "Status",

    render: (_, record) => {

      let color = "orange";

      switch (record.status) {

        case "APPROVED":
          color = "green";
          break;

        case "REJECTED":
          color = "red";
          break;

        case "ON_HOLD":
          color = "blue";
          break;

        case "SEND_BACK":
          color = "purple";
          break;

        case "CLOSED":
          color = "default";
          break;

        default:
          color = "orange";
      }

      return (
        <Tag color={color}>
          {record.status}
        </Tag>
      );
    },
  },

  {
    title: "Manager Remarks",

    render: (_, record) => (

      <Text
        type="secondary"
      >
        {record.remarks ||
          "-"}
      </Text>

    ),
  },

  {
    title: "Submitted Date",
    dataIndex: "started_at",
  },

  {
  title: "Action",

  render: (_, record) => (

    <Button
      type="primary"
      ghost
      onClick={() =>
        viewRequest(record)
      }
    >
      View Details
    </Button>

  ),
},
];

  return (

    <>
      <div
        style={{
          marginBottom: 24,
        }}
      >

        <Title level={2}>
          My Requests
        </Title>

        <Text type="secondary">
          Track all submitted workflow requests
        </Text>

      </div>

        <Row gutter={16}
     style={{
       marginBottom: 20
     }}
>

<Col xs={24} sm={12} md={6}>
    <Card>
      <Statistic
        title="Pending"
        value={
          requests.filter(
            x =>
              x.status ===
              "PENDING"
          ).length
        }
      />
    </Card>
  </Col>

<Col xs={24} sm={12} md={6}>
    <Card>
      <Statistic
        title="Approved"
        value={
          requests.filter(
            x =>
              x.status ===
              "APPROVED"
          ).length
        }
      />
    </Card>
  </Col>

  <Col xs={24} sm={12} md={6}>
    <Card>
      <Statistic
        title="Rejected"
        value={
          requests.filter(
            x =>
              x.status ===
              "REJECTED"
          ).length
        }
      />
    </Card>
  </Col>

  <Col xs={24} sm={12} md={6}>
    <Card>
      <Statistic
        title="On Hold"
        value={
          requests.filter(
            x =>
              x.status ===
              "ON_HOLD"
          ).length
        }
      />
    </Card>
  </Col>

</Row>

      <Card
        variant="borderless"
        className="fl-card"
      >

        <Table
          rowKey="instance_id"
          loading={loading}
          columns={columns}
          dataSource={requests}
        />

      </Card>
      <ViewMyRequest
      open={openDrawer}
      onClose={() =>
        setOpenDrawer(false)
      }
      request={selectedRequest}
      details={requestDetails}
      loading={detailsLoading}
    />
    </>
  );
}

export default MyRequests;