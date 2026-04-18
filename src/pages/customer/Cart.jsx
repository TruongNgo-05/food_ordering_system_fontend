import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { T, fmt } from "../../constants/customerTheme";
import { EmptyState } from "../../components/customer/SharedUI";
import UserHeader from "../../components/user/UserHeader";
import FoodImage from "../../components/common/FoodImage";
import DeliveryAddressModal from "../../components/customer/DeliveryAddressModal";
import VoucherSection from "../../components/customer/cart/VoucherSection";
import PaymentMethodSection from "../../components/customer/cart/PaymentMethodSection";
import OrderSummarySection from "../../components/customer/cart/OrderSummarySection";
import {
  loadSharedVouchers,
  SHARED_DATA_UPDATED_EVENT,
} from "../../utils/sharedData";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/CustomerCart.css";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";
const BANK_OPTIONS = [
  { code: "VCB", name: "Vietcombank" },
  { code: "BIDV", name: "BIDV" },
  { code: "TCB", name: "Techcombank" },
  { code: "MB", name: "MB Bank" },
  { code: "ACB", name: "ACB" },
  { code: "VPB", name: "VPBank" },
];

const calcVoucherDiscount = (voucher, subtotal) => {
  if (!voucher) return 0;
  return voucher.discount_type === "percent"
    ? Math.min(
        Math.round((subtotal * voucher.discount_value) / 100),
        voucher.max_discount,
      )
    : voucher.discount_value;
};

