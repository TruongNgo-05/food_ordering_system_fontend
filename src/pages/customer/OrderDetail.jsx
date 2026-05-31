import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faBuildingColumns,
  faMoneyBillWave,
  faReceipt,
  faLocationDot,
  faFileLines,
  faTags,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";

import UserHeader from "../../components/user/UserHeader";
import FoodImage from "../../components/common/FoodImage";
import { StatusBadge } from "../../components/customer/SharedUI";

import { T, fmt, STATUS_CFG } from "../../constants/customerTheme";

import orderService from "../../services/customer/orderService";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  const mapStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "pending";

      case "PROCESSING":
        return "processing";

      case "DELIVERING":
        return "delivering";

      case "COMPLETED":
        return "completed";

      case "CANCELED":
      case "CANCELLED":
        return "cancelled";

      default:
        return "pending";
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("vi-VN");
  };

  const fetchDetail = async () => {
    try {
      setLoading(true);

      const res = await orderService.myOrderDetail(id);

      const data = res.data?.data;
      const order = data?.order;

      if (!order) {
        setDetail(null);
        return;
      }

      setDetail({
        id: order.orderId,
        orderCode: order.orderCode,

        status: mapStatus(order.status),

        total: order.totalPrice,

        subtotal: data.priceBefore || order.totalPrice,

        discount: data.voucherOrder?.discount || 0,

        voucher: data.voucherOrder?.voucherCode || null,

        address: data.address || "",

        note: data.note || "",

        customerName: order.customerName,

        customerPhone: order.customerPhone,

        created_at: formatDate(order.createdAt),

        payment_method: order.payment?.paymentMethodType || "COD",

        payment_status:
          order.payment?.paymentStatus === "PAID" ? "paid" : "pending",

        items: (order.items || []).map((item) => ({
          id: item.foodId,
          name: item.foodName,
          image: item.image,
          price: item.price,
          qty: item.quantity,
        })),
      });
    } catch (error) {
      console.error("Load order detail error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleReorder = async () => {
    try {
      await orderService.reorderOrder(detail.id);
      navigate("/customer/carts");
    } catch (error) {
      console.error(error);
      alert("Không thể đặt lại đơn");
    }
  };

  const handleCancelOrder = async () => {
    try {
      await orderService.cancelOrder(detail.id);

      setDetail((prev) => ({
        ...prev,
        status: "cancelled",
      }));
    } catch (error) {
      console.error(error);
      alert("Không thể hủy đơn");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Đang tải chi tiết đơn hàng...
      </div>
    );
  }

  if (!detail) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Không tìm thấy đơn hàng
      </div>
    );
  }

  const steps = ["pending", "processing", "delivering", "completed"];

  const stepIdx = steps.indexOf(detail.status);

  return (
    <div className="customer-orders-page" style={{ background: T.bg }}>
      <div className="customer-orders-container">
        <UserHeader
          title="Chi tiết đơn hàng"
          description={`Mã đơn ${detail.orderCode}`}
        />

        <button
          onClick={() => navigate("/customer/orders")}
          className="ord-back-btn"
          style={{ color: T.sub }}
        >
          ← Quay lại
        </button>

        {/* HEADER */}
        <div
          className="ord-detail-card"
          style={{
            background: T.card,
            borderColor: T.border,
          }}
        >
          <div className="ord-detail-card-top">
            <div>
              <p className="ord-detail-id-label" style={{ color: T.sub }}>
                Mã đơn
              </p>

              <p className="ord-detail-id-value" style={{ color: T.text }}>
                #{detail.orderCode}
              </p>

              <p className="ord-detail-created" style={{ color: T.sub }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: 6 }} />
                {detail.created_at}
              </p>
            </div>

            <div className="ord-detail-right">
              <StatusBadge status={detail.status} />

              <p className="ord-detail-payment" style={{ color: T.sub }}>
                <FontAwesomeIcon
                  icon={
                    detail.payment_method === "ONLINE"
                      ? faBuildingColumns
                      : faMoneyBillWave
                  }
                  style={{ marginRight: 6 }}
                />

                {detail.payment_method === "ONLINE"
                  ? "Online"
                  : detail.payment_method === "AT_TABLE"
                    ? "Tại bàn"
                    : "COD"}

                {" • "}

                {detail.payment_status === "paid"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </p>
            </div>
          </div>

          <div className="ord-steps-strip">
            {steps.map((s, i) => {
              const c = STATUS_CFG[s];
              const active = i <= stepIdx;

              return (
                <span
                  key={s}
                  className="ord-step-badge"
                  style={{
                    background: active ? c.bg : "#fff",
                    color: active ? c.color : T.muted,
                    borderColor: active ? `${c.color}33` : T.border,
                  }}
                >
                  {c.icon} {c.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}
        <div className="ord-detail-grid">
          {/* ITEMS */}
          <div
            className="ord-items-card"
            style={{
              background: T.card,
              borderColor: T.border,
            }}
          >
            <div
              className="ord-items-card-header"
              style={{
                borderBottomColor: T.border,
              }}
            >
              <p style={{ color: T.text }}>
                <FontAwesomeIcon icon={faReceipt} style={{ marginRight: 8 }} />
                Món trong đơn
              </p>
            </div>

            {detail.items.map((it, i) => (
              <div
                key={i}
                className="ord-item-row"
                style={{
                  borderBottomColor:
                    i < detail.items.length - 1 ? T.border : "transparent",
                }}
              >
                <div
                  className="ord-item-thumb"
                  style={{
                    background: T.primaryLight,
                  }}
                >
                  <FoodImage
                    src={it.image}
                    size={34}
                    radius={10}
                    textSize={20}
                  />
                </div>

                <div className="ord-item-info">
                  <p className="ord-item-name" style={{ color: T.text }}>
                    {it.name}
                  </p>

                  <p className="ord-item-sub" style={{ color: T.sub }}>
                    {fmt(it.price)} · x{it.qty}
                  </p>
                </div>

                <p className="ord-item-total" style={{ color: T.text }}>
                  {fmt(it.price * it.qty)}
                </p>
              </div>
            ))}
          </div>

          {/* SIDEBAR */}
          <div className="ord-sidebar">
            <div
              className="ord-sidebar-card"
              style={{
                background: T.card,
                borderColor: T.border,
              }}
            >
              <p className="ord-sidebar-card-title" style={{ color: T.text }}>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ marginRight: 8 }}
                />
                Giao đến
              </p>

              <p className="ord-address-text" style={{ color: T.sub }}>
                {detail.address || "—"}
              </p>
            </div>

            <div
              className="ord-sidebar-card"
              style={{
                background: T.card,
                borderColor: T.border,
              }}
            >
              <p className="ord-sidebar-card-title" style={{ color: T.text }}>
                <FontAwesomeIcon
                  icon={faFileLines}
                  style={{ marginRight: 8 }}
                />
                Tóm tắt
              </p>

              <div className="ord-summary-row">
                <span style={{ color: T.sub }}>Tạm tính</span>

                <span style={{ color: T.text }}>
                  {fmt(detail.subtotal ?? 0)}
                </span>
              </div>

              {detail.discount > 0 && (
                <div className="ord-summary-row">
                  <span style={{ color: T.sub }}>Giảm giá</span>

                  <span
                    style={{
                      color: T.green,
                      fontWeight: 700,
                    }}
                  >
                    -{fmt(detail.discount)}
                  </span>
                </div>
              )}

              <div
                className="ord-summary-total"
                style={{
                  borderTopColor: T.border,
                }}
              >
                <span>Tổng</span>

                <span style={{ color: T.primary }}>
                  {fmt(detail.total ?? 0)}
                </span>
              </div>
            </div>

            {detail.voucher && (
              <div
                className="ord-voucher-badge"
                style={{
                  background: T.primaryLight,
                  borderColor: `${T.primary}66`,
                }}
              >
                <p style={{ color: T.primary }}>
                  <FontAwesomeIcon icon={faTags} style={{ marginRight: 6 }} />
                  Voucher: {detail.voucher}
                </p>
              </div>
            )}

            <div
              className="ord-sidebar-card"
              style={{
                background: T.card,
                borderColor: T.border,
              }}
            >
              <p className="ord-sidebar-card-title" style={{ color: T.text }}>
                Ghi chú
              </p>

              <p className="ord-address-text" style={{ color: T.sub }}>
                {detail.note || "Không có ghi chú"}
              </p>
            </div>

            {detail.status === "pending" && (
              <button
                onClick={handleCancelOrder}
                className="ord-cancel-btn"
                style={{
                  background: T.redBg,
                  color: T.red,
                }}
              >
                Hủy đơn
              </button>
            )}

            <button
              onClick={handleReorder}
              className="ord-reorder-btn"
              style={{
                background: T.primary,
              }}
            >
              <FontAwesomeIcon
                icon={faRotateRight}
                style={{ marginRight: 6 }}
              />
              Đặt lại đơn này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
