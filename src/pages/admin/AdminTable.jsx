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
  const buildQrImageUrl = (tableNumber) => {
    const tableUrl = `${window.location.origin}/table-order?table=${encodeURIComponent(
      tableNumber,
    )}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
      tableUrl,
    )}`;
  };

  const openPrintWindow = (tables) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      message.error(
        "Không thể mở cửa sổ in. Vui lòng cho phép cửa sổ bật lên.",
      );
      return;
    }

    const rows = tables
      .map(
        (table) => `
          <div class="print-qr-card">
            <div class="print-qr-title">Bàn ${table.tableNumber}</div>
            <img src="${buildQrImageUrl(table.tableNumber)}" alt="QR ${table.tableNumber}" />
            <div class="print-qr-link">${window.location.origin}/table-order?table=${table.tableNumber}</div>
          </div>
        `,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>In mã QR bàn</title>
          <style>
            body { margin: 0; padding: 16px; font-family: Arial, sans-serif; background: #fff; }
            .print-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
            .print-qr-card { padding: 16px; border: 1px solid #ddd; border-radius: 12px; text-align: center; }
            .print-qr-title { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
            .print-qr-card img { width: 220px; height: 220px; object-fit: contain; margin-bottom: 12px; }
            .print-qr-link { font-size: 12px; word-break: break-all; color: #333; }
            @media print { .print-qr-card { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          <h1>In mã QR bàn</h1>
          <div class="print-grid">${rows}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const handlePrintQrCodes = async () => {
    try {
      setLoading(true);
      const res = await adminTableService.getAllTable({
        page: 0,
        size: 9999,
        tableNumber: search || undefined,
      });
      const allTables = res?.data?.data?.content || [];

      if (!allTables.length) {
        message.warning("Không có bàn nào để in QR");
        return;
      }

      openPrintWindow(allTables);
    } catch (err) {
      console.error("Lỗi in QR:", err);
      message.error("Xảy ra lỗi khi in QR");
    } finally {
      setLoading(false);
    }
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
          <Button icon={<QrcodeOutlined />} onClick={handlePrintQrCodes}>
            In QR bàn
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
