import React, { useMemo, useState } from "react";
import { Button, Modal, Input, Select, message } from "antd";
import UserHeader from "../../components/user/UserHeader";
import BaseTable from "../../components/common/BaseTable";
import AppPagination from "../../components/common/AppPagination";
import TableActions from "../../components/common/TableActions";
import { T, fmt } from "../../constants/customerTheme";


const pageSize = 5;

const StaffOrders = () => {
  const [items, setItems] = useState(mockStaffOrders);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const statusOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Chờ xử lý", value: "pending" },
    { label: "Đang chuẩn bị", value: "preparing" },
    { label: "Đang giao", value: "delivering" },
    { label: "Hoàn thành", value: "completed" },
  ];

  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((it) => {
      const matchSearch =
        String(it.id).toLowerCase().includes(keyword) ||
        String(it.customer || "")
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
    setModalOpen(false);
    setEditingRecord(null);
    message.success("Cập nhật trạng thái thành công");
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleView = (id) => {
    const record = items.find((it) => it.id === id);
    if (record) {
      Modal.info({
        title: `Chi tiết đơn hàng: ${record.id}`,
        width: 500,
        content: (
          <div style={{ lineHeight: 1.8 }}>
            <p>
              <strong>Khách hàng:</strong> {record.customer}
            </p>
            <p>
              <strong>Thời gian đặt:</strong> {record.created_at}
            </p>
            <p>
              <strong>Bàn:</strong> {record.table}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong> {record.payment_method}
            </p>
            <p>
              <strong>Các món:</strong>
            </p>
            <ul>
              {record.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p>
              <strong>Tổng tiền:</strong>{" "}
              <span style={{ color: T.primary, fontWeight: 600 }}>
                {fmt(record.total)}
              </span>
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <span style={{ color: T.primary, fontWeight: 600 }}>
                {record.status}
              </span>
            </p>
          </div>
        ),
      });
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      render: (v) => v || "Khách lẻ",
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      width: 140,
    },
    {
      title: "Bàn",
      dataIndex: "table",
      align: "center",
      width: 80,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      render: (v) => fmt(v),
      align: "right",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const statusMap = {
          pending: "Chờ xử lý",
          preparing: "Đang chuẩn bị",
          delivering: "Đang giao",
          completed: "Hoàn thành",
        };
        const colors = {
          pending: T.amber,
          preparing: T.blue,
          delivering: T.primary,
          completed: T.green,
        };
        return (
          <span
            style={{
              background: colors[status] + "20",
              color: colors[status],
              padding: "4px 12px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {statusMap[status] || status}
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
        />
      ),
      width: 100,
    },
  ];

  return (
    <section className="admin-page">
      <UserHeader
        title="Quản lý đơn hàng"
        description="Theo dõi trạng thái đơn hàng, chuẩn bị và giao hàng"
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
            placeholder="Tìm kiếm mã đơn hoặc tên khách..."
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
              <strong>Trạng thái hiện tại:</strong> {editingRecord.status}
            </div>
            <div>
              <strong>Chọn trạng thái mới:</strong>
            </div>
            <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
              {["preparing", "delivering", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => updateOrderStatus(editingRecord.id, status)}
                  style={{
                    padding: "8px 16px",
                    border: `1px solid ${T.border}`,
                    borderRadius: 6,
                    background: T.primary,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  {status === "preparing"
                    ? "Chuẩn bị"
                    : status === "delivering"
                      ? "Giao hàng"
                      : "Hoàn thành"}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default StaffOrders;
