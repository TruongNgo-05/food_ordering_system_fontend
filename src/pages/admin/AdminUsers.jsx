import React, { useMemo, useState } from "react";
import { Form, Input, Modal, Switch } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import AdminViewDrawer from "../../components/admin/AdminViewDrawer";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";

const pageSize = 4;

const AdminUsers = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Nguyễn Thanh Hằng",
      email: "hang@example.com",
      role: "CUSTOMER",
      status: "Hoạt động",
      statusClass: "ok",
    },
    {
      id: 2,
      name: "Lê Quốc Bảo",
      email: "bao.staff@example.com",
      role: "ADMIN",
      status: "Khóa",
      statusClass: "danger",
    },
  ]);
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form] = Form.useForm();

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        String(item.name).toLowerCase().includes(keyword) ||
        String(item.email).toLowerCase().includes(keyword);
      const normalizedStatus = item.status === "Khóa" ? "locked" : "active";
      const matchStatus =
        statusFilter === "all" || normalizedStatus === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [items, search, statusFilter]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 80,
      // render: (image) => (

      // ),
    },
    { title: "Tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Số điện thoại", dataIndex: "phone" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, u) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Switch
            checked={u.status !== "Khóa"}
            checkedChildren="Hoạt động"
            unCheckedChildren="Khóa"
            onChange={() => handleToggleLock(u.id)}
          />
        </div>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={true}
          onView={(r) => {
            setEditingRecord(r);
            setOpenView(true);
          }}
          showEdit={false}
          onDelete={(id) => {
            const found = items.find((x) => x.id === id);
            setEditingRecord(found || null);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  const handleAdd = async () => {
    const values = await form.validateFields();
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...values,
        role: "CUSTOMER",
        status: "Hoạt động",
        statusClass: "ok",
      },
    ]);
    setOpenAdd(false);
    form.resetFields();
  };

  const handleEdit = async () => {
    const values = await form.validateFields();
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingRecord?.id ? { ...item, ...values } : item,
      ),
    );
    setOpenEdit(false);
    setEditingRecord(null);
  };

  const handleDelete = () => {
    setItems((prev) => prev.filter((item) => item.id !== editingRecord?.id));
    setOpenDelete(false);
    setEditingRecord(null);
  };

  const handleToggleLock = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Khóa" ? "Hoạt động" : "Khóa",
              statusClass: item.status === "Khóa" ? "ok" : "danger",
            }
          : item,
      ),
    );
  };

  return (
    <>
      <AdminPageSection
        title="Quản lý người dùng"
        subtitle="Kiểm soát tài khoản khách hàng, nhân viên và quyền truy cập hệ thống."
        stats={[
          { label: "Tổng tài khoản", value: "1.824" },
          { label: "Khách hàng", value: "1.650" },
          { label: "Nhân viên", value: "146" },
          { label: "Tài khoản khóa", value: "28" },
        ]}
        actionLabel="+ Thêm tài khoản"
        onAddClick={() => {
          form.resetFields();
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm tên hoặc email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="admin-control"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
            </select>
          </>
        }
        table={<BaseTable columns={columns} data={pageData} />}
        pagination={
          <AppPagination
            page={page}
            size={pageSize}
            total={filteredItems.length}
            onChange={(p) => setPage(p)}
          />
        }
      />

      <Modal
        title="Thêm tài khoản"
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={handleAdd}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Nhập email hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sửa tài khoản"
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={handleEdit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Nhập email hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa tài khoản"
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
          { label: "Họ tên", value: editingRecord?.name },
          { label: "Email", value: editingRecord?.email },
          { label: "Trạng thái", value: editingRecord?.status },
        ]}
      />
    </>
  );
};
export default AdminUsers;
