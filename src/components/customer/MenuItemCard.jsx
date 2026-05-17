import { useState } from "react";
import { T, fmt } from "../../constants/customerTheme";
import FoodImage from "../common/FoodImage";

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
  const cardMaxWidth = compact ? 236 : 280;
  const thumbHeight = compact ? 220 : 270;
  const imageTextSize = compact ? 62 : 72;

  return (
    <div
      onClick={onClick}
      style={{
        background: T.card,
        borderRadius: 18,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow .2s",
        width: "100%",
        maxWidth: cardMaxWidth,
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,.08)";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          background: T.primaryLight,
          height: thumbHeight,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            transition: "transform .35s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        >
          <FoodImage
            src={item.image}
            size="100%"
            radius={0}
            textSize={imageTextSize}
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(item.id, e);
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(255,255,255,.92)",
            border: "none",
            borderRadius: 99,
            width: 32,
            height: 32,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <p
          style={{
            margin: "0 0 4px",
            fontWeight: 700,
            fontSize: compact ? 13 : 15,
            color: T.text,
            lineHeight: 1.3,
            letterSpacing: 0.1,
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: compact ? 11 : 13,
            fontWeight: 500,
            color: T.sub,
            lineHeight: 1.55,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.desc}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <span style={{ color: "#FBBF24", fontSize: 12 }}>★</span>
          <span style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>
            {item.rating}
          </span>
          <span style={{ color: T.border }}>·</span>
          <span style={{ fontSize: 12, color: T.sub }}>
            {item.soldCount ?? 0} Đã bán
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontWeight: 800,
              color: T.primary,
              fontSize: compact ? 16 : 18,
            }}
          >
            {fmt(item.price)}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item, e);
            }}
            style={{
              flex: 1,
              border: "none",
              borderRadius: 10,
              background: T.primary,
              color: "#fff",
              fontWeight: 800,
              padding: "9px 10px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Thêm vào giỏ hàng
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            style={{
              flex: 1,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              background: "#fff",
              color: T.text,
              fontWeight: 700,
              padding: "9px 10px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
