import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { T, fmt } from "../../constants/customerTheme";
import { EmptyState, SectionTitle } from "../../components/customer/SharedUI";

import MenuItemCard from "../../components/customer/MenuItemCard";
import FoodImage from "../../components/common/FoodImage";
import FoodReviews from "../../components/customer/FoodReviews";

import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";

import {
  getFoodByIdDetail,
  getFoods,
  getCategories,
} from "../../services/userService";

import { useCustomerData } from "../../context/CustomerDataContext";

import "../../assets/styles/CustomerDetail.css";

const FoodDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isLoggedIn } = useAuth();

  // ============================================================
  // CUSTOMER DATA
  // ============================================================
  // Tất cả cart + favorite đều lấy từ CustomerDataContext.
  // FoodDetail KHÔNG gọi cartService/favoriteService trực tiếp.
  // ============================================================

  const {
    cart,
    favorites,
    cartMap,
    addToCart: addCartContext,
    updateCart,
    removeItem,
    toggleFavorite,
  } = useCustomerData();

  const itemId = Number(id);

  // ============================================================
  // FOOD DETAIL
  // ============================================================

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  // ============================================================
  // LOAD CATEGORIES
  // ============================================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();

        const list = res?.data?.data?.content || [];

        setCategories(list);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // ============================================================
  // LOAD FOOD DETAIL
  // ============================================================

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setLoading(true);

        const res = await getFoodByIdDetail(id);

        setItem(res?.data?.data || null);
      } catch (err) {
        console.error("Lỗi load chi tiết món:", err);

        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFoodDetail();
    }
  }, [id]);

  // ============================================================
  // RESET ACTIVE IMAGE WHEN FOOD CHANGES
  // ============================================================

  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    setActiveImage("");
  }, [item?.id]);

  // ============================================================
  // GALLERY
  // ============================================================

  const galleryImages = useMemo(() => {
    if (!item) {
      return [];
    }

    const images = Array.isArray(item.images) ? item.images : [];

    const main = item.image;

    return [...new Set([main, ...images].filter(Boolean))];
  }, [item]);

  const displayImage = activeImage || item?.image;

  // ============================================================
  // CART
  // ============================================================

  const inCart = item ? cartMap[item.id] || 0 : 0;

  // ============================================================
  // QUANTITY
  // ============================================================

  const [qty, setQty] = useState(1);

  // ============================================================
  // LOGIN GUARD
  // ============================================================

  const requireLoginAction = () => {
    confirmLoginWithModal(navigate);
  };

  // ============================================================
  // ADD TO CART
  // ============================================================

  const handleAddToCart = async (food = item, quantity = qty) => {
    if (!isLoggedIn) {
      requireLoginAction();
      return false;
    }

    if (!food) {
      return false;
    }

    try {
      const success = await addCartContext({
        ...food,
        id: food.id,
      });

      if (success && quantity > 1) {
        for (let i = 1; i < quantity; i++) {
          const nextSuccess = await addCartContext({
            ...food,
            id: food.id,
          });

          if (!nextSuccess) {
            break;
          }
        }
      }

      if (success) {
        toast.success("Đã thêm vào giỏ hàng");
      } else {
        toast.error("Thêm vào giỏ hàng thất bại");
      }

      return success;
    } catch (err) {
      console.error("Add to cart error:", err);

      toast.error("Thêm vào giỏ hàng thất bại");

      return false;
    }
  };

  // ============================================================
  // ADD RELATED FOOD
  // ============================================================

  const handleAddRelated = async (food) => {
    if (!isLoggedIn) {
      requireLoginAction();
      return;
    }

    const success = await addCartContext(food);

    if (success) {
      toast.success("Đã thêm vào giỏ hàng");
    } else {
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };

  // ============================================================
  // DECREASE CART
  // ============================================================

  const decCart = async (foodId) => {
    if (!isLoggedIn) {
      requireLoginAction();
      return;
    }

    const currentQty = cartMap[foodId] || 0;

    if (currentQty <= 0) {
      return;
    }

    try {
      const success = await updateCart(foodId, -1);

      if (!success) {
        toast.error("Cập nhật giỏ hàng thất bại");
      }
    } catch (err) {
      console.error("Dec cart error:", err);

      toast.error("Cập nhật giỏ hàng thất bại");
    }
  };

  // ============================================================
  // FAVORITE
  // ============================================================

  const isFav = item ? favorites.includes(item.id) : false;

  const toggleFav = async (foodId) => {
    if (!isLoggedIn) {
      requireLoginAction();
      return;
    }

    const currentFavorite = favorites.includes(foodId);

    try {
      const success = await toggleFavorite(foodId);

      if (!success) {
        toast.error("Không thể cập nhật yêu thích");

        return;
      }

      if (currentFavorite) {
        toast.info("Đã xóa khỏi yêu thích");
      } else {
        toast.success("Đã thêm vào yêu thích");
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);

      toast.error("Không thể cập nhật yêu thích");
    }
  };

  // ============================================================
  // REVIEW STATS (nhận từ FoodReviews để hiển thị ở stats-row)
  // ============================================================

  const [reviewStats, setReviewStats] = useState({
    avgReview: 0,
    count: 0,
  });

  // ============================================================
  // RELATED FOODS
  // ============================================================

  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!item) {
        return;
      }

      try {
        const res = await getFoods();

        const list = res?.data?.data?.content || [];

        if (!Array.isArray(list)) {
          setRelated([]);
          return;
        }

        const filtered = list
          .filter(
            (food) =>
              food.categoryId === item.categoryId && food.id !== item.id,
          )
          .slice(0, 4);

        setRelated(filtered);
      } catch (err) {
        console.error("Lỗi load related:", err);

        setRelated([]);
      }
    };

    fetchRelated();
  }, [item]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div
        className="customer-detail-page"
        style={{
          background: T.bg,
        }}
      >
        <div className="customer-detail-container">
          <div
            style={{
              textAlign: "center",
              padding: "60px",
              color: T.sub,
            }}
          >
            Đang tải món ăn...
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!item) {
    return (
      <div
        className="customer-detail-page"
        style={{
          background: T.bg,
        }}
      >
        <div className="customer-detail-container">
          <EmptyState
            icon="🍽️"
            title="Không tìm thấy món"
            desc="Món ăn không tồn tại hoặc đã bị xóa."
            btnLabel="Quay lại thực đơn"
            onBtn={() => navigate("/customer")}
          />
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="customer-detail-page"
      style={{
        background: T.bg,
      }}
    >
      <div className="customer-detail-container">
        {/* ======================================================
            BACK
        ====================================================== */}

        <button
          onClick={() => navigate(-1)}
          className="fd-back-btn"
          style={{
            color: T.sub,
          }}
        >
          ← Quay lại thực đơn
        </button>

        {/* ======================================================
            MAIN CARD
        ====================================================== */}

        <div
          className="fd-main-card"
          style={{
            background: T.card,
            borderColor: T.border,
          }}
        >
          {/* ====================================================
              IMAGE
          ==================================================== */}

          <div
            className="fd-image-panel"
            style={{
              background: T.primaryLight,
            }}
          >
            <div className="fd-image-main">
              <FoodImage
                src={displayImage}
                size="100%"
                radius={0}
                textSize={120}
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="fd-thumb-strip">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${item.id}-thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className="fd-thumb-btn"
                    style={{
                      border:
                        activeImage === img
                          ? `2px solid ${T.primary}`
                          : `1px solid ${T.border}`,
                    }}
                  >
                    <FoodImage src={img} size="100%" radius={0} textSize={24} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ====================================================
              INFO
          ==================================================== */}

          <div className="fd-info-panel">
            <div className="fd-info-header">
              <span
                className="fd-category-badge"
                style={{
                  background: T.bg,
                  color: T.sub,
                }}
              >
                {item.categoryName}
              </span>

              <button
                onClick={() => toggleFav(item.id)}
                className="fd-fav-btn"
                style={{
                  background: T.bg,
                }}
                aria-label="Yêu thích"
              >
                {isFav ? "❤️" : "🤍"}
              </button>
            </div>

            <h1
              className="fd-item-title"
              style={{
                color: T.text,
              }}
            >
              {item.name}
            </h1>

            {/* ==================================================
                STATS
            ================================================== */}

            <div className="fd-stats-row">
              <span
                style={{
                  color: T.sub,
                }}
              >
                ⭐{" "}
                <strong
                  style={{
                    color: T.text,
                  }}
                >
                  {reviewStats.avgReview}
                </strong>
              </span>

              <span
                style={{
                  color: T.sub,
                }}
              >
                🔥{" "}
                <strong
                  style={{
                    color: T.text,
                  }}
                >
                  {item.soldCount || 0}
                </strong>{" "}
                đã bán
              </span>

              <span
                style={{
                  color: T.sub,
                }}
              >
                💬{" "}
                <strong
                  style={{
                    color: T.text,
                  }}
                >
                  {reviewStats.count}
                </strong>{" "}
                đánh giá
              </span>
            </div>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <p
              className="fd-description"
              style={{
                color: T.sub,
              }}
            >
              {item.description || "Món ăn thơm ngon được nhà hàng chuẩn bị."}
            </p>

            {/* ==================================================
                QUANTITY
            ================================================== */}

            <div
              className="fd-qty-box"
              style={{
                background: T.bg,
              }}
            >
              <span
                className="fd-qty-label"
                style={{
                  color: T.text,
                }}
              >
                Số lượng
              </span>

              <div className="fd-qty-controls">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="fd-qty-dec"
                  style={{
                    borderColor: T.border,
                  }}
                >
                  −
                </button>

                <span className="fd-qty-value">{qty}</span>

                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="fd-qty-inc"
                  style={{
                    background: T.primary,
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* ==================================================
                PRICE
            ================================================== */}

            <div className="fd-action-row">
              <div>
                <p
                  className="fd-price-label"
                  style={{
                    color: T.sub,
                  }}
                >
                  Tổng cộng
                </p>

                <p
                  className="fd-price-total"
                  style={{
                    color: T.primary,
                  }}
                >
                  {fmt(Number(item.price || 0) * qty)}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(item, qty)}
                className="fd-add-btn"
                style={{
                  background: T.primary,
                }}
              >
                🛒 Thêm vào giỏ hàng
              </button>
            </div>

            {/* ==================================================
                CURRENT CART
            ================================================== */}

            {inCart > 0 && (
              <div
                style={{
                  marginTop: 12,
                  color: T.sub,
                  fontSize: 14,
                }}
              >
                Trong giỏ hàng:{" "}
                <strong
                  style={{
                    color: T.text,
                  }}
                >
                  {inCart}
                </strong>{" "}
                phần
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            REVIEWS (toggle + list + form, tất cả nằm trong FoodReviews)
        ====================================================== */}

        <FoodReviews
          itemId={itemId}
          fallbackRating={item?.rating}
          isLoggedIn={isLoggedIn}
          requireLoginAction={requireLoginAction}
          onStatsChange={setReviewStats}
        />

        {/* ======================================================
            RELATED FOODS
        ====================================================== */}

        {related.length > 0 && (
          <div className="fd-related-section">
            <SectionTitle>Món cùng danh mục</SectionTitle>

            <div className="fd-related-grid">
              {related.map((food) => (
                <MenuItemCard
                  key={food.id}
                  item={{
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    image: food.image || null,
                    category_id: food.categoryId,
                    description: food.description || "",
                    rating: food.rating,
                    soldCount: food.soldCount,
                  }}
                  isFav={favorites.includes(food.id)}
                  inCart={cartMap[food.id] || 0}
                  onToggleFav={toggleFav}
                  onAdd={handleAddRelated}
                  onDec={decCart}
                  onClick={() => navigate(`/foods/${food.id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetail;
