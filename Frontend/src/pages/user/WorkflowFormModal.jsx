import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Spin,
  Empty,
  Typography,
  Divider,
  Select,
} from "antd";

import {
  useEffect,
  useState,
} from "react";

import API
from "../../services/api";

const { Title, Text } =
  Typography;

function WorkflowFormModal({
  open,
  setOpen,
  workflow,
}) {

  const [fields,
    setFields] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [submitLoading,
    setSubmitLoading] =
    useState(false);

  const [form] =
    Form.useForm();

  // =====================================
  // FETCH FIELDS
  // =====================================

  const fetchFields =
    async () => {

      if (!workflow) return;

      try {

        setLoading(true);

        const res =
          await API.get(
            `/workflows/${workflow.workflowId}/fields`
          );

        setFields(
          res.data || []
        );

      } catch (err) {

        console.error(err);

        message.error(
          "Failed to load form ❌"
        );

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    if (open) {

      fetchFields();
    }

  }, [open]);

  // =====================================
  // FIELD RENDER
  // =====================================

  const renderField = (field) => {

  switch (
    field.dataType?.toUpperCase()
  ) {

    case "DATE":

      return (
        <Input
          type="date"
          size="large"
        />
      );

    case "NUMBER":

      return (
        <Input
          type="tel"
          size="large"
          maxLength={10}
          placeholder={`Enter ${field.variableName}`}
          onInput={(e) => {
            e.target.value =
              e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);
          }}
        />
      );

    case "BOOLEAN":

      return (
        <Select
          size="large"
          placeholder="Select"
          options={[
            {
              label: "Yes",
              value: "YES",
            },
            {
              label: "No",
              value: "NO",
            },
          ]}
        />
      );

    default:

      return (
        <Input
          size="large"
          placeholder={`Enter ${field.variableName}`}
        />
      );
  }
};


  // SUBMIT

  const handleSubmit =
    async () => {

      try {

        const values =
          await form.validateFields();

        setSubmitLoading(
          true
        );

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        await API.post(
          `/workflows/submit/${workflow.workflowId}`,
          {
            ...values,
            userId: user.userId,
          }
        );

        message.success(
          "Workflow submitted successfully ✅"
        );

        form.resetFields();

        setOpen(false);

      } catch (err) {

        console.error(err);

        message.error(
          "Submission failed ❌"
        );

      } finally {

        setSubmitLoading(
          false
        );
      }
    };

  return (

    <Modal
      open={open}
      width={700}
      centered
      destroyOnHidden
      onCancel={() => {

        setOpen(false);

        form.resetFields();
      }}
      footer={[
        <Button
          onClick={() =>
            setOpen(false)
          }
        >
          Cancel
        </Button>,

        <Button
          type="primary"
          loading={
            submitLoading
          }
          onClick={
            handleSubmit
          }
        >
          Submit Workflow
        </Button>,
      ]}
    >

      {/* HEADER */}

      <div
        style={{
          marginBottom: 20,
        }}
      >

        <Title
          level={3}
          style={{
            marginBottom: 4,
          }}
        >
          {
            workflow?.workflowName
          }
        </Title>

        <Text
          type="secondary"
        >
          Fill all required
          details carefully
        </Text>

      </div>

      <Divider />

      {/* BODY */}

      {loading ? (

        <div
          style={{
            height: 250,
            display: "flex",
            justifyContent:
              "center",

            alignItems:
              "center",
          }}
        >

          <Spin size="large" />

        </div>

      ) : fields.length ===
        0 ? (

        <Empty
          description="No form fields configured"
        />

      ) : (

        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >

          {fields.map(
            (field) => (

              <div
                key={
                  field.variableId
                }
                style={{
                  marginBottom: 18,
                  padding: 18,
                  background:
                    "#fafafa",
                  borderRadius: 14,
                }}
              >

                <Form.Item
                  label={

                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {
                        field.variableName
                      }
                    </span>
                  }

                  name={
                    field.variableName
                  }

                  rules={[
                      {
                        required: true,
                        message:
                          `${field.variableName} is required`,
                      },

                      ...(field.dataType?.toUpperCase() === "NUMBER"
                        ? [
                            {
                              pattern: /^\d{10}$/,
                              message:
                                "Mobile number must be exactly 10 digits",
                            },
                          ]
                        : []),
                    ]}
                  >

                  

                  {renderField(
                    field
                  )}

                </Form.Item>

              </div>
            )
          )}

        </Form>

      )}

    </Modal>
  );
}

export default WorkflowFormModal;