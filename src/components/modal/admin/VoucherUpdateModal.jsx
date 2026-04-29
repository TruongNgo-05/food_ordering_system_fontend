import React from "react";
import { Modal, Form, Input, InputNumber, DatePicker } from "antd";

const VoucherEditModal = ({ open, onCancel, onOk, form }) => {
  return (
    <Modal
      title=" Sửa voucher"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
      width={520}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" style={{ marginTop: 10 }}>
        <Form.Item
          name="voucherCode"
          label="Mã voucher"
          rules={[
            { required: true, message: "Vui lòng nhập mã voucher" },
            { min: 3, message: "Tối thiểu 3 ký tự" },
          ]}
        >
          <Input placeholder="VD: SALE20" />
        </Form.Item>

        <Form.Item
          name="discount"
          label="Giảm giá (%)"
          rules={[
            { required: true, message: "Nhập % giảm giá" },
            { type: "number", min: 1, max: 100 },
          ]}
        >
          <InputNumber
            min={1}
            max={100}
            style={{ width: "100%" }}
            placeholder="1 - 100"
          />
        </Form.Item>

        <Form.Item
          name="usageLimit"
          label="Giới hạn lượt dùng"
          rules={[{ type: "number", min: 0 }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="0 = không giới hạn"
          />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="Ngày kết thúc"
          rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoucherEditModal;
