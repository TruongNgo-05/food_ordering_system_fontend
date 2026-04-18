import React, { useMemo, useState, useEffect } from "react";
import { Form, Modal, Switch, message } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import AdminViewDrawer from "../../components/admin/user/AdminViewDrawer";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import AddUserModal from "../../components/admin/user/AddUserModal";
import EditUserModal from "../../components/admin/user/EditUserModal";
import adminUserService from "../../services/admin/adminUserService";
import { useAuth } from "../../hooks/useAuth";

const pageSize = 4;

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [roleFilter, setRoleFilter] = useState("all");
  const [total, setTotal] = useState(0);
  // ================= LOAD DATA =================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await adminUserService.getAllUser({
        email: search || undefined,
        fullName: search || undefined,
        status:
          statusFilter === "all"
            ? undefined
            : statusFilter === "active"
              ? "ACTIVED"
              : "LOCKED",
        role: roleFilter === "all" ? undefined : roleFilter,
        page: page,
        size: pageSize,
      });

      const data = res?.data?.data;

      const content = data?.content || [];

      const users = content.map((u) => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        phone: u.phone,
        role: u.role,
        image: u.avatar,
        status: u.status === "ACTIVED" ? "Hoạt động" : "Khóa",
        raw: u,
      }));

      setItems(users);
      setTotal(data?.totalElements || 0);
    } catch (err) {
      console.error("Fetch lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (img) =>
        img ? (
          <img
            src={img}
            alt="avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          "—"
        ),
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
            onChange={() => handleToggleLock(u.id, u)}
            title={
              isCurrentUser ? "Không thể khóa tài khoản của chính mình" : ""
            }
          />
        );
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView
          showEdit
          onView={(r) => {
            setEditingRecord(r);
            setOpenView(true);
          }}
          onEdit={(r) => {
            setEditingRecord(r);
            editForm.setFieldsValue(r);
            setOpenEdit(true);
          }}
          onDelete={(id) => {
            setEditingRecord(items.find((x) => x.id === id));
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();

      await adminUserService.createUser(values);

      message.success("Thêm user thành công");
      setOpenAdd(false);
      addForm.resetFields();

      fetchUsers();
    } catch (err) {
      message.error("Thêm thất bại");
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      await adminUserService.updateUser(editingRecord.id, values);

      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);

      fetchUsers();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await adminUserService.deleteUser(editingRecord.id);

      message.success("Xóa thành công");
      setOpenDelete(false);
      setEditingRecord(null);

      fetchUsers();
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  // ================= LOCK =================
  const handleToggleLock = async (id, user) => {
    try {
      // Kiểm tra xem có phải admin hiện tại không
      if (currentUser?.id === id) {
        message.error("Không thể khóa tài khoản của chính mình");
        return;
      }

      if (user.raw.status === "ACTIVED") {
        await adminUserService.lockUser(id);
      } else {
        await adminUserService.unlockUser(id);
      }

      message.success("Cập nhật trạng thái thành công");
      fetchUsers();
    } catch (err) {
      message.error("Lỗi đổi trạng thái");
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, statusFilter, roleFilter, page]);

  const pageData = items;
  return (
    <>
      <AdminPageSection
        title="Quản lý người dùng"
        subtitle="Kiểm soát tài khoản hệ thống"
        actionLabel="+ Thêm tài khoản"
        onAddClick={() => {
          addForm.resetFields();
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="admin-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
            </select>
            <select
              className="admin-control"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="ADMIN">Admin</option>
              <option value="CUSTOMER">Khách hàng</option>
            </select>
          </>
        }
        table={
          <BaseTable columns={columns} data={pageData} loading={loading} />
        }
        pagination={
          <AppPagination
            page={page}
            size={pageSize}
            total={total}
            onChange={(p) => setPage(p)}
          />
        }
      />

      <AddUserModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={handleAdd}
        form={addForm}
      />

      <EditUserModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={handleEdit}
        form={editForm}
      />

      <Modal
        title="Xác nhận xóa"
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onOk={handleDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn xóa tài khoản này?</p>
      </Modal>

      <AdminViewDrawer
        title="Thông tin người dùng"
        open={openView}
        onClose={() => {
          setOpenView(false);
          setEditingRecord(null);
        }}
        fields={[
          { label: "Họ tên", value: editingRecord?.raw?.fullName },
          { label: "Username", value: editingRecord?.raw?.username },
          { label: "Email", value: editingRecord?.raw?.email },
          { label: "SĐT", value: editingRecord?.raw?.phone },
          { label: "Vai trò", value: editingRecord?.raw?.role },
          {
            label: "Trạng thái",
            value:
              editingRecord?.raw?.status === "ACTIVED" ? "Hoạt động" : "Khóa",
          },
          {
            label: "Ngày tạo",
            value: editingRecord?.raw?.createdDate,
          },
          {
            label: "Fail count",
            value: editingRecord?.raw?.failCount,
          },
          {
            label: "Lock time",
            value: editingRecord?.raw?.lockTime || "—",
          },
        ]}
      />
    </>
  );
};

export default AdminUsers;
