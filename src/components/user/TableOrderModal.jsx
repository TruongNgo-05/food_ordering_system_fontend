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
  const [nameError, setNameError] = React.useState("");
  const [phoneError, setPhoneError] = React.useState("");

  const handleNameChange = (value) => {
    onChange("name", value);

    if (!value.trim()) {
      setNameError("Vui lòng nhập họ tên");
    } else {
      setNameError("");
    }
  };

  const handlePhoneChange = (value) => {
    // Chỉ cho phép số
    const numericValue = value.replace(/\D/g, "");

    // Tối đa 10 số
    const phone = numericValue.slice(0, 10);

    onChange("phone", phone);

    if (!phone) {
      setPhoneError("Vui lòng nhập số điện thoại");
      return;
    }

    if (phone.length < 10) {
      setPhoneError("Số điện thoại phải có 10 chữ số");
      return;
    }

    setPhoneError("");
  };

  const handleConfirm = () => {
    let hasError = false;

    // Validate họ tên
    if (!orderFormData.name.trim()) {
      setNameError("Vui lòng nhập họ tên");
      hasError = true;
    }

    // Validate số điện thoại
    if (!orderFormData.phone.trim()) {
      setPhoneError("Vui lòng nhập số điện thoại");
      hasError = true;
    } else if (!/^[0-9]{10}$/.test(orderFormData.phone.trim())) {
      setPhoneError("Số điện thoại phải có 10 chữ số");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    onConfirm();
  };

  return (
    <Modal
      className="table-order-modal"
      title="Thông tin gọi món"
      open={open}
      onCancel={onCancel}
      onOk={handleConfirm}
      okText="Xác nhận"
      cancelText="Hủy"
      centered
      width={500}
    >
      <div className="table-order-modal-form">
        {/* HỌ TÊN */}
        <div className="table-order-form-group">
          <label>Họ tên</label>

          <input
            type="text"
            placeholder="Nhập họ tên"
            value={orderFormData.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />

          {nameError && (
            <div className="table-order-field-error">{nameError}</div>
          )}
        </div>

        {/* SỐ ĐIỆN THOẠI */}
        <div className="table-order-form-group">
          <label>Số điện thoại</label>

          <input
            type="tel"
            placeholder="Nhập số điện thoại (10 chữ số)"
            value={orderFormData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            maxLength={10}
            inputMode="numeric"
          />

          {phoneError && (
            <div className="table-order-field-error">{phoneError}</div>
          )}
        </div>

        {/* GHI CHÚ */}
        <div className="table-order-form-group">
          <label>Ghi chú</label>

          <textarea
            placeholder="Nhập ghi chú (tùy chọn)"
            value={orderFormData.note}
            onChange={(e) => onChange("note", e.target.value)}
            rows={3}
          />
        </div>

        {/* PAYMENT */}
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
