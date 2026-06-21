import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import BookingTableModal from "./BookingTableModal";
import tableService from "../../../services/user/tableService";
import "../../../assets/styles/user/BookingModal.css";

const BookingModal = ({ open, onClose }) => {
  const [arrivalTime, setArrivalTime] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [note, setNote] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++)
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptcha(code);
  };

  const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  useEffect(() => {
    if (open) {
      generateCaptcha();
      setCaptchaInput("");
      setSelectedTable(null);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setNote("");
      setArrivalTime("");
    }
  }, [open]);

  const handleBook = async () => {
    if (!customerName.trim()) {
      return message.error("Vui lòng nhập họ tên");
    }

    if (!customerPhone.trim()) {
      return message.error("Vui lòng nhập số điện thoại");
    }

    // Validate số điện thoại Việt Nam
    if (!phoneRegex.test(customerPhone.trim())) {
      return message.error(
        "Số điện thoại không hợp lệ. Ví dụ: 0912345678 hoặc +84912345678",
      );
    }
    if (!customerEmail.trim()) {
      return message.error("Vui lòng nhập email");
    }

    if (!emailRegex.test(customerEmail.trim())) {
      return message.error("Email không hợp lệ");
    }
    if (!arrivalTime) {
      return message.error("Vui lòng chọn thời gian đến");
    }

    if (!selectedTable) {
      return message.error("Vui lòng chọn bàn");
    }

    if (captchaInput.trim().toUpperCase() !== captcha) {
      generateCaptcha();
      setCaptchaInput("");
      return message.error("Mã bảo mật không chính xác");
    }

    try {
      await tableService.createBooking({
        customerName,
        customerPhone,
        customerEmail,
        tableId: selectedTable.tableId,
        note,
        timeComes: `${arrivalTime}:00`,
      });

      message.success("Đặt bàn thành công!");
      onClose();
    } catch (error) {
      message.error(error?.response?.data?.message || "Đặt bàn thất bại");
    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={760}
        centered
        className="bm__modal"
      >
        <h2 className="bm__title">Đặt Bàn</h2>
        <div className="bm__divider" />

        <div className="bm__form">
          {/* Họ tên */}
          <div className="bm__group">
            <label className="bm__label">Họ và tên</label>
            <input
              className="bm__input"
              type="text"
              placeholder="Nguyễn Văn A"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          {/* Số điện thoại */}
          <div className="bm__group">
            <label className="bm__label">Số điện thoại</label>

            <input
              className={`bm__input ${phoneError ? "bm__input-error" : ""}`}
              type="tel"
              placeholder="0912345678"
              maxLength={10}
              value={customerPhone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setCustomerPhone(value);

                if (value.length === 0) {
                  setPhoneError("");
                } else if (!phoneRegex.test(value)) {
                  setPhoneError("Số điện thoại không hợp lệ");
                } else {
                  setPhoneError("");
                }
              }}
            />

            {phoneError && <span className="bm__error">{phoneError}</span>}
          </div>

          {/* Email */}
          <div className="bm__group">
            <label className="bm__label">Email</label>
            <input
              className="bm__input"
              type="email"
              placeholder="nguyenvana@gmail.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>

          {/* Thời gian đến */}
          <div className="bm__group">
            <label className="bm__label">Thời gian đến</label>
            <input
              className="bm__input"
              type="datetime-local"
              value={arrivalTime}
              min={getMinDateTime()}
              onChange={(e) => setArrivalTime(e.target.value)}
            />
          </div>

          {/* Chọn bàn */}
          <div className="bm__group bm__full">
            <label className="bm__label">Bàn</label>
            <div className="bm__table-row">
              <span className="bm__table-label">
                {selectedTable
                  ? `Bàn ${selectedTable.tableNumber}`
                  : "Chưa chọn bàn"}
              </span>
              <button
                type="button"
                className="bm__choose-btn"
                onClick={() => setShowTableModal(true)}
              >
                Chọn bàn
              </button>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="bm__group bm__full">
            <label className="bm__label">Ghi chú</label>
            <textarea
              className="bm__textarea"
              placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Captcha */}
          <div className="bm__group bm__full">
            <label className="bm__label">Mã bảo mật</label>
            <div className="bm__captcha-row">
              <div className="bm__captcha-box">{captcha}</div>
              <button
                type="button"
                className="bm__refresh-btn"
                title="Làm mới mã"
                onClick={generateCaptcha}
              >
                ↻
              </button>
              <input
                className="bm__captcha-input"
                type="text"
                placeholder="Nhập mã bên trái"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                maxLength={5}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="button" className="bm__submit-btn" onClick={handleBook}>
            Xác nhận đặt bàn
          </button>
        </div>
      </Modal>

      <BookingTableModal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        onSelect={(table) => {
          setSelectedTable(table);
          setShowTableModal(false);
        }}
        selectedTable={selectedTable}
      />
    </>
  );
};

export default BookingModal;
