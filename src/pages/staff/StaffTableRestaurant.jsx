import React, { useEffect, useState } from "react";
import { message } from "antd";
import "../../assets/styles/staff/TableRestaurant.css";
import UserHeader from "../../components/user/UserHeader";
import tablesStaffService from "../../services/staff/tablesStaffService";

const STATUS_LABEL = {
  AVAILABLE: "Còn Trống",
  OCCUPIED: "Đang Có Khách",
  RESERVED: "Đã Đặt Trước",
};

const STATUS_CLASS = {
  AVAILABLE: "tpm__status--available",
  OCCUPIED: "tpm__status--occupied",
  RESERVED: "tpm__status--reserved",
};

const StaffTableRestaurantPage = ({ onOpenOrder, onCheckIn, onCheckout }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const loadTables = async () => {
    try {
      setLoading(true);

      const res = await tablesStaffService.getAllTableStaff();

      const list = res.data.data;

      setTables(
        list.map((t) => ({
          tableId: t.id,
          tableNumber: t.tableNumber,
          capacity: t.capacity,
          status: t.status,
          statusText: t.statusText,
          hasOrder: t.hasOrder,
          orderId: t.orderId,
          totalPrice: t.totalPrice,
        })),
      );
    } catch (e) {
      message.error("Không tải được danh sách bàn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);
  const handleReceive = async (table) => {
    try {
      await tablesStaffService.receiveCustomer(table.tableId);

      message.success("Đã nhận khách");

      loadTables();
    } catch (e) {
      message.error(e.response?.data?.message || "Lỗi");
    }
  };
  const handleCheckout = async (table) => {
    try {
      await tablesStaffService.checkoutTable(table.tableId);

      message.success("Thanh toán thành công");

      loadTables();
    } catch (e) {
      message.error(e.response?.data?.message || "Lỗi");
    }
  };

  // ===== STAFF ACTION LOGIC =====
  const handleTableClick = (table) => {
    if (table.status === "AVAILABLE") {
      handleReceive(table);
      return;
    }

    if (table.status === "RESERVED") {
      onCheckIn?.(table);
      return;
    }

    if (table.status === "OCCUPIED") {
      if (table.hasOrder) {
        handleCheckout(table);
      } else {
        onOpenOrder?.(table);
      }
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
                    {table.statusText || STATUS_LABEL[table.status]}
                  </div>

                  {/* ACTION BUTTONS THEO ROLE STAFF */}
                  {table.status === "OCCUPIED" && table.hasOrder && (
                    <>
                      <div className="tpm__table-total">
                        Tổng tiền
                        <br />
                        {table.totalPrice?.toLocaleString("vi-VN")} đ
                      </div>

                      <button
                        className="tpm__action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckout(table);
                        }}
                      >
                        Thanh toán
                      </button>
                    </>
                  )}
                  {table.status === "OCCUPIED" && !table.hasOrder && (
                    <button
                      className="tpm__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOrder?.(table);
                      }}
                    >
                      Gọi món
                    </button>
                  )}

                  {table.status === "AVAILABLE" && (
                    <button
                      className="tpm__action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReceive(table);
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
