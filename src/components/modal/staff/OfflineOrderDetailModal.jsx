import React from "react";
import { Modal, Button } from "antd";
import { fmt } from "../../../constants/customerTheme";
import FoodItemTable from "../../staff/FoodItemTable";

const OfflineOrderDetailModal = ({ open, record, onClose }) => {
  return (
    <Modal
      title="Chi tiết đơn hàng tại bàn"
      open={open}
      onCancel={onClose}
      footer={[
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

            <div>
              <strong>Số Bàn:</strong>
              <p>{record.tableNumber}</p>
            </div>

            <div>
              <strong>Thời gian:</strong>
              <p>{record.createdAt}</p>
            </div>

            <div>
              <strong>Thanh toán:</strong>
              <p>{record.paymentMethod}</p>
            </div>

            <div>
              <strong>Trạng thái đơn:</strong>
              <p>{record.status}</p>
            </div>

            <div>
              <strong>Trạng thái thanh toán:</strong>
              <p>{record.paymentStatus}</p>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div style={{ marginTop: 10, marginBottom: 16 }}>
            <strong>Các món:</strong>

            <div style={{ marginTop: 8 }}>
              <FoodItemTable data={record.items} loading={false} />
            </div>
          </div>

          {/* FINANCIAL INFO (FIXED LAYOUT) */}
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

            <div style={{ gridColumn: "1 / -1" }}>
              <strong>Ghi chú:</strong>
              <p>{record.note}</p>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default OfflineOrderDetailModal;
