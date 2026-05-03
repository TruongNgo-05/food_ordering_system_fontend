import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import cartService from "../../services/customer/cartService";
import {
  loadSharedVouchers,
  SHARED_DATA_UPDATED_EVENT,
} from "../../utils/sharedData";
import icon from "../../assets/images/icon.png";
import "../../assets/styles/CustomerCart.css";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

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

  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVouchers, setAppliedVouchers] = useState([]);
  const [voucherError, setVoucherError] = useState("");
  const [vouchers, setVouchers] = useState(() => loadSharedVouchers());

  const [payMethod, setPayMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [onlinePaymentRef, setOnlinePaymentRef] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoadingCart(true);
        const res = await cartService.getCart();
        const data = res.data?.data;
        const mapped = (data?.items || []).map((i) => ({
          item_id: i.itemId,
          name: i.foodName,
          price: i.price,
          image: i.image,
          qty: i.quantity,
        }));
        setCart(mapped);
      } catch (err) {
        console.error("Load cart error:", err);
      } finally {
        setLoadingCart(false);
      }
    };
    loadCart();
  }, []);

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

  const updateQty = useCallback(
    async (id, delta) => {
      try {
        const item = cart.find((c) => c.item_id === id);
        if (!item) return;
        const newQty = item.qty + delta;
        if (newQty <= 0) {
          await cartService.deleteCart(id);
        } else {
          await cartService.updateCart(id, { quantity: newQty });
        }
        const res = await cartService.getCart();
        const data = res.data?.data;
        const mapped = (data?.items || []).map((i) => ({
          item_id: i.itemId,
          name: i.foodName,
          price: i.price,
          image: i.image,
          qty: i.quantity,
        }));
        setCart(mapped);
      } catch (err) {
        console.error("Update cart error:", err);
        toast.error("Cập nhật giỏ hàng thất bại");
      }
    },
    [cart],
  );

  const removeItem = useCallback(async (id) => {
    try {
      await cartService.deleteCart(id);
      const res = await cartService.getCart();
      const data = res.data?.data;
      const mapped = (data?.items || []).map((i) => ({
        item_id: i.itemId,
        name: i.foodName,
        price: i.price,
        image: i.image,
        qty: i.quantity,
      }));
      setCart(mapped);
    } catch (err) {
      console.error("Remove cart item error:", err);
      toast.error("Xóa món thất bại");
    }
  }, []);

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
      <div className="cart-placed-screen" style={{ background: T.bg }}>
        <div className="cart-placed-emoji">🎉</div>
        <h2 className="cart-placed-title">Đặt hàng thành công!</h2>
        <p className="cart-placed-sub">Đang chuyển đến trang đơn hàng...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-empty-page" style={{ background: T.bg }}>
        <UserHeader title="Giỏ hàng" description="Xem lại món bạn đã chọn" />
        <div className="cart-empty-center">
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

        <div className="cart-layout">
          {/* Left */}
          <div className="cart-left">
            <div
              className="cart-items-box"
              style={{ background: T.card, border: `1px solid ${T.border}` }}
            >
              <div className="cart-box-header">
                <p className="cart-title">Món đã chọn</p>
              </div>
              {cart.map((item, i) => (
                <div
                  key={item.item_id}
                  className="cart-item-row"
                  style={{
                    borderBottom:
                      i < cart.length - 1 ? `1px solid ${T.border}` : "none",
                  }}
                >
                  <div
                    className="cart-item-image-wrap"
                    style={{ background: T.primaryLight }}
                  >
                    <FoodImage
                      src={item.image}
                      size={48}
                      radius={10}
                      textSize={28}
                    />
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name" style={{ color: T.text }}>
                      {item.name}
                    </p>
                    <p className="cart-item-price" style={{ color: T.primary }}>
                      {fmt(item.price)} / phần
                    </p>
                  </div>
                  <div className="cart-qty-controls">
                    <button
                      className="cart-qty-btn-minus"
                      style={{ border: `1.5px solid ${T.border}` }}
                      onClick={() => updateQty(item.item_id, -1)}
                    >
                      −
                    </button>
                    <span className="cart-qty-value" style={{ color: T.text }}>
                      {item.qty}
                    </span>
                    <button
                      className="cart-qty-btn-plus"
                      style={{ background: T.primary }}
                      onClick={() => updateQty(item.item_id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="cart-item-total" style={{ color: T.text }}>
                    {fmt(item.price * item.qty)}
                  </p>
                  <button
                    className="cart-item-remove-btn"
                    style={{ background: T.redBg, color: T.red }}
                    onClick={() => removeItem(item.item_id)}
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
              className="cart-address-box"
              style={{ background: T.card, border: `1px solid ${T.border}` }}
            >
              <p className="cart-address-label" style={{ color: T.text }}>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ marginRight: 8 }}
                />
                Địa chỉ giao hàng
              </p>
              <button
                className="cart-address-btn"
                type="button"
                onClick={() => setOpenAddressModal(true)}
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
          <div className="cart-right">
            <PaymentMethodSection
              payMethod={payMethod}
              onChangePayMethod={setPayMethod}
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

      {/* QR Modal */}
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
        <div className="cart-qr-modal-body">
          <img
            className="cart-qr-image"
            src={icon}
            alt="QR thanh toán"
            style={{ border: `1px solid ${T.border}` }}
          />
          <p className="cart-qr-ref" style={{ color: T.sub }}>
            Nội dung chuyển khoản: <strong>{onlinePaymentRef}</strong>
          </p>
          <button
            type="button"
            className="cart-qr-confirm-btn"
            style={{ background: T.primary }}
            onClick={() => {
              setOpenQrModal(false);
              finalizeOrder("paid");
            }}
          >
            Tôi đã quét và thanh toán thành công
          </button>
          <p className="cart-qr-note" style={{ color: T.sub }}>
            Sau thanh toán, đơn sẽ ở trạng thái chờ xác nhận.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Cart;
