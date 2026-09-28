import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Select,
  Input,
  Button,
  Space,
  Timeline,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { useEffect, useState } from "react";
import API from "../../services/api";
import { getUser } from "../../services/auth";

const { Title, Text } = Typography;
const { TextArea } = Input;

function ViewRequest({
  request,
  onBack,
}) {

  const [status, setStatus] =
    useState(
      request?.status ||
      "PENDING"
    );

    const [formData,
  setFormData] =
  useState([]);

  const [remarks, setRemarks] =
    useState("");

    const handleSave = async () => {

  if (
    status === "REJECTED" &&
    !remarks.trim()
  ) {
    message.error(
      "Please enter remarks before rejecting the request."
    );
    return;
  }

  try {

  
    const user = getUser();

await API.put(
  `/manager/request/${request.instance_id}/status`,
  {
    status,
    remarks,
    managerId: user.userId,
  }
);

    message.success(
      "Status updated successfully"
    );

    onBack();

  } catch (err) {

    console.error(err);

    message.error(
      "Failed to update status"
    );
  }
};
    
    useEffect(() => {

  const fetchDetails =
    async () => {

      try {

        const res =
          await API.get(
            `/manager/request/${request.instance_id}`
          );

        setFormData(
          res.data || []
        );

      } catch(err) {

        console.error(err);
      }
    };

  fetchDetails();

}, [request]);

  return (

    <>

      <Button
        icon={
          <ArrowLeftOutlined />
        }
        onClick={onBack}
        style={{
          marginBottom: 20,
        }}
      >
        Back
      </Button>

      <Card
        variant="borderless"
        className="fl-card"
      >

        <Title level={2}>
          Request Details
        </Title>

        <Text
          type="secondary"
        >
          Review submitted workflow application
        </Text>

      </Card>

      {/* BASIC INFO */}

      <Card
        title="Application Information"
        variant="borderless"
        className="fl-card"
        style={{
          marginTop: 20,
        }}
      >

       <Descriptions
  bordered
  column={1}
>

  {formData.map(
    (item, index) => (

      <Descriptions.Item
        key={index}
        label={item.field}
      >
        {item.value}
      </Descriptions.Item>

    )
  )}

</Descriptions>

      </Card>

      {/* FORM DATA */}

      

      {/* DECISION */}

      <Card
        title="Manager Decision"
        variant="borderless"
        className="fl-card"
        style={{
          marginTop: 20,
        }}
      >

        <Space
          direction="vertical"
          size={20}
          style={{
            width: "100%",
          }}
        >

          <div>

            <Text strong>
              Status
            </Text>

            <Select
              style={{
                width: "100%",
                marginTop: 8,
              }}
              value={status}
              onChange={
                setStatus
              }
              options={[
                {
                  value:
                    "PENDING",
                  label:
                    "Pending",
                },
                {
                  value:
                    "APPROVED",
                  label:
                    "Approved",
                },
                {
                  value:
                    "REJECTED",
                  label:
                    "Rejected",
                },
                {
                  value:
                    "ON_HOLD",
                  label:
                    "On Hold",
                },
                {
                  value:
                    "SEND_BACK",
                  label:
                    "Send Back",
                },
              ]}
            />

          </div>

          <div>

            <Text strong>
              Remarks
            </Text>

            <TextArea
              rows={4}
              value={remarks}
              onChange={(e) =>
                setRemarks(
                  e.target.value
                )
              }
              placeholder="Enter manager remarks..."
            />

          </div>

          <Space>

            <Button
              type="primary"
              icon={
                <CheckCircleOutlined />
              }
              onClick={
                handleSave
              }
            >
              Save Decision
            </Button>

            <Button
              danger
              icon={
                <CloseCircleOutlined />
              }
              onClick={() =>
                setStatus(
                  "REJECTED"
                )
              }
            >
              Reject
            </Button>

          </Space>

        </Space>

      </Card>

      {/* HISTORY */}

      <Card
        title="Activity Timeline"
        variant="borderless"
        className="fl-card"
        style={{
          marginTop: 20,
        }}
      >

        <Timeline
          items={[
            {
              content:
                "Application Submitted",
            },
            {
              content:
                "Pending Manager Review",
            },
          ]}
        />

      </Card>

    </>
  );
}

export default ViewRequest;