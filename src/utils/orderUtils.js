export const getOrderType = (orderCode = "") => {
  if (orderCode.includes("TB")) return "offline";
  if (orderCode.includes("OL")) return "online";
  return "online";
};
