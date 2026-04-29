import React from "react";

import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";

const VoucherTable = ({
  data,
  categories = [],
  onToggleStatus,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Mã voucher",
      dataIndex: "voucherCode",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Giảm",
      dataIndex: "discount",
    },
    {
      title: "Số lượt dùng",
      dataIndex: "usageLimit",
    },
    {
      title: "Thời hạn",
      render: (_, record) => `${record.startDate} - ${record.endDate}`,
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={onView}
          showView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} />;
};

export default VoucherTable;
