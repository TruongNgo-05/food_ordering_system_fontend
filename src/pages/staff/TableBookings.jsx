import React, { useMemo, useState } from "react";
import { Button, Modal, Input, Select, message } from "antd";
import UserHeader from "../../components/user/UserHeader";
import BaseTable from "../../components/common/BaseTable";
import AppPagination from "../../components/common/AppPagination";
import TableActions from "../../components/common/TableActions";
import { mockStaffTableBookings } from "../../data/mockStaffData";
import { T, fmt } from "../../constants/customerTheme";

const pageSize = 5;

const StaffTableBookings = () => {
  const [bookings, setBookings] = useState(
    mockStaffTableBookings.map((b) => ({
      ...b,
      key: b.id,
    })),
  );
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const statusOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ xác nhận", value: "pending" },
    { label: "Đã xác nhận", value: "confirmed" },
  ];

  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase();
    return bookings.filter((b) => {
      const matchSearch =
        String(b.id).toLowerCase().includes(keyword) ||
        String(b.name || "")
          .toLowerCase()
          .includes(keyword) ||
        String(b.phone || "").includes(keyword);
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, search, statusFilter]);

  const pageData = useMemo(
    () => filteredBookings.slice(page * pageSize, page * pageSize + pageSize),
    [filteredBookings, page],
  );

  const totalPages = Math.ceil(filteredBookings.length / pageSize);

  const updateBookingStatus = (id, newStatus) => {
    const newList = bookings.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b,
    );
    setBookings(newList);
    setModalOpen(false);
    setEditingRecord(null);
    message.success("Cập nhật trạng thái thành công");
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleView = (id) => {
    const record = bookings.find((b) => b.id === id);
    if (record) {
      Modal.info({
        title: `Chi tiết đặt bàn: ${record.id}`,
        width: 500,
        content: (
          <div style={{ lineHeight: 1.8 }}>
            <p>
              <strong>Tên khách:</strong> {record.name}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {record.phone}
            </p>
            <p>
              <strong>Ngày đặt:</strong> {record.date}
            </p>
            <p>
              <strong>Giờ đặt:</strong> {record.time}
            </p>
            <p>
              <strong>Số người:</strong> {record.guests} người
            </p>
            <p>
              <strong>Bàn:</strong> {record.table}
            </p>
            {record.note && (
              <p>
                <strong>Ghi chú:</strong> {record.note}
              </p>
            )}
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span style={{ color: T.primary, fontWeight: 600 }}>
                {record.status === "confirmed" ? "Đã xác nhận" : "Chờ xác nhận"}
              </span>
            </p>
          </div>
        ),
      });
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn chắc chắn muốn hủy đặt bàn này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: () => {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        message.success("Hủy đặt bàn thành công");
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "Tên khách",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      width: 100,
    },
    {
      title: "Ngày / Giờ",
      render: (_, record) => `${record.date} ${record.time}`,
      width: 140,
    },
    {
      title: "Số người",
      dataIndex: "guests",
      align: "center",
      width: 80,
    },
    {
      title: "Bàn",
      dataIndex: "table",
      align: "center",
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const isConfirmed = status === "confirmed";
        return (
          <span
            style={{
              background: isConfirmed ? T.primaryLight : T.amberBg,
              color: isConfirmed ? T.primary : T.amber,
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {isConfirmed ? "Đã xác nhận" : "Chờ xác nhận"}
          </span>
        );
      },
      width: 120,
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <TableActions
          record={record}
          onView={(r) => handleView(r.id)}
          onEdit={handleEdit}
          onDelete={(r) => handleDelete(r.id)}
        />
      ),
      width: 100,
    },
  ];

  return (
    <section className="admin-page">
      <UserHeader
        title="Quản lý đặt bàn"
        description="Theo dõi các yêu cầu đặt bàn và xác nhận"
      />

      <div className="admin-container">
        <div
          className="admin-filters"
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <Input
            placeholder="Tìm kiếm tên hoặc SĐT..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Select
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(0);
            }}
            options={statusOptions}
            style={{ minWidth: 150 }}
          />
        </div>

        <div
          className="admin-table-box"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <BaseTable columns={columns} data={pageData} loading={false} />
        </div>

        {totalPages > 1 && (
          <AppPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <Modal
        title={`Cập nhật trạng thái: ${editingRecord?.id}`}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingRecord(null);
        }}
        footer={null}
      >
        {editingRecord && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <strong>Trạng thái hiện tại:</strong>{" "}
              {editingRecord.status === "confirmed"
                ? "Đã xác nhận"
                : "Chờ xác nhận"}
            </div>
            <div>
              <strong>Chọn trạng thái mới:</strong>
            </div>
            <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
              {["confirmed", "pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateBookingStatus(editingRecord.id, status)}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${T.border}`,
                    borderRadius: 6,
                    background: status === "confirmed" ? T.primary : T.amber,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {status === "confirmed" ? "Xác nhận" : "Chờ xác nhận"}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default StaffTableBookings;
