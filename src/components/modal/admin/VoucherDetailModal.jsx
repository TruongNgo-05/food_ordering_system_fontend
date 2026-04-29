import React from "react";
import { Modal, Descriptions } from "antd";

const VoucherDetailModal = ({ open, onCancel, data }) => {
  return (
    <Modal
      title="Chi tiết voucher"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      {data && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã voucher">
            {data.voucherCode}
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả">
            {data.description || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Giảm (%)">
            {data.discount}%
          </Descriptions.Item>

          <Descriptions.Item label="Số lượt dùng">
            {data.usageLimit}
          </Descriptions.Item>

          <Descriptions.Item label="Đã dùng">
            {data.usedCount || 0}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian">
            {data.startDate} - {data.endDate}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {data.createdAt}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default VoucherDetailModal;
