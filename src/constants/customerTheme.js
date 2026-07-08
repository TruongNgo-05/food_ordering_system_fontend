// Design tokens — màu sắc customer (dark + gold như blog)
export const T = {
  primary: "#C9A84C",
  primaryLight: "rgba(201, 168, 76, 0.12)",
  primaryDark: "#B8923F",
  surface: "#111111",
  bg: "#0A0A0A",
  card: "#111111",
  border: "rgba(201, 168, 76, 0.2)",
  text: "#E8E0D0",
  sub: "#9A9080",
  muted: "#9A9080",
  green: "#16A34A",
  greenBg: "rgba(22, 163, 74, 0.12)",
  amber: "#E8C96E",
  amberBg: "rgba(201, 168, 76, 0.12)",
  blue: "#C9A84C",
  blueBg: "rgba(201, 168, 76, 0.12)",
  red: "#DC2626",
  redBg: "rgba(220, 38, 38, 0.12)",
};

// Format số tiền VNĐ
export const fmt = (n) =>
  (Number(n) || 0).toLocaleString("vi-VN") + "đ";

// Config trạng thái đơn hàng
export const STATUS_CFG = {
  pending: { label: "Chờ xác nhận", color: T.amber, bg: T.amberBg, icon: "⏳" },
  processing: { label: "Đang làm", color: T.primary, bg: T.primaryLight, icon: "👨‍🍳" },
  delivering: {
    label: "Đang giao",
    color: T.primary,
    bg: T.primaryLight,
    icon: "🛵",
  },
  completed: { label: "Hoàn thành", color: T.green, bg: T.greenBg, icon: "✅" },
  cancelled: { label: "Đã hủy", color: T.red, bg: T.redBg, icon: "❌" },
};
