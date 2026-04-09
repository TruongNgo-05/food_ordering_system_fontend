import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { T } from "../../constants/customerTheme";
import { EmptyState } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import Banner from "../../components/customer/Banner";
import CustomerChatWidget from "../../components/customer/CustomerChatWidget";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import { mockCategories, mockMenuItems } from "../../data/mockData";
import "../../assets/styles/CustomerHome.css";

/* ================= COMPONENT ================= */
const Home = () => {
  const navigate = useNavigate();
  const { tableNo } = useParams();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    const saved = localStorage.getItem("recently-viewed-foods");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeCat, setActiveCat] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const activeTable = useMemo(() => {
    if (tableNo) return String(tableNo).trim().toUpperCase();
    const saved = localStorage.getItem("active-table");
    return saved || null;
  }, [tableNo]);

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  /* ================= PERSIST ================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (tableNo) {
      const formatted = String(tableNo).trim().toUpperCase();
      localStorage.setItem("active-table", formatted);
    } else {
      localStorage.removeItem("active-table");
    }
  }, [tableNo]);

  useEffect(() => {
    const syncRecentlyViewed = () => {
      const saved = localStorage.getItem("recently-viewed-foods");
      setRecentlyViewedIds(saved ? JSON.parse(saved) : []);
    };
    syncRecentlyViewed();
    window.addEventListener("focus", syncRecentlyViewed);
    return () => window.removeEventListener("focus", syncRecentlyViewed);
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return mockMenuItems.filter(
      (m) =>
        (activeCat === 1 || m.category_id === activeCat) &&
        m.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [activeCat, debouncedSearch]);
  const maxPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
  const currentPage = Math.min(page, maxPage);

  const pagedItems = useMemo(() => {
    const start = currentPage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const recentlyViewedItems = useMemo(() => {
    if (!Array.isArray(recentlyViewedIds) || recentlyViewedIds.length === 0) return [];
    return recentlyViewedIds
      .map((id) => mockMenuItems.find((m) => m.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyViewedIds]);

  /* ================= CART MAP ================= */
  const cartMap = useMemo(() => {
    return Object.fromEntries(cart.map((c) => [c.item_id, c.qty]));
  }, [cart]);

  /* ================= ADD CART ================= */
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.item_id === item.id);
      if (ex) {
        return prev.map((c) =>
          c.item_id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
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

  /* ================= DEC CART ================= */
  const decCart = useCallback((item_id) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item_id === item_id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  }, []);

  /* ================= FAVORITE ================= */
  const toggleFav = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  const scrollToMenu = () => {
    const menuSection = document.getElementById("customer-menu-header");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const clearTableMode = () => {
    localStorage.removeItem("active-table");
    navigate("/customer");
  };

  /* ================= UI ================= */
  return (
    <div className="customer-home-page" style={{ background: T.bg }}>
      <Banner onOrderNow={scrollToMenu} />

      <div id="customer-menu-header" className="customer-home-header-wrap">
        {/* HEADER */}
        <UserHeader
          title="Thực đơn"
          description={
            activeTable
              ? `Đang phục vụ tại bàn ${activeTable} · Chào bạn 👋`
              : "Xin chào 👋"
          }
          extra={
            <div style={{ display: "flex", gap: 10 }}>
              {activeTable && (
                <button
                  onClick={clearTableMode}
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    background: "#fff",
                    color: T.sub,
                    fontWeight: 700,
                    padding: "0 12px",
                    cursor: "pointer",
                  }}
                  title="Rời chế độ gọi món tại bàn"
                >
                  Rời bàn
                </button>
              )}
              <div
                style={{
                  background: T.card,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: "10px 12px",
                  width: 260,
                }}
              >
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Tìm món..."
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: T.text,
                  }}
                />
              </div>
            </div>
          }
        />

        {/* CATEGORY */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCat(cat.id);
                setPage(0);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border:
                  activeCat === cat.id
                    ? `1px solid ${T.primary}`
                    : `1px solid ${T.border}`,
                background: activeCat === cat.id ? T.primary : T.card,
                color: activeCat === cat.id ? "#fff" : T.text,
                cursor: "pointer",
                transition: "0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div id="customer-menu-section" className="customer-home-content-wrap">
        {recentlyViewedItems.length > 0 && (
          <div className="customer-home-recent-section">
            <UserHeader title="Đã xem gần đây" description="Xem lại món bạn vừa xem" />
            <div className="customer-home-recent-grid">
              {recentlyViewedItems.map((item) => (
                <MenuItemCard
                  key={`recent-${item.id}`}
                  item={item}
                  isFav={favorites.includes(item.id)}
                  inCart={cartMap[item.id] || 0}
                  onToggleFav={toggleFav}
                  onAdd={addToCart}
                  onDec={decCart}
                  onClick={() => navigate(`/customer/foods/${item.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState title="Không có món" desc="Thử lại nhé" />
        ) : (
          <div className="customer-home-menu-grid">
            {pagedItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                isFav={favorites.includes(item.id)}
                inCart={cartMap[item.id] || 0}
                onToggleFav={toggleFav}
                onAdd={addToCart}
                onDec={decCart}
                onClick={() => navigate(`/customer/foods/${item.id}`)}
              />
            ))}
          </div>
        )}

        {filtered.length > pageSize && (
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
            <AppPagination
              page={currentPage}
              size={pageSize}
              total={filtered.length}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        )}
      </div>
      <CustomerChatWidget />
    </div>
  );
};

export default Home;
