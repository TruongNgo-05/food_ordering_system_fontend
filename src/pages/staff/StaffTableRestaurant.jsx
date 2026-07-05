import React, { useEffect, useState } from "react";
import "../../assets/styles/staff/TableRestaurant.css";
import UserHeader from "../../components/user/UserHeader";
import tableService from "../../services/user/tableService";

const STATUS_LABEL = {
  AVAILABLE: "Còn Trống",
  OCCUPIED: "Đang Có Khách",
  RESERVED: "Đã Đặt Trước",
  UNAVAILABLE: "Ngừng Phục Vụ",
};

const STATUS_CLASS = {
  AVAILABLE: "tpm__status--available",
  OCCUPIED: "tpm__status--occupied",
  RESERVED: "tpm__status--reserved",
  UNAVAILABLE: "tpm__status--unavailable",
};

const MOCK_TABLES = [
  { tableId: 1, tableNumber: 1, capacity: 2, status: "AVAILABLE" },
  { tableId: 2, tableNumber: 2, capacity: 4, status: "OCCUPIED" },
  { tableId: 3, tableNumber: 3, capacity: 4, status: "RESERVED" },
  { tableId: 4, tableNumber: 4, capacity: 2, status: "AVAILABLE" },
  { tableId: 5, tableNumber: 5, capacity: 6, status: "OCCUPIED" },
  { tableId: 6, tableNumber: 6, capacity: 4, status: "RESERVED" },
  { tableId: 7, tableNumber: 7, capacity: 2, status: "AVAILABLE" },
  { tableId: 8, tableNumber: 8, capacity: 8, status: "OCCUPIED" },
  { tableId: 9, tableNumber: 9, capacity: 4, status: "AVAILABLE" },
  { tableId: 10, tableNumber: 10, capacity: 2, status: "RESERVED" },
];

const StaffTableRestaurantPage = ({ onOpenOrder, onCheckIn, onCheckout }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  // ===== LOAD TABLES =====
  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoading(true);

        const res = await tableService.getTables();
        const list = res?.data?.data ?? [];

        setTables(
          (list.length > 0 ? list : MOCK_TABLES).map((t) => ({
            tableId: t.id ?? t.tableId,
            tableNumber: t.tableNumber,
            capacity: t.capacity,
            status: t.status,
          })),
        );
      } catch (err) {
        console.error(err);
        // fallback sang mock nếu API lỗi, để không chặn UI khi BE chưa sẵn sàng
        setTables(
          MOCK_TABLES.map((t) => ({
            tableId: t.tableId,
            tableNumber: t.tableNumber,
            capacity: t.capacity,
            status: t.status,
          })),
        );
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  // ===== STAFF ACTION LOGIC =====
  const handleTableClick = (table) => {
    switch (table.status) {
      case "AVAILABLE":
        onCheckIn?.(table); // gán khách / tạo order mới
        break;

      case "OCCUPIED":
        onOpenOrder?.(table); // xem / sửa order / thêm món
        break;

      case "RESERVED":
        onCheckIn?.(table); // confirm khách đến (check-in)
        break;

      default:
        break;
    }
  };

  const filtered =
    filter === "ALL" ? tables : tables.filter((t) => t.status === filter);

  const counts = {
    ALL: tables.length,
    AVAILABLE: tables.filter((t) => t.status === "AVAILABLE").length,
    OCCUPIED: tables.filter((t) => t.status === "OCCUPIED").length,
    RESERVED: tables.filter((t) => t.status === "RESERVED").length,
  };

  return (
    <div className="tpm__page">
      {/* HEADER */}
      <UserHeader
        title="Quản lý bàn ăn "
        description="Theo dõi các bàn ăn tại nhà hàng"
      />

      {/* FILTER */}
      <div className="tpm__filters">
        {[
          { key: "ALL", label: "Tất Cả" },
          { key: "AVAILABLE", label: "Còn Trống" },
          { key: "OCCUPIED", label: "Đang Có Khách" },
          { key: "RESERVED", label: "Đã Đặt" },
        ].map((f) => (
          <button
            key={f.key}
            className={`tpm__filter-btn ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            <span className="tpm__filter-count">{counts[f.key] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="tpm__grid-wrap">
        {loading ? (
          <div className="tpm__loading">
            <div className="tpm__spinner"></div>
            <span>Đang tải...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="tpm__empty">Không có bàn nào phù hợp</div>
        ) : (
          <div className="tpm__grid">
            {filtered.map((table) => (
              <div
                key={table.tableId}
                className={["tpm__table-card", STATUS_CLASS[table.status]].join(
                  " ",
                )}
                onClick={() => handleTableClick(table)}
              >
                <div className="tpm__card-body">
                  <div className="tpm__table-number">
                    Bàn {table.tableNumber}
                  </div>

                  {table.capacity ? (
                    <div className="tpm__table-capacity">
                      {table.capacity} người
                    </div>
                  ) : null}

                  <div className={`tpm__badge ${STATUS_CLASS[table.status]}`}>
                    {STATUS_LABEL[table.status] ?? table.status}
                  </div>

                  {/* ACTION BUTTONS THEO ROLE STAFF */}
                  {table.status === "OCCUPIED" && (
                    <button
                      className="tpm__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheckout?.(table);
                      }}
                    >
                      Thanh toán
                    </button>
                  )}

                  {table.status === "AVAILABLE" && (
                    <button
                      className="tpm__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheckIn?.(table);
                      }}
                    >
                      Nhận khách
                    </button>
                  )}

                  {table.status === "RESERVED" && (
                    <button
                      className="tpm__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCheckIn?.(table);
                      }}
                    >
                      Check-in
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffTableRestaurantPage;
