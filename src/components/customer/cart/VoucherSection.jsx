import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { T, fmt } from "../../../constants/customerTheme";

export default function VoucherSection({
  voucherInput,
  voucherError,
  appliedVouchers,
  vouchers,
  subtotal,
  onVoucherInputChange,
  onApplyVoucher,
  onPickVoucherCode,
  onRemoveAppliedVoucher,
  calcVoucherDiscount,
}) {
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
          margin: "0 0 12px",
          fontWeight: 800,
          color: T.text,
          fontSize: 15,
        }}
      >
        <FontAwesomeIcon icon={faTags} style={{ marginRight: 8 }} />
        Mã giảm giá
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input
          value={voucherInput}
          onChange={(e) => onVoucherInputChange(e.target.value.toUpperCase())}
          placeholder="Nhập mã voucher..."
          style={{
            flex: 1,
            padding: "11px 14px",
            borderRadius: 11,
            border: `1.5px solid ${
              voucherError ? T.red : appliedVouchers.length > 0 ? T.green : T.border
            }`,
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={onApplyVoucher}
          style={{
            padding: "11px 22px",
            background: T.primary,
            color: "#fff",
            border: "none",
            borderRadius: 11,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Áp dụng
        </button>
      </div>

      {voucherError && (
        <p style={{ margin: "0 0 8px", fontSize: 13, color: T.red }}>{voucherError}</p>
      )}

      {appliedVouchers.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
          {appliedVouchers.map((voucher) => (
            <div
              key={voucher.code}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                background: T.greenBg,
                color: T.green,
                borderRadius: 10,
                padding: "8px 10px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <span>
                <FontAwesomeIcon icon={faCircleCheck} style={{ marginRight: 6 }} />
                {voucher.code} — Tiết kiệm{" "}
                {fmt(calcVoucherDiscount(voucher, subtotal))}
              </span>
              <button
                type="button"
                onClick={() => onRemoveAppliedVoucher(voucher.code)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: T.green,
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {vouchers.map((voucher) => (
          <button
            key={voucher.id}
            onClick={() => onPickVoucherCode(voucher.code)}
            style={{
              fontSize: 12,
              padding: "4px 12px",
              borderRadius: 99,
              border: `1.5px dashed ${T.primary}`,
              background: T.primaryLight,
              color: T.primary,
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {voucher.code}
          </button>
        ))}
      </div>
    </div>
  );
}
