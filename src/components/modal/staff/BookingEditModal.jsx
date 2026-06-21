import React from "react";
import { Modal, Button, Select } from "antd";

const bookingStatusFlow = {
  PENDING: ["CHECKED_IN", "CANCELED"],
  CHECKED_IN: ["COMPLETED"],
  COMPLETED: [],
  CANCELED: [],
};

const statusOptions = [
  { value: "CHECKED_IN", label: "Nhận bàn" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELED", label: "Hủy đặt bàn" },
];

const getAvailableStatuses = (currentStatus) => {
  return statusOptions.filter((opt) =>
    bookingStatusFlow[currentStatus]?.includes(opt.value),
  );
};

const BookingEditModal = ({
  open,
  record,
  newStatus,
  setNewStatus,
  onSave,
  onClose,
}) => {
  React.useEffect(() => {
    if (open && record) {
      const available = getAvailableStatuses(record.status);

      if (available.length > 0) {
        setNewStatus(available[0].value);
      }
    }
  }, [open, record]);

  return (
    <Modal
      title="Cập nhật trạng thái đặt bàn"
      open={open}
      onCancel={onClose}
      footer={null}
      width={450}
    >
      {record && (
        <>
          <div style={{ marginBottom: 12 }}>
            <strong>Mã đặt bàn:</strong>
            <p>{record.reservationCode}</p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Khách hàng:</strong>
            <p>{record.customerName}</p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Bàn:</strong>
            <p>{record.tableNumber}</p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Trạng thái hiện tại:</strong>
            <p>{record.statusLabel}</p>
          </div>

          {getAvailableStatuses(record.status).length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <strong>Chọn trạng thái mới:</strong>

              <Select
                style={{ width: "100%", marginTop: 8 }}
                value={newStatus}
                onChange={setNewStatus}
              >
                {getAvailableStatuses(record.status).map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <Button onClick={onClose}>Đóng</Button>

            <Button
              type="primary"
              onClick={() => onSave(newStatus)}
              disabled={!newStatus}
            >
              Lưu
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default BookingEditModal;
