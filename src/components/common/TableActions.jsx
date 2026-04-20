import React from "react";
import { Button, Space, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const TableActions = ({
  record,
  onView,
  onEdit,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}) => {
  return (
    <Space>
      {showView && (
        <Button
          icon={<EyeOutlined />}
          onClick={() => onView && onView(record)}
        />
      )}

      {showEdit && (
        <Button
          icon={<EditOutlined />}
          onClick={() => onEdit && onEdit(record)}
        />
      )}

      {showDelete && (
        <Popconfirm
          title="Bạn chắc chắn muốn xoá?"
          okText="Xoá"
          cancelText="Huỷ"
          onConfirm={() => onDelete && onDelete(record.id)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )}
    </Space>
  );
};

export default TableActions;
