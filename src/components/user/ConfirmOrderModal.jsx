
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faClock,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/styles/ConfirmOrderModal.css";

const COUNTDOWN_TIME = 5;

const ConfirmOrderModal = ({
  open,
  loading = false,
  onCancel,
  onConfirm,
}) => {
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);

  // Reset countdown mỗi lần mở modal
  useEffect(() => {
    if (!open) {
      setCountdown(COUNTDOWN_TIME);
      return;
    }

    setCountdown(COUNTDOWN_TIME);
  }, [open]);

  // Đếm ngược
  useEffect(() => {
    if (!open || loading) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, loading]);

  // Hết 5 giây -> tự động đặt hàng
  useEffect(() => {
    if (open && countdown === 0 && !loading) {
      onConfirm();
    }
  }, [countdown, open, loading, onConfirm]);

  const progress = (countdown / COUNTDOWN_TIME) * 100;

  return (
    <Modal
      open={open}
      centered
      footer={null}
      closable={false}
      maskClosable={false}
      width={430}
      className="confirm-order-modal"
    >
      <div className="confirm-order">
        {/* ICON */}
        <div className="confirm-order-icon">
          <FontAwesomeIcon icon={faBagShopping} />
        </div>

        {/* TITLE */}
        <h2 className="confirm-order-title">
          Xác nhận đặt hàng
        </h2>

        <p className="confirm-order-description">
          Bạn có chắc chắn muốn đặt đơn hàng này?
        </p>

        {/* COUNTDOWN */}
        <div className="confirm-countdown-wrapper">
          <div
            className="confirm-countdown"
            style={{
              background: `conic-gradient(
                #f4c542 ${progress}%,
                #eeeeee ${progress}%
              )`,
            }}
          >
            <div className="confirm-countdown-inner">
              <span className="confirm-countdown-number">
                {countdown}
              </span>

              <span className="confirm-countdown-text">
                giây
              </span>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="confirm-order-notice">
          <FontAwesomeIcon icon={faClock} />

          <span>
            Đơn hàng sẽ được đặt tự động sau{" "}
            <strong>{countdown} giây</strong>
          </span>
        </div>

        {/* BUTTONS */}
        <div className="confirm-order-actions">
          <button
            type="button"
            className="confirm-order-cancel"
            disabled={loading}
            onClick={onCancel}
          >
            <FontAwesomeIcon icon={faXmark} />
            Hủy
          </button>

          <button
            type="button"
            className="confirm-order-confirm"
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? (
              "Đang đặt..."
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                Đặt ngay
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmOrderModal;

