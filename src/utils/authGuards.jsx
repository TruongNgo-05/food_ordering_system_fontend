import React from "react";
import { toast } from "react-toastify";

export const confirmLoginWithToast = (navigate, onDecline) => {
  toast.info(
    ({ closeToast }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span>Bạn có muốn đăng nhập không?</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              closeToast?.();
              navigate("/login");
            }}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Có
          </button>
          <button
            type="button"
            onClick={() => {
              closeToast?.();
              if (typeof onDecline === "function") onDecline();
            }}
            style={{
              border: "1px solid #d9d9d9",
              background: "#fff",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Không
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    },
  );
};
