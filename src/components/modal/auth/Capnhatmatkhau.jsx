import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "../../../assets/styles/ChangePassword.css";
const Capnhatmatkhau = ({
  open = false,
  onCancel = () => {},
  onChangePassword = () => {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await onChangePassword(values);
      form.resetFields();
      onCancel();
    } catch (error) {
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
      title="Đổi mật khẩu"
      open={open}
      footer={null}
      onCancel={handleCancel}
      width={500}
      className="change-password-modal"
    >
      <Form
        form={form}
        layout="vertical"
        className="change-password-form"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu hiện tại",
            },
          ]}
        >
          <Input.Password
            prefix={<FontAwesomeIcon icon={faLock} />}
            placeholder="Nhập mật khẩu hiện tại"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mật khẩu mới",
            },
            {
              min: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự",
            },
          ]}
        >
          <Input.Password
            prefix={<FontAwesomeIcon icon={faLock} />}
            placeholder="Nhập mật khẩu mới"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập lại mật khẩu mới",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp"),
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<FontAwesomeIcon icon={faLock} />}
            placeholder="Nhập lại mật khẩu mới"
            size="large"
          />
        </Form.Item>

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
              Lưu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Capnhatmatkhau;
