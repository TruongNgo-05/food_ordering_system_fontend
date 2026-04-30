import React from "react";
import dayjs from "dayjs";

import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";

const VoucherTable = ({ data, onView, onEdit, onDelete }) => {
  const formatDate = (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "—");

  const formatMoney = (value) =>
    value ? `${value.toLocaleString()} đ` : "0 đ";

  const columns = [
    {
      title: "Mã voucher",
      dataIndex: "voucherCode",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (text) => text || "—",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      render: (value) => formatMoney(value),
    },
    {
      title: "Lượt dùng",
      dataIndex: "usageLimit",
      render: (value) => value ?? "Không giới hạn",
    },
    {
      title: "Thời hạn",
      render: (_, record) =>
        `${formatDate(record.startDate)} → ${formatDate(record.endDate)}`,
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={onView}
          showView={!!onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} />;
};

export default VoucherTable;
