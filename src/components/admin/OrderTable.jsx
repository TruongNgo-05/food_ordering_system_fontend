import React from "react";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";
const formatPrice = (v) => `${Number(v || 0).toLocaleString("vi-VN")}đ`;
const getStatusText = (status) => {
  const map = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PREPARING: "Đang chuẩn bị",
    DELIVERING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELED: "Đã hủy",
    REJECTED: "Từ chối",
  };
  return map[status] || status;
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
      render: (value) => {
        const map = {
          COD: "Tiền mặt (COD)",
          ONLINE: "Online",
          AT_TABLE: "Tiền mặt tại bàn",
        };
        return map[value] || value;
      },
    },
    {
      title: "Trạng thái Thanh toán",
      dataIndex: "paymentStatus",
    },
    {
      title: "Trạng thái Đơn hàng",
      dataIndex: "status",
      render: (status) => <span>{getStatusText(status)}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      render: (v) => formatPrice(v),
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
