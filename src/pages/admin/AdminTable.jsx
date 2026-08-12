import React, { useState, useEffect } from "react";
import { Form, Input, message, Button } from "antd";
import { QrcodeOutlined } from "@ant-design/icons";

import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import BanTable from "../../components/admin/BanTable";

import TableCreateAndUpdateModal from "../../components/modal/admin/TableCreateAndUpdateModal";
import TableQrViewModal from "../../components/modal/admin/TableQrViewModal";

import adminTableService from "../../services/admin/adminTableService";
import tableService from "../../services/user/tableService";

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

  // Bàn đang được xem QR
  const [viewingTable, setViewingTable] = useState(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // =========================================================
  // LOAD DATA
  // =========================================================
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

  // =========================================================
  // ADD
  // =========================================================
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
      console.error("Lỗi thêm bàn:", err);

      message.error(err?.response?.data?.message || "Thêm thất bại");
    }
  };

  // =========================================================
  // EDIT
  // =========================================================
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
      console.error("Lỗi cập nhật bàn:", err);

      message.error(err?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  // =========================================================
  // DELETE
  // =========================================================
  const handleDelete = async (id) => {
    try {
      await adminTableService.deleteTable(id);

      message.success("Xóa thành công");

      fetchTables();
    } catch (err) {
      console.error("Lỗi xóa bàn:", err);

      message.error(err?.response?.data?.message || "Xóa thất bại");
    }
  };

  // =========================================================
  // VIEW QR
  // =========================================================
  const handleView = async (record) => {
    try {
      const res = await tableService.getQrTable();

      const qrTables = res?.data?.data || [];

      const qrTable = qrTables.find(
        (item) => item.tableNumber === record.tableNumber,
      );

      if (!qrTable) {
        message.warning(`Không tìm thấy QR của bàn ${record.tableNumber}`);
        return;
      }

      if (!qrTable.qrCode) {
        message.warning(`Bàn ${record.tableNumber} chưa có mã QR`);
        return;
      }

      setViewingTable(qrTable);
    } catch (error) {
      console.error("Lỗi lấy QR:", error);

      message.error("Không thể tải QR bàn");
    }
  };

  // =========================================================
  // PRINT ALL QR
  // =========================================================
  const openPrintWindow = (tables) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      message.error(
        "Không thể mở cửa sổ in. Vui lòng cho phép cửa sổ bật lên.",
      );
      return;
    }

    const rows = tables
      .map((table) => {
        const tableNumber = table.tableNumber;
        const qrCode = table.qrCode;

        const tableUrl = `${window.location.origin}/table-order?table=${encodeURIComponent(
          tableNumber,
        )}`;

        return `
          <div class="print-qr-card">
            <div class="print-qr-title">
              Bàn ${tableNumber}
            </div>

            ${
              qrCode
                ? `
                  <img
                    src="${qrCode}"
                    alt="QR ${tableNumber}"
                  />
                `
                : `
                  <div class="no-qr">
                    Chưa có mã QR
                  </div>
                `
            }

            <div class="print-qr-link">
              ${tableUrl}
            </div>
          </div>
        `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>In mã QR bàn</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 16px;
              font-family: Arial, sans-serif;
              background: #fff;
              color: #000;
            }

            h1 {
              text-align: center;
              margin: 0 0 24px;
              font-size: 24px;
            }

            .print-grid {
              display: grid;
              grid-template-columns:
                repeat(auto-fit, minmax(220px, 1fr));

              gap: 16px;
            }

            .print-qr-card {
              padding: 16px;
              border: 1px solid #ddd;
              border-radius: 12px;
              text-align: center;

              page-break-inside: avoid;
              break-inside: avoid;
            }

            .print-qr-title {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 12px;
            }

            .print-qr-card img {
              width: 220px;
              height: 220px;
              object-fit: contain;
              display: block;
              margin: 0 auto 12px;
            }

            .print-qr-link {
              font-size: 12px;
              word-break: break-all;
              color: #333;
            }

            .no-qr {
              width: 220px;
              height: 220px;

              display: flex;
              align-items: center;
              justify-content: center;

              margin: 0 auto 12px;

              border: 1px dashed #aaa;
              color: #777;
              font-size: 14px;
            }

            @media print {
              body {
                padding: 10px;
              }

              .print-qr-card {
                page-break-inside: avoid;
                break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          <h1>IN MÃ QR BÀN</h1>

          <div class="print-grid">
            ${rows}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Đợi ảnh QR backend load xong rồi mới in
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 1000);
  };

  const handlePrintQrCodes = async () => {
    try {
      setLoading(true);

      // Lấy toàn bộ QR từ backend
      const res = await adminTableService.getQrTable();

      const allTables = res?.data?.data || [];

      if (!allTables.length) {
        message.warning("Không có bàn nào để in QR");
        return;
      }

      openPrintWindow(allTables);
    } catch (err) {
      console.error("Lỗi in QR:", err);

      message.error("Xảy ra lỗi khi tải QR bàn");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EFFECT
  // =========================================================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchTables();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, page, size]);

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <UserHeader
        title="Quản lý bàn ăn"
        description="Quản lý bàn ăn trong nhà hàng"
        buttonText="Thêm bàn"
        handleAdd={() => setOpenAdd(true)}
        extra={
          <Button icon={<QrcodeOutlined />} onClick={handlePrintQrCodes}>
            In tất cả QR bàn
          </Button>
        }
      />

      {/* =====================================================
          STATS
      ===================================================== */}
      <StatsCards
        loading={loading}
        items={[
          {
            title: "Tổng bàn",
            value: total,
          },
        ]}
      />

      {/* =====================================================
          FILTER
      ===================================================== */}
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

      {/* =====================================================
          TABLE
      ===================================================== */}
      <div className="admin-table-wrapper">
        <BanTable
          data={items}
          loading={loading}
          // VIEW QR
          onView={handleView}
          // EDIT
          onEdit={(record) => {
            setEditingRecord(record);

            editForm.setFieldsValue({
              tableNumber: record.tableNumber,
              capacity: record.capacity,
            });

            setOpenEdit(true);
          }}
          // DELETE
          onDelete={(id) => handleDelete(id)}
        />
      </div>

      {/* =====================================================
          PAGINATION
      ===================================================== */}
      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />

      {/* =====================================================
          ADD MODAL
      ===================================================== */}
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

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}
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

      {/* =====================================================
          VIEW QR MODAL
      ===================================================== */}
      <TableQrViewModal
        open={!!viewingTable}
        table={viewingTable}
        onCancel={() => setViewingTable(null)}
      />
    </>
  );
};

export default AdminTable;
