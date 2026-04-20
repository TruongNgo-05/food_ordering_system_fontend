import React, { useState, useEffect } from "react";
import { Form, Modal, Input, Select, message } from "antd";
import AdminViewDrawer from "../../components/modal/admin/UserViewDrawer";

import adminUserService from "../../services/admin/adminUserService";
import { useAuth } from "../../hooks/useAuth";
import UserTable from "../../components/admin/UserTable";
import AppPagination from "../../components/common/AppPagination";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import "../../assets/styles/AdminPages.css";
import UserCreateModal from "../../components/modal/admin/UserCreateModal";
import UserUpdateModal from "../../components/modal/admin/UserUpdateModal";
const pageSize = 5;

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [total, setTotal] = useState(0);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

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
        size: size,
      });
      const data = res?.data?.data;
      const content = data?.content || [];
      const users = content.map((u) => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        phone: u.phone,
        role: u.role === "ADMIN" ? "Quản trị" : "Khách hàng",
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

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      const payload = {
        username: values.username,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        passWord: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
      };
      await adminUserService.createUser(payload);
      message.success("Thêm user thành công");
      setOpenAdd(false);
      addForm.resetFields();
      fetchUsers();
    } catch (err) {
      console.log(err);
      message.error("Thêm thất bại");
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        email: values.email,
        role: values.role,
      };
      await adminUserService.updateUser(editingRecord.id, payload);
      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);
      fetchUsers();
    } catch (err) {
      message.error("Cập nhật thất bại");
      console.log(err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await adminUserService.deleteUser(id);
      message.success("Xóa thành công");
      fetchUsers();
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  // ================= LOCK =================
  const handleToggleLock = async (id, user) => {
    try {
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
  }, [search, statusFilter, roleFilter, page, size]);

  return (
    <>
      <UserHeader
        title="Quản lý người dùng"
        description="Kiểm soát tài khoản hệ thống"
        buttonText=" Thêm tài khoản"
        handleAdd={() => setOpenAdd(true)}
      />

      {/* STATS */}
      <StatsCards
        loading={loading}
        items={[
          { title: "Tổng", value: total },
          { title: "Số", value: 0 },
          { title: "Số", value: 0 },
          { title: "Số", value: 0 },
        ]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            placeholder="Tìm tên hoặc email..."
            allowClear
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-divider" />
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => setStatusFilter(v || "all")}
        >
          <Select.Option value="all">Tất cả</Select.Option>
          <Select.Option value="active">Hoạt động</Select.Option>
          <Select.Option value="locked">Khóa</Select.Option>
        </Select>
        <Select
          placeholder="Vai trò"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => setRoleFilter(v || "all")}
        >
          <Select.Option value="all">Tất cả</Select.Option>
          <Select.Option value="ADMIN">Admin</Select.Option>
          <Select.Option value="CUSTOMER">Khách hàng</Select.Option>
        </Select>
      </div>

      <div className="admin-table-wrapper">
        <UserTable
          data={items}
          loading={loading}
          currentUser={currentUser}
          onView={(id) => {
            const user = items.find((u) => u.id === id);
            setEditingRecord(user);
            setOpenView(true);
          }}
          onEdit={(record) => {
            setEditingRecord(record);
            editForm.setFieldsValue(record);
            setOpenEdit(true);
          }}
          onDelete={(id) => handleDelete(id)}
          onToggleLock={handleToggleLock}
        />
      </div>

      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />

      <UserCreateModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={handleAdd}
        form={addForm}
      />
      <UserUpdateModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={handleEdit}
        form={editForm}
      />
      <AdminViewDrawer
        title="Thông tin người dùng"
        open={openView}
        onClose={() => {
          setOpenView(false);
          setEditingRecord(null);
        }}
        user={editingRecord?.raw}
      />
    </>
  );
};

export default AdminUsers;
