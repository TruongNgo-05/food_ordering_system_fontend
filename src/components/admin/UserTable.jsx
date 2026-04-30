import React from "react";
import { Switch } from "antd";
import TableActions from "../common/TableActions";
import BaseTable from "../common/BaseTable";

const UserTable = ({
  data,
  loading,
  onView,
  onEdit,
  onDelete,
  onToggleLock,
  currentUser,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => id || "—",
    },
    { title: "Họ Tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "SĐT", dataIndex: "phone" },

    {
      title: "Trạng thái",
      render: (_, u) => {
        const isCurrentUser = currentUser?.id === u.id;

        return (
          <Switch
            disabled={isCurrentUser}
            checked={u.raw?.status === "ACTIVED"}
            checkedChildren="Hoạt động"
            unCheckedChildren="Khóa"
            onChange={() => onToggleLock(u.id, u)}
            title={isCurrentUser ? "Không thể khóa chính mình" : ""}
          />
        );
      },
    },

    { title: "Vai trò", dataIndex: "role" },

    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={(r) => onView(r.id)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return <BaseTable columns={columns} data={data} loading={loading} />;
};

export default UserTable;
