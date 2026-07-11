import React from "react";
import { Modal } from "antd";
import "../../assets/styles/customer/PaymentQrModal.css";

const PaymentQrModal = ({
  open,
  paymentUrl,
  orderCode,
  totalPrice,
  countdown,
  showCountdown = true,
  onCancel,
}) => {
  return (
    <Modal
      title="Thanh toán SePay"
      open={open}
      footer={null}
      onCancel={onCancel}
      centered
      destroyOnClose
    >
      <div className="payment-qr-modal">
        <div className="payment-qr-image-wrapper">
          <img src={paymentUrl} alt="QR Payment" className="payment-qr-image" />
        </div>

        <p className="payment-qr-title">Quét mã QR bằng ứng dụng ngân hàng</p>

        {orderCode && (
          <div className="payment-qr-order">
            Mã đơn: <strong>{orderCode}</strong>
          </div>
        )}

        {totalPrice != null && (
          <div className="payment-qr-total">
            Tổng tiền: <strong>{totalPrice}</strong>
          </div>
        )}

        {showCountdown && (
          <div className="payment-qr-countdown">
            QR hết hạn sau:
            <span className={countdown <= 10 ? "danger" : ""}>
              {" "}
              {countdown}s
            </span>
          </div>
        )}

        <div className="payment-qr-note">
          Sau khi thanh toán thành công, hệ thống sẽ tự động cập nhật trạng thái
          đơn hàng.
        </div>
      </div>
    </Modal>
  );
};

export default PaymentQrModal;
