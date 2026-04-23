import React from "react";
import { Switch } from "antd";

import BaseTable from "../common/BaseTable";
import TableActions from "../common/TableActions";
import FoodImage from "../common/FoodImage";

const formatPrice = (v) => `${Number(v || 0).toLocaleString("vi-VN")}đ`;

const FoodTable = ({
  data,
  categories = [],
  onToggleStatus,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (img) => <FoodImage src={img} size={40} />,
    },
    {
      title: "Tên món",
      dataIndex: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category_name",
      render: (name) => name || "—",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (v) => formatPrice(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => (
        <Switch
          checked={record.status === "active"}
          checkedChildren="Đang bán"
          unCheckedChildren="Tạm hết"
          onChange={() => onToggleStatus?.(record.id)}
        />
      ),
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

export default FoodTable;
