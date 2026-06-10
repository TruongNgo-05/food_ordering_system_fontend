import React, { useState, useEffect } from "react";
import { Form, Input, Modal, message, Button } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import BanTable from "../../components/admin/BanTable";

import TableCreateAndUpdateModal from "../../components/modal/admin/TableCreateAndUpdateModal";

import adminTableService from "../../services/admin/adminTableService";

import "../../assets/styles/AdminPages.css";

const pageSize = 5;

const AdminTable = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // ================= LOAD DATA =================
  const fetchTables = async () => {
    try {
      setLoading(true);

      const res = await adminTableService.getAllTable({
        page,
        size,
        tableNumber: search || undefined,
      });

      const pageData = res?.data?.data;

      setItems(pageData?.content || []);
      setTotal(pageData?.totalElements || 0);
    } catch (err) {
      console.error("Lỗi load bàn:", err);
      message.error("Không thể tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();

      await adminTableService.createTable({
        tableNumber: values.tableNumber,
        capacity: values.capacity,
      });

      message.success("Thêm bàn thành công");
      setOpenAdd(false);
      addForm.resetFields();
      fetchTables();
    } catch (err) {
      message.error("Thêm thất bại");
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      await adminTableService.updateTable(editingRecord.id, {
        tableNumber: values.tableNumber,
        capacity: values.capacity,
      });

      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);
      fetchTables();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await adminTableService.deleteTable(id);
      message.success("Xóa thành công");
      fetchTables();
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };
  // xuat pdf
  const handleExportQrPdf = () => {
    console.log("Xuất QR PDF");
    // gọi API hoặc xử lý tạo PDF ở đây
  };
  // ================= EFFECT =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTables();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, page, size]);

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý bàn ăn"
        description="Quản lý bàn ăn trong nhà hàng"
        buttonText="Thêm bàn"
        handleAdd={() => setOpenAdd(true)}
        extra={
          <Button icon={<QrcodeOutlined />} onClick={handleExportQrPdf}>
            Xuất QR PDF
          </Button>
        }
      />

      {/* STATS */}
      <StatsCards
        loading={loading}
        items={[{ title: "Tổng bàn", value: total }]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm theo mã bàn..."
            allowClear
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <BanTable
          data={items}
          loading={loading}
          onEdit={(record) => {
            setEditingRecord(record);

            editForm.setFieldsValue({
              tableNumber: record.tableNumber,
              capacity: record.capacity,
            });

            setOpenEdit(true);
          }}
          onDelete={(id) => handleDelete(id)}
        />
      </div>

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />

      {/* MODALS */}
      <TableCreateAndUpdateModal
        open={openAdd}
        title="Thêm bàn"
        onCancel={() => {
          setOpenAdd(false);
          addForm.resetFields();
        }}
        onSubmit={handleAdd}
        form={addForm}
      />

      {/* EDIT */}
      <TableCreateAndUpdateModal
        open={openEdit}
        title="Sửa bàn"
        onCancel={() => {
          setOpenEdit(false);
          setEditingRecord(null);
        }}
        onSubmit={handleEdit}
        form={editForm}
      />
    </>
  );
};

export default AdminTable;
