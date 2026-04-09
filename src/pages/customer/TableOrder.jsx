import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserHeader from "../../components/user/UserHeader";
import FoodImage from "../../components/common/FoodImage";
import { T, fmt } from "../../constants/customerTheme";
import { loadSharedFoods } from "../../utils/sharedData";
import "../../assets/styles/CustomerTableOrder.css";

const TABLE_ORDER_STORAGE_KEY = "table-orders";

const TableOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableFromQr = searchParams.get("table") || "";
  const [tableNumber, setTableNumber] = useState(tableFromQr);
  const [foods] = useState(() => loadSharedFoods());
  const [qtyMap, setQtyMap] = useState({});

  const selectedItems = useMemo(() => {
    return foods
      .filter((food) => (qtyMap[food.id] || 0) > 0)
      .map((food) => ({ ...food, qty: qtyMap[food.id] }));
  }, [foods, qtyMap]);

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [selectedItems],
  );

  const updateQty = (foodId, delta) => {
    setQtyMap((prev) => {
      const next = Math.max(0, (prev[foodId] || 0) + delta);
      if (next === 0) {
        const clone = { ...prev };
        delete clone[foodId];
        return clone;
      }
      return { ...prev, [foodId]: next };
    });
  };

  const submitTableOrder = () => {
    if (!tableNumber.trim()) {
      toast.warning("Vui lòng nhập số bàn");
      return;
    }
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 món");
      return;
    }

    const payload = {
      id: `TBL-${Date.now()}`,
      tableNumber: tableNumber.trim(),
      createdAt: new Date().toLocaleString("vi-VN"),
      status: "pending",
      source: "dine_in_qr",
      items: selectedItems.map((item) => ({
        item_id: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      })),
      subtotal,
      total: subtotal,
    };

    try {
      const raw = localStorage.getItem(TABLE_ORDER_STORAGE_KEY);
      const prev = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(prev) ? [payload, ...prev] : [payload];
      localStorage.setItem(TABLE_ORDER_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("customer-data-updated"));
      toast.success(`Đã gửi gọi món cho bàn ${payload.tableNumber}`);
      setQtyMap({});
      navigate("/customer");
    } catch {
      toast.error("Không thể gửi gọi món, vui lòng thử lại");
    }
  };

  return (
    <div className="customer-table-order-page" style={{ background: T.bg }}>
      <div className="customer-table-order-container">
        <UserHeader
          title="Gọi món tại bàn"
          description="Quét QR và chọn món trực tiếp tại nhà hàng"
          extra={
            <div className="table-order-table-input-wrap">
              <label>Số bàn</label>
              <input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Ví dụ: B12"
              />
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
      </div>
    </div>
  );
};

export default TableOrder;
