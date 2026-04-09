// Design tokens — màu sắc dùng chung toàn bộ customer module
export const T = {
  primary: "#FF6B35",
  primaryLight: "#FFF3EE",
  primaryDark: "#C94E1A",
  surface: "#FFFFFF",
  bg: "#F7F5F1",
  card: "#FFFFFF",
  border: "#E7E5E1",
  text: "#1C1917",
  sub: "#78716C",
  muted: "#A8A29E",
  green: "#16A34A",
  greenBg: "#F0FDF4",
  amber: "#D97706",
  amberBg: "#FFFBEB",
  blue: "#2563EB",
  blueBg: "#EFF6FF",
  red: "#DC2626",
  redBg: "#FEF2F2",
};

// Format số tiền VNĐ
export const fmt = (n) => n.toLocaleString("vi-VN") + "đ";

// Config trạng thái đơn hàng
export const STATUS_CFG = {
  pending: { label: "Chờ xác nhận", color: T.amber, bg: T.amberBg, icon: "⏳" },
  processing: { label: "Đang làm", color: T.blue, bg: T.blueBg, icon: "👨‍🍳" },
  delivering: {
    label: "Đang giao",
    color: T.primary,
    bg: T.primaryLight,
    icon: "🛵",
  },
  completed: { label: "Hoàn thành", color: T.green, bg: T.greenBg, icon: "✅" },
  cancelled: { label: "Đã hủy", color: T.red, bg: T.redBg, icon: "❌" },
};
