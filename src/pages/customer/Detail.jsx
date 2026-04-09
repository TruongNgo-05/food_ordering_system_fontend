import React, { useState } from "react";
import { T, fmt } from "../../constants/customerTheme";
import { mockCategories, mockMenuItems } from "../../data/mockData";
import { SectionTitle } from "../../components/customer/SharedUI";

/**
 * DetailPage — hiển thị trong CustomerLayout khi detailItem != null.
 * Nhận onBack() thay vì setPage() để tương thích với React Router.
 */
const Detail = ({ item, cart, setCart, favorites, setFavorites, onBack }) => {
  const [qty, setQty] = useState(1);
  const isFav = favorites.includes(item.id);
  const related = mockMenuItems
    .filter((m) => m.category_id === item.category_id && m.id !== item.id)
    .slice(0, 4);
  const inCart = cart.find((c) => c.item_id === item.id)?.qty || 0;

  const addToCart = () => {
    setCart((prev) => {
      const ex = prev.find((c) => c.item_id === item.id);
      if (ex)
        return prev.map((c) =>
          c.item_id === item.id ? { ...c, qty: c.qty + qty } : c,
        );
      return [
        ...prev,
        {
          item_id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty,
        },
      ];
    });
    onBack();
  };

  return (
    <div style={{ overflowY: "auto", height: "100%", background: T.bg }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px" }}>
        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: T.sub,
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 24,
            padding: 0,
          }}
        >
          ← Quay lại thực đơn
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 36,
            background: T.card,
            borderRadius: 24,
            border: `1px solid ${T.border}`,
            overflow: "hidden",
          }}
        >
          {/* Image */}
          <div
            style={{
              background: T.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 130,
              position: "relative",
              minHeight: 340,
            }}
          >
            {item.image}
            {item.badge && (
              <span
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  background: T.primary,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "5px 14px",
                  borderRadius: 99,
                }}
              >
                {item.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div
            style={{
              padding: "36px 36px 36px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  background: T.bg,
                  color: T.sub,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: 99,
                }}
              >
                {mockCategories.find((c) => c.id === item.category_id)?.name}
              </span>
              <button
                onClick={() =>
                  setFavorites((prev) =>
                    isFav
                      ? prev.filter((f) => f !== item.id)
                      : [...prev, item.id],
                  )
                }
                style={{
                  background: T.bg,
                  border: "none",
                  borderRadius: 10,
                  width: 38,
                  height: 38,
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                {isFav ? "❤️" : "🤍"}
              </button>
            </div>

            <h1
              style={{
                margin: "10px 0 8px",
                fontSize: 26,
                fontWeight: 900,
                color: T.text,
                lineHeight: 1.2,
              }}
            >
              {item.name}
            </h1>

            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <span style={{ fontSize: 14, color: T.sub }}>
                ⭐ <strong style={{ color: T.text }}>{item.rating}</strong>
              </span>
              <span style={{ fontSize: 14, color: T.sub }}>
                🔥 <strong style={{ color: T.text }}>{item.sold}</strong> đã bán
              </span>
            </div>

            <p
              style={{
                fontSize: 14,
                color: T.sub,
                lineHeight: 1.8,
                flex: 1,
                margin: "0 0 24px",
              }}
            >
              {item.desc}
            </p>

            {/* Quantity */}
            <div
              style={{
                background: T.bg,
                borderRadius: 14,
                padding: "14px 18px",
                marginBottom: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
                Số lượng
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: `1.5px solid ${T.border}`,
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: 20,
                    minWidth: 28,
                    textAlign: "center",
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    border: "none",
                    background: T.primary,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 12, color: T.sub }}>
                  Tổng cộng
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 900,
                    color: T.primary,
                  }}
                >
                  {fmt(item.price * qty)}
                </p>
              </div>
              <button
                onClick={addToCart}
                style={{
                  flex: 1,
                  padding: "14px 24px",
                  background: T.primary,
                  color: "#fff",
                  border: "none",
                  borderRadius: 14,
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                🛒 Thêm vào giỏ hàng
              </button>
            </div>

            {inCart > 0 && (
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 13,
                  color: T.green,
                  fontWeight: 700,
                }}
              >
                ✓ Đã có {inCart} trong giỏ hàng
              </p>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <SectionTitle>Món cùng danh mục</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
              }}
            >
              {related.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: T.card,
                    borderRadius: 14,
                    border: `1px solid ${T.border}`,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      background: T.primaryLight,
                      height: 90,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 46,
                    }}
                  >
                    {r.image}
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.text,
                      }}
                    >
                      {r.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 900,
                        color: T.primary,
                      }}
                    >
                      {fmt(r.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Detail;
