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
import { getBanner, getCategories, getFoods } from "../../services/userService";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/CustomerHome.css";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(0);

  const [foods, setFoods] = useState([]);
  const [totalFoods, setTotalFoods] = useState(0);
  const [loadingFoods, setLoadingFoods] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

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

  const [greetingName, setGreetingName] = useState(
    () => localStorage.getItem("userFullName") || "Khách",
  );
  const [showBackToTop, setShowBackToTop] = useState(false);

  // ─── Fetch banners ───────────────────────────────────────────────
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getBanner();
        const mapped = (res.data.data || []).map((b) => ({
          id: b.id,
          title: b.title,
          desc: b.description,
          image: b.imageUrl,
        }));
        setBanners(mapped);
      } catch (err) {
        console.error("Lỗi load banner:", err);
      }
    };
    fetchBanners();
  }, []);

  // ─── Fetch categories ────────────────────────────────────────────
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const list = res.data?.data?.content || [];
        setCategories([
          { id: 0, name: "Tất cả" },
          ...list.map((c) => ({ id: c.id, name: c.name })),
        ]);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ─── Debounce search ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // reset page khi search thay đổi
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // ─── Fetch foods (gọi lại khi page / category / search thay đổi) ─
  // ─── Fetch foods ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchFoods = async () => {
      setLoadingFoods(true);
      try {
        const params = {
          page,
          size: pageSize,
          ...(activeCat !== 0 && { categoryId: activeCat }),
          ...(debouncedSearch && { name: debouncedSearch }), // ← "name" thay vì "keyword"
        };

        const res = await getFoods(params);
        const data = res.data?.data; // res.data = { data: {...}, message: "..." }

        const list = data?.content || [];
        const total = data?.totalElements ?? 0;

        const mapped = list.map((f) => ({
          id: f.id,
          name: f.name,
          price: f.price,
          image: f.image || null,
          category_id: f.categoryId,
          description: f.description,
          rating: f.rating,
          soldCount: f.soldCount,
        }));

        setFoods(mapped);
        setTotalFoods(total);
      } catch (err) {
        console.error("Lỗi load foods:", err);
        setFoods([]);
        setTotalFoods(0);
      } finally {
        setLoadingFoods(false);
      }
    };

    fetchFoods();
  }, [page, activeCat, debouncedSearch]);

  // ─── Persist cart & favorites ────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
  }, [favorites]);

  // ─── Sync recently viewed ────────────────────────────────────────
  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem("recently-viewed-foods");
      setRecentlyViewedIds(saved ? JSON.parse(saved) : []);
    };
    sync();
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  // ─── Sync greeting name ──────────────────────────────────────────
  useEffect(() => {
    const sync = () =>
      setGreetingName(localStorage.getItem("userFullName") || "Khách");
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // ─── Back-to-top button ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 280);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ─── Recently viewed (dùng foods đã load) ───────────────────────
  const recentlyViewedItems = useMemo(() => {
    if (!recentlyViewedIds.length) return [];
    return recentlyViewedIds
      .map((id) => foods.find((m) => m.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyViewedIds, foods]);

  // ─── Cart map ────────────────────────────────────────────────────
  const cartMap = useMemo(
    () => Object.fromEntries(cart.map((c) => [c.item_id, c.qty])),
    [cart],
  );

  const requireLoginAction = useCallback(() => {
    confirmLoginWithModal(navigate);
  }, [navigate]);

  // ─── Add to cart ─────────────────────────────────────────────────
  const addToCart = useCallback(
    (item) => {
      if (!isLoggedIn) {
        requireLoginAction();
        return;
      }
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
    },
    [isLoggedIn, requireLoginAction],
  );

  // ─── Dec cart ────────────────────────────────────────────────────
  const decCart = useCallback((item_id) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item_id === item_id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  }, []);

  // ─── Toggle favorite ─────────────────────────────────────────────
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

  // ─── UI ──────────────────────────────────────────────────────────
  return (
    <div className="customer-home-page" style={{ background: T.bg }}>
      <Banner data={banners} onViewMenu={scrollToMenu} />

      <div id="customer-menu-header" className="customer-home-header-wrap">
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
                onChange={(e) => setSearch(e.target.value)}
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

        {/* Categories */}
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

      {/* Menu list */}
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

        {loadingFoods ? (
          <div style={{ textAlign: "center", padding: 40, color: T.textSub }}>
            Đang tải...
          </div>
        ) : foods.length === 0 ? (
          <EmptyState title="Không có món" desc="Thử lại nhé" />
        ) : (
          <div className="customer-home-menu-grid">
            {foods.map((item) => (
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

        {totalFoods > 0 && (
          <div
            style={{ marginTop: 18, display: "flex", justifyContent: "center" }}
          >
            <AppPagination
              page={page}
              size={pageSize}
              total={totalFoods}
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
