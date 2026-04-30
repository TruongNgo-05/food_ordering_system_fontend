import React from "react";
import { Modal, Descriptions } from "antd";
import dayjs from "dayjs";

const VoucherDetailModal = ({ open, onCancel, data }) => {
  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "Không có";

  const formatMoney = (value) =>
    value ? `${value.toLocaleString()} đ` : "0 đ";

  return (
    <Modal
      title=" Chi tiết voucher"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      {data && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã voucher">
            {data.voucherCode}
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả">
            {data.description || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Giảm giá">
            {formatMoney(data.discount)}
          </Descriptions.Item>

          <Descriptions.Item label="Đơn tối thiểu">
            {formatMoney(data.minOrderValue)}
          </Descriptions.Item>

          <Descriptions.Item label="Giới hạn lượt dùng">
            {data.usageLimit ?? "Không giới hạn"}
          </Descriptions.Item>

          <Descriptions.Item label="Đã sử dụng">
            {data.usedCount || 0}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian">
            {formatDate(data.startDate)} → {formatDate(data.endDate)}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {formatDate(data.createdAt)}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default VoucherDetailModal;
