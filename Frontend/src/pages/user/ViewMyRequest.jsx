import {
  Drawer,
  Descriptions,
  Table,
  Spin,
  Typography,
} from "antd";

const { Title } = Typography;

function ViewMyRequest({
  open,
  onClose,
  request,
  details,
  loading,
}) {

  return (

    <Drawer
      title={
        request
          ? `Request #${request.instance_id}`
          : "Request Details"
      }
      open={open}
      onClose={onClose}
      size="default"
    >

      {loading ? (

        <Spin />

      ) : (

        <>
          <Descriptions
            bordered
            column={1}
            style={{
              marginBottom: 24,
            }}
          >

            <Descriptions.Item
              label="Workflow"
            >
              {request?.workflow_name}
            </Descriptions.Item>

            <Descriptions.Item
              label="Assigned Manager"
            >
              {request?.manager_name ||
                "Not Assigned"}
            </Descriptions.Item>

            <Descriptions.Item
              label="Status"
            >
              {request?.status}
            </Descriptions.Item>

            <Descriptions.Item
              label="Manager Remarks"
            >
              {request?.remarks ||
                "-"}
            </Descriptions.Item>

            <Descriptions.Item
              label="Submitted Date"
            >
              {request?.started_at}
            </Descriptions.Item>

          </Descriptions>

          <Title level={5}>
            Application Details
          </Title>

          <Table
            rowKey="field"
            pagination={false}
            dataSource={details}
            columns={[
              {
                title: "Field",
                dataIndex: "field",
              },
              {
                title: "Value",
                dataIndex: "value",
              },
            ]}
          />

        </>
      )}

    </Drawer>
  );
}

export default ViewMyRequest;