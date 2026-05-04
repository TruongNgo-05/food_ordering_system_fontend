import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { T, fmt } from "../../../constants/customerTheme";

export default function OrderSummarySection({
  subtotal,
  shipping,
  discount,
  total,
  onPlaceOrder,
}) {
  return (
    <>
      <div
        style={{
          background: T.card,
          borderRadius: 18,
          border: `1px solid ${T.border}`,
          padding: "18px 22px",
        }}
      >
        <p
          style={{
            margin: "0 0 14px",
            fontWeight: 800,
            color: T.text,
            fontSize: 15,
          }}
        >
          <FontAwesomeIcon icon={faFileLines} style={{ marginRight: 8 }} />
          Tóm tắt
        </p>

        {[
          ["Tạm tính", fmt(subtotal), T.text],
          ...(discount > 0 ? [["Giảm giá", `−${fmt(discount)}`, T.green]] : []),
        ].map(([key, value, color]) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 14,
              padding: "5px 0",
            }}
          >
            <span style={{ color: T.sub }}>{key}</span>
            <span style={{ color, fontWeight: color === T.green ? 700 : 400 }}>
              {value}
            </span>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 900,
            fontSize: 20,
            marginTop: 14,
            paddingTop: 14,
            borderTop: `2px solid ${T.border}`,
          }}
        >
          <span>Tổng cộng</span>
          <span style={{ color: T.primary }}>{fmt(total)}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        style={{
          width: "100%",
          padding: 16,
          background: T.primary,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontSize: 16,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        🛒 Đặt hàng ngay — {fmt(total)}
      </button>
    </>
  );
}
