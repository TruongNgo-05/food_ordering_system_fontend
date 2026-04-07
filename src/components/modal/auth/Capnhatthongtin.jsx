import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
const Capnhatthongtin = ({
  open = false,
  onCancel = () => {},
  onUpdate = () => {},
  user,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        firstName: user.firstName || "".trim,
        lastName: user.lastName || "".trim,
        email: user.email || "".trim,
      });
    }
  }, [open, user, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      await onUpdate(values);

      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Cập nhật thông tin cá nhân"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* FULL NAME */}
        <Form.Item
          label="FistName"
          name="firstName"
          rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
        >
          <Input placeholder="Nhập họ..." size="large" />
        </Form.Item>

        <Form.Item
          label="LastName"
          name="lastName"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Nhập tên..." size="large" />
        </Form.Item>

        {/* EMAIL */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email..." size="large" />
        </Form.Item>

        {/* BUTTON */}
        <Form.Item style={{ marginBottom: 0 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={handleCancel} size="large">
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
            >
              Cập nhật
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Capnhatthongtin;
