import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import UserHeader from "../../components/user/UserHeader";
import FoodImage from "../../components/common/FoodImage";
import Categories from "../../components/common/Categories";
import TableOrderModal from "../../components/user/TableOrderModal";

import { T, fmt } from "../../constants/customerTheme";
import { getCategories } from "../../services/userService";
import tableService from "../../services/user/tableService";

import "../../assets/styles/CustomerTableOrder.css";
import Footer from "../../layouts/Footer";
import PaymentQrModal from "../../components/customer/PaymentQrModal";
import sepayService from "../../services/sepayService";
import ConfirmOrderModal from "../../components/user/ConfirmOrderModal";

const TableOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tableFromQr = searchParams.get("table") || "";

  const [tableNumber, setTableNumber] = useState(tableFromQr);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [qtyMap, setQtyMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);

  const [ordering, setOrdering] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    name: "",
    phone: "",
    note: "",
    paymentMethod: "AT_TABLE",
  });
  const [countdown, setCountdown] = useState(60);
  const [openQrModal, setOpenQrModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderCode, setOrderCode] = useState("");
  const PAYMENT_METHOD_MAP = {
    COD: 1,
    ONLINE: 2,
    AT_TABLE: 3,
  };
  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      const list = res.data?.data?.content || [];

      setCategories([
        { id: 0, name: "Tất cả" },
        ...list.map((cat) => ({ id: cat.id, name: cat.name })),
      ]);
    } catch (err) {
      console.error("Lỗi load categories:", err);
    }
  };

  useEffect(() => {
    if (tableFromQr) {
      loadMenuTable();
      fetchCategories();
    } else {
      setLoading(false);
      toast.warning("Không tìm thấy thông tin bàn");
    }
  }, [tableFromQr]);

  useEffect(() => {
    if (!openQrModal || !orderCode) return;

    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);

          handleExpireQr();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [openQrModal, orderCode]);

  const handleExpireQr = async () => {
    try {
      await sepayService.deletePendingOrder(orderCode);

      toast.warning("Mã QR đã hết hạn");
    } catch (err) {
      console.log(err);
    } finally {
      setOpenQrModal(false);
      setPaymentUrl("");
      setOrderCode("");
      setCountdown(60);
    }
  };
  useEffect(() => {
    if (!openQrModal || !orderCode) return;

    const interval = setInterval(async () => {
      try {
        const res = await sepayService.getPaymentStatus(orderCode);

        const data = res.data?.data || res.data;

        if (data.paymentStatus === "PAID") {
          clearInterval(interval);

          setOpenQrModal(false);
          setPaymentUrl("");
          setOrderCode("");
          setCountdown(60);

          toast.success("Thanh toán thành công");

          await loadMenuTable();

          navigate(`/table-order?table=${tableNumber}`);
        }
      } catch (err) {
        console.log(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [openQrModal, orderCode]);
  const loadMenuTable = async () => {
    try {
      setLoading(true);

      const res = await tableService.menuTable({
        table: tableFromQr,
      });

      const fetchedFoods = res.data.foods || [];
      setFoods(fetchedFoods);

      if (res.data.table?.tableNumber) {
        setTableNumber(res.data.table.tableNumber);
      }
    } catch (error) {
      console.error(error);
      toast.error("Không tải được menu");
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = useMemo(() => {
    if (activeCategory === 0) {
      return foods;
    }

    return foods.filter(
      (food) =>
        food.categoryId === activeCategory ||
        food.category_id === activeCategory,
    );
  }, [foods, activeCategory]);

  const selectedItems = useMemo(() => {
    return foods
      .filter((food) => (qtyMap[food.id] || 0) > 0)
      .map((food) => ({
        ...food,
        qty: qtyMap[food.id],
      }));
  }, [foods, qtyMap]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [selectedItems]);

  const updateQty = (foodId, delta) => {
    setQtyMap((prev) => {
      const next = Math.max(0, (prev[foodId] || 0) + delta);

      if (next === 0) {
        const clone = { ...prev };
        delete clone[foodId];
        return clone;
      }

      return {
        ...prev,
        [foodId]: next,
      };
    });
  };

  const submitTableOrder = () => {
    if (!tableNumber.trim()) {
      toast.warning("Không tìm thấy số bàn");
      return;
    }

    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 món");
      return;
    }

    setShowOrderModal(true);
  };

  const handleFormInputChange = (field, value) => {
    setOrderFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const confirmOrderSubmit = async () => {
    if (ordering) return;

    if (!orderFormData.name.trim()) {
      toast.warning("Vui lòng nhập họ tên");
      return;
    }

    if (!orderFormData.phone.trim()) {
      toast.warning("Vui lòng nhập số điện thoại");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(orderFormData.phone.trim())) {
      toast.warning("Số điện thoại không hợp lệ");
      return;
    }

    try {
      setOrdering(true);

      const paymentMethodId = PAYMENT_METHOD_MAP[orderFormData.paymentMethod];

      const payload = {
        tableNumber: tableNumber.trim(),
        paymentMethodId,
        customerName: orderFormData.name.trim(),
        customerPhone: orderFormData.phone.trim(),
        note: orderFormData.note.trim(),
        items: selectedItems.map((item) => ({
          foodId: item.id,
          quantity: item.qty,
        })),
      };

      const response = await tableService.orderTable(payload);

      const orderData = response.data.data;

      setQtyMap({});

      setOrderFormData({
        name: "",
        phone: "",
        note: "",
        paymentMethod: "AT_TABLE",
      });

      setShowConfirmOrderModal(false);
      setShowOrderModal(false);

      setOrderInfo(orderData);

      // ================================
      // ONLINE
      // ================================
      if (paymentMethodId === 2 && orderData.paymentUrl) {
        setPaymentUrl(orderData.paymentUrl);
        setOrderCode(orderData.orderCode);
        setCountdown(60);
        setOpenQrModal(true);

        return;
      }

      // ================================
      // AT TABLE
      // ================================
      toast.success("Đặt món thành công");

      await loadMenuTable();

      navigate(`/table-order?table=${tableNumber}`);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Không thể tạo đơn hàng");
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="customer-table-order-page" style={{ background: T.bg }}>
        <div className="customer-table-order-container">
          <h3>Đang tải menu...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-table-order-page" style={{ background: T.bg }}>
      <div className="customer-table-order-container">
        <UserHeader
          title="Gọi món tại bàn"
          description="Quét QR và chọn món trực tiếp tại nhà hàng"
          extra={
            <div className="table-order-table-input-wrap">
              <label>Số bàn</label>

              <input value={tableNumber} readOnly />
            </div>
          }
        />

        <Categories
          categories={categories}
          activeCategoryId={activeCategory}
          onChange={(id) => setActiveCategory(id)}
        />

        <div className="table-order-grid">
          {filteredFoods.map((food) => {
            const qty = qtyMap[food.id] || 0;

            return (
              <div className="table-order-card" key={food.id}>
                <div className="table-order-card-top">
                  <FoodImage
                    src={food.image}
                    size={68}
                    radius={12}
                    textSize={34}
                  />

                  <div className="table-order-meta">
                    <p className="name">{food.name}</p>

                    <p className="price">{fmt(food.price)}</p>
                  </div>
                </div>

                <div className="table-order-actions">
                  <button
                    onClick={() => updateQty(food.id, -1)}
                    disabled={qty === 0}
                  >
                    −
                  </button>

                  <span>{qty}</span>

                  <button onClick={() => updateQty(food.id, 1)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="table-order-summary">
          <p>
            Món đã chọn: <strong>{selectedItems.length}</strong>
          </p>

          <p>
            Tạm tính: <strong>{fmt(subtotal)}</strong>
          </p>

          <button onClick={submitTableOrder}>Gửi gọi món</button>
        </div>

        <TableOrderModal
          open={showOrderModal}
          onCancel={() => setShowOrderModal(false)}
          onConfirm={() => {
            setShowOrderModal(false);
            setShowConfirmOrderModal(true);
          }}
          orderFormData={orderFormData}
          onChange={handleFormInputChange}
        />
        <ConfirmOrderModal
          open={showConfirmOrderModal}
          loading={ordering}
          onCancel={() => {
            if (!ordering) {
              setShowConfirmOrderModal(false);
              setShowOrderModal(true);
            }
          }}
          onConfirm={confirmOrderSubmit}
        />
        <PaymentQrModal
          open={openQrModal}
          paymentUrl={paymentUrl}
          orderCode={orderCode}
          totalPrice={fmt(orderInfo?.totalPrice || 0)}
          countdown={countdown}
          showCountdown={true}
          onCancel={async () => {
            try {
              await sepayService.deletePendingOrder(orderCode);
            } catch (e) {}

            setOpenQrModal(false);
            setPaymentUrl("");
            setOrderCode("");
            setCountdown(60);
          }}
        />
      </div>
      <Footer />
    </div>
  );
};

export default TableOrder;
