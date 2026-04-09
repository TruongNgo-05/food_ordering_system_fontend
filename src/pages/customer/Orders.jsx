import React, { useState, useEffect } from "react";
import { T, fmt, STATUS_CFG } from "../../constants/customerTheme";
import {
  SectionTitle,
  EmptyState,
  StatusBadge,
} from "../../components/customer/SharedUI";
import UserHeader from "../../components/user/UserHeader";
const Orders = () => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const [detail, setDetail] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const safeOrders = Array.isArray(orders) ? orders : [];

  const filtered =
    filterStatus === "all"
      ? safeOrders
      : safeOrders.filter((o) => o.status === filterStatus);

  // ================= DETAIL =================
  if (detail) {
    const cfg = STATUS_CFG[detail.status];
    const steps = ["pending", "processing", "delivering", "completed"];
    const stepIdx = steps.indexOf(detail.status);

    return (
      <div style={{ padding: 36 }}>
        <button onClick={() => setDetail(null)}>← Quay lại</button>
        <h2>Đơn #{detail.id}</h2>

        <StatusBadge status={detail.status} />

        <div>
          {detail.items.map((it, i) => (
            <div key={i}>
              {it.name} x{it.qty} - {fmt(it.price * it.qty)}
            </div>
          ))}
        </div>

        <h3>Tổng: {fmt(detail.total)}</h3>
      </div>
    );
  }

  // ================= LIST =================
  return (
    <div style={{ padding: 36 }}>
      {/* <SectionTitle count={`${safeOrders.length} đơn`}>
        Đơn hàng của tôi
      </SectionTitle> */}
      <UserHeader
        title="Đơn hàng của tôi"
        description="count={`${safeOrders.length} đơn"
      />

      {filtered.length === 0 ? (
        <EmptyState title="Chưa có đơn hàng" />
      ) : (
        filtered.map((order) => (
          <div
            key={order.id}
            onClick={() => setDetail(order)}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            <b>#{order.id}</b> - {fmt(order.total)}
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
