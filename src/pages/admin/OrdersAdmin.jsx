import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Input, message } from "antd";

import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import BaseTable from "../../components/common/BaseTable";
import AppPagination from "../../components/common/AppPagination";
import TableActions from "../../components/common/TableActions";

import { mockOrders } from "../../data/mockData";

const pageSize = 5;

const AdminOrders = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [openCancel, setOpenCancel] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // ================= LOAD =================
  useEffect(() => {
    setItems(mockOrders);
  }, []);

  // ================= FILTER =================
  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter(
      (it) =>
        String(it.id).toLowerCase().includes(keyword) ||
        String(it.customer || "")
          .toLowerCase()
          .includes(keyword),
    );
  }, [items, search]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );

  // ================= FORMAT =================
  const formatMoney = (v) => `${Number(v || 0).toLocaleString("vi-VN")}đ`;

  // ================= STATUS =================
  const updateOrderStatus = (id, status) => {
    const newList = items.map((it) => (it.id === id ? { ...it, status } : it));
    setItems(newList);
    message.success("Cập nhật trạng thái thành công");
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      render: (v) => v || "Khách lẻ",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      render: (v) => formatMoney(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <span className="admin-status">{status}</span>
          <Button
            size="small"
            onClick={() => updateOrderStatus(record.id, "completed")}
          >
            Hoàn tất
          </Button>
        </div>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          onDelete={() => {
            setEditingRecord(record);
            setOpenCancel(true);
          }}
        />
      ),
    },
  ];

  // ================= DELETE =================
  const handleCancel = () => {
    updateOrderStatus(editingRecord.id, "canceled");
    setOpenCancel(false);
    setEditingRecord(null);
  };

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý đơn hàng"
        description="Theo dõi và xử lý đơn hàng"
        buttonText="Xuất báo cáo"
        handleAdd={() => message.info("Chưa làm export")}
      />

      {/* STATS */}
      <StatsCards
        items={[
          { title: "Tổng đơn", value: items.length },
          {
            title: "Đang xử lý",
            value: items.filter((i) => i.status === "pending").length,
          },
          {
            title: "Hoàn thành",
            value: items.filter((i) => i.status === "completed").length,
          },
          {
            title: "Đã hủy",
            value: items.filter((i) => i.status === "canceled").length,
          },
        ]}
      />

      {/* SEARCH */}
      <div className="filter-bar">
        <Input
          placeholder="Tìm đơn..."
          allowClear
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
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

      {/* CANCEL MODAL */}
      <Modal
        title="Xác nhận hủy đơn"
        open={openCancel}
        onCancel={() => setOpenCancel(false)}
        onOk={handleCancel}
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn hủy đơn này?</p>
      </Modal>
    </>
  );
};

export default AdminOrders;
