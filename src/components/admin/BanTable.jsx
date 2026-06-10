import React from "react";
import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";

const BanTable = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Mã bàn",
      dataIndex: "tableNumber",
    },
    {
      title: "Số người tối đa",
      dataIndex: "capacity",
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={false}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default BanTable;
