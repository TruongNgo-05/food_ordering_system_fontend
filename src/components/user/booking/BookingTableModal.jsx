import React, { useEffect, useState, useCallback, useRef } from "react";
import "../../../assets/styles/user/BookingTable.css";
import tableService from "../../../services/user/tableService";

const WHEEL_ITEM_HEIGHT = 44;
const WHEEL_VISIBLE_ITEMS = 5;
const MAX_PEOPLE = 20;

// ====== Vòng quay chọn số người ======
const PeopleWheelPicker = ({ value, onChange, onClose }) => {
  const listRef = useRef(null);
  const options = [
    null,
    ...Array.from({ length: MAX_PEOPLE }, (_, i) => i + 1),
  ]; // null = "Tất cả"
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = options.findIndex((o) => o === (value || null));
    return idx === -1 ? 0 : idx;
  });
  const scrollTimeout = useRef(null);

  // Cuộn tới vị trí ban đầu khi mở
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = activeIndex * WHEEL_ITEM_HEIGHT;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    if (!listRef.current) return;
    clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      const scrollTop = listRef.current.scrollTop;
      const idx = Math.round(scrollTop / WHEEL_ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(options.length - 1, idx));

      setActiveIndex(clamped);
      listRef.current.scrollTo({
        top: clamped * WHEEL_ITEM_HEIGHT,
        behavior: "smooth",
      });
    }, 90);
  };

  const handleItemClick = (idx) => {
    setActiveIndex(idx);
    listRef.current?.scrollTo({
      top: idx * WHEEL_ITEM_HEIGHT,
      behavior: "smooth",
    });
  };

  const handleConfirm = () => {
    onChange(options[activeIndex]);
    onClose();
  };

  return (
    <div className="bktm-wheel-backdrop" onClick={onClose}>
      <div className="bktm-wheel-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="bktm-wheel-handle" />

        <h3 className="bktm-wheel-title">Chọn Số Người</h3>

        <div
          className="bktm-wheel-viewport"
          style={{ height: WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_ITEMS }}
        >
          <div
            className="bktm-wheel-highlight"
            style={{ height: WHEEL_ITEM_HEIGHT }}
          />

          <div
            className="bktm-wheel-list"
            ref={listRef}
            onScroll={handleScroll}
            style={{
              paddingTop:
                WHEEL_ITEM_HEIGHT * Math.floor(WHEEL_VISIBLE_ITEMS / 2),
              paddingBottom:
                WHEEL_ITEM_HEIGHT * Math.floor(WHEEL_VISIBLE_ITEMS / 2),
            }}
          >
            {options.map((opt, idx) => {
              const distance = Math.abs(idx - activeIndex);
              return (
                <div
                  key={opt ?? "all"}
                  className={[
                    "bktm-wheel-item",
                    idx === activeIndex ? "bktm-wheel-item-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    height: WHEEL_ITEM_HEIGHT,
                    opacity: Math.max(0.25, 1 - distance * 0.35),
                    transform: `scale(${Math.max(0.75, 1 - distance * 0.12)})`,
                  }}
                  onClick={() => handleItemClick(idx)}
                >
                  {opt === null ? "Tất cả" : `${opt} người`}
                </div>
              );
            })}
          </div>

          <div className="bktm-wheel-fade bktm-wheel-fade-top" />
          <div className="bktm-wheel-fade bktm-wheel-fade-bottom" />
        </div>

        <div className="bktm-wheel-actions">
          <button className="bktm-wheel-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="bktm-wheel-confirm" onClick={handleConfirm}>
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [wheelOpen, setWheelOpen] = useState(false);

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
      if (e.key === "Escape") {
        if (wheelOpen) {
          setWheelOpen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", onKey);
    }

    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, wheelOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="bktm-overlay"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Chọn bàn"
    >
      <div className="bktm-panel">
        {/* Header */}
        <div className="bktm-header">
          <div className="bktm-header-text">
            <span className="bktm-eyebrow">Đặt Chỗ</span>
            <h2 className="bktm-title">Chọn Bàn Của Bạn</h2>
          </div>

          <button className="bktm-close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="bktm-filter">
          <label className="bktm-filter-label">Số lượng người</label>

          <button
            type="button"
            className="bktm-people-btn"
            onClick={() => setWheelOpen(true)}
          >
            <span className="bktm-people-btn-icon">👥</span>
            <span className="bktm-people-btn-text">
              {peopleFilter ? `${peopleFilter} người` : "Tất cả bàn"}
            </span>
            <span className="bktm-people-btn-chevron">⌄</span>
          </button>
        </div>

        {/* Grid */}
        <div className="bktm-grid-wrap">
          {loading ? (
            <div className="bktm-loading">
              <div className="bktm-spinner"></div>
              <span>Đang tải danh sách bàn…</span>
            </div>
          ) : tables.length === 0 ? (
            <div className="bktm-empty">Không tìm thấy bàn phù hợp.</div>
          ) : (
            <div className="bktm-grid">
              {tables.map((table) => {
                const isSelected = selectedTable?.tableId === table.tableId;

                return (
                  <button
                    key={table.tableId}
                    className={[
                      "bktm-table-card",
                      isSelected ? "bktm-table-card-selected" : "",
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
                    <div className="bktm-card-accent"></div>

                    <div className="bktm-card-body">
                      <div className="bktm-icon-wrap">
                        <svg
                          viewBox="0 0 36 24"
                          fill="none"
                          className="bktm-icon"
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

                      <span className="bktm-table-number">
                        {table.tableNumber}
                      </span>

                      <span className="bktm-table-capacity">
                        👥 {table.capacity} người
                      </span>
                    </div>

                    {isSelected && <span className="bktm-check">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bktm-footer">
          <span className="bktm-footer-note">
            {selectedTable
              ? `Đang chọn: ${selectedTable.tableNumber}`
              : "Chạm vào bàn để chọn"}
          </span>

          <button className="bktm-close-btn" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>

      {/* Vòng quay chọn số người */}
      {wheelOpen && (
        <PeopleWheelPicker
          value={peopleFilter}
          onChange={setPeopleFilter}
          onClose={() => setWheelOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingTableModal;
