import React, { useMemo, useState } from "react";
import { Form, Input, Modal, Switch } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import { loadSharedBanners, saveSharedBanners } from "../../utils/sharedData";

const pageSize = 4;

const AdminBanners = () => {
  const [items, setItems] = useState(() => loadSharedBanners());
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [form] = Form.useForm();

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        String(item.title).toLowerCase().includes(keyword) ||
        String(item.desc).toLowerCase().includes(keyword);
      const isActive = item.active !== false;
      const matchActive =
        activeFilter === "all" ||
        (activeFilter === "active" && isActive) ||
        (activeFilter === "inactive" && !isActive);
      return matchKeyword && matchActive;
    });
  }, [activeFilter, items, search]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );

  const columns = [
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Mô tả", dataIndex: "desc" },
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
      render: (_, r) => (
        <Switch
          checked={r.active !== false}
          onChange={(checked) => {
            const nextItems = items.map((it) =>
              it.id === r.id ? { ...it, active: checked } : it,
            );
            setItems(nextItems);
            saveSharedBanners(nextItems);
          }}
        />
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={false}
          onEdit={(r) => {
            setEditingRecord(r);
            form.setFieldsValue(r);
            setOpenEdit(true);
          }}
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
    const nextItems = [...items, { id: Date.now(), ...values, active: values.active !== false }];
    setItems(nextItems);
    saveSharedBanners(nextItems);
    setOpenAdd(false);
    form.resetFields();
  };

  const handleEdit = async () => {
    const values = await form.validateFields();
    const nextItems = items.map((it) =>
      it.id === editingRecord?.id ? { ...it, ...values, active: values.active !== false } : it,
    );
    setItems(nextItems);
    saveSharedBanners(nextItems);
    setOpenEdit(false);
    setEditingRecord(null);
  };

  const handleDelete = () => {
    const nextItems = items.filter((it) => it.id !== editingRecord?.id);
    setItems(nextItems);
    saveSharedBanners(nextItems);
    setOpenDelete(false);
    setEditingRecord(null);
  };

  return (
    <>
      <AdminPageSection
        title="Quản lý banner"
        subtitle="Tạo và cập nhật banner hiển thị trên trang khách hàng."
        stats={[
          { label: "Tổng banner", value: items.length },
          { label: "Đang hiển thị", value: items.filter((x) => x.active !== false).length },
          { label: "Đã tắt", value: items.filter((x) => x.active === false).length },
          { label: "Tỉ lệ hiển thị", value: `${items.length ? Math.round((items.filter((x) => x.active !== false).length / items.length) * 100) : 0}%` },
        ]}
        actionLabel="+ Thêm banner"
        onAddClick={() => {
          form.resetFields();
          form.setFieldValue("active", true);
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm banner..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="admin-control"
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hiển thị</option>
              <option value="inactive">Đã tắt</option>
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

      <Modal title="Thêm banner" open={openAdd} onCancel={() => setOpenAdd(false)} onOk={handleAdd}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="desc" label="Mô tả" rules={[{ required: true, message: "Nhập mô tả" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Link ảnh" rules={[{ required: true, message: "Nhập link ảnh" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="active" label="Hiển thị" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Sửa banner" open={openEdit} onCancel={() => setOpenEdit(false)} onOk={handleEdit}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="desc" label="Mô tả" rules={[{ required: true, message: "Nhập mô tả" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Link ảnh" rules={[{ required: true, message: "Nhập link ảnh" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="active" label="Hiển thị" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa banner"
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onOk={handleDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn xóa banner này?</p>
      </Modal>
    </>
  );
};

export default AdminBanners;
