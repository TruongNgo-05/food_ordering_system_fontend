import React from "react";
import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";

const CategoryTable = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "id",
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
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

export default CategoryTable;
