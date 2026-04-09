import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { T } from "../../constants/customerTheme";
import { EmptyState } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import Banner from "../../components/customer/Banner";
import CustomerChatWidget from "../../components/customer/CustomerChatWidget";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import {
  loadSharedFoods,
  loadSharedCategories,
  SHARED_DATA_UPDATED_EVENT,
} from "../../utils/sharedData";
import { confirmLoginWithToast } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/CustomerHome.css";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

/* ================= COMPONENT ================= */
const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

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
  const [foods, setFoods] = useState(() => loadSharedFoods());
  const [categories, setCategories] = useState(() => loadSharedCategories());
  const [activeCat, setActiveCat] = useState(1);
  const [greetingName, setGreetingName] = useState(
    () => localStorage.getItem("userFullName") || "Khách",
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pageSize = 10;

  /* ================= DEBOUNCE SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  /* ================= PERSIST ================= */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
  }, [favorites]);

  useEffect(() => {
    const syncRecentlyViewed = () => {
      const saved = localStorage.getItem("recently-viewed-foods");
      setRecentlyViewedIds(saved ? JSON.parse(saved) : []);
    };
    syncRecentlyViewed();
    window.addEventListener("focus", syncRecentlyViewed);
    return () => window.removeEventListener("focus", syncRecentlyViewed);
  }, []);

  useEffect(() => {
    const syncSharedData = () => {
      setFoods(loadSharedFoods());
      setCategories(loadSharedCategories());
    };
    syncSharedData();
    window.addEventListener("focus", syncSharedData);
    window.addEventListener("storage", syncSharedData);
    window.addEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
    return () => {
      window.removeEventListener("focus", syncSharedData);
      window.removeEventListener("storage", syncSharedData);
      window.removeEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
    };
  }, []);

  useEffect(() => {
    const syncGreetingName = () => {
      setGreetingName(localStorage.getItem("userFullName") || "Khách");
    };
    syncGreetingName();
    window.addEventListener("focus", syncGreetingName);
    window.addEventListener("storage", syncGreetingName);
    return () => {
      window.removeEventListener("focus", syncGreetingName);
      window.removeEventListener("storage", syncGreetingName);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 280);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const safeActiveCat = useMemo(
    () => (categories.some((c) => c.id === activeCat) ? activeCat : 1),
    [categories, activeCat],
  );

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return foods.filter(
      (m) =>
        (safeActiveCat === 1 || m.category_id === safeActiveCat) &&
        m.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [foods, safeActiveCat, debouncedSearch]);
  const maxPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
  const currentPage = Math.min(page, maxPage);

  const pagedItems = useMemo(() => {
    const start = currentPage * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage]);

  const recentlyViewedItems = useMemo(() => {
    if (!Array.isArray(recentlyViewedIds) || recentlyViewedIds.length === 0)
      return [];
    return recentlyViewedIds
      .map((id) => foods.find((m) => m.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyViewedIds, foods]);

  /* ================= CART MAP ================= */
  const cartMap = useMemo(() => {
    return Object.fromEntries(cart.map((c) => [c.item_id, c.qty]));
  }, [cart]);

  const requireLoginAction = useCallback(() => {
    confirmLoginWithToast(navigate);
  }, [navigate]);

  /* ================= ADD CART ================= */
  const addToCart = useCallback(
    (item) => {
      if (!isLoggedIn) {
        requireLoginAction();
        return;
      }
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
    },
    [isLoggedIn, requireLoginAction],
  );

  /* ================= DEC CART ================= */
  const decCart = useCallback((item_id) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item_id === item_id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  }, []);

  /* ================= FAVORITE ================= */
  const toggleFav = useCallback(
    (id) => {
      if (!isLoggedIn) {
        requireLoginAction();
        return;
      }
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
      );
    },
    [isLoggedIn, requireLoginAction],
  );

  const scrollToMenu = () => {
    const bannerEl = document.querySelector(".banner");
    if (!bannerEl) return;
    const bottom = bannerEl.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo({ top: Math.max(0, bottom - 35), behavior: "smooth" });
  };

  /* ================= UI ================= */
  return (
    <div className="customer-home-page" style={{ background: T.bg }}>
      <Banner onViewMenu={scrollToMenu} />

      <div id="customer-menu-header" className="customer-home-header-wrap">
        {/* HEADER */}
        <UserHeader
          title="Thực đơn"
          description={`Xin chào ${greetingName} 👋`}
          extra={
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
          {categories.map((cat) => (
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
                  safeActiveCat === cat.id
                    ? `1px solid ${T.primary}`
                    : `1px solid ${T.border}`,
                background: safeActiveCat === cat.id ? T.primary : T.card,
                color: safeActiveCat === cat.id ? "#fff" : T.text,
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
            <UserHeader
              title="Đã xem gần đây"
              description="Xem lại món bạn vừa xem"
            />
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
                  compact
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

        {filtered.length > 0 && (
          <div
            style={{ marginTop: 18, display: "flex", justifyContent: "center" }}
          >
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
      {showBackToTop && (
        <button
          type="button"
          className="back-to-top-btn"
          aria-label="Về đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="back-to-top-icon">
            <FontAwesomeIcon icon={faArrowUp} />
          </span>
          <span className="back-to-top-text">Về đầu trang</span>
        </button>
      )}
    </div>
  );
};

export default Home;
