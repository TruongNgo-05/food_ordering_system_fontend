import React from "react";
import { Modal, Button } from "antd";
import { T, fmt } from "../../../constants/customerTheme";
    
const OnlineOrderDetailModal = ({ open, record, onClose }) => {
  return (
    <Modal
      title="Chi tiết đơn hàng online"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={600}
    >
      {record && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 20,
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
              <strong>Thời gian:</strong>
              <p>{record.createdAt}</p>
            </div>

            <div>
              <strong>Thanh toán:</strong>
              <p>{record.paymentMethod}</p>
            </div>

            <div>
              <strong>Trạng thái đơn hàng:</strong>
              <p>{record.status}</p>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <strong>Trạng thái thanh toán:</strong>
              <p>{record.paymentStatus}</p>
            </div>
            <div>
              <strong>Giảm giá:</strong>
              <p>{fmt(record.discount)}</p>
            </div>
            <div>
              <strong>Tổng tiền:</strong>
              <p style={{ color: "blue", fontWeight: "bold" }}>
                {fmt(record.totalPrice)}
              </p>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <strong>Địa chỉ giao:</strong>
              <p>{record.address}</p>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <strong>Ghi chú:</strong>
              <p>{record.note}</p>
            </div>
          </div>

          <div>
            <strong>Các món:</strong>
            <ul style={{ paddingLeft: 20 }}>
              {record.items?.length > 0 ? (
                record.items.map((item) => (
                  <li key={item.foodId}>
                    {item.foodName} - SL: {item.quantity} - {fmt(item.price)}
                  </li>
                ))
              ) : (
                <p>Không có món</p>
              )}
            </ul>
          </div>
        </>
      )}
    </Modal>
  );
};

export default OnlineOrderDetailModal;
