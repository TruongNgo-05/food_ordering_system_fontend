import { T, fmt } from "../../constants/customerTheme";

export default function MenuItemCard({
  item,
  isFav,
  inCart,
  onToggleFav,
  onAdd,
  onDec,
  onClick,
}) {
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
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,.08)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Thumbnail */}
      <div
        style={{
          background: T.primaryLight,
          height: 130,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 62,
          position: "relative",
        }}
      >
        {item.image}
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
            fontWeight: 800,
            fontSize: 14,
            color: T.text,
            lineHeight: 1.3,
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 12,
            color: T.sub,
            lineHeight: 1.5,
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
          <span style={{ fontSize: 12, color: T.sub }}>{item.sold} bán</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 900, color: T.primary, fontSize: 16 }}>
            {fmt(item.price)}
          </span>
          {inCart > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: T.primaryLight,
                borderRadius: 10,
                padding: "4px 6px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDec(item.id, e);
                }}
                style={{
                  width: 26,
                  height: 26,
                  border: "none",
                  background: "#fff",
                  borderRadius: 7,
                  cursor: "pointer",
                  fontWeight: 800,
                  color: T.primary,
                  fontSize: 15,
                }}
              >
                −
              </button>
              <span
                style={{
                  fontWeight: 800,
                  color: T.primary,
                  minWidth: 14,
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                {inCart}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(item, e);
                }}
                style={{
                  width: 26,
                  height: 26,
                  border: "none",
                  background: T.primary,
                  borderRadius: 7,
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: 15,
                }}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item, e);
              }}
              style={{
                background: T.primary,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                width: 34,
                height: 34,
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
              }}
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
