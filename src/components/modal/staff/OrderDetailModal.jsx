import React from "react";
import { Modal, Button } from "antd";
import { fmt } from "../../../constants/customerTheme";
import FoodItemTable from "../../staff/FoodItemTable";
import dayjs from "dayjs";
const getStatusLabel = (status) => {
  const map = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PREPARING: "Đang chuẩn bị",
    DELIVERING: "Đang giao",
    DELIVERY_FAILED: "Nhà hàng đã hủy",
    COMPLETED: "Hoàn thành",
    CANCELED: "Nhà hàng đã hủy",
    CANCELLED: "Nhà hàng đã hủy",
  };

  return map[status] || status;
};

const getPaymentMethodLabel = (method) => {
  const map = {
    COD: "Tiền mặt (COD)",
    ONLINE: "Online",
    AT_TABLE: "Tại bàn",
  };

  return map[method] || method;
};

const getPaymentStatusLabel = (status) => {
  return status === "PAID" ? "Đã thanh toán" : "Chưa thanh toán";
};

const getDisplayTime = (record) => {
  const raw =
    record?.reservationTime || record?.createdAt || record?.created_at;
  if (!raw) return "-";

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "-";

  return dayjs(parsed).format("HH:mm DD/MM/YYYY");
};

const OrderDetailModal = ({ open, record, onClose, type = "online" }) => {
  const isOffline = type === "offline";

  return (
    <Modal
      title={
        isOffline ? "Chi tiết đơn hàng tại bàn" : "Chi tiết đơn hàng online"
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="print" type="primary" onClick={() => window.print()}>
          In hóa đơn
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={700}
    >
      {record && (
        <>
          {/* INFO GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <strong>Mã đơn:</strong>
              <p>{record.orderCode}</p>
            </div>

            <div>
              <strong>Khách hàng:</strong>
              <p>{record.customerName}</p>
            </div>

            <div>
              <strong>Số điện thoại:</strong>
              <p>{record.customerPhone}</p>
            </div>

            {isOffline && (
              <div>
                <strong>Số bàn:</strong>
                <p>{record.tableNumber}</p>
              </div>
            )}

            <div>
              <strong>Thời gian:</strong>
              <p>{getDisplayTime(record)}</p>
            </div>

            <div>
              <strong>Thanh toán:</strong>
              <p>{getPaymentMethodLabel(record.paymentMethod)}</p>
            </div>

            <div>
              <strong>Trạng thái đơn:</strong>
              <p>{getStatusLabel(record.status)}</p>
            </div>

            <div>
              <strong>Trạng thái thanh toán:</strong>
              <p>{getPaymentStatusLabel(record.paymentStatus)}</p>
            </div>
          </div>

          {/* ITEMS */}
          <div style={{ marginTop: 10, marginBottom: 16 }}>
            <strong>Các món:</strong>
            <div style={{ marginTop: 8 }}>
              <FoodItemTable data={record.items} loading={false} />
            </div>
          </div>

          {/* FINANCIAL */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 10,
            }}
          >
            <div>
              <strong>Tổng tiền:</strong>
              <p style={{ color: "blue", fontWeight: "bold" }}>
                {fmt(record.totalPrice)}
              </p>
            </div>

            {!isOffline && (
              <div>
                <strong>Giảm giá:</strong>
                <p>{fmt(record.discount)}</p>
              </div>
            )}

            {isOffline && (
              <div style={{ gridColumn: "1 / -1" }}>
                <strong>Ghi chú:</strong>
                <p>{record.note}</p>
              </div>
            )}

            {!isOffline && (
              <>
                <div style={{ gridColumn: "1 / -1" }}>
                  <strong>Địa chỉ giao:</strong>
                  <p>{record.address}</p>
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <strong>Ghi chú:</strong>
                  <p>{record.note}</p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default OrderDetailModal;
