import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { T, fmt } from "../../constants/customerTheme";
import { EmptyState, SectionTitle } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import FoodImage from "../../components/common/FoodImage";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/CustomerDetail.css";
import {
  getFoodByIdDetail,
  getFoods,
  getCategories,
} from "../../services/userService";
import favoriteService from "../../services/customer/favoriteService";
import reviewService from "../../services/customer/reviewService";
import { toast } from "react-toastify";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

const FoodDetail = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { id } = useParams();
  const itemId = Number(id);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setLoading(true);
        const res = await getFoodByIdDetail(id);
        setItem(res?.data?.data);
      } catch (err) {
        console.error("Lỗi load chi tiết món:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFoodDetail();
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!item) return [];

    const images = Array.isArray(item.images) ? item.images : [];
    const main = item.image;

    return [...new Set([main, ...images].filter(Boolean))];
  }, [item]);

  const [cart, setCart] = useState([]);

  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const [orders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  // Load favorites from API on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoadingFavorites(true);
        const res = await favoriteService.getMyFavorite();
        const data = res.data?.data;
        const favIds = Array.isArray(data)
          ? data.map((item) => item.foodId || item.id)
          : [];
        setFavorites(favIds);
      } catch (err) {
        console.error("Load favorites error:", err);
        setFavorites([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    if (isLoggedIn) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isLoggedIn]);

  const fetchFoods = async () => {
    try {
      const res = await getFoods();
      const list = res?.data?.data?.content || [];
      setFoods(list);
    } catch (err) {
      console.error("Lỗi load foods:", err);
    }
  };

  useEffect(() => {
    if (!item) return;
    const saved = localStorage.getItem("recently-viewed-foods");
    const prev = saved ? JSON.parse(saved) : [];
    const next = [
      item.id,
      ...(Array.isArray(prev) ? prev.filter((id) => id !== item.id) : []),
    ].slice(0, 8);
    localStorage.setItem("recently-viewed-foods", JSON.stringify(next));
  }, [item]);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const requireLoginAction = () => {
    confirmLoginWithModal(navigate);
  };
  const BASE_URL = "http://localhost:8080/uploads/";
  const displayImage = activeImage || item?.image;

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const isFav = item ? favorites.includes(item.id) : false;
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await reviewService.getReviewByFood(itemId);
        setReviews(res.data.data.content || []);
      } catch (err) {
        console.error("Lỗi load review:", err);
      }
    };

    if (itemId) fetchReviews();
  }, [itemId]);
  const currentUserName = useMemo(() => {
    try {
      const saved = localStorage.getItem("userInfo");
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.fullName || parsed?.name || parsed?.username || "Bạn";
    } catch {
      return "Bạn";
    }
  }, []);

  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await getFoods();

        const list = res?.data?.data?.content || [];

        if (!Array.isArray(list)) {
          console.warn("Expected array but got:", list);
          return;
        }

        const filtered = list
          .filter((f) => f.categoryId === item.categoryId && f.id !== item.id)
          .slice(0, 4);

        setRelated(filtered);
      } catch (err) {
        console.error("Lỗi load related:", err);
      }
    };

    if (item) fetchRelated();
  }, [item]);
  const ownReview = useMemo(() => {
    return reviews.find((r) => r.username === currentUserName);
  }, [reviews, currentUserName]);

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (reviewSort === "highest")
      return list.sort((a, b) => b.rating - a.rating);
    if (reviewSort === "lowest")
      return list.sort((a, b) => a.rating - b.rating);
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reviews, reviewSort]);

  const handleEditOwnReview = () => {
    if (!ownReview) return;

    setEditingReviewId(ownReview.id);
    setNewRating(ownReview.rating);
    setNewComment(ownReview.comment);
  };
  const avgReview = useMemo(() => {
    if (!reviews.length) return item?.rating || 0;
    const total = reviews.reduce((s, r) => s + r.rating, 0);
    return Number((total / reviews.length).toFixed(1));
  }, [reviews, item]);

  const cartMap = useMemo(() => {
    return Object.fromEntries(cart.map((c) => [c.item_id, c.qty]));
  }, [cart]);

  const inCart = item ? cart.find((c) => c.item_id === item.id)?.qty || 0 : 0;
  const canReview = useMemo(() => {
    if (!item || !Array.isArray(orders)) return false;
    return orders.some(
      (order) =>
        order?.status === "completed" &&
        Array.isArray(order.items) &&
        order.items.some(
          (it) => it.item_id === item.id || it.name === item.name,
        ),
    );
  }, [orders, item]);
  const addToCart = () => {
    if (!item) return;
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
  };

  const decCart = (item_id) => {
    setCart((prev) =>
      prev
        .map((c) => (c.item_id === item_id ? { ...c, qty: c.qty - 1 } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const toggleFav = async (foodId) => {
    if (!isLoggedIn) {
      requireLoginAction();
      return;
    }
    try {
      const isFav = favorites.includes(foodId);
      if (isFav) {
        await favoriteService.deleteFavorite(foodId);
        setFavorites((prev) => prev.filter((f) => f !== foodId));
        toast.info("Đã xóa khỏi yêu thích");
      } else {
        await favoriteService.addToFavorite(foodId);
        setFavorites((prev) => [...prev, foodId]);
        toast.success("Đã thêm vào yêu thích");
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
      toast.error("Không thể cập nhật yêu thích");
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const payload = {
        foodId: itemId,
        rating: newRating,
        comment: newComment,
      };

      await reviewService.createReview(payload);

      toast.success("Đánh giá thành công!");

      setNewComment("");
      setNewRating(5);
      const res = await reviewService.getReviewByFood(itemId);
      setReviews(res.data.data.content || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Gửi đánh giá thất bại!";

      toast.error(msg);
    }
  };

  const handleUpdateReview = async () => {
    try {
      await reviewService.updateReview(editingReviewId, {
        rating: newRating,
        comment: newComment,
      });

      toast.success("Cập nhật thành công!");

      setEditingReviewId(null);
      setNewComment("");
      setNewRating(5);

      const res = await reviewService.getReviewByFood(itemId);
      setReviews(res.data.data.content || []);
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleDeleteOwnReview = async () => {
    try {
      await reviewService.deleteReview(ownReview.id);

      toast.success("Xóa thành công!");

      const res = await reviewService.getReviewByFood(itemId);
      setReviews(res.data.data.content || []);
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  if (!item) {
    return (
      <div className="customer-detail-page" style={{ background: T.bg }}>
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

  return (
    <div className="customer-detail-page" style={{ background: T.bg }}>
      <div className="customer-detail-container">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="fd-back-btn"
          style={{ color: T.sub }}
        >
          ← Quay lại thực đơn
        </button>

        {/* Main card */}
        <div
          className="fd-main-card"
          style={{ background: T.card, borderColor: T.border }}
        >
          {/* Image panel */}
          <div
            className="fd-image-panel"
            style={{ background: T.primaryLight }}
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

          {/* Info panel */}
          <div className="fd-info-panel">
            <div className="fd-info-header">
              <span
                className="fd-category-badge"
                style={{ background: T.bg, color: T.sub }}
              >
                {item.categoryName}
              </span>
              <button
                onClick={() => toggleFav(item.id)}
                className="fd-fav-btn"
                style={{ background: T.bg }}
              >
                {isFav ? "❤️" : "🤍"}
              </button>
            </div>

            <h1 className="fd-item-title" style={{ color: T.text }}>
              {item.name}
            </h1>

            <div className="fd-stats-row">
              <span style={{ color: T.sub }}>
                ⭐ <strong style={{ color: T.text }}>{avgReview}</strong>
              </span>
              <span style={{ color: T.sub }}>
                🔥 <strong style={{ color: T.text }}>{item.soldCount}</strong>{" "}
                đã bán
              </span>
              <span style={{ color: T.sub }}>
                💬 <strong style={{ color: T.text }}>{reviews.length}</strong>{" "}
                đánh giá
              </span>
            </div>

            <p className="fd-description" style={{ color: T.sub }}>
              {item.description}
            </p>

            {/* Quantity */}
            <div className="fd-qty-box" style={{ background: T.bg }}>
              <span className="fd-qty-label" style={{ color: T.text }}>
                Số lượng
              </span>
              <div className="fd-qty-controls">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="fd-qty-dec"
                  style={{ borderColor: T.border }}
                >
                  −
                </button>
                <span className="fd-qty-value">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="fd-qty-inc"
                  style={{ background: T.primary }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price + Add to cart */}
            <div className="fd-action-row">
              <div>
                <p className="fd-price-label" style={{ color: T.sub }}>
                  Tổng cộng
                </p>
                <p className="fd-price-total" style={{ color: T.primary }}>
                  {fmt(item.price * qty)}
                </p>
              </div>
              <button
                onClick={addToCart}
                className="fd-add-btn"
                style={{ background: T.primary }}
              >
                🛒 Thêm vào giỏ hàng
              </button>
            </div>

            {inCart > 0 && (
              <p className="fd-in-cart-msg" style={{ color: T.green }}>
                ✓ Đã có {inCart} trong giỏ hàng
              </p>
            )}
          </div>
        </div>

        {/* Toggle reviews */}
        <button
          onClick={() => setShowReviews((prev) => !prev)}
          className="fd-toggle-reviews-btn"
          style={{ borderColor: T.border, color: T.text }}
        >
          {showReviews ? "Ẩn comment & đánh giá" : "Xem comment & đánh giá"}
        </button>

        {showReviews && (
          <div className="fd-reviews-section">
            <SectionTitle count={reviews.length}>
              Đánh giá & comment
            </SectionTitle>

            {/* Write review */}
            <div
              className="fd-write-review-box"
              style={{ background: T.card, borderColor: T.border }}
            >
              <p className="fd-write-review-title" style={{ color: T.text }}>
                Viết đánh giá của bạn
              </p>

              {ownReview && !editingReviewId && (
                <div
                  className="fd-own-review-notice"
                  style={{
                    background: T.primaryLight,
                    borderColor: `${T.primary}33`,
                  }}
                >
                  <span style={{ color: T.text }}>
                    Bạn đã đánh giá món này. Bạn có thể sửa hoặc xóa.
                  </span>
                  <div className="fd-own-review-actions">
                    <button
                      onClick={handleEditOwnReview}
                      className="fd-own-review-edit-btn"
                      style={{ color: T.primary }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={handleDeleteOwnReview}
                      className="fd-own-review-delete-btn"
                      style={{ background: T.redBg, color: T.red }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}

              {/* Stars */}
              <div className="fd-star-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewRating(s)}
                    className="fd-star-btn"
                    style={{
                      cursor: canReview ? "pointer" : "not-allowed",
                      color: s <= newRating ? "#F59E0B" : "#D1D5DB",
                      opacity: canReview ? 1 : 0.6,
                    }}
                    title={`${s} sao`}
                    disabled={!canReview}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="fd-comment-row">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      editingReviewId
                        ? handleUpdateReview()
                        : handleSubmitComment();
                    }
                  }}
                  placeholder={
                    canReview
                      ? "Chia sẻ cảm nhận của bạn..."
                      : "Hoàn thành đơn hàng để mở tính năng bình luận"
                  }
                  className="fd-comment-input"
                  style={{
                    borderColor: T.border,
                    background: canReview ? "#fff" : "#F5F5F5",
                  }}
                  disabled={!canReview}
                />
                <button
                  onClick={
                    editingReviewId ? handleUpdateReview : handleSubmitComment
                  }
                  className="fd-comment-submit-btn"
                  style={{
                    background: canReview ? T.primary : T.muted,
                    cursor: canReview ? "pointer" : "not-allowed",
                  }}
                  disabled={!canReview}
                >
                  {editingReviewId ? "Cập nhật" : "Gửi"}
                </button>
              </div>
            </div>

            {/* Review summary */}
            <div
              className="fd-review-summary-box"
              style={{ background: T.card, borderColor: T.border }}
            >
              <div className="fd-avg-stars">
                <p className="fd-avg-score" style={{ color: T.text }}>
                  {avgReview}
                </p>
                <div>
                  <p className="fd-star-display">
                    {"★".repeat(Math.max(1, Math.round(avgReview)))}
                    {"☆".repeat(Math.max(0, 5 - Math.round(avgReview)))}
                  </p>
                  <p className="fd-review-count" style={{ color: T.sub }}>
                    Dựa trên {reviews.length} nhận xét
                  </p>
                </div>
              </div>

              <div className="fd-sort-row">
                {[
                  ["newest", "Mới nhất"],
                  ["highest", "Điểm cao"],
                  ["lowest", "Điểm thấp"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setReviewSort(key)}
                    className="fd-sort-btn"
                    style={{
                      borderColor: reviewSort === key ? T.primary : T.border,
                      background: reviewSort === key ? T.primaryLight : "#fff",
                      color: reviewSort === key ? T.primary : T.text,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Review list */}
            {reviews.length === 0 ? (
              <div
                className="fd-no-reviews"
                style={{ borderColor: T.border, color: T.sub }}
              >
                Chưa có comment cho món này.
              </div>
            ) : (
              <div className="fd-review-list">
                {sortedReviews.map((r) => (
                  <div
                    key={r.id}
                    className="fd-review-card"
                    style={{ borderColor: T.border }}
                  >
                    <div className="fd-review-card-header">
                      <p className="fd-review-user" style={{ color: T.text }}>
                        {r.username}
                      </p>
                      <span className="fd-review-date" style={{ color: T.sub }}>
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="fd-review-stars">
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </p>
                    <p className="fd-review-comment" style={{ color: T.sub }}>
                      {r.comment}
                    </p>
                    {r.username === currentUserName && (
                      <div className="fd-review-own-actions">
                        <button
                          onClick={handleEditOwnReview}
                          className="fd-review-edit-btn"
                          style={{
                            background: T.primaryLight,
                            color: T.primary,
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={handleDeleteOwnReview}
                          className="fd-review-delete-btn"
                          style={{ background: T.redBg, color: T.red }}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="fd-related-section">
            <SectionTitle>Món cùng danh mục</SectionTitle>
            <div className="fd-related-grid">
              {related.map((r) => (
                <MenuItemCard
                  key={r.id}
                  item={r}
                  isFav={favorites.includes(r.id)}
                  inCart={cartMap[r.id] || 0}
                  onToggleFav={toggleFav}
                  onAdd={(it) => {
                    setQty(1);
                    setCart((prev) => {
                      const ex = prev.find((c) => c.item_id === it.id);
                      if (ex)
                        return prev.map((c) =>
                          c.item_id === it.id ? { ...c, qty: c.qty + 1 } : c,
                        );
                      return [
                        ...prev,
                        {
                          item_id: it.id,
                          name: it.name,
                          price: it.price,
                          image: it.image,
                          qty: 1,
                        },
                      ];
                    });
                  }}
                  onDec={(foodId) => decCart(foodId)}
                  onClick={() => navigate(`/customer/foods/${r.id}`)}
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
