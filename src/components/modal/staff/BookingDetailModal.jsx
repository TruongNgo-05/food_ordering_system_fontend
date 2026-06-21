import React from "react";
import { Modal, Descriptions, Tag, Spin } from "antd";
import dayjs from "dayjs";

const BookingDetailModal = ({ open, onClose, loading, booking }) => {
  return (
    <Modal
      title="Chi tiết đặt bàn"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 30 }}>
          <Spin />
        </div>
      ) : (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã đặt bàn" span={2}>
            {booking?.reservationCode}
          </Descriptions.Item>

          <Descriptions.Item label="Khách hàng" span={2}>
            {booking?.customerName}
          </Descriptions.Item>

          <Descriptions.Item label="Số điện thoại" span={2}>
            {booking?.customerPhone}
          </Descriptions.Item>

          <Descriptions.Item label="Email" span={2}>
            {booking?.customerEmail}
          </Descriptions.Item>

          <Descriptions.Item label="Bàn" span={2}>
            {booking?.tableNumber} - Sức chứa {booking?.capacity}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian đặt" span={2}>
            {booking?.reservationTime
              ? dayjs(booking.reservationTime).format("HH:mm DD/MM/YYYY ")
              : ""}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái" span={2}>
            <Tag>{booking?.status}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú" span={2}>
            {booking?.note || "Không có"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default BookingDetailModal;
