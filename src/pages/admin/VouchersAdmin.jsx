import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Modal, message } from "antd";

import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";

const pageSize = 5;

const AdminVouchers = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);

  const [form] = Form.useForm();

  // ================= MOCK LOAD =================
  useEffect(() => {
    const fake = [
      {
        id: 1,
        code: "SALE10",
        percent: 10,
        used: 5,
      },
      {
        id: 2,
        code: "SALE20",
        percent: 20,
        used: 2,
      },
    ];

    setItems(fake);
    setTotal(fake.length);
  }, []);

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      const newItem = {
        id: Date.now(),
        code: values.code,
        percent: values.percent,
        used: values.used || 0,
      };

      const newList = [newItem, ...items];

      setItems(newList);
      setTotal(newList.length);

      message.success("Thêm voucher thành công");
      setOpenAdd(false);
      form.resetFields();
    } catch {
      message.error("Thêm thất bại");
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    try {
      const values = await form.validateFields();

      const newList = items.map((it) =>
        it.id === editingRecord.id
          ? {
              ...it,
              code: values.code,
              percent: values.percent,
              used: values.used,
            }
          : it,
      );

      setItems(newList);

      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    const newList = items.filter((it) => it.id !== editingRecord.id);

    setItems(newList);
    setTotal(newList.length);

    message.success("Xóa thành công");
    setOpenDelete(false);
    setEditingRecord(null);
  };

  // ================= TABLE =================
  const columns = [
    { title: "Mã", dataIndex: "code" },
    {
      title: "Giảm (%)",
      dataIndex: "percent",
      render: (v) => `${v}%`,
    },
    { title: "Số lượt dùng", dataIndex: "used" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          onEdit={(r) => {
            setEditingRecord(r);
            form.setFieldsValue(r);
            setOpenEdit(true);
          }}
          onDelete={() => {
            setEditingRecord(record);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý voucher"
        description="Quản lý mã giảm giá"
        buttonText="Thêm voucher"
        handleAdd={() => {
          form.resetFields();
          setOpenAdd(true);
        }}
      />

      {/* STATS */}
      <StatsCards
        loading={loading}
        items={[
          { title: "Tổng voucher", value: total },
          { title: "Đang dùng", value: items.length },
          { title: "Hết hạn", value: 0 },
          { title: "Khác", value: 0 },
        ]}
      />

      {/* SEARCH */}
      <div className="filter-bar">
        <Input
          placeholder="Tìm voucher..."
          allowClear
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <BaseTable columns={columns} data={items} loading={loading} />
      </div>

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={pageSize}
        total={total}
        onChange={(p) => setPage(p)}
      />

      {/* ADD */}
      <Modal
        title="Thêm voucher"
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={handleAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[{ required: true, message: "Nhập mã" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="percent"
            label="Giảm (%)"
            rules={[{ required: true, message: "Nhập %" }]}
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="used" label="Số lượt dùng">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT */}
      <Modal
        title="Sửa voucher"
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={handleEdit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="percent"
            label="Giảm (%)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="used" label="Số lượt dùng">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* DELETE */}
      <Modal
        title="Xác nhận xóa"
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onOk={handleDelete}
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn xóa voucher này?</p>
      </Modal>
    </>
  );
};

export default AdminVouchers;
