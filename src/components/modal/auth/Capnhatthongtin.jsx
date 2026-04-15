import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Input, Button, message, Tabs } from "antd";
import { LinkOutlined, UploadOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../context/authContext";
import {
  getCurrentUserApi,
  updateProfileApi,
} from "../../../services/userService";

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
}) => {
  const { refreshUser } = useContext(AuthContext);
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [avatarTab, setAvatarTab] = useState("upload"); // "upload" | "url"
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    if (open) {
      loadCurrentUser();
    }
  }, [open]);

  //  Lấy user hiện tại
  const loadCurrentUser = async () => {
    try {
      const res = await getCurrentUserApi();
      const user = res.data.data;
      form.setFieldsValue({
        fullName: user.fullName || "",
        email: user.email || "",
      });

      setAvatarPreview(user.avatar || "");
    } catch (error) {
      console.error("Load user failed", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const res = await updateProfileApi({
        fullName: values.fullName,
        email: values.email,
        avatar: avatarPreview,
      });
      const msg = res.data.message;
      message.success(msg);
      await refreshUser();
      await loadCurrentUser();

      onCancel();
    } catch (error) {
      console.error("Update failed", error);
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setAvatarPreview("");
    setAvatarUrlInput("");
    setUrlError("");
    setAvatarTab("upload");
    onCancel();
  };

  const onUploadAvatar = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Giới hạn 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Ảnh phải nhỏ hơn 10MB");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setAvatarPreview(dataUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvatarUrlApply = () => {
    const trimmed = avatarUrlInput.trim();
    setUrlError("");

    if (!trimmed) {
      setUrlError("Vui lòng nhập URL ảnh!");
      return;
    }

    try {
      new URL(trimmed);
    } catch {
      setUrlError("URL không hợp lệ! Vui lòng kiểm tra lại.");
      return;
    }

    setAvatarPreview(trimmed);
    message.success("Đã áp dụng ảnh từ URL!");
  };

  const handleUrlKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAvatarUrlApply();
    }
  };

  const tabItems = [
    {
      key: "upload",
      label: (
        <span>
          <UploadOutlined /> Tải lên
        </span>
      ),
      children: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            paddingTop: 8,
          }}
        >
          <label
            htmlFor="avatar-upload-input"
            style={{
              cursor: "pointer",
              padding: "8px 14px",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              color: "#374151",
              background: "#fff",
              transition: "border-color 0.2s",
            }}
          >
            <UploadOutlined />
            Chọn ảnh từ máy tính
          </label>

          <input
            id="avatar-upload-input"
            type="file"
            accept="image/*"
            onChange={onUploadAvatar}
            style={{ display: "none" }}
          />

          <span style={{ fontSize: 12, color: "#9ca3af" }}>Tối đa 10MB</span>
        </div>
      ),
    },
    {
      key: "url",
      label: (
        <span>
          <LinkOutlined /> Từ URL
        </span>
      ),
      children: (
        <div style={{ paddingTop: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <Input
              placeholder="https://example.com/avatar.jpg"
              value={avatarUrlInput}
              onChange={(e) => {
                setAvatarUrlInput(e.target.value);
                setUrlError("");
              }}
              onKeyDown={handleUrlKeyDown}
              size="middle"
              status={urlError ? "error" : ""}
              style={{ flex: 1 }}
              prefix={<LinkOutlined style={{ color: "#9ca3af" }} />}
            />
            <Button onClick={handleAvatarUrlApply} type="default">
              Áp dụng
            </Button>
          </div>

          {urlError && (
            <div style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
              {urlError}
            </div>
          )}

          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
            Nhập URL ảnh công khai và nhấn <strong>Áp dụng</strong> hoặc{" "}
            <strong>Enter</strong>
          </div>
        </div>
      ),
    },
  ];

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
        {/* Avatar */}
        <Form.Item label="Ảnh đại diện">
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            {/* Preview */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#f3f4f6",
                border: "2px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar-preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={() => {
                    message.error("Không thể tải ảnh từ URL này!");
                    setAvatarPreview("");
                  }}
                />
              ) : (
                <span style={{ fontSize: 11, color: "#9ca3af" }}>Ảnh</span>
              )}
            </div>

            {/* Tabs upload / URL */}
            <div style={{ flex: 1 }}>
              <Tabs
                activeKey={avatarTab}
                onChange={setAvatarTab}
                items={tabItems}
                size="small"
              />
            </div>
          </div>
        </Form.Item>

        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên..." size="large" />
        </Form.Item>

        {/* Email */}
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

        {/* Buttons */}
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button onClick={handleCancel} size="large">
              Hủy
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
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
