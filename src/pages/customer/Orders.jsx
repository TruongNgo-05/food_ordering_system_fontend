import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { T, fmt, STATUS_CFG } from "../../constants/customerTheme";
import { EmptyState, StatusBadge } from "../../components/customer/SharedUI";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/CustomerOrders.css";
const Orders = () => {
  const navigate = useNavigate();
  const [orders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const [detail, setDetail] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const safeOrders = useMemo(() => (Array.isArray(orders) ? orders : []), [orders]);

  const filtered = useMemo(() => {
    return filterStatus === "all"
      ? safeOrders
      : safeOrders.filter((o) => o.status === filterStatus);
  }, [filterStatus, safeOrders]);

  const filters = useMemo(() => {
    const steps = ["all", "pending", "processing", "delivering", "completed"];
    return steps.map((k) => {
      if (k === "all")
        return {
          key: "all",
          label: "Tất cả",
          icon: "📋",
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
    if (!order || !Array.isArray(order.items) || order.items.length === 0) return;
    const nextCart = order.items.map((it) => ({
      item_id: it.item_id || `${it.name}-${it.price}`,
      name: it.name,
      price: it.price,
      image: it.image,
      qty: it.qty || 1,
    }));
    localStorage.setItem("cart", JSON.stringify(nextCart));
    navigate("/customer/carts");
  };

  // ================= DETAIL =================
  if (detail) {
    const steps = ["pending", "processing", "delivering", "completed"];
    const stepIdx = steps.indexOf(detail.status);

    return (
      <div className="customer-orders-page" style={{ background: T.bg }}>
        <div className="customer-orders-container">
          <button
            onClick={() => setDetail(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.sub,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 18,
              padding: 0,
            }}
          >
            ← Quay lại
          </button>

          <div
            style={{
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 18,
              padding: 22,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 12, color: T.sub }}>Mã đơn</p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 18,
                    fontWeight: 900,
                    color: T.text,
                  }}
                >
                  #{detail.id}
                </p>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: T.sub }}>
                  🕒 {detail.created_at}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <StatusBadge status={detail.status} />
                <p style={{ margin: "10px 0 0", fontSize: 13, color: T.sub }}>
                  {detail.payment_method === "ONLINE" ? "🏦 Online" : "💵 COD"}{" "}
                  ·{" "}
                  {detail.payment_status === "paid"
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </p>
                {detail.order_type === "dine_in" && detail.table_number && (
                  <span
                    style={{
                      marginTop: 8,
                      background: T.blueBg,
                      color: T.blue,
                      border: `1px solid ${T.blue}33`,
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    🪑 Bàn {detail.table_number}
                  </span>
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {steps.map((s, i) => {
                const c = STATUS_CFG[s];
                const active = i <= stepIdx;
                return (
                  <span
                    key={s}
                    style={{
                      background: active ? c.bg : "#fff",
                      color: active ? c.color : T.muted,
                      border: `1px solid ${active ? c.color + "33" : T.border}`,
                      borderRadius: 99,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {c.icon} {c.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 18,
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 18,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <p style={{ margin: 0, fontWeight: 900, color: T.text }}>
                  🧾 Món trong đơn
                </p>
              </div>

              {detail.items.map((it, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 18px",
                    borderBottom:
                      i < detail.items.length - 1
                        ? `1px solid ${T.border}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: T.primaryLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  >
                    {it.image}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 800,
                        color: T.text,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {it.name}
                    </p>
                    <p
                      style={{ margin: "2px 0 0", fontSize: 12, color: T.sub }}
                    >
                      {fmt(it.price)} · x{it.qty}
                    </p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 900, color: T.text }}>
                    {fmt(it.price * it.qty)}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  padding: 18,
                }}
              >
                <p
                  style={{ margin: "0 0 10px", fontWeight: 900, color: T.text }}
                >
                  {detail.order_type === "dine_in" ? "🪑 Bàn phục vụ" : "📍 Giao đến"}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: T.sub,
                    lineHeight: 1.7,
                  }}
                >
                  {detail.address || "—"}
                </p>
              </div>

              <div
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: 18,
                  padding: 18,
                }}
              >
                <p
                  style={{ margin: "0 0 10px", fontWeight: 900, color: T.text }}
                >
                  📄 Tóm tắt
                </p>

                {[
                  ["Tạm tính", fmt(detail.subtotal ?? 0), T.text],
                  ["Phí giao hàng", fmt(detail.shipping ?? 0), T.text],
                  ...(detail.discount > 0
                    ? [["Giảm giá", `−${fmt(detail.discount)}`, T.green]]
                    : []),
                ].map(([k, v, c]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 13,
                      padding: "4px 0",
                    }}
                  >
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
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 900,
                    fontSize: 18,
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: `2px solid ${T.border}`,
                  }}
                >
                  <span>Tổng</span>
                  <span style={{ color: T.primary }}>
                    {fmt(detail.total ?? 0)}
                  </span>
                </div>
              </div>

              {detail.voucher && (
                <div
                  style={{
                    background: T.primaryLight,
                    borderRadius: 14,
                    padding: "10px 12px",
                    border: `1px dashed ${T.primary}66`,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: T.primary,
                      fontWeight: 900,
                    }}
                  >
                    🏷️ Voucher: {detail.voucher}
                  </p>
                </div>
              )}

              <button
                onClick={() => handleReorder(detail)}
                style={{
                  border: "none",
                  borderRadius: 12,
                  background: T.primary,
                  color: "#fff",
                  fontWeight: 800,
                  padding: "10px 12px",
                  cursor: "pointer",
                }}
              >
                🔁 Đặt lại đơn này
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

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          {filters.map((f) => {
            const active = filterStatus === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key)}
                style={{
                  border: `1.5px solid ${active ? T.primary : T.border}`,
                  background: active ? T.primaryLight : "#fff",
                  color: active ? T.primary : T.text,
                  padding: "9px 14px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontWeight: 800,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
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
            icon="📦"
            title="Chưa có đơn hàng"
            desc="Hãy đặt món để xem lịch sử đơn hàng."
            btnLabel="Xem thực đơn"
            onBtn={() => (window.location.href = "/customer")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((order) => {
              const first = order.items?.[0];
              const itemCount = Array.isArray(order.items)
                ? order.items.reduce((s, it) => s + (it.qty || 0), 0)
                : 0;

              return (
                <div
                  key={order.id}
                  onClick={() => setDetail(order)}
                  style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 16,
                    padding: 16,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    transition: "box-shadow .15s, border-color .15s",
                  }}
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
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        background: T.primaryLight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {first?.image || "🍽️"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 900, color: T.text }}>
                        #{order.id} · {fmt(order.total ?? 0)}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0",
                          fontSize: 12,
                          color: T.sub,
                        }}
                      >
                        🕒 {order.created_at} · {itemCount} món
                      </p>
                      {first?.name && (
                        <p
                          style={{
                            margin: "6px 0 0",
                            fontSize: 12,
                            color: T.sub,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 520,
                          }}
                        >
                          {first.name}
                          {Array.isArray(order.items) && order.items.length > 1
                            ? ` và ${order.items.length - 1} món khác`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <StatusBadge status={order.status} />
                    <p
                      style={{ margin: "10px 0 0", fontSize: 12, color: T.sub }}
                    >
                      {order.payment_method === "ONLINE"
                        ? "🏦 Online"
                        : "💵 COD"}
                    </p>
                    {order.order_type === "dine_in" && order.table_number && (
                      <span
                        style={{
                          marginTop: 8,
                          background: T.blueBg,
                          color: T.blue,
                          border: `1px solid ${T.blue}33`,
                          borderRadius: 999,
                          padding: "4px 10px",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        🪑 Bàn {order.table_number}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order);
                      }}
                      style={{
                        marginTop: 8,
                        border: `1px solid ${T.primary}44`,
                        borderRadius: 10,
                        background: T.primaryLight,
                        color: T.primary,
                        fontWeight: 800,
                        fontSize: 12,
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Đặt lại
                    </button>
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
