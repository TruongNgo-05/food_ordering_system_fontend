import React from "react";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";

const formatPrice = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const getStatusText = (status) => {
  const map = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PREPARING: "Đang chuẩn bị",
    DELIVERING: "Đang giao",
    DELIVERY_FAILED: "Giao hàng thất bại",
    COMPLETED: "Hoàn thành",
    CANCELED: "Nhà hàng đã hủy",
    FAILED: "Giao hàng thất bại",
  };

  return map[status] || status || "Không xác định";
};

const getPaymentStatusText = (status) => {
  const map = {
    PENDING: "Chờ thanh toán",
    PAID: "Đã thanh toán",
    UNPAID: "Chưa thanh toán",
    FAILED: "Thanh toán thất bại",
  };

  return map[status] || status || "Không xác định";
};

const getPaymentMethodText = (method) => {
  const map = {
    COD: "Tiền mặt (COD)",
    ONLINE: "Thanh toán online",
    AT_TABLE: "Tiền mặt tại bàn",
  };

  return map[method] || method || "Chưa xác định";
};

const OrderTable = ({ data, loading, onView }) => {
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      render: (text) => <strong>{text}</strong>,
    },

    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      render: (value) => getPaymentMethodText(value),
    },

    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      render: (status) => (
        <span className={`payment-status payment-${status?.toLowerCase()}`}>
          {getPaymentStatusText(status)}
        </span>
      ),
    },

    {
      title: "Trạng thái đơn hàng",
      dataIndex: "status",
      render: (status) => (
        <span className={`order-status order-${status?.toLowerCase()}`}>
          {getStatusText(status)}
        </span>
      ),
    },

    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (value) => formatPrice(value),
    },

    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={onView}
          showEdit={false}
          showDelete={false}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default OrderTable;
