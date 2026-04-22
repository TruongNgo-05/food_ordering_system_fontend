import React from "react";
import { Modal } from "antd";
import { fmt } from "../../constants/customerTheme";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/modal/CartModal.css";

const CartModal = ({
  open,
  onClose,
  cart,
  cartCount,
  cartSubtotal,
  updateQty,
  removeItem,
  isLoggedIn,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      title="Giỏ hàng"
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
    >
      {cart.length === 0 ? (
        <div className="cart-empty">
          Giỏ hàng trống. Hãy thêm món bạn thích.
        </div>
      ) : (
        <div className="cart-wrapper">
          {/* Header */}
          <div className="cart-header">
            <span>{cartCount} sản phẩm</span>
            <span>Tạm tính: {fmt(cartSubtotal)}</span>
          </div>

          {/* List */}
          <div className="cart-list">
            {cart.map((it) => (
              <div key={it.item_id} className="cart-item">
                {/* Image */}
                <div className="cart-item-img">
                  {it?.image ? <img src={it.image} alt={it.name} /> : "🍽️"}
                </div>

                {/* Info */}
                <div className="cart-item-info">
                  <div className="cart-item-name" title={it?.name}>
                    {it?.name}
                  </div>
                  <div className="cart-item-price">
                    {fmt(Number(it?.price) || 0)}
                  </div>
                </div>

                {/* Actions */}
                <div className="cart-actions">
                  <button
                    className="cart-btn cart-btn-outline"
                    onClick={() => updateQty(it.item_id, -1)}
                  >
                    −
                  </button>

                  <span className="cart-qty">{it?.qty || 0}</span>

                  <button
                    className="cart-btn cart-btn-primary"
                    onClick={() => updateQty(it.item_id, 1)}
                  >
                    +
                  </button>

                  <button
                    className="cart-btn cart-btn-outline cart-btn-remove"
                    onClick={() => removeItem(it.item_id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="cart-footer">
            <button
              className="cart-footer-btn cart-footer-btn-outline"
              onClick={() => {
                onClose();
                navigate("/customer");
              }}
            >
              Tiếp tục chọn món
            </button>

            <button
              className="cart-footer-btn cart-footer-btn-primary"
              onClick={() => {
                onClose();
                if (!isLoggedIn) {
                  confirmLoginWithModal(
                    () => navigate("/login"),
                    () => {},
                  );
                  return;
                }
                navigate("/customer/carts");
              }}
            >
              Đặt hàng
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CartModal;
