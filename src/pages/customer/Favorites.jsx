import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { T } from "../../constants/customerTheme";
import { EmptyState } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import UserHeader from "../../components/user/UserHeader";
import favoriteService from "../../services/customer/favoriteService";
import cartService from "../../services/customer/cartService";
import { getFoods } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import { confirmLoginWithModal } from "../../utils/authGuards";
import "../../assets/styles/CustomerFavorites.css";

const CART_UPDATED_EVENT = "cart-updated-event";

const Favorites = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [favorites, setFavorites] = useState([]);
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  // ─── Require login ─────────────────────
  const requireLoginAction = useCallback(() => {
    confirmLoginWithModal(navigate);
  }, [navigate]);

  // ─── Load favorites (API) ──────────────
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const res = await favoriteService.getMyFavorite();
        const favIds = res.data?.data?.favoriteIds || [];
        setFavorites(favIds);
      } catch (err) {
        console.error(err);
        setFavorites([]);
      }
    };

    if (isLoggedIn) loadFavorites();
    else setFavorites([]);
  }, [isLoggedIn]);

  // ─── Load foods (API) ──────────────────
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await getFoods({ page: 0, size: 1000 });
        const list = res.data?.data?.content || [];

        const mapped = list.map((f) => ({
          id: f.id,
          name: f.name,
          price: f.price,
          image: f.image,
          desc: f.description || "",
        }));

        setFoods(mapped);
      } catch (err) {
        console.error("Load foods error:", err);
        setFoods([]);
      }
    };

    fetchFoods();
  }, []);

  // ─── Filter favorites ──────────────────
  const items = useMemo(() => {
    const keyword = search.toLowerCase();

    return foods.filter(
      (f) =>
        favorites.includes(f.id) &&
        (f.name.toLowerCase().includes(keyword) ||
          f.desc.toLowerCase().includes(keyword)),
    );
  }, [foods, favorites, search]);

  // ─── Toggle favorite (API) ─────────────
  const toggleFav = useCallback(
    async (id) => {
      if (!isLoggedIn) {
        requireLoginAction();
        return;
      }

      // Check current favorite status
      const isFavorite = favorites.includes(id);

      try {
        // Optimistic update - update UI immediately
        if (isFavorite) {
          setFavorites((prev) => prev.filter((f) => f !== id));
          toast.info("Đã xóa khỏi yêu thích");
        } else {
          setFavorites((prev) => [...prev, id]);
          toast.success("Đã thêm vào yêu thích");
        }

        // Call API to sync with backend
        const res = await favoriteService.toggleFavorite(id);

        // If API fails, revert the change
        if (!res.data) {
          if (isFavorite) {
            setFavorites((prev) => [...prev, id]);
          } else {
            setFavorites((prev) => prev.filter((f) => f !== id));
          }
          toast.error("Không thể cập nhật yêu thích");
        }
      } catch (err) {
        console.error("Toggle favorite error:", err);

        // Revert on error
        if (isFavorite) {
          setFavorites((prev) => [...prev, id]);
        } else {
          setFavorites((prev) => prev.filter((f) => f !== id));
        }
        toast.error("Không thể cập nhật yêu thích");
      }
    },
    [isLoggedIn, requireLoginAction, favorites],
  );

  // ─── Clear all favorites (API-safe) ────
  const clearAllFavorites = async () => {
    try {
      await Promise.all(
        favorites.map((id) => favoriteService.toggleFavorite(id)),
      );
      setFavorites([]);
      toast.success("Đã xóa tất cả yêu thích");
    } catch (err) {
      toast.error("Xóa thất bại");
    }
  };

  // ─── Load cart from API on mount ─────────────────────────────
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

  // ─── Cart map ────────────────────────────
  const cartMap = useMemo(
    () => Object.fromEntries(cart.map((c) => [c.item_id, c.qty])),
    [cart],
  );

  // ─── Add to cart (API) ────────────────────
  const addToCart = useCallback(
    async (item) => {
      if (!isLoggedIn) {
        requireLoginAction();
        return;
      }
      try {
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
        // Dispatch event to notify Header.jsx of cart update
        window.dispatchEvent(new Event(CART_UPDATED_EVENT));
      } catch (err) {
        console.error("Add to cart error:", err);
        toast.error("Thêm vào giỏ hàng thất bại");
      }
    },
    [isLoggedIn, requireLoginAction],
  );

  // ─── Dec cart (API) ───────────────────────
  const decCart = useCallback(async (item) => {
    try {
      if (item.qty <= 1) {
        await cartService.deleteCart(item.item_id);
      } else {
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
      // Dispatch event to notify Header.jsx of cart update
      window.dispatchEvent(new Event(CART_UPDATED_EVENT));
    } catch (err) {
      console.error("Dec cart error:", err);
      toast.error("Cập nhật giỏ hàng thất bại");
    }
  }, []);

  // ─── UI ────────────────────────────────
  return (
    <div className="customer-favorites-page" style={{ background: T.bg }}>
      <div className="customer-favorites-container">
        <UserHeader
          title="Món yêu thích"
          description="Những món bạn đã lưu"
          extra={
            <div className="favorites-header-extra">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm trong yêu thích..."
              />

              <button
                onClick={clearAllFavorites}
                disabled={favorites.length === 0}
              >
                Xóa tất cả
              </button>
            </div>
          }
        />

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
