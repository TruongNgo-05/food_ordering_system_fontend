import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { toast } from "react-toastify";
import AdminPageSection from "../../components/admin/AdminPageSection";
import BaseTable from "../../components/common/BaseTable";
import AppPagination from "../../components/common/AppPagination";
import { MOCK_TABLE_BOOKINGS } from "../../data/mockTableBookings";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";
const STORAGE_KEY = "table-bookings";
const pageSize = 4;

const readBookings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeBookings = (bookings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
};

const AdminTableBookings = () => {
  const [items, setItems] = useState(() => readBookings());
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form] = Form.useForm();

  useEffect(() => {
    const existing = readBookings();
    if (existing.length > 0) return;
    writeBookings(MOCK_TABLE_BOOKINGS);
    setItems(MOCK_TABLE_BOOKINGS);
  }, []);

  useEffect(() => {
    const sync = () => setItems(readBookings());
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    window.addEventListener(CUSTOMER_DATA_UPDATED_EVENT, sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener(CUSTOMER_DATA_UPDATED_EVENT, sync);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        String(item.customerName || "").toLowerCase().includes(keyword) ||
        String(item.phone || "").toLowerCase().includes(keyword) ||
        String(item.tableNumber || "").toLowerCase().includes(keyword);
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [items, search, statusFilter]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );

  const columns = [
    { title: "Mã đặt bàn", dataIndex: "code" },
    { title: "Khách hàng", dataIndex: "customerName" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Số bàn", dataIndex: "tableNumber" },
    { title: "Số khách", dataIndex: "guestCount" },
    { title: "Giờ đến", dataIndex: "reservedAt" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <span
          className={`admin-status ${
            status === "confirmed" ? "ok" : status === "cancelled" ? "danger" : "warn"
          }`}
        >
          {status === "confirmed"
            ? "Đã xác nhận"
            : status === "cancelled"
              ? "Đã hủy"
              : "Chờ xác nhận"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            disabled={record.status === "confirmed" || record.status === "cancelled"}
            onClick={() => {
              const next = items.map((it) =>
                it.id === record.id ? { ...it, status: "confirmed" } : it,
              );
              setItems(next);
              writeBookings(next);
              toast.success("Đã xác nhận đặt bàn");
            }}
          >
            Xác nhận
          </Button>
          <Button
            size="small"
            danger
            disabled={record.status === "cancelled"}
            onClick={() => {
              const next = items.map((it) =>
                it.id === record.id ? { ...it, status: "cancelled" } : it,
              );
              setItems(next);
              writeBookings(next);
              toast.success("Đã hủy đặt bàn");
            }}
          >
            Hủy
          </Button>
        </div>
      ),
    },
  ];

  const onAdd = async () => {
    const values = await form.validateFields();
    const newBooking = {
      id: Date.now(),
      code: `BOOK-${String(Date.now()).slice(-6)}`,
      customerName: values.customerName,
      phone: values.phone,
      tableNumber: values.tableNumber,
      guestCount: values.guestCount,
      reservedAt: values.reservedAt,
      note: values.note || "",
      status: values.status || "pending",
    };
    const next = [newBooking, ...items];
    setItems(next);
    writeBookings(next);
    setOpenAdd(false);
    form.resetFields();
    toast.success("Đã tạo đơn đặt bàn");
  };

  return (
    <>
      <AdminPageSection
        title="Quản lý đặt bàn"
        subtitle="Admin tạo và xác nhận đơn đặt bàn tại nhà hàng."
        stats={[
          { label: "Tổng đặt bàn", value: String(items.length) },
          {
            label: "Chờ xác nhận",
            value: String(items.filter((i) => i.status === "pending").length),
          },
          {
            label: "Đã xác nhận",
            value: String(items.filter((i) => i.status === "confirmed").length),
          },
          {
            label: "Đã hủy",
            value: String(items.filter((i) => i.status === "cancelled").length),
          },
        ]}
        actionLabel="+ Tạo đơn đặt bàn"
        onAddClick={() => {
          form.resetFields();
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm khách, số bàn hoặc SĐT..."
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
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="cancelled">Đã hủy</option>
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
        title="Tạo đơn đặt bàn"
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={onAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="customerName"
            label="Tên khách"
            rules={[{ required: true, message: "Nhập tên khách" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: "Nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="tableNumber"
            label="Số bàn"
            rules={[{ required: true, message: "Nhập số bàn" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="guestCount"
            label="Số lượng khách"
            rules={[{ required: true, message: "Nhập số lượng khách" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="reservedAt"
            label="Giờ đến"
            rules={[{ required: true, message: "Nhập giờ đến" }]}
          >
            <Input placeholder="Ví dụ: 19:00 10/04/2026" />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái ban đầu" initialValue="pending">
            <Select
              options={[
                { value: "pending", label: "Chờ xác nhận" },
                { value: "confirmed", label: "Đã xác nhận" },
                { value: "cancelled", label: "Đã hủy" },
              ]}
            />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminTableBookings;
