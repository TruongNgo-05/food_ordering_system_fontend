import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faClock,
  faBuildingColumns,
  faMoneyBillWave,
  faReceipt,
  faLocationDot,
  faFileLines,
  faTags,
  faRotateRight,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import { T, fmt, STATUS_CFG } from "../../constants/customerTheme";
import { EmptyState, StatusBadge } from "../../components/customer/SharedUI";
import UserHeader from "../../components/user/UserHeader";
import FoodImage from "../../components/common/FoodImage";
import { mockOrders } from "../../data/mockOrders";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/CustomerOrders.css";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

const Orders = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState(() => mockOrders);

  useEffect(() => {
    if (!isLoggedIn) {
      confirmLoginWithModal(navigate, () => navigate("/customer"));
    }
  }, [isLoggedIn, navigate]);

  const [detail, setDetail] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders],
  );

  const filtered = useMemo(() => {
    return filterStatus === "all"
      ? safeOrders
      : safeOrders.filter((o) => o.status === filterStatus);
  }, [filterStatus, safeOrders]);

  const filters = useMemo(() => {
    const steps = [
      "all",
      "pending",
      "processing",
      "delivering",
      "completed",
      "cancelled",
    ];
    return steps.map((k) => {
      if (k === "all")
        return {
          key: "all",
          label: "Tất cả",
          icon: <FontAwesomeIcon icon={faListCheck} />,
          color: T.text,
          bg: "#fff",
        };
      const cfg = STATUS_CFG[k];
      return {
        key: k,
        label: cfg.label,
        icon: cfg.icon,
        color: cfg.color,
        bg: cfg.bg,
      };
    });
  }, []);

  const handleReorder = (order) => {
    if (!order || !Array.isArray(order.items) || order.items.length === 0)
      return;
    const nextCart = order.items.map((it) => ({
      item_id: it.item_id || `${it.name}-${it.price}`,
      name: it.name,
      price: it.price,
      image: it.image,
      qty: it.qty || 1,
    }));
    localStorage.setItem("cart", JSON.stringify(nextCart));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
    navigate("/customer/carts");
  };

  const handleCancelOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status === "pending"
          ? { ...o, status: "cancelled" }
          : o,
      ),
    );
    setDetail((prev) =>
      prev && prev.id === orderId && prev.status === "pending"
        ? { ...prev, status: "cancelled" }
        : prev,
    );
  };

  // ================= DETAIL =================
  if (detail) {
    const steps = ["pending", "processing", "delivering", "completed"];
    const stepIdx = steps.indexOf(detail.status);

    return (
      <div className="customer-orders-page" style={{ background: T.bg }}>
        <div className="customer-orders-container">
          <UserHeader
            title="Chi tiết đơn hàng"
            description={`Mã đơn #${detail.id}`}
          />

          <button
            onClick={() => setDetail(null)}
            className="ord-back-btn"
            style={{ color: T.sub }}
          >
            ← Quay lại
          </button>

          {/* Order info card */}
          <div
            className="ord-detail-card"
            style={{ background: T.card, borderColor: T.border }}
          >
            <div className="ord-detail-card-top">
              <div>
                <p className="ord-detail-id-label" style={{ color: T.sub }}>
                  Mã đơn
                </p>
                <p className="ord-detail-id-value" style={{ color: T.text }}>
                  #{detail.id}
                </p>
                <p className="ord-detail-created" style={{ color: T.sub }}>
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: 6 }} />
                  {detail.created_at}
                </p>
              </div>
              <div className="ord-detail-right">
                <StatusBadge status={detail.status} />
                <p className="ord-detail-payment" style={{ color: T.sub }}>
                  <FontAwesomeIcon
                    icon={
                      detail.payment_method === "ONLINE"
                        ? faBuildingColumns
                        : faMoneyBillWave
                    }
                    style={{ marginRight: 6 }}
                  />
                  {detail.payment_method === "ONLINE" ? "Online" : "COD"} ·{" "}
                  {detail.payment_status === "paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </p>
              </div>
            </div>

            {/* Step badges */}
            <div className="ord-steps-strip">
              {steps.map((s, i) => {
                const c = STATUS_CFG[s];
                const active = i <= stepIdx;
                return (
                  <span
                    key={s}
                    className="ord-step-badge"
                    style={{
                      background: active ? c.bg : "#fff",
                      color: active ? c.color : T.muted,
                      borderColor: active ? `${c.color}33` : T.border,
                    }}
                  >
                    {c.icon} {c.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 2-col grid */}
          <div className="ord-detail-grid">
            {/* Items list */}
            <div
              className="ord-items-card"
              style={{ background: T.card, borderColor: T.border }}
            >
              <div
                className="ord-items-card-header"
                style={{ borderBottomColor: T.border }}
              >
                <p style={{ color: T.text }}>
                  <FontAwesomeIcon
                    icon={faReceipt}
                    style={{ marginRight: 8 }}
                  />
                  Món trong đơn
                </p>
              </div>

              {detail.items.map((it, i) => (
                <div
                  key={i}
                  className="ord-item-row"
                  style={{
                    borderBottomColor:
                      i < detail.items.length - 1 ? T.border : "transparent",
                  }}
                >
                  <div
                    className="ord-item-thumb"
                    style={{ background: T.primaryLight }}
                  >
                    <FoodImage
                      src={it.image}
                      size={34}
                      radius={10}
                      textSize={20}
                    />
                  </div>
                  <div className="ord-item-info">
                    <p className="ord-item-name" style={{ color: T.text }}>
                      {it.name}
                    </p>
                    <p className="ord-item-sub" style={{ color: T.sub }}>
                      {fmt(it.price)} · x{it.qty}
                    </p>
                  </div>
                  <p className="ord-item-total" style={{ color: T.text }}>
                    {fmt(it.price * it.qty)}
                  </p>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="ord-sidebar">
              {/* Address */}
              <div
                className="ord-sidebar-card"
                style={{ background: T.card, borderColor: T.border }}
              >
                <p className="ord-sidebar-card-title" style={{ color: T.text }}>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ marginRight: 8 }}
                  />
                  Giao đến
                </p>
                <p className="ord-address-text" style={{ color: T.sub }}>
                  {detail.address || "—"}
                </p>
              </div>

              {/* Summary */}
              <div
                className="ord-sidebar-card"
                style={{ background: T.card, borderColor: T.border }}
              >
                <p className="ord-sidebar-card-title" style={{ color: T.text }}>
                  <FontAwesomeIcon
                    icon={faFileLines}
                    style={{ marginRight: 8 }}
                  />
                  Tóm tắt
                </p>

                {[
                  ["Tạm tính", fmt(detail.subtotal ?? 0), T.text],
                  ["Phí giao hàng", fmt(detail.shipping ?? 0), T.text],
                  ...(detail.discount > 0
                    ? [["Giảm giá", `−${fmt(detail.discount)}`, T.green]]
                    : []),
                ].map(([k, v, c]) => (
                  <div key={k} className="ord-summary-row">
                    <span style={{ color: T.sub }}>{k}</span>
                    <span
                      style={{
                        color: c,
                        fontWeight: c === T.green ? 800 : 600,
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}

                <div
                  className="ord-summary-total"
                  style={{ borderTopColor: T.border }}
                >
                  <span>Tổng</span>
                  <span style={{ color: T.primary }}>
                    {fmt(detail.total ?? 0)}
                  </span>
                </div>
              </div>

              {/* Voucher */}
              {detail.voucher && (
                <div
                  className="ord-voucher-badge"
                  style={{
                    background: T.primaryLight,
                    borderColor: `${T.primary}66`,
                  }}
                >
                  <p style={{ color: T.primary }}>
                    <FontAwesomeIcon icon={faTags} style={{ marginRight: 6 }} />
                    Voucher: {detail.voucher}
                  </p>
                </div>
              )}

              {/* Cancel */}
              {detail.status === "pending" && (
                <button
                  onClick={() => handleCancelOrder(detail.id)}
                  className="ord-cancel-btn"
                  style={{ background: T.redBg, color: T.red }}
                >
                  Hủy đơn
                </button>
              )}

              {/* Reorder */}
              <button
                onClick={() => handleReorder(detail)}
                className="ord-reorder-btn"
                style={{ background: T.primary }}
              >
                <FontAwesomeIcon
                  icon={faRotateRight}
                  style={{ marginRight: 6 }}
                />
                Đặt lại đơn này
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= LIST =================
  return (
    <div className="customer-orders-page" style={{ background: T.bg }}>
      <div className="customer-orders-container">
        <UserHeader
          title="Đơn hàng của tôi"
          description={`${safeOrders.length} đơn`}
        />

        {/* Filter bar */}
        <div className="ord-filter-bar">
          {filters.map((f) => {
            const active = filterStatus === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                className="ord-filter-btn"
                style={{
                  borderColor: active ? T.primary : T.border,
                  background: active ? T.primaryLight : "#fff",
                  color: active ? T.primary : T.text,
                }}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FontAwesomeIcon icon={faBoxOpen} />}
            title="Chưa có đơn hàng"
            desc="Hãy đặt món để xem lịch sử đơn hàng."
            btnLabel="Xem thực đơn"
            onBtn={() => (window.location.href = "/customer")}
          />
        ) : (
          <div className="ord-list">
            {filtered.map((order) => {
              const first = order.items?.[0];
              const itemCount = Array.isArray(order.items)
                ? order.items.reduce((s, it) => s + (it.qty || 0), 0)
                : 0;

              return (
                <div
                  key={order.id}
                  onClick={() => setDetail(order)}
                  className="ord-card"
                  style={{ background: T.card, borderColor: T.border }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = T.primary;
                    e.currentTarget.style.boxShadow =
                      "0 10px 26px rgba(0,0,0,.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Left */}
                  <div className="ord-card-left">
                    <div
                      className="ord-card-thumb"
                      style={{ background: T.primaryLight }}
                    >
                      <FoodImage
                        src={first?.image || "🍽️"}
                        size={38}
                        radius={12}
                        textSize={22}
                      />
                    </div>
                    <div className="ord-card-info">
                      <p className="ord-card-title" style={{ color: T.text }}>
                        #{order.id} · {fmt(order.total ?? 0)}
                      </p>
                      <p className="ord-card-meta" style={{ color: T.sub }}>
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ marginRight: 6 }}
                        />
                        {order.created_at} · {itemCount} món
                      </p>
                      {first?.name && (
                        <p
                          className="ord-card-preview"
                          style={{ color: T.sub }}
                        >
                          {first.name}
                          {Array.isArray(order.items) && order.items.length > 1
                            ? ` và ${order.items.length - 1} món khác`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="ord-card-right">
                    <StatusBadge status={order.status} />
                    <p className="ord-card-payment" style={{ color: T.sub }}>
                      <FontAwesomeIcon
                        icon={
                          order.payment_method === "ONLINE"
                            ? faBuildingColumns
                            : faMoneyBillWave
                        }
                        style={{ marginRight: 6 }}
                      />
                      {order.payment_method === "ONLINE" ? "Online" : "COD"}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order);
                      }}
                      className="ord-card-reorder-btn"
                      style={{
                        borderColor: `${T.primary}44`,
                        background: T.primaryLight,
                        color: T.primary,
                      }}
                    >
                      Đặt lại
                    </button>
                    {order.status === "pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order.id);
                        }}
                        className="ord-card-cancel-btn"
                        style={{
                          borderColor: `${T.red}33`,
                          background: T.redBg,
                          color: T.red,
                        }}
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
