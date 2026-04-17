import React, { useMemo, useState } from "react";
import { Form, Input, InputNumber, Modal } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import {
  loadSharedCategories,
  saveSharedCategories,
} from "../../utils/sharedData";

const pageSize = 4;

const AdminCategories = () => {
  const [items, setItems] = useState(() => {
    const shared = loadSharedCategories().filter((c) => c.id !== 1);
    if (shared.length > 0) {
      return shared.map((c) => ({
        id: c.id,
        name: c.name,
        desc: `Danh mục ${c.name}`,
        count: 0,
      }));
    }
    return loadSharedCategories()
      .filter((c) => c.id !== 1)
      .map((c) => ({
        id: c.id,
        name: c.name,
        desc: `Danh mục ${c.name}`,
        count: 0,
      }));
  });
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [countFilter, setCountFilter] = useState("all");
  const [form] = Form.useForm();

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        String(item.name).toLowerCase().includes(keyword) ||
        String(item.desc).toLowerCase().includes(keyword);
      if (countFilter === "all") return matchKeyword;
      if (countFilter === "lt10")
        return matchKeyword && Number(item.count || 0) < 10;
      return matchKeyword && Number(item.count || 0) >= 10;
    });
  }, [countFilter, items, search]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );
  const columns = [
    { title: "Tên danh mục", dataIndex: "name" },
    { title: "Mô tả", dataIndex: "desc" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={false}
          onEdit={(r) => onOpenEdit(r)}
          onDelete={(id) => {
            const found = items.find((x) => x.id === id);
            setEditingRecord(found || null);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  const onAdd = async () => {
    const values = await form.validateFields();
    const nextItems = [
      ...items,
      {
        id: Date.now(),
        name: values.name,
        desc: values.desc,
        count: Number(values.count || 0),
      },
    ];
    setItems(nextItems);
    saveSharedCategories([
      { id: 1, name: "Tất cả", icon: "🍽️" },
      ...nextItems.map((it) => ({ id: it.id, name: it.name, icon: "🍽️" })),
    ]);
    setOpenAdd(false);
    form.resetFields();
  };
  const onOpenEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setOpenEdit(true);
  };
  const onEdit = async () => {
    const values = await form.validateFields();
    const nextItems = items.map((it) =>
      it.id === editingRecord?.id
        ? {
            ...it,
            name: values.name,
            desc: values.desc,
            count: Number(values.count || 0),
          }
        : it,
    );
    setItems(nextItems);
    saveSharedCategories([
      { id: 1, name: "Tất cả", icon: "🍽️" },
      ...nextItems.map((it) => ({ id: it.id, name: it.name, icon: "🍽️" })),
    ]);
    setOpenEdit(false);
    setEditingRecord(null);
  };
  const onDelete = () => {
    const nextItems = items.filter((it) => it.id !== editingRecord?.id);
    setItems(nextItems);
    saveSharedCategories([
      { id: 1, name: "Tất cả", icon: "🍽️" },
      ...nextItems.map((it) => ({ id: it.id, name: it.name, icon: "🍽️" })),
    ]);
    setOpenDelete(false);
    setEditingRecord(null);
  };

  return (
    <>
      <AdminPageSection
        title="Quản lý danh mục"
        subtitle="Nhóm món ăn theo danh mục để hiển thị rõ ràng và tìm kiếm nhanh."
        stats={[
          { label: "Tổng danh mục", value: "12" },
          { label: "Đang hoạt động", value: "10" },
          { label: "Ẩn tạm thời", value: "2" },
          { label: "Món trung bình/danh mục", value: "14" },
        ]}
        actionLabel="+ Thêm danh mục"
        onAddClick={() => {
          form.resetFields();
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm danh mục..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="admin-control"
              value={countFilter}
              onChange={(e) => {
                setCountFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả số món</option>
              <option value="lt10">Dưới 10 món</option>
              <option value="gte10">Từ 10 món</option>
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
        title="Thêm danh mục"
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={onAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="desc"
            label="Mô tả"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="count"
            label="Số món"
            rules={[{ required: true, message: "Nhập số món" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Sửa danh mục"
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={onEdit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Nhập tên danh mục" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="desc"
            label="Mô tả"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={openDelete}
        title="Xác nhận xóa danh mục"
        onCancel={() => setOpenDelete(false)}
        onOk={onDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn xóa danh mục này?</p>
      </Modal>
    </>
  );
};
export default AdminCategories;
