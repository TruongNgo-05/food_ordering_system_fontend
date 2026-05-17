import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faMoneyBillWave,
  faBuildingColumns,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { T } from "../../../constants/customerTheme";

export default function PaymentMethodSection({ payMethod, onChangePayMethod }) {
  return (
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
        <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: 8 }} />
        Phương thức thanh toán
      </p>

      {[
        [
          "COD",
          <FontAwesomeIcon icon={faMoneyBillWave} key="cod-icon" />,
          "Tiền mặt khi nhận",
          "Trả tiền lúc giao hàng",
        ],
        [
          "ONLINE",
          <FontAwesomeIcon icon={faBuildingColumns} key="online-icon" />,
          "Thanh toán online",
          "Chuyển khoản / Ví điện tử",
        ],
      ].map(([value, icon, label, sub]) => (
        <label
          key={value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 12,
            marginBottom: 6,
            cursor: "pointer",
            border: `1.5px solid ${payMethod === value ? T.primary : T.border}`,
            background: payMethod === value ? T.primaryLight : "#fff",
            transition: "all .15s",
          }}
        >
          <input
            type="radio"
            value={value}
            checked={payMethod === value}
            onChange={() => onChangePayMethod(value)}
            style={{ accentColor: T.primary }}
          />
          <span style={{ fontSize: 22 }}>{icon}</span>
          <div style={{ flex: 1 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 14,
                color: T.text,
              }}
            >
              {label}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: T.sub }}>{sub}</p>
          </div>
          {payMethod === value && (
            <span style={{ color: T.green, fontSize: 16, fontWeight: 900 }}>
              ✓
            </span>
          )}
        </label>
      ))}

      {payMethod === "ONLINE" && (
        <div
          style={{
            background: T.blueBg,
            borderRadius: 10,
            padding: "10px 14px",
          }}
        >
          <p style={{ margin: 0, fontSize: 12, color: T.blue }}>
            <FontAwesomeIcon icon={faShieldHalved} style={{ marginRight: 6 }} />
            Bấm thanh toán để hiển thị mã QR chuyển khoản.
          </p>
        </div>
      )}
    </div>
  );
}
