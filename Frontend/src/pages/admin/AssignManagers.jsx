import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Select,
  Button,
  Typography,
  message,
  Tag,
} from "antd";

import API from "../../services/api";

const { Title, Text } = Typography;

function AssignManagers() {

  const [requests, setRequests] =
    useState([]);

  const [managers, setManagers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData =
    async () => {

      try {

        setLoading(true);

        const requestRes =
          await API.get(
            "/admin/requests"
          );

        const managerRes =
          await API.get(
            "/manager/list"
          );

        setRequests(
          requestRes.data || []
        );

        setManagers(
          managerRes.data || []
        );

      } catch (err) {

        console.error(err);

        message.error(
          "Failed to load data"
        );

      } finally {

        setLoading(false);
      }
    };

  const handleManagerChange =
    (instanceId, managerId) => {

      setRequests((prev) =>
        prev.map((item) =>
          item.instance_id === instanceId
            ? {
                ...item,
                manager_id: managerId,
              }
            : item
        )
      );
    };

  const saveAssignment =
    async (instanceId, managerId) => {

      try {

        if (!managerId) {

          message.warning(
            "Please select manager"
          );

          return;
        }

        await API.put(
          `/admin/request/${instanceId}/assign-manager`,
          {
            managerId,
          }
        );

        message.success(
          "Manager Assigned Successfully"
        );

        fetchData();

      } catch (err) {

        console.error(err);

        message.error(
          "Assignment Failed"
        );
      }
    };

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
      title: "Submitted By",

      render: (_, record) => (

        <div>
          <div
            style={{
              fontWeight: 600,
            }}
          >
            {record.employee_name}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#888",
            }}
          >
            {record.email}
          </div>
        </div>

      ),
    },

    {
      title: "Status",

      render: (_, record) => {

        let color = "orange";

        if (
          record.status ===
          "APPROVED"
        ) {
          color = "green";
        }

        if (
          record.status ===
          "REJECTED"
        ) {
          color = "red";
        }

        return (
          <Tag color={color}>
            {record.status}
          </Tag>
        );
      },
    },

    {
      title: "Assigned Manager",

      render: (_, record) => (

        <Text>
          {record.manager_name ||
            "Not Assigned"}
        </Text>

      ),
    },

    {
      title: "Assign Manager",

      render: (_, record) => (

        <Select
          style={{
            width: 220,
          }}
          placeholder="Select Manager"
          value={
            record.manager_id
          }
          onChange={(value) =>
            handleManagerChange(
              record.instance_id,
              value
            )
          }
        >

          {managers.map(
            (manager) => (

              <Select.Option
                key={
                  manager.user_id
                }
                value={
                  manager.user_id
                }
              >
                {
                  manager.full_name
                }
              </Select.Option>

            )
          )}

        </Select>

      ),
    },

    {
      title: "Action",

      render: (_, record) => (

        <Button
          type="primary"
          onClick={() =>
            saveAssignment(
              record.instance_id,
              record.manager_id
            )
          }
        >
          Assign
        </Button>

      ),
    },
  ];

  return (

    <>
      <div
      style={{
        marginBottom: 24,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
    </div>

      <Card
        variant="borderless"
        className="fl-card"
      >

        <Table
          rowKey="instance_id"
          loading={loading}
          columns={columns}
          dataSource={requests}
          pagination={{
            pageSize: 10,
          }}
        />

      </Card>
    </>
  );
}

export default AssignManagers;