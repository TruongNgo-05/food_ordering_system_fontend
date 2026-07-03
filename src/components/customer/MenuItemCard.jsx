import { useState } from "react";
import { T, fmt } from "../../constants/customerTheme";
import FoodImage from "../common/FoodImage";
import "../../assets/styles/MenuItemCard.css";

export default function MenuItemCard({
  item,
  isFav,
  inCart,
  onToggleFav,
  onAdd,
  onClick,
  compact = false,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`menu-item-card ${compact ? "compact" : "normal"}`}
      style={{ backgroundColor: T.card, borderColor: T.border }}
    >
      {/* Thumbnail */}
      <div
        className="menu-item-thumbnail"
        style={{ background: T.primaryLight }}
      >
        <div className="menu-item-thumbnail-img">
          <FoodImage
            src={item.image}
            size="100%"
            radius={0}
            textSize={compact ? 62 : 72}
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(item.id, e);
          }}
          className="menu-item-fav-btn"
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Info */}
      <div className="menu-item-info">
        <p
          className={`menu-item-name ${compact ? "compact" : "normal"}`}
          style={{ color: T.text }}
        >
          {item.name}
        </p>
        <p
          className={`menu-item-desc ${compact ? "compact" : "normal"}`}
          style={{ color: T.sub }}
        >
          {item.desc}
        </p>
        <div className="menu-item-rating">
          <span className="menu-item-rating-star">★</span>
          <span className="menu-item-rating-value">{item.rating}</span>
          <span className="menu-item-rating-sep">·</span>
          <span className="menu-item-rating-sold">
            {item.soldCount ?? 0} Đã bán
          </span>
        </div>
        <div className="menu-item-price-row">
          <span
            className={`menu-item-price ${compact ? "compact" : "normal"}`}
            style={{ color: T.primary }}
          >
            {fmt(item.price)}
          </span>
        </div>

        <div className="menu-item-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item, e);
            }}
            className="menu-item-action-btn add"
            style={{ backgroundColor: T.primary }}
          >
            Thêm vào giỏ hàng
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            className="menu-item-action-btn detail"
            style={{ borderColor: T.border, color: T.text }}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
