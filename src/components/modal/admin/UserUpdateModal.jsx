import React from "react";
import { Modal, Form, Input, Select } from "antd";

const UserUpdateModal = ({ open, onCancel, onOk, form }) => {
  return (
    <Modal title="Cập nhật vai trò" open={open} onCancel={onCancel} onOk={onOk}>
      <Form layout="vertical" form={form}>
        {/* KHÔNG CHO SỬA */}
        <Form.Item name="name" label="Họ tên">
          <Input disabled />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Chọn vai trò" }]}
        >
          <Select>
            <Select.Option value="CUSTOMER">Khách hàng</Select.Option>
            <Select.Option value="ADMIN">Admin</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserUpdateModal;
