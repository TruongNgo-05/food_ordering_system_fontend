// Design tokens — màu sắc dùng chung toàn bộ customer module
export const T = {
  // Neutral base (aligned with global CSS variables in `src/index.css`)
  primary: "#4F46E5",
  primaryLight: "#EEF2FF",
  primaryDark: "#4338CA",
  surface: "#FFFFFF",
  bg: "#F6F7FB",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  sub: "#475569",
  muted: "#64748B",
  green: "#16A34A",
  greenBg: "#F0FDF4",
  amber: "#D97706",
  amberBg: "#FFFBEB",
  blue: "#4F46E5",
  blueBg: "#EEF2FF",
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
