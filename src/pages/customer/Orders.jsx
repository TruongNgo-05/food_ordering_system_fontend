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
import AppPagination from "../../components/common/AppPagination";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";

import "../../assets/styles/CustomerOrders.css";
import CustomerSearch from "../../components/common/CustomerSearch";
import orderService from "../../services/customer/orderService";

const STATUS_MAP = {
  PENDING: "pending",
  PROCESSING: "processing",
  DELIVERING: "delivering",
  COMPLETED: "completed",
  CANCELED: "cancelled",
  CANCELLED: "cancelled",
};

const BACKEND_STATUS = {
  pending: "PENDING",
  processing: "PROCESSING",
  delivering: "DELIVERING",
  completed: "COMPLETED",
  cancelled: "CANCELED",
};

const Orders = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchCode, setSearchCode] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      confirmLoginWithModal(navigate, () => navigate("/customer"));
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (minDate && maxDate && minDate > maxDate) {
        return;
      }

      fetchOrders();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, searchCode, filterStatus, minDate, maxDate]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString("vi-VN") : "";

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        size,
      };

      const keyword = searchCode.trim();

      if (keyword) {
        params.orderCode = keyword;
      }

      if (filterStatus !== "all") {
        params.status = BACKEND_STATUS[filterStatus];
      }

      if (minDate) {
        params.minDate = minDate;
      }

      if (maxDate) {
        params.maxDate = maxDate;
      }

      const res = await orderService.myOrders(params);

      const data = res.data?.data;

      const mapped = (data?.content || []).map((order) => ({
        id: order.orderId,
        orderCode: order.orderCode,
        status: STATUS_MAP[order.status] || "pending",
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
      setPage(data.number);
      setTotal(data.totalElements);
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
        };
      }

      return {
        key: k,
        label: STATUS_CFG[k].label,
        icon: STATUS_CFG[k].icon,
      };
    });
  }, []);

  return (
    <div className="customer-orders-page" style={{ background: T.bg }}>
      <div className="customer-orders-container">
        <UserHeader title="Đơn hàng của tôi" description={`${total} đơn`} />

        <CustomerSearch
          placeholder="Tìm mã đơn..."
          keyword={searchCode}
          onKeywordChange={(value) => {
            setPage(0);
            setSearchCode(value);
          }}
          showDate
          minDate={minDate}
          maxDate={maxDate}
          onMinDateChange={(value) => {
            setPage(0);
            setMinDate(value);
          }}
          onMaxDateChange={(value) => {
            setPage(0);
            setMaxDate(value);
          }}
        />

        <div className="ord-filter-bar">
          {filters.map((f) => {
            const active = filterStatus === f.key;

            return (
              <button
                key={f.key}
                onClick={() => {
                  setPage(0);
                  setFilterStatus(f.key);
                }}
                className="ord-filter-btn"
                style={{
                  borderColor: active ? T.primary : T.border,
                  background: active ? T.primaryLight : "transparent",
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
              padding: 40,
              color: T.sub,
            }}
          >
            Đang tải đơn hàng...
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<FontAwesomeIcon icon={faBoxOpen} />}
            title="Chưa có đơn hàng"
            desc="Hãy đặt món để xem lịch sử đơn hàng."
            btnLabel="Xem thực đơn"
            onBtn={() => navigate("/customer")}
          />
        ) : (
          <div className="ord-list">
            {orders.map((order) => {
              const first = order.items?.[0];

              const itemCount =
                order.items?.reduce((s, it) => s + (it.qty || 0), 0) ?? 0;

              return (
                <div
                  key={order.id}
                  className="ord-card"
                  onClick={() => navigate(`/customer/orders/${order.id}`)}
                  style={{
                    background: T.card,
                    borderColor: T.border,
                  }}
                >
                  <div className="ord-card-left">
                    <div
                      className="ord-card-thumb"
                      style={{ background: T.primaryLight }}
                    >
                      <FoodImage
                        src={first?.image || "🍽️"}
                        size={38}
                        radius={12}
                        textSize={22}
                      />
                    </div>

                    <div className="ord-card-info">
                      <p className="ord-card-title" style={{ color: T.text }}>
                        #{order.orderCode} · {fmt(order.total ?? 0)}
                      </p>

                      <p className="ord-card-meta" style={{ color: T.sub }}>
                        <FontAwesomeIcon
                          icon={faClock}
                          style={{ marginRight: 6 }}
                        />
                        {order.created_at} · {itemCount} món
                      </p>
                    </div>
                  </div>

                  <div className="ord-card-right">
                    <StatusBadge status={order.status} />

                    <p className="ord-card-payment" style={{ color: T.sub }}>
                      <FontAwesomeIcon
                        icon={
                          order.payment_method === "ONLINE"
                            ? faBuildingColumns
                            : faMoneyBillWave
                        }
                        style={{ marginRight: 6 }}
                      />

                      {order.payment_method === "ONLINE"
                        ? "Thanh toán online"
                        : "Thanh toán tiền mặt"}
                    </p>

                    <button
                      className="ord-card-reorder-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReorder(order);
                      }}
                    >
                      Đặt lại
                    </button>

                    {order.status === "pending" && (
                      <button
                        className="ord-card-cancel-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order.id);
                        }}
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
        <AppPagination
          page={page}
          size={size}
          total={total}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};

export default Orders;
