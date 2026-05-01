import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { T } from "../../constants/customerTheme";
import { EmptyState } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import Banner from "../../components/customer/Banner";
import CustomerChatWidget from "../../components/customer/CustomerChatWidget";
import UserHeader from "../../components/user/UserHeader";
import AppPagination from "../../components/common/AppPagination";
import { getBanner, getCategories, getFoods } from "../../services/userService";
import cartService from "../../services/customer/cartService";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/CustomerHome.css";

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
  const pageSize = 12;

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
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
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // ─── Fetch foods ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchFoods = async () => {
      setLoadingFoods(true);
      try {
        const params = {
          page,
          size: pageSize,
          ...(activeCat !== 0 && { categoryId: activeCat }),
          ...(debouncedSearch && { name: debouncedSearch }),
        };

        const res = await getFoods(params);
        const data = res.data?.data;

        const list = data?.content || [];
        const total = data?.totalElements ?? 0;

        const mapped = list.map((f) => ({
          id: f.id,
          name: f.name,
          price: f.price,
          image: f.image || null,
          category_id: f.categoryId,
          description: f.description ?? "",
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

  // ─── Load cart from API on mount ─────────────────────────────────
  useEffect(() => {
    const loadCartFromAPI = async () => {
      try {
        const res = await cartService.getCart();
        const data = res.data?.data;
        const mapped = (data?.items || []).map((i) => ({
          item_id: i.itemId,
          name: i.foodName,
          price: i.price,
          image: i.image,
          qty: i.quantity,
        }));
        setCart(mapped);
      } catch (err) {
        console.error("Load cart error:", err);
      }
    };

    loadCartFromAPI();
  }, []);

  // ─── Persist favorites ───────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

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
    async (item) => {
      if (!isLoggedIn) {
        requireLoginAction();
        return;
      }
      try {
        // API addToCart only sends quantity
        await cartService.addToCart({
          foodId: item.id,
          quantity: 1,
        });

        // Reload cart from API
        const res = await cartService.getCart();
        const data = res.data?.data;
        const mapped = (data?.items || []).map((i) => ({
          item_id: i.itemId,
          name: i.foodName,
          price: i.price,
          image: i.image,
          qty: i.quantity,
        }));
        setCart(mapped);
      } catch (err) {
        console.error("Add to cart error:", err);
        toast.error("Thêm vào giỏ hàng thất bại");
      }
    },
    [isLoggedIn, requireLoginAction],
  );

  // ─── Dec cart ────────────────────────────────────────────────────
  const decCart = useCallback(
    async (item) => {
      try {
        if (item.qty <= 1) {
          // Remove item if quantity is 1
          await cartService.deleteCart(item.item_id);
        } else {
          // Update quantity via API (send only quantity)
          await cartService.updateCart(item.item_id, {
            quantity: item.qty - 1,
          });
        }

        // Reload cart from API
        const res = await cartService.getCart();
        const data = res.data?.data;
        const mapped = (data?.items || []).map((i) => ({
          item_id: i.itemId,
          name: i.foodName,
          price: i.price,
          image: i.image,
          qty: i.quantity,
        }));
        setCart(mapped);
      } catch (err) {
        console.error("Dec cart error:", err);
        toast.error("Cập nhật giỏ hàng thất bại");
      }
    },
    [],
  );

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

  return (
    <div className="customer-home-page" style={{ background: T.bg }}>
      <Banner data={banners} onViewMenu={scrollToMenu} />

      <div id="customer-menu-header" className="customer-home-header-wrap">
        <UserHeader
          title="Thực đơn"
          description={`Xin chào ${greetingName} 👋`}
          extra={
            <div
              className="customer-search-box"
              style={{ background: T.card, border: `1px solid ${T.border}` }}
            >
              <input
                className="customer-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm món..."
                style={{ color: T.text }}
              />
            </div>
          }
        />

        {/* Categories */}
        <div className="customer-category-list">
          {categories.map((cat) => (
            <button
              key={`cat-${cat.id}`}
              className="customer-category-btn"
              onClick={() => {
                setActiveCat(cat.id);
                setPage(0);
              }}
              style={{
                border:
                  activeCat === cat.id
                    ? `1px solid ${T.primary}`
                    : `1px solid ${T.border}`,
                background: activeCat === cat.id ? T.primary : T.card,
                color: activeCat === cat.id ? "#fff" : T.text,
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu list */}
      <div id="customer-menu-section" className="customer-home-content-wrap">
        {loadingFoods ? (
          <div className="customer-loading" style={{ color: T.textSub }}>
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