const Cart = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) {
      confirmLoginWithModal(navigate, () => navigate("/customer"));
    }
  }, [isLoggedIn, navigate]);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState([]);
  const [voucherError, setVoucherError] = useState("");
  const [vouchers, setVouchers] = useState(() => loadSharedVouchers());

  const [payMethod, setPayMethod] = useState("COD");
  const [selectedBank, setSelectedBank] = useState("");
  const [address, setAddress] = useState("");
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [onlinePaymentRef, setOnlinePaymentRef] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
  }, [cart]);

  useEffect(() => {
    const syncVouchers = () => setVouchers(loadSharedVouchers());
    syncVouchers();
    window.addEventListener("focus", syncVouchers);
    window.addEventListener("storage", syncVouchers);
    window.addEventListener(SHARED_DATA_UPDATED_EVENT, syncVouchers);
    return () => {
      window.removeEventListener("focus", syncVouchers);
      window.removeEventListener("storage", syncVouchers);
      window.removeEventListener(SHARED_DATA_UPDATED_EVENT, syncVouchers);
    };
  }, []);

  const updateQty = (id, d) =>
    setCart((prev) =>
      prev
        .map((c) => (c.item_id === id ? { ...c, qty: c.qty + d } : c))
        .filter((c) => c.qty > 0),
    );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((c) => c.item_id !== id));

  const subtotal = useMemo(
    () => cart.reduce((s, c) => s + c.price * c.qty, 0),
    [cart],
  );
  const shipping = subtotal > 0 ? 15000 : 0;

  const discount = useMemo(() => {
    const sum = appliedVouchers.reduce(
      (acc, voucher) => acc + calcVoucherDiscount(voucher, subtotal),
      0,
    );
    return Math.min(sum, subtotal + shipping);
  }, [appliedVouchers, subtotal, shipping]);

  const total = Math.max(0, subtotal + shipping - discount);

  const applyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) {
      setVoucherError("Vui lòng nhập mã");
      return;
    }

    const v = vouchers.find((x) => x.code === code);
    if (!v) {
      setVoucherError("Mã không hợp lệ");
      return;
    }
    if (appliedVouchers.some((x) => x.code === v.code)) {
      setVoucherError("Mã này đã được áp dụng");
      return;
    }
    if (subtotal < v.min_order) {
      setVoucherError(`Đơn tối thiểu ${fmt(v.min_order)}`);
      return;
    }
    const now = Date.now();
    const start = v.start_at ? new Date(v.start_at).getTime() : null;
    const end = v.end_at
      ? new Date(v.end_at).getTime()
      : v.expired
        ? new Date(v.expired).getTime()
        : null;
    if (start && now < start) {
      setVoucherError("Voucher chưa đến thời gian áp dụng");
      return;
    }
    if (end && now > end) {
      setVoucherError("Voucher đã hết hạn");
      return;
    }
    setAppliedVouchers((prev) => [...prev, v]);
    setVoucherError("");
    setVoucherInput("");
  };

  const removeAppliedVoucher = (code) => {
    setAppliedVouchers((prev) =>
      prev.filter((voucher) => voucher.code !== code),
    );
  };

  const finalizeOrder = (paymentStatus) => {
    if (cart.length === 0) return;

    const order = {
      id: "ORD-" + String(Date.now()).slice(-6),
      created_at: new Date().toLocaleString("vi-VN"),
      status: "pending",
      payment_method: payMethod,
      payment_status: paymentStatus,
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
      voucher: appliedVouchers.map((voucher) => voucher.code),
      address,
    };

    const saved = localStorage.getItem("orders");
    const prevOrders = saved ? JSON.parse(saved) : [];
    const nextOrders = Array.isArray(prevOrders)
      ? [order, ...prevOrders]
      : [order];
    localStorage.setItem("orders", JSON.stringify(nextOrders));

    setCart([]);
    setAppliedVouchers([]);
    setVoucherInput("");
    setSelectedBank("");
    setPlaced(true);

    setTimeout(() => {
      setPlaced(false);
      navigate("/customer/orders");
    }, 900);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    if (!address.trim()) {
      toast.warning("Vui lòng chọn địa chỉ giao hàng");
      setOpenAddressModal(true);
      return;
    }
    if (payMethod === "ONLINE") {
      if (!selectedBank) {
        toast.warning("Vui lòng chọn ngân hàng để thanh toán online");
        return;
      }
      const ref = `PAY-${Date.now()}`;
      setOnlinePaymentRef(ref);
      setOpenQrModal(true);
      return;
    }
    finalizeOrder("pending");
  };

  const saveAddressFromModal = (fullAddress) => {
    setAddress(fullAddress);
    setOpenAddressModal(false);
    toast.success("Đã cập nhật địa chỉ giao hàng");
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
        <h2
          style={{ margin: 0, color: T.green, fontWeight: 900, fontSize: 26 }}
        >
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
        <UserHeader title="Giỏ hàng" description="Xem lại món bạn đã chọn" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
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
        <UserHeader
          title="Giỏ hàng"
          description={`${cart.length} món đã chọn`}
        />

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28 }}
        >
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
                <p
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 15,
                    color: T.text,
                  }}
                >
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
                    borderBottom:
                      i < cart.length - 1 ? `1px solid ${T.border}` : "none",
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
                    <FoodImage
                      src={item.image}
                      size={48}
                      radius={10}
                      textSize={28}
                    />
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
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: T.primary,
                        fontWeight: 800,
                      }}
                    >
                      {fmt(item.price)} / phần
                    </p>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
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

            {/* Address */}
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
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ marginRight: 8 }}
                />
                Địa chỉ giao hàng
              </p>
              <button
                type="button"
                onClick={() => setOpenAddressModal(true)}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 11,
                  border: `1.5px solid ${T.border}`,
                  fontSize: 14,
                  color: T.text,
                  textAlign: "left",
                  background: "#fff",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                {address || "Chọn địa chỉ giao hàng"}
              </button>
            </div>

            <VoucherSection
              voucherInput={voucherInput}
              voucherError={voucherError}
              appliedVouchers={appliedVouchers}
              vouchers={vouchers}
              subtotal={subtotal}
              onVoucherInputChange={(value) => {
                setVoucherInput(value);
                setVoucherError("");
              }}
              onApplyVoucher={applyVoucher}
              onPickVoucherCode={(code) => {
                setVoucherInput(code);
                setVoucherError("");
              }}
              onRemoveAppliedVoucher={removeAppliedVoucher}
              calcVoucherDiscount={calcVoucherDiscount}
            />
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <PaymentMethodSection
              payMethod={payMethod}
              selectedBank={selectedBank}
              bankOptions={BANK_OPTIONS}
              onChangePayMethod={setPayMethod}
              onSelectBank={setSelectedBank}
            />

            <OrderSummarySection
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              onPlaceOrder={placeOrder}
            />
          </div>
        </div>
      </div>

      <DeliveryAddressModal
        open={openAddressModal}
        onCancel={() => setOpenAddressModal(false)}
        onSave={saveAddressFromModal}
      />

      <Modal
        title={
          <span>
            <FontAwesomeIcon icon={faQrcode} style={{ marginRight: 8 }} />
            Quét QR để thanh toán
          </span>
        }
        open={openQrModal}
        onCancel={() => setOpenQrModal(false)}
        footer={null}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: 10, color: T.sub }}>
            Ngân hàng:{" "}
            <strong>
              {BANK_OPTIONS.find((b) => b.code === selectedBank)?.name || "-"}
            </strong>
          </p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
              `BANK:${selectedBank}|AMOUNT:${total}|REF:${onlinePaymentRef}`,
            )}`}
            alt="QR thanh toán"
            style={{
              width: 220,
              height: 220,
              borderRadius: 12,
              border: `1px solid ${T.border}`,
            }}
          />
          <p style={{ marginTop: 10, color: T.sub, fontSize: 12 }}>
            Nội dung chuyển khoản: <strong>{onlinePaymentRef}</strong>
          </p>
          <button
            type="button"
            onClick={() => {
              setOpenQrModal(false);
              finalizeOrder("paid");
            }}
            style={{
              marginTop: 8,
              border: "none",
              borderRadius: 10,
              background: T.primary,
              color: "#fff",
              fontWeight: 800,
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            Tôi đã quét và thanh toán thành công
          </button>
          <p style={{ marginTop: 8, fontSize: 12, color: T.sub }}>
            Sau thanh toán, đơn sẽ ở trạng thái chờ xác nhận.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
