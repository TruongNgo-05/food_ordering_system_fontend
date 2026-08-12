import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { T } from "../../constants/customerTheme";
import { EmptyState } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import UserHeader from "../../components/user/UserHeader";
import { getFoods } from "../../services/userService";
import { useAuth } from "../../hooks/useAuth";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useCustomerData } from "../../context/CustomerDataContext";
import "../../assets/styles/CustomerFavorites.css";
import CustomerSearch from "../../components/common/CustomerSearch";
import Footer from "../../layouts/Footer";

const Favorites = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const {
    favorites,
    cart,
    toggleFavorite,
    addToCart: addToCartContext,
    updateCart,
  } = useCustomerData();

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");

  // ─── Require login ─────────────────────
  const requireLoginAction = useCallback(() => {
    confirmLoginWithModal(navigate);
  }, [navigate]);

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

      const isFavorite = favorites.includes(Number(id));

      try {
        const success = await toggleFavorite(id);

        if (success) {
          if (isFavorite) {
            toast.info("Đã xóa khỏi yêu thích");
          } else {
            toast.success("Đã thêm vào yêu thích");
          }
        } else {
          toast.error("Không thể cập nhật yêu thích");
        }
      } catch (err) {
        console.error("Toggle favorite error:", err);
        toast.error("Không thể cập nhật yêu thích");
      }
    },
    [favorites, isLoggedIn, requireLoginAction, toggleFavorite],
  );

  // ─── Clear all favorites (API-safe) ────
  const clearAllFavorites = () => {
    if (favorites.length === 0) return;

    Modal.confirm({
      title: "Xóa tất cả món yêu thích?",
      content:
        "Bạn có chắc chắn muốn xóa toàn bộ món khỏi danh sách yêu thích không?",
      okText: "Xóa tất cả",
      cancelText: "Hủy",
      okButtonProps: {
        danger: true,
      },
      async onOk() {
        try {
          const list = [...favorites];

          await Promise.all(list.map((id) => toggleFavorite(id)));

          toast.success("Đã xóa tất cả yêu thích");
        } catch (err) {
          console.error(err);
          toast.error("Xóa thất bại");
        }
      },
    });
  };

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
        const success = await addToCartContext(item, 1);

        if (success) {
          toast.success("Đã thêm vào giỏ hàng");
        } else {
          toast.error("Thêm vào giỏ hàng thất bại");
        }
      } catch (err) {
        console.error("Add to cart error:", err);
        toast.error("Thêm vào giỏ hàng thất bại");
      }
    },
    [addToCartContext, isLoggedIn, requireLoginAction],
  );

  // ─── Dec cart (API) ───────────────────────
  const decCart = useCallback(
    async (item) => {
      try {
        if (!item || !item.item_id) return;

        const success = await updateCart(item.item_id, -1);

        if (!success) {
          toast.error("Cập nhật giỏ hàng thất bại");
        }
      } catch (err) {
        console.error("Dec cart error:", err);
        toast.error("Cập nhật giỏ hàng thất bại");
      }
    },
    [updateCart],
  );

  // ─── UI ────────────────────────────────
  return (
    <div className="customer-favorites-page" style={{ background: T.bg }}>
      <div className="customer-favorites-container">
        <UserHeader title="Món yêu thích" description="Những món bạn đã lưu" />

        <div className="favorites-toolbar">
          <CustomerSearch
            keyword={search}
            onKeywordChange={setSearch}
            placeholder="Tìm trong yêu thích..."
          />

          <button
            className="favorites-clear-btn"
            onClick={clearAllFavorites}
            disabled={favorites.length === 0}
          >
            Xóa tất cả
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon="❤️"
            title="Chưa có món yêu thích"
            desc="Nhấn ♡ để lưu món"
            btnLabel="Khám phá"
            onBtn={() => navigate("/")}
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
                onClick={() => navigate(`/foods/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Favorites;
