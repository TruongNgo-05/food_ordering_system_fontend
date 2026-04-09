
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T, fmt } from "../../constants/customerTheme";
import { mockVouchers } from "../../data/mockData";
import { EmptyState, SectionTitle } from "../../components/customer/SharedUI";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/CustomerCart.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  const [payMethod, setPayMethod] = useState("COD");
  const [address, setAddress] = useState("123 Nguyễn Huệ, Q.1, TP.HCM");
  const [activeTable] = useState(() => {
    const saved = localStorage.getItem("active-table");
    return saved ? saved : null;
  });
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateQty = (id, d) =>
    setCart((prev) =>
      prev
        .map((c) => (c.item_id === id ? { ...c, qty: c.qty + d } : c))
        .filter((c) => c.qty > 0),
    );

  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.item_id !== id));

  const subtotal = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);
  const shipping = activeTable ? 0 : subtotal > 0 ? 15000 : 0;

  const discount = useMemo(() => {
    if (!appliedVoucher) return 0;
    return appliedVoucher.discount_type === "percent"
      ? Math.min(
          Math.round((subtotal * appliedVoucher.discount_value) / 100),
          appliedVoucher.max_discount,
        )
      : appliedVoucher.discount_value;
  }, [appliedVoucher, subtotal]);

  const total = Math.max(0, subtotal + shipping - discount);

  const applyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) {
      setVoucherError("Vui lòng nhập mã");
      setAppliedVoucher(null);
      return;
    }

    const v = mockVouchers.find((x) => x.code === code);
    if (!v) {
      setVoucherError("Mã không hợp lệ");
      setAppliedVoucher(null);
      return;
    }
    if (subtotal < v.min_order) {
      setVoucherError(`Đơn tối thiểu ${fmt(v.min_order)}`);
      setAppliedVoucher(null);
      return;
    }
    setAppliedVoucher(v);
    setVoucherError("");
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const order = {
      id: "ORD-" + String(Date.now()).slice(-6),
      created_at: new Date().toLocaleString("vi-VN"),
      status: "pending",
      payment_method: payMethod,
      payment_status: payMethod === "ONLINE" ? "paid" : "pending",
      items: cart.map((c) => ({
        item_id: c.item_id,
        name: c.name,
        image: c.image,
        qty: c.qty,
        price: c.price,
      })),
      subtotal,
      discount,
      shipping,
      total,
      voucher: appliedVoucher?.code || null,
      address: activeTable ? `Bàn ${activeTable}` : address,
      order_type: activeTable ? "dine_in" : "delivery",
      table_number: activeTable || null,
    };

    const saved = localStorage.getItem("orders");
    const prevOrders = saved ? JSON.parse(saved) : [];
    const nextOrders = Array.isArray(prevOrders) ? [order, ...prevOrders] : [order];
    localStorage.setItem("orders", JSON.stringify(nextOrders));

    setCart([]);
    setAppliedVoucher(null);
    setVoucherInput("");
    setPlaced(true);

    setTimeout(() => {
      setPlaced(false);
      navigate("/customer/orders");
    }, 900);
  };

  if (placed) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 18,
          background: T.bg,
        }}
      >
        <div style={{ fontSize: 90 }}>🎉</div>
        <h2 style={{ margin: 0, color: T.green, fontWeight: 900, fontSize: 26 }}>
          Đặt hàng thành công!
        </h2>
        <p style={{ margin: 0, color: T.sub, fontSize: 15 }}>
          Đang chuyển đến trang đơn hàng...
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ height: "100%", background: T.bg, padding: 36 }}>
        <UserHeader
          title="Giỏ hàng"
          description={
            activeTable
              ? `Bạn đang gọi món tại bàn ${activeTable}`
              : "Xem lại món bạn đã chọn"
          }
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <EmptyState
            icon="🛒"
            title="Giỏ hàng trống"
            desc="Hãy khám phá thực đơn và thêm món bạn thích"
            btnLabel="Xem thực đơn"
            onBtn={() => navigate("/customer")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="customer-cart-page" style={{ background: T.bg }}>
      <div className="customer-cart-container">
        <SectionTitle count={`${cart.length} món`}>Giỏ hàng</SectionTitle>
        {activeTable && (
          <div
            style={{
              background: T.blueBg,
              border: `1px solid ${T.blue}33`,
              borderRadius: 12,
              color: T.blue,
              fontSize: 13,
              fontWeight: 700,
              padding: "10px 12px",
              marginBottom: 14,
            }}
          >
            🪑 Đơn này sẽ được phục vụ tại bàn <strong>{activeTable}</strong>.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28 }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Items */}
            <div
              style={{
                background: T.card,
                borderRadius: 18,
                border: `1px solid ${T.border}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "18px 22px 14px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: T.text }}>
                  🛍️ Món đã chọn
                </p>
              </div>

              {cart.map((item, i) => (
                <div
                  key={item.item_id}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "16px 22px",
                    borderBottom: i < cart.length - 1 ? `1px solid ${T.border}` : "none",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 44,
                      background: T.primaryLight,
                      width: 66,
                      height: 66,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.image}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontWeight: 700,
                        fontSize: 15,
                        color: T.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: T.primary, fontWeight: 800 }}>
                      {fmt(item.price)} / phần
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      onClick={() => updateQty(item.item_id, -1)}
                      style={{
                        width: 30,
                        height: 30,
                        border: `1.5px solid ${T.border}`,
                        background: "#fff",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        fontWeight: 800,
                        minWidth: 20,
                        textAlign: "center",
                        fontSize: 16,
                        color: T.text,
                      }}
                    >
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.item_id, 1)}
                      style={{
                        width: 30,
                        height: 30,
                        border: "none",
                        background: T.primary,
                        color: "#fff",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      +
                    </button>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontWeight: 900,
                      color: T.text,
                      fontSize: 16,
                      minWidth: 90,
                      textAlign: "right",
                    }}
                  >
                    {fmt(item.price * item.qty)}
                  </p>

                  <button
                    onClick={() => removeItem(item.item_id)}
                    style={{
                      background: T.redBg,
                      border: "none",
                      color: T.red,
                      borderRadius: 8,
                      width: 30,
                      height: 30,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                    aria-label="Xóa"
                    title="Xóa"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {!activeTable && (
              <div
                style={{
                  background: T.card,
                  borderRadius: 18,
                  border: `1px solid ${T.border}`,
                  padding: "18px 22px",
                }}
              >
                <p style={{ margin: "0 0 12px", fontWeight: 800, color: T.text, fontSize: 15 }}>
                  📍 Địa chỉ giao hàng
                </p>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 11,
                    border: `1.5px solid ${T.border}`,
                    fontSize: 14,
                    color: T.text,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {/* Voucher */}
            <div
              style={{
                background: T.card,
                borderRadius: 18,
                border: `1px solid ${T.border}`,
                padding: "18px 22px",
              }}
            >
              <p style={{ margin: "0 0 12px", fontWeight: 800, color: T.text, fontSize: 15 }}>
                🏷️ Mã giảm giá
              </p>

              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <input
                  value={voucherInput}
                  onChange={(e) => {
                    setVoucherInput(e.target.value.toUpperCase());
                    setVoucherError("");
                  }}
                  placeholder="Nhập mã voucher..."
                  style={{
                    flex: 1,
                    padding: "11px 14px",
                    borderRadius: 11,
                    border: `1.5px solid ${
                      voucherError ? T.red : appliedVoucher ? T.green : T.border
                    }`,
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  onClick={applyVoucher}
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
                <p style={{ margin: "0 0 8px", fontSize: 13, color: T.red }}>
                  {voucherError}
                </p>
              )}
              {appliedVoucher && (
                <p style={{ margin: "0 0 8px", fontSize: 13, color: T.green, fontWeight: 700 }}>
                  ✅ {appliedVoucher.description} — Tiết kiệm {fmt(discount)}
                </p>
              )}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {mockVouchers.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVoucherInput(v.code);
                      setVoucherError("");
                    }}
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
                    {v.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Payment */}
            <div
              style={{
                background: T.card,
                borderRadius: 18,
                border: `1px solid ${T.border}`,
                padding: "18px 22px",
              }}
            >
              <p style={{ margin: "0 0 14px", fontWeight: 800, color: T.text, fontSize: 15 }}>
                💳 Phương thức thanh toán
              </p>

              {[
                ["COD", "💵", "Tiền mặt khi nhận", "Trả tiền lúc giao hàng"],
                ["ONLINE", "🏦", "Thanh toán online", "Chuyển khoản / Ví điện tử"],
              ].map(([v, ic, lb, sub]) => (
                <label
                  key={v}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    borderRadius: 12,
                    marginBottom: 6,
                    cursor: "pointer",
                    border: `1.5px solid ${payMethod === v ? T.primary : T.border}`,
                    background: payMethod === v ? T.primaryLight : "#fff",
                    transition: "all .15s",
                  }}
                >
                  <input
                    type="radio"
                    value={v}
                    checked={payMethod === v}
                    onChange={() => setPayMethod(v)}
                    style={{ accentColor: T.primary }}
                  />
                  <span style={{ fontSize: 22 }}>{ic}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: T.text }}>
                      {lb}
                    </p>
                    <p style={{ margin: 0, fontSize: 11, color: T.sub }}>{sub}</p>
                  </div>
                  {payMethod === v && (
                    <span style={{ color: T.green, fontSize: 16, fontWeight: 900 }}>✓</span>
                  )}
                </label>
              ))}

              {payMethod === "ONLINE" && (
                <div style={{ background: T.blueBg, borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ margin: 0, fontSize: 12, color: T.blue }}>
                    🔒 Thanh toán an toàn qua VNPay, Momo, ZaloPay.
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div
              style={{
                background: T.card,
                borderRadius: 18,
                border: `1px solid ${T.border}`,
                padding: "18px 22px",
              }}
            >
              <p style={{ margin: "0 0 14px", fontWeight: 800, color: T.text, fontSize: 15 }}>
                📄 Tóm tắt
              </p>

              {[
                ["Tạm tính", fmt(subtotal), T.text],
                ["Phí giao hàng", fmt(shipping), T.text],
                ...(discount > 0 ? [["Giảm giá", `−${fmt(discount)}`, T.green]] : []),
              ].map(([k, v, c]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14,
                    padding: "5px 0",
                  }}
                >
                  <span style={{ color: T.sub }}>{k}</span>
                  <span style={{ color: c, fontWeight: c === T.green ? 700 : 400 }}>{v}</span>
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
              onClick={placeOrder}
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
              {activeTable ? `🍽️ Gọi món bàn ${activeTable} — ${fmt(total)}` : `🛒 Đặt hàng ngay — ${fmt(total)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
