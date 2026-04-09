import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const Capnhatthongtin = ({
  open = false,
  onCancel = () => {},
  onUpdate = () => {},
  user,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        firstName: user.firstName || "".trim,
        lastName: user.lastName || "".trim,
        email: user.email || "".trim,
      });
      setAvatarPreview(user.avatar || "");
    }
  }, [open, user, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      await onUpdate({ ...values, avatar: avatarPreview });

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
    setAvatarPreview(user?.avatar || "");
    onCancel();
  };

  const onUploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setAvatarPreview(dataUrl);
    } catch (error) {
      console.error("Cannot read avatar file", error);
    } finally {
      event.target.value = "";
    }
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
        <Form.Item label="Ảnh đại diện">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                fontWeight: 700,
              }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar-preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                "Ảnh"
              )}
            </div>
            <label
              htmlFor="avatar-upload-input"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                padding: "0 14px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Chọn ảnh từ máy
            </label>
            <input
              id="avatar-upload-input"
              type="file"
              accept="image/*"
              onChange={onUploadAvatar}
              style={{ display: "none" }}
            />
          </div>
        </Form.Item>

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
