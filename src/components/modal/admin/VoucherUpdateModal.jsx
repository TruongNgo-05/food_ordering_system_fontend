import React from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Row, Col } from "antd";

const VoucherEditModal = ({ open, onCancel, onOk, form }) => {
  return (
    <Modal
      title={<span style={{ fontWeight: 600 }}> Sửa voucher</span>}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
      width={600}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* Mã voucher */}
        <Form.Item
          name="voucherCode"
          label="Mã voucher"
          rules={[
            { required: true, message: "Vui lòng nhập mã voucher" },
            { min: 3, message: "Tối thiểu 3 ký tự" },
          ]}
        >
          <Input placeholder="VD: SALE20, TET2026..." size="large" />
        </Form.Item>

        {/* Mô tả */}
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Nhập mô tả..." />
        </Form.Item>

        {/* Giá trị */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="discount"
              label="Giảm giá"
              rules={[{ required: true, message: "Nhập giá" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                addonAfter="000đ"
                size="large"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="minOrderValue"
              label="Đơn tối thiểu"
              rules={[{ required: true, message: "Nhập giá" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                addonAfter="000đ"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Giới hạn */}
        <Form.Item
          name="usageLimit"
          label="Giới hạn lượt dùng"
          extra="0 = không giới hạn"
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập số lượt"
            size="large"
          />
        </Form.Item>

        {/* Ngày */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              dependencies={["startDate"]}
              rules={[
                { required: true, message: "Chọn ngày kết thúc" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value.isAfter(getFieldValue("startDate"))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Ngày kết thúc phải sau ngày bắt đầu"),
                    );
                  },
                }),
              ]}
            >
              <DatePicker style={{ width: "100%" }} size="large" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default VoucherEditModal;
