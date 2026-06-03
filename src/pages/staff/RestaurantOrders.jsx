import React, { useMemo, useState } from "react";
import { Button, Modal, Input, Select, message } from "antd";
import UserHeader from "../../components/user/UserHeader";
import BaseTable from "../../components/common/BaseTable";
import AppPagination from "../../components/common/AppPagination";
import TableActions from "../../components/common/TableActions";
import { mockStaffRestaurantOrders } from "../../data/mockStaffData";
import { T, fmt } from "../../constants/customerTheme";

const pageSize = 5;

const RestaurantOrders = () => {
  const [items, setItems] = useState(mockStaffRestaurantOrders);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const statusOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ xử lý", value: "pending" },
    { label: "Đang chuẩn bị", value: "preparing" },
    { label: "Hoàn thành", value: "completed" },
    { label: "Hủy", value: "cancelled" },
  ];

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((it) => {
      const matchSearch =
        String(it.id).toLowerCase().includes(keyword) ||
        String(it.customer || "")
          .toLowerCase()
          .includes(keyword) ||
        String(it.table || "")
          .toLowerCase()
          .includes(keyword);
      const matchStatus = statusFilter === "all" || it.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [items, search, statusFilter]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );

  const totalPages = Math.ceil(filteredItems.length / pageSize);

  const updateOrderStatus = (id, newStatus) => {
    const newList = items.map((it) =>
      it.id === id ? { ...it, status: newStatus } : it,
    );
    setItems(newList);
    message.success("Cập nhật trạng thái thành công");
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "#faad14",
      preparing: "#1890ff",
      completed: "#52c41a",
      cancelled: "#f5222d",
    };
    return colorMap[status] || "#999";
  };

  const getStatusText = (status) => {
    const textMap = {
      pending: "Chờ xử lý",
      preparing: "Đang chuẩn bị",
      completed: "Hoàn thành",
      cancelled: "Hủy",
    };
    return textMap[status] || status;
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      width: 100,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 120,
    },
    {
      title: "Bàn",
      dataIndex: "table",
      width: 80,
      render: (table) => (
        <span
          style={{
            backgroundColor: T.primary,
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          {table}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 120,
      render: (status) => (
        <span style={{ color: getStatusColor(status), fontWeight: "bold" }}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      width: 120,
      render: (value) => fmt(value),
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, record) => (
        <TableActions
          onView={() => {
            setEditingRecord(record);
            setModalOpen(true);
          }}
          onEdit={() => {
            setEditingRecord(record);
            setModalOpen(true);
          }}
        />
      ),
    },
  ];

  const handleStatusChange = (newStatus) => {
    if (editingRecord) {
      updateOrderStatus(editingRecord.id, newStatus);
      const updated = items.find((it) => it.id === editingRecord.id);
      if (updated) {
        setEditingRecord({ ...updated, status: newStatus });
      }
    }
  };

  return (
    <>
      <UserHeader
        title="Quản lý đơn hàng tại nhà hàng"
        description="Theo dõi và xử lý các đơn tại bàn"
      />

      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            placeholder="Tìm mã đơn, khách hàng, bàn..."
            allowClear
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-divider" />
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => setStatusFilter(v || "all")}
        >
          {statusOptions.map((opt) => (
            <Select.Option key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div className="admin-table-wrapper">
        <BaseTable columns={columns} data={pageData} />
      </div>

      {totalPages > 1 && (
        <AppPagination
          page={page}
          size={pageSize}
          total={filteredItems.length}
          onChange={(p, s) => setPage(p)}
        />
      )}

      {/* DETAIL MODAL */}
      <Modal
        title="Chi tiết đơn hàng tại nhà hàng"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingRecord(null);
        }}
        footer={null}
        width={600}
      >
        {editingRecord && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div>
                <strong>Mã đơn:</strong>
                <p>{editingRecord.id}</p>
              </div>
              <div>
                <strong>Khách hàng:</strong>
                <p>{editingRecord.customer}</p>
              </div>
              <div>
                <strong>Số điện thoại:</strong>
                <p>{editingRecord.phone}</p>
              </div>
              <div>
                <strong>Thời gian:</strong>
                <p>{editingRecord.created_at}</p>
              </div>
              <div>
                <strong>Bàn:</strong>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: T.primary,
                  }}
                >
                  {editingRecord.table}
                </p>
              </div>
              <div>
                <strong>Phương thức thanh toán:</strong>
                <p>{editingRecord.payment_method}</p>
              </div>
              <div>
                <strong>Tổng tiền:</strong>
                <p style={{ color: T.primary, fontWeight: "bold" }}>
                  {fmt(editingRecord.total)}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <strong>Các món:</strong>
              <ul style={{ paddingLeft: "20px" }}>
                {editingRecord.items?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {editingRecord.notes && (
              <div style={{ marginBottom: "20px" }}>
                <strong>Ghi chú:</strong>
                <p style={{ fontStyle: "italic", color: "#666" }}>
                  {editingRecord.notes}
                </p>
              </div>
            )}

            <div style={{ marginBottom: "20px" }}>
              <strong>Trạng thái:</strong>
              <Select
                style={{ width: "100%", marginTop: "8px" }}
                value={editingRecord.status}
                onChange={handleStatusChange}
              >
                {statusOptions.map((opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <div style={{ textAlign: "right", gap: "8px", display: "flex" }}>
              <Button onClick={() => setModalOpen(false)}>Đóng</Button>
              <Button
                type="primary"
                onClick={() => {
                  message.success("Cập nhật thành công");
                  setModalOpen(false);
                }}
              >
                Lưu
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RestaurantOrders;
