import React from "react";
import { Modal, Form, Input, Select, Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
const UserCreateModal = ({ open, onCancel, onOk, form }) => {
  return (
    <Modal title="Thêm tài khoản" open={open} onCancel={onCancel} onOk={onOk}>
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập username" }]}
            >
              <Input
                placeholder="Username"
                prefix={<FontAwesomeIcon icon={faUser} />}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input
                placeholder="Họ và tên"
                prefix={<FontAwesomeIcon icon={faUser} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email" },
            { type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input
            placeholder="Email"
            prefix={<FontAwesomeIcon icon={faEnvelope} />}
          />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Số điện thoại phải có 10-11 chữ số",
            },
          ]}
        >
          <Input
            placeholder="Số điện thoại"
            prefix={<FontAwesomeIcon icon={faUser} />}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
        >
          <Input.Password
            placeholder="Mật khẩu"
            prefix={<FontAwesomeIcon icon={faLock} />}
          />
        </Form.Item>

        <Form.Item
          label="Nhập lại mật khẩu"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không khớp"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            prefix={<FontAwesomeIcon icon={faLock} />}
          />
        </Form.Item>

        {/* Role */}
        <Form.Item name="role" label="Vai trò" initialValue="CUSTOMER">
          <Select>
            <Select.Option value="CUSTOMER">Khách hàng</Select.Option>
            <Select.Option value="ADMIN">Quản trị</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateModal;
