import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faClock,
  faBuildingColumns,
  faMoneyBillWave,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";

import { T, fmt, STATUS_CFG } from "../../constants/customerTheme";
import { EmptyState, StatusBadge } from "../../components/customer/SharedUI";
import UserHeader from "../../components/user/UserHeader";
import FoodImage from "../../components/common/FoodImage";

import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";

import "../../assets/styles/CustomerOrders.css";

import orderService from "../../services/customer/orderService";

const Orders = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchCode, setSearchCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!isLoggedIn) {
      confirmLoginWithModal(navigate, () => navigate("/customer"));
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const mapStatusToBackend = (status) => {
    switch (status) {
      case "pending":
        return "PENDING";

      case "processing":
        return "PROCESSING";

      case "delivering":
        return "DELIVERING";

      case "completed":
        return "COMPLETED";

      case "cancelled":
        return "CANCELLED";

      default:
        return null;
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("vi-VN");
  };

  const fetchOrders = async (
    page = 0,
    status = filterStatus,
    orderCode = searchCode,
  ) => {
    try {
      setLoading(true);

      const params = {
        page,
        size: 20,
      };

      if (orderCode?.trim()) {
        params.orderCode = orderCode.trim();
      }

      if (status !== "all") {
        params.status = mapStatusToBackend(status);
      }

      const res = await orderService.myOrders(params);

      const content = res.data?.data?.content || [];

      const mapped = content.map((order) => ({
        id: order.orderId,

        orderCode: order.orderCode,

        status: mapStatus(order.status),

        total: order.totalPrice,

        created_at: formatDate(order.createdAt),

        payment_method:
          order.payment?.paymentMethodType === "ONLINE"
            ? "ONLINE"
            : order.payment?.paymentMethodType === "AT_TABLE"
              ? "AT_TABLE"
              : "COD",

        payment_status:
          order.payment?.paymentStatus === "PAID" ? "paid" : "pending",

        items: (order.items || []).map((item) => ({
          id: item.foodId,
          name: item.foodName,
          image: item.image,
          price: item.price,
          qty: item.quantity,
        })),
      }));

      setOrders(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (order) => {
    try {
      await orderService.reorderOrder(order.id);

      navigate("/customer/carts");
    } catch (error) {
      console.error(error);
      alert("Không thể đặt lại đơn");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);

      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Không thể hủy đơn");
    }
  };

  const safeOrders = useMemo(
    () => (Array.isArray(orders) ? orders : []),
    [orders],
  );

  const filtered = useMemo(() => safeOrders, [safeOrders]);

  const filters = useMemo(() => {
    const steps = [
      "all",
      "pending",
      "processing",
      "delivering",
      "completed",
      "cancelled",
    ];

    return steps.map((k) => {
      if (k === "all") {
        return {
          key: "all",
          label: "Tất cả",
          icon: <FontAwesomeIcon icon={faListCheck} />,
          color: T.text,
          bg: "#fff",
        };
      }

      const cfg = STATUS_CFG[k];

      return {
        key: k,
        label: cfg.label,
        icon: cfg.icon,
        color: cfg.color,
        bg: cfg.bg,
      };
    });
  }, []);

  return (
    <div className="customer-orders-page" style={{ background: T.bg }}>
      <div className="customer-orders-container">
        <UserHeader
          title="Đơn hàng của tôi"
          description={`${safeOrders.length} đơn`}
        />

        <div className="ord-search">
          <input
            type="text"
            placeholder="Tìm mã đơn..."
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchOrders(0, filterStatus, e.target.value);
              }
            }}
          />

          <button onClick={() => fetchOrders(0, filterStatus, searchCode)}>
            Tìm kiếm
          </button>
        </div>

        <div className="ord-filter-bar">
          {filters.map((f) => {
            const active = filterStatus === f.key;

            return (
              <button
                key={f.key}
                onClick={() => {
                  setFilterStatus(f.key);

                  fetchOrders(0, f.key, searchCode);
                }}
                className="ord-filter-btn"
                style={{
                  borderColor: active ? T.primary : T.border,
                  background: active ? T.primaryLight : "#fff",
                  color: active ? T.primary : T.text,
                }}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: T.sub,
            }}
          >
            Đang tải đơn hàng...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FontAwesomeIcon icon={faBoxOpen} />}
            title="Chưa có đơn hàng"
            desc="Hãy đặt món để xem lịch sử đơn hàng."
            btnLabel="Xem thực đơn"
            onBtn={() => navigate("/customer")}
          />
        ) : (
          <div className="ord-list">
            {filtered.map((order) => {
              const first = order.items?.[0];

              const itemCount = Array.isArray(order.items)
                ? order.items.reduce((s, it) => s + (it.qty || 0), 0)
                : 0;

              return (
                <div
                  key={order.id}
                  onClick={() => navigate(`/customer/orders/${order.id}`)}
                  className="ord-card"
                  style={{
                    background: T.card,
                    borderColor: T.border,
                  }}
                >
                  <div className="ord-card-left">
                    <div
                      className="ord-card-thumb"
                      style={{
                        background: T.primaryLight,
                      }}
                    >
                      <FoodImage
                        src={first?.image || "🍽️"}
                        size={38}
                        radius={12}
                        textSize={22}
                      />
                    </div>

                    <div className="ord-card-info">
                      <p
                        className="ord-card-title"
                        style={{
                          color: T.text,
                        }}
                      >
                        #{order.orderCode} · {fmt(order.total ?? 0)}
                      </p>

                      <p
                        className="ord-card-meta"
                        style={{
                          color: T.sub,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{
                            marginRight: 6,
                          }}
                        />
                        {order.created_at}
                        {" · "}
                        {itemCount} món
                      </p>
                    </div>
                  </div>

                  <div className="ord-card-right">
                    <StatusBadge status={order.status} />

                    <p
                      className="ord-card-payment"
                      style={{
                        color: T.sub,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={
                          order.payment_method === "ONLINE"
                            ? faBuildingColumns
                            : faMoneyBillWave
                        }
                        style={{
                          marginRight: 6,
                        }}
                      />

                      {order.payment_method === "ONLINE"
                        ? "Online"
                        : order.payment_method === "AT_TABLE"
                          ? "Tại bàn"
                          : "COD"}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order);
                      }}
                      className="ord-card-reorder-btn"
                    >
                      Đặt lại
                    </button>

                    {order.status === "pending" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order.id);
                        }}
                        className="ord-card-cancel-btn"
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
