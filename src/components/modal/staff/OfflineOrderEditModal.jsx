import React from "react";
import { Modal, Button, Select } from "antd";

const offlineStatusFlow = {
  PENDING: ["CONFIRMED", "REJECTED"],
  CONFIRMED: ["PREPARING"],
  PREPARING: ["COMPLETED"], // ❗ FIX QUAN TRỌNG
  COMPLETED: [],
  REJECTED: [],
  CANCELED: [],
};

const getAvailableStatuses = (currentStatus, options) => {
  return options.filter((opt) =>
    offlineStatusFlow[currentStatus]?.includes(opt.value),
  );
};

const OfflineOrderEditModal = ({
  open,
  record,
  statusOptions,
  newStatus,
  setNewStatus,
  onSave,
  onClose,
}) => {
  React.useEffect(() => {
    if (open && record) {
      setNewStatus(record.status);
    }
  }, [open, record]);

  return (
    <Modal
      title="Cập nhật trạng thái đơn hàng OFFLINE"
      open={open}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      {record && (
        <>
          <div style={{ marginBottom: 12 }}>
            <strong>Mã đơn:</strong>
            <p>{record.orderCode}</p>
          </div>

          <div style={{ marginBottom: 12 }}>
            <strong>Trạng thái hiện tại:</strong>
            <p>{record.status}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <strong>Chọn trạng thái mới:</strong>

            <Select
              style={{ width: "100%", marginTop: 8 }}
              value={newStatus}
              onChange={setNewStatus}
            >
              {getAvailableStatuses(record.status, statusOptions).map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={onClose}>Đóng</Button>

            <Button
              type="primary"
              onClick={() => onSave(newStatus)}
              disabled={newStatus === record.status}
            >
              Lưu
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default OfflineOrderEditModal;
