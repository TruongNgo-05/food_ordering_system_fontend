import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../../constants/customerTheme";
import { mockMenuItems } from "../../data/mockData";
import { SectionTitle, EmptyState } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/CustomerFavorites.css";

const Favorites = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // CART
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const items = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return mockMenuItems.filter(
      (m) =>
        favorites.includes(m.id) &&
        (keyword.length === 0 ||
          m.name.toLowerCase().includes(keyword) ||
          m.desc.toLowerCase().includes(keyword)),
    );
  }, [favorites, search]);

  const cartMap = useMemo(() => {
    return Object.fromEntries(cart.map((c) => [c.item_id, c.qty]));
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.item_id === item.id);
      if (ex)
        return prev.map((c) =>
          c.item_id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );

      return [
        ...prev,
        {
          item_id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: 1,
        },
      ];
    });
  }, []);

  const decCart = useCallback((item_id) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item_id === item_id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  }, []);

  const toggleFav = useCallback((id) => {
    setFavorites((prev) => prev.filter((f) => f !== id));
  }, []);

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return (
    <div className="customer-favorites-page" style={{ background: T.bg }}>
      <div className="customer-favorites-container">
        <UserHeader
          title="Món yêu thích"
          description="Những món bạn đã lưu"
          extra={
            <div style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "10px 12px",
                  width: 250,
                }}
              >
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm trong yêu thích..."
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: T.text,
                  }}
                />
              </div>
              <button
                onClick={clearAllFavorites}
                disabled={favorites.length === 0}
                style={{
                  border: `1px solid ${T.border}`,
                  background: favorites.length > 0 ? "#fff" : T.bg,
                  color: favorites.length > 0 ? T.red : T.muted,
                  borderRadius: 10,
                  padding: "0 12px",
                  cursor: favorites.length > 0 ? "pointer" : "not-allowed",
                  fontWeight: 700,
                }}
              >
                Xóa tất cả
              </button>
            </div>
          }
        />
        <SectionTitle count={items.length}>Món yêu thích</SectionTitle>

        {items.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="Chưa có món yêu thích"
            desc="Nhấn ♡ để lưu món"
            btnLabel="Khám phá"
            onBtn={() => navigate("/customer")}
          />
        ) : (
          <div className="customer-favorites-grid">
            {items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                isFav={true}
                inCart={cartMap[item.id] || 0}
                onToggleFav={toggleFav}
                onAdd={addToCart}
                onDec={decCart}
                onClick={() => navigate(`/customer/foods/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
