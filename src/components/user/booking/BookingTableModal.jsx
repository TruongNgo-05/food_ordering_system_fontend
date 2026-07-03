import React, { useEffect, useState, useCallback } from "react";
import { InputNumber } from "antd";
import "../../../assets/styles/user/BookingTable.css";
import tableService from "../../../services/user/tableService";

const BookingTableModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedTable,
  capacity,
}) => {
  const [tables, setTables] = useState([]);
  const [peopleFilter, setPeopleFilter] = useState(capacity || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPeopleFilter(capacity || null);
  }, [capacity]);

  const loadTables = useCallback(async () => {
    try {
      setLoading(true);

      const res = await tableService.getTables({
        capacity: peopleFilter || undefined,
      });

      const list = res?.data?.data || [];

      setTables(
        list.map((t) => ({
          tableId: t.tableId,
          tableNumber: t.tableNumber,
          capacity: t.capacity,
        })),
      );
    } catch (err) {
      console.error(err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, [peopleFilter]);

  // Load khi mở modal hoặc đổi số người
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      loadTables();
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen, peopleFilter, loadTables]);

  // Click nền để đóng
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ESC để đóng
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", onKey);
    }

    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="btm__overlay"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Chọn bàn"
    >
      <div className="btm__panel">
        {/* Header */}
        <div className="btm__header">
          <div className="btm__header-text">
            <span className="btm__eyebrow">Đặt Chỗ</span>
            <h2 className="btm__title">Chọn Bàn Của Bạn</h2>
          </div>

          <button className="btm__close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="btm__filter">
          <label className="btm__filter-label">Số lượng người</label>

          <InputNumber
            min={1}
            max={20}
            value={peopleFilter}
            onChange={(value) => setPeopleFilter(value)}
            placeholder="Nhập số người"
            style={{ width: "100%" }}
          />

          <button
            type="button"
            className="btm__reset-filter"
            onClick={() => setPeopleFilter(null)}
          >
            Hiện tất cả bàn
          </button>
        </div>

        {/* Grid */}
        <div className="btm__grid-wrap">
          {loading ? (
            <div className="btm__loading">
              <div className="btm__spinner"></div>
              <span>Đang tải danh sách bàn…</span>
            </div>
          ) : tables.length === 0 ? (
            <div className="btm__empty">Không tìm thấy bàn phù hợp.</div>
          ) : (
            <div className="btm__grid">
              {tables.map((table) => {
                const isSelected = selectedTable?.tableId === table.tableId;

                return (
                  <button
                    key={table.tableId}
                    className={[
                      "btm__table-card",
                      isSelected ? "btm__table-card--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => {
                      onSelect(table);
                      onClose();
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Bàn ${table.tableNumber}`}
                  >
                    <div className="btm__card-accent"></div>

                    <div className="btm__card-body">
                      <div className="btm__icon-wrap">
                        <svg
                          viewBox="0 0 36 24"
                          fill="none"
                          className="btm__icon"
                        >
                          <rect
                            x="2"
                            y="8"
                            width="32"
                            height="8"
                            rx="1"
                            fill="currentColor"
                            opacity="0.9"
                          />
                          <rect
                            x="6"
                            y="16"
                            width="4"
                            height="7"
                            rx="1"
                            fill="currentColor"
                            opacity="0.55"
                          />
                          <rect
                            x="26"
                            y="16"
                            width="4"
                            height="7"
                            rx="1"
                            fill="currentColor"
                            opacity="0.55"
                          />
                          <rect
                            x="14"
                            y="1"
                            width="8"
                            height="7"
                            rx="1"
                            fill="currentColor"
                            opacity="0.3"
                          />
                        </svg>
                      </div>

                      <span className="btm__table-number">
                        {table.tableNumber}
                      </span>

                      <span className="btm__table-capacity">
                        👥 {table.capacity} người
                      </span>
                    </div>

                    {isSelected && <span className="btm__check">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="btm__footer">
          <span className="btm__footer-note">
            {selectedTable
              ? `Đang chọn: ${selectedTable.tableNumber}`
              : "Chạm vào bàn để chọn"}
          </span>

          <button className="btm__close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingTableModal;
