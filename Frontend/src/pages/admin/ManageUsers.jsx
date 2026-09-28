import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Space,
} from "antd";
import { useEffect, useState } from "react";
import API from "../../services/api";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form] = Form.useForm();

  //  FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");

      console.log("Users:", res.data);

      const formatted = res.data.map((u) => ({
        ...u,
        roleId: u.roleId,
        roleName: u.roleName,
      }));

      setUsers(formatted);

    } catch (err) {
      console.error(err);
      message.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //  OPEN ADD MODAL
  const handleAdd = () => {
    setEditingUser(null);

    form.resetFields();

    setOpen(true);
  };

  // OPEN EDIT MODAL
  const handleEdit = (record) => {
    setEditingUser(record);

    form.setFieldsValue({
      fullName: record.fullName,
      email: record.email,
      roleId: record.roleId,
    });

    setOpen(true);
  };

  // DELETE USER
  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);

      message.success("User deleted");

      fetchUsers();

    } catch (err) {
      console.error(err);
      message.error("Delete failed");
    }
  };

  // SUBMIT FORM
  const handleSubmit = async () => {
    try {

      const values = await form.validateFields();

      //  CORRECT PAYLOAD
      const payload = {
        fullName: values.fullName,
        email: values.email,
        roleId: values.roleId,
      };

      // PASSWORD ONLY FOR ADD
      if (!editingUser) {
        payload.password = values.password;
      }

      console.log("Payload:", payload);

      //  UPDATE USER
      if (editingUser) {

        await API.put(`/users/${editingUser.userId}`, payload);

        message.success("User updated");

      }
      //  ADD USER
      else {

        await API.post("/users", payload);

        message.success("User added");
      }

      setOpen(false);

      form.resetFields();

      fetchUsers();

    } catch (err) {

      console.error(err);

      console.log("ERROR RESPONSE:", err.response?.data);

      message.error("Operation failed");
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "roleName",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.userId)}
          >
            <Button danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {/*  ADD BUTTON */}
      <Button
        type="primary"
        onClick={handleAdd}
      >
        + Add User
      </Button>

      {/*  USERS TABLE */}
      <Table
        dataSource={users}
        columns={columns}
        rowKey="userId"
        style={{ marginTop: 15 }}
      />

      {/*  MODAL */}
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
        >

          {/* FULL NAME */}
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              {
                required: true,
                message: "Please enter full name",
              },
            ]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          {/* EMAIL */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter email",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          {/* PASSWORD ONLY FOR ADD */}
          {!editingUser && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please enter password",
                },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          {/* ROLE */}
          <Form.Item
            name="roleId"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please select role",
              },
            ]}
          >
            <Select placeholder="Select role">
              <Select.Option value={1}>
                Admin
              </Select.Option>

              <Select.Option value={2}>
                User
              </Select.Option>

              <Select.Option value={3}>
                Manager
              </Select.Option>
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}

export default ManageUsers;