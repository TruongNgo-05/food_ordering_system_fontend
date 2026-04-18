import React from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";

const AddUserModal = ({ open, onCancel, onOk, form }) => {
  return (
    <Modal title="Thêm tài khoản" open={open} onCancel={onCancel} onOk={onOk}>
      <Form layout="vertical" form={form}>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: "Nhập username" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="name"
              label="Họ tên"
              rules={[{ required: true, message: "Nhập họ tên" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Email */}
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Phone */}
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: "Nhập số điện thoại" },
            {
              pattern: /^[0-9]{9,11}$/,
              message: "SĐT không hợp lệ",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Nhập mật khẩu" },
            { min: 6, message: "Tối thiểu 6 ký tự" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {/* Role */}
        <Form.Item name="role" label="Vai trò" initialValue="CUSTOMER">
          <Select>
            <Select.Option value="CUSTOMER">Khách hàng</Select.Option>
            <Select.Option value="ADMIN">Admin</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
