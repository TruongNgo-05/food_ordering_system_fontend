import React from "react";
import { Switch } from "antd";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";

const BannerTable = ({ data, loading, onEdit, onDelete, onToggle }) => {
  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "desc",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (v) => (
        <a href={v} target="_blank" rel="noreferrer">
          Link ảnh
        </a>
      ),
    },
    {
      title: "Hiển thị",
      dataIndex: "active",
      render: (_, record) => (
        <Switch
          checked={record.active !== false}
          onChange={(checked) => onToggle(record, checked)}
        />
      ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={false}
          onEdit={onEdit}
          onDelete={() => onDelete(record)}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default BannerTable;
