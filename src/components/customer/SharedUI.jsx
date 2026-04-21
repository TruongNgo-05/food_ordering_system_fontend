import React from "react";
import { T, STATUS_CFG } from "../../constants/customerTheme";

// Badge trạng thái đơn hàng
export function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 99,
        whiteSpace: "nowrap",
      }}
    >
      {c.icon} {c.label}
    </span>
  );
}

// Màn hình rỗng (empty state)
export function EmptyState({ icon, title, desc, btnLabel, onBtn }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 40px",
        gap: 14,
      }}
    >
      <div style={{ fontSize: 64 }}>{icon}</div>
      <p style={{ margin: 0, fontWeight: 800, fontSize: 20, color: T.text }}>
        {title}
      </p>
      {desc && (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: T.sub,
            textAlign: "center",
            maxWidth: 360,
          }}
        >
          {desc}
        </p>
      )}
      {btnLabel && (
        <button
          onClick={onBtn}
          style={{
            marginTop: 8,
            background: T.primary,
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 32px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {btnLabel}
        </button>
      )}
    </div>
  );
}

// Tiêu đề section kèm badge số lượng
export function SectionTitle({ children, count }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: T.text }}>
        {children}
      </h2>
      {count !== undefined && (
        <span
          style={{
            background: T.primaryLight,
            color: T.primary,
            fontSize: 12,
            fontWeight: 700,
            padding: "2px 10px",
            borderRadius: 99,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
