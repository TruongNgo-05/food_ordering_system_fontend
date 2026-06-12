import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "antd";

import UserHeader from "../../components/user/UserHeader";
import FoodImage from "../../components/common/FoodImage";
import PaymentMethodSection from "../../components/customer/cart/PaymentMethodSection";

import { T, fmt } from "../../constants/customerTheme";
import tableService from "../../services/user/tableService";

import "../../assets/styles/CustomerTableOrder.css";

const TABLE_ORDER_STORAGE_KEY = "table-orders";

const TableOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tableFromQr = searchParams.get("table") || "";

  const [tableNumber, setTableNumber] = useState(tableFromQr);
  const [foods, setFoods] = useState([]);
  const [tableInfo, setTableInfo] = useState(null);
  const [qtyMap, setQtyMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderFormData, setOrderFormData] = useState({
    name: "",
    phone: "",
    note: "",
    paymentMethod: "AT_TABLE",
  });
  const [openQrModal, setOpenQrModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const PAYMENT_METHOD_MAP = {
    COD: 1,
    ONLINE: 2,
    AT_TABLE: 3,
  };
  useEffect(() => {
    loadMenuTable();
  }, [tableFromQr]);

  const loadMenuTable = async () => {
    try {
      setLoading(true);

      const res = await tableService.menuTable({
        table: tableFromQr,
      });

      setFoods(res.data.foods || []);
      setTableInfo(res.data.table || null);

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

      toast.success("Đặt món thành công");

      setQtyMap({});

      setOrderFormData({
        name: "",
        phone: "",
        note: "",
        paymentMethod: "AT_TABLE",
      });

      setShowOrderModal(false);

      setOrderInfo(orderData);

      if (paymentMethodId === 2 && orderData.paymentUrl) {
        setPaymentUrl(orderData.paymentUrl);
        setOpenQrModal(true);
        return;
      }

      navigate(`/table-order?table=${tableNumber}`);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Không thể tạo đơn hàng");
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

        <div className="table-order-grid">
          {foods.map((food) => {
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

        <Modal
          title="Thông tin gọi món"
          open={showOrderModal}
          onCancel={() => setShowOrderModal(false)}
          onOk={confirmOrderSubmit}
          okText="Xác nhận"
          cancelText="Hủy"
          centered
          width={500}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Họ tên
              </label>
              <input
                type="text"
                placeholder="Nhập họ tên"
                value={orderFormData.name}
                onChange={(e) => handleFormInputChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                placeholder="Nhập số điện thoại (10 chữ số)"
                value={orderFormData.phone}
                onChange={(e) => handleFormInputChange("phone", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                Ghi chú
              </label>
              <textarea
                placeholder="Nhập ghi chú (tùy chọn)"
                value={orderFormData.note}
                onChange={(e) => handleFormInputChange("note", e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <PaymentMethodSection
              payMethod={orderFormData.paymentMethod}
              onChangePayMethod={(method) =>
                handleFormInputChange("paymentMethod", method)
              }
              allowedMethods={["ONLINE", "AT_TABLE"]}
            />
          </div>
        </Modal>
        <Modal
          title="Thanh toán SePay"
          open={openQrModal}
          footer={null}
          onCancel={() => setOpenQrModal(false)}
          centered
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={paymentUrl}
              alt="QR Payment"
              style={{
                width: 280,
                maxWidth: "100%",
              }}
            />

            <p style={{ marginTop: 16 }}>Quét mã QR để thanh toán</p>

            {orderInfo && (
              <>
                <p>
                  Mã đơn:
                  <strong>{orderInfo.orderCode}</strong>
                </p>

                <p>
                  Tổng tiền:
                  <strong>{fmt(orderInfo.totalPrice)}</strong>
                </p>
              </>
            )}

            <button
              className="cart-qr-confirm-btn"
              onClick={() => {
                setOpenQrModal(false);
                navigate(`/table-order?table=${tableNumber}`);
              }}
            >
              Quay lại menu
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TableOrder;
