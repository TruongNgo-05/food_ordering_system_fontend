import React from "react";
import { T, STATUS_CFG } from "../../constants/customerTheme";
import "../../assets/styles/SharedUI.css";

// Badge trạng thái đơn hàng
export function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
  return (
    <span className="status-badge" style={{ background: c.bg, color: c.color }}>
      {c.icon} {c.label}
    </span>
  );
}

// Màn hình rỗng (empty state)
export function EmptyState({ icon, title, desc, btnLabel, onBtn }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-title" style={{ color: T.text }}>
        {title}
      </p>
      {desc && (
        <p className="empty-state-desc" style={{ color: T.sub }}>
          {desc}
        </p>
      )}
      {btnLabel && (
        <button
          onClick={onBtn}
          className="empty-state-btn"
          style={{ background: T.primary }}
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
    <div className="section-title">
      <h2 className="section-title-text" style={{ color: T.text }}>
        {children}
      </h2>
      {count !== undefined && (
        <span
          className="section-title-count"
          style={{
            background: T.primaryLight,
            color: T.primary,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}
