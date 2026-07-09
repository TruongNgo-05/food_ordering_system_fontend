import React from "react";
import dayjs from "dayjs";
import { Tag } from "antd";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";

const SupportTable = ({ data, loading, onView }) => {
  const getStatusTag = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag className="status-pending">Đang chờ</Tag>;

      case "REPLIED":
        return <Tag className="status-replied">Đã phản hồi</Tag>;

      case "RESOLVED":
        return <Tag className="status-resolved">Đã giải quyết</Tag>;

      default:
        return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Mã hỗ trợ",
      dataIndex: "supportCode",
      align: "center",
      width: 160,
    },
    {
      title: "Chủ đề",
      dataIndex: "subject",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: 170,
      render: getStatusTag,
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      align: "center",
      width: 180,
      render: (value) =>
        value ? dayjs(value).format("HH:mm DD/MM/YYYY") : "-",
    },
    {
      title: "Thao tác",
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

export default SupportTable;
