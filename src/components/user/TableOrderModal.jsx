import React from "react";
import { Modal } from "antd";

import PaymentMethodSection from "../../components/customer/cart/PaymentMethodSection";

const TableOrderModal = ({
  open,
  onCancel,
  onConfirm,
  orderFormData,
  onChange,
}) => {
  return (
    <Modal
      className="table-order-modal"
      title="Thông tin gọi món"
      open={open}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Xác nhận"
      cancelText="Hủy"
      centered
      width={500}
    >
      <div className="table-order-modal-form">
        <div className="table-order-form-group">
          <label>Họ tên</label>

          <input
            type="text"
            placeholder="Nhập họ tên"
            value={orderFormData.name}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>

        <div className="table-order-form-group">
          <label>Số điện thoại</label>

          <input
            type="tel"
            placeholder="Nhập số điện thoại (10 chữ số)"
            value={orderFormData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>

        <div className="table-order-form-group">
          <label>Ghi chú</label>

          <textarea
            placeholder="Nhập ghi chú (tùy chọn)"
            value={orderFormData.note}
            onChange={(e) => onChange("note", e.target.value)}
            rows={3}
          />
        </div>

        <div className="table-order-payment">
          <PaymentMethodSection
            payMethod={orderFormData.paymentMethod}
            onChangePayMethod={(method) => onChange("paymentMethod", method)}
            allowedMethods={["ONLINE", "AT_TABLE"]}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TableOrderModal;
