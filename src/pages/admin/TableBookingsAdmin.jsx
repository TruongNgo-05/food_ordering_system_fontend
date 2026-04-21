import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, InputNumber, Modal, Select, Button } from "antd";

import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import BaseTable from "../../components/common/BaseTable";
import AppPagination from "../../components/common/AppPagination";

import { MOCK_TABLE_BOOKINGS } from "../../data/mockTableBookings";

import "../../assets/styles/AdminPages.css";

const STORAGE_KEY = "table-bookings";
const pageSize = 5;

const readBookings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeBookings = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const AdminTableBookings = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [openAdd, setOpenAdd] = useState(false);

  const [form] = Form.useForm();

  // ================= LOAD =================
  useEffect(() => {
    const data = readBookings();

    if (data.length === 0) {
      writeBookings(MOCK_TABLE_BOOKINGS);
      setItems(MOCK_TABLE_BOOKINGS);
    } else {
      setItems(data);
    }
  }, []);

  // ================= FILTER =================
  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();

    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        item.customerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword) ||
        String(item.tableNumber).includes(keyword);

      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchKeyword && matchStatus;
    });
  }, [items, search, statusFilter]);

  // ================= PAGINATION =================
  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();

      const newItem = {
        id: Date.now(),
        code: `BOOK-${String(Date.now()).slice(-6)}`,
        ...values,
        status: values.status || "pending",
      };

      const next = [newItem, ...items];

      setItems(next);
      writeBookings(next);

      setOpenAdd(false);
      form.resetFields();
    } catch {}
  };

  // ================= ACTION =================
  const updateStatus = (id, status) => {
    const next = items.map((it) => (it.id === id ? { ...it, status } : it));

    setItems(next);
    writeBookings(next);
  };

  // ================= TABLE =================
  const columns = [
    { title: "Mã", dataIndex: "code" },
    { title: "Khách", dataIndex: "customerName" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Bàn", dataIndex: "tableNumber" },
    { title: "Khách", dataIndex: "guestCount" },
    { title: "Giờ", dataIndex: "reservedAt" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => (
        <span
          className={`admin-status ${
            s === "confirmed" ? "ok" : s === "cancelled" ? "danger" : "warn"
          }`}
        >
          {s === "confirmed"
            ? "Đã xác nhận"
            : s === "cancelled"
              ? "Đã hủy"
              : "Chờ"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (_, r) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            size="small"
            disabled={r.status !== "pending"}
            onClick={() => updateStatus(r.id, "confirmed")}
          >
            Xác nhận
          </Button>

          <Button
            size="small"
            danger
            disabled={r.status === "cancelled"}
            onClick={() => updateStatus(r.id, "cancelled")}
          >
            Hủy
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý đặt bàn"
        description="Quản lý và xác nhận đặt bàn"
        buttonText="Tạo đơn"
        handleAdd={() => {
          form.resetFields();
          setOpenAdd(true);
        }}
      />

      {/* STATS */}
      <StatsCards
        items={[
          { title: "Tổng", value: items.length },
          {
            title: "Chờ",
            value: items.filter((i) => i.status === "pending").length,
          },
          {
            title: "Đã xác nhận",
            value: items.filter((i) => i.status === "confirmed").length,
          },
          {
            title: "Đã hủy",
            value: items.filter((i) => i.status === "cancelled").length,
          },
        ]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm khách, SĐT, bàn..."
            allowClear
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>

        <select
          className="admin-control"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
        >
          <option value="all">Tất cả</option>
          <option value="pending">Chờ</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <BaseTable columns={columns} data={pageData} />
      </div>

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={pageSize}
        total={filteredItems.length}
        onChange={(p) => setPage(p)}
      />

      {/* MODAL ADD */}
      <Modal
        title="Tạo đơn đặt bàn"
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={handleAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="customerName"
            label="Tên khách"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="SĐT" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="tableNumber"
            label="Bàn"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="guestCount"
            label="Số khách"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="reservedAt" label="Giờ" rules={[{ required: true }]}>
            <Input placeholder="19:00 20/04" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" initialValue="pending">
            <Select
              options={[
                { value: "pending", label: "Chờ" },
                { value: "confirmed", label: "Đã xác nhận" },
                { value: "cancelled", label: "Đã hủy" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminTableBookings;
