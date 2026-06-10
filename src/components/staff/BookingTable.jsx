import React from "react";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";

const BookingTable = ({ data, loading, onEdit, onView }) => {
  const columns = [
    {
      title: "Mã booking",
      dataIndex: "reservationCode",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhone",
    },
    {
      title: "Thời gian đến",
      dataIndex: "reservationTime",
    },
    {
      title: "Bàn",
      dataIndex: "tableNumber",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
    },

    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={onView}
          onEdit={onEdit}
          showDelete={false}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default BookingTable;
