import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { T, fmt } from "../../constants/customerTheme";
import { mockFoodReviews } from "../../data/mockFoodReviews";
import { EmptyState, SectionTitle } from "../../components/customer/SharedUI";
import MenuItemCard from "../../components/customer/MenuItemCard";
import FoodImage from "../../components/common/FoodImage";
import {
  loadSharedCategories,
  loadSharedFoods,
  SHARED_DATA_UPDATED_EVENT,
} from "../../utils/sharedData";
import { confirmLoginWithModal } from "../../utils/authGuards";
import { useAuth } from "../../hooks/useAuth";
import "../../assets/styles/CustomerDetail.css";

const CUSTOMER_DATA_UPDATED_EVENT = "customer-data-updated";

const FoodDetail = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { id } = useParams();
  const itemId = Number(id);
  const [foods, setFoods] = useState(() => loadSharedFoods());
  const [categories, setCategories] = useState(() => loadSharedCategories());

  const item = useMemo(() => {
    return foods.find((m) => m.id === itemId) || null;
  }, [foods, itemId]);
  const galleryImages = useMemo(() => {
    if (!item) return [];
    const images = Array.isArray(item.images) ? item.images : [];
    const merged = [item.image, ...images].filter(Boolean);
    return [...new Set(merged)];
  }, [item]);

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [orders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    window.dispatchEvent(new Event(CUSTOMER_DATA_UPDATED_EVENT));
  }, [favorites]);

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

  const displayImage = activeImage || galleryImages[0] || item?.image || "";

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [showReviews, setShowReviews] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const isFav = item ? favorites.includes(item.id) : false;
  const currentUserName = useMemo(() => {
    try {
      const saved = localStorage.getItem("userInfo");
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.fullName || parsed?.name || parsed?.username || "Bạn";
    } catch {
      return "Bạn";
    }
  }, []);

  const related = useMemo(() => {
    if (!item) return [];
    return foods
      .filter((m) => m.category_id === item.category_id && m.id !== item.id)
      .slice(0, 4);
  }, [foods, item]);
  const [customReviews, setCustomReviews] = useState(() => {
    const saved = localStorage.getItem("food-reviews");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("food-reviews", JSON.stringify(customReviews));
  }, [customReviews]);

  const reviews = useMemo(() => {
    if (!item) return [];
    const baseReviews = mockFoodReviews[item.id] || [];
    const localReviews = customReviews[item.id] || [];
    return [...localReviews, ...baseReviews];
  }, [item, customReviews]);
  const ownReview = useMemo(() => {
    if (!item) return null;
    const localReviews = customReviews[item.id] || [];
    return localReviews.find((r) => r.user === currentUserName) || null;
  }, [item, customReviews, currentUserName]);
  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (reviewSort === "highest")
      return list.sort((a, b) => b.rating - a.rating);
    if (reviewSort === "lowest")
      return list.sort((a, b) => a.rating - b.rating);
    return list.sort((a, b) => (b.created_ts || 0) - (a.created_ts || 0));
  }, [reviews, reviewSort]);
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

  const toggleFav = (foodId) => {
    if (!isLoggedIn) {
      requireLoginAction();
      return;
    }
    setFavorites((prev) =>
      prev.includes(foodId)
        ? prev.filter((f) => f !== foodId)
        : [...prev, foodId],
    );
  };

  const handleSubmitComment = () => {
    if (!item) return;
    if (!canReview) return;
    const content = newComment.trim();
    if (!content) return;

    setCustomReviews((prev) => {
      const list = prev[item.id] || [];
      const targetId = editingReviewId || ownReview?.id;
      const now = Date.now();
      const review = {
        id: targetId || `local-${now}`,
        user: currentUserName,
        rating: newRating,
        comment: content,
        created_at: "Vừa xong",
        created_ts: now,
      };

      if (targetId) {
        return {
          ...prev,
          [item.id]: list.map((r) => (r.id === targetId ? review : r)),
        };
      }

      return {
        ...prev,
        [item.id]: [review, ...list.filter((r) => r.user !== currentUserName)],
      };
    });
    setNewComment("");
    setNewRating(5);
    setEditingReviewId(null);
  };

  const handleEditOwnReview = () => {
    if (!ownReview) return;
    setEditingReviewId(ownReview.id);
    setNewRating(ownReview.rating);
    setNewComment(ownReview.comment);
  };

  const handleDeleteOwnReview = () => {
    if (!item || !ownReview) return;
    setCustomReviews((prev) => {
      const list = prev[item.id] || [];
      return { ...prev, [item.id]: list.filter((r) => r.id !== ownReview.id) };
    });
    setEditingReviewId(null);
    setNewComment("");
    setNewRating(5);
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
              position: "relative",
              minHeight: 340,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: 14,
            }}
          >
            <div
              style={{
                width: "100%",
                minHeight: 290,
                borderRadius: 18,
                overflow: "hidden",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FoodImage
                src={displayImage}
                size="100%"
                radius={0}
                textSize={120}
              />
            </div>
            {galleryImages.length > 1 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${item.id}-thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    style={{
                      border:
                        activeImage === img
                          ? `2px solid ${T.primary}`
                          : `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: 0,
                      background: "#fff",
                      cursor: "pointer",
                      width: 56,
                      height: 56,
                      overflow: "hidden",
                    }}
                  >
                    <FoodImage src={img} size="100%" radius={0} textSize={24} />
                  </button>
                ))}
              </div>
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
                {categories.find((c) => c.id === item.category_id)?.name}
              </span>
              <button
                onClick={() => toggleFav(item.id)}
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
                ⭐ <strong style={{ color: T.text }}>{avgReview}</strong>
              </span>
              <span style={{ fontSize: 14, color: T.sub }}>
                🔥 <strong style={{ color: T.text }}>{item.sold}</strong> đã bán
              </span>
              <span style={{ fontSize: 14, color: T.sub }}>
                💬 <strong style={{ color: T.text }}>{reviews.length}</strong>{" "}
                đánh giá
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

        <div style={{ marginTop: 36 }}>
          <button
            onClick={() => setShowReviews((prev) => !prev)}
            style={{
              border: `1px solid ${T.border}`,
              background: "#fff",
              color: T.text,
              borderRadius: 12,
              padding: "10px 14px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {showReviews ? "Ẩn comment & đánh giá" : "Xem comment & đánh giá"}
          </button>
        </div>

        {showReviews && (
          <div style={{ marginTop: 16 }}>
            <SectionTitle count={reviews.length}>
              Đánh giá & comment
            </SectionTitle>

            <div
              style={{
                background: T.card,
                borderRadius: 18,
                border: `1px solid ${T.border}`,
                padding: 16,
                marginBottom: 14,
              }}
            >
              <p style={{ margin: "0 0 10px", fontWeight: 800, color: T.text }}>
                Viết đánh giá của bạn
              </p>
              {ownReview && !editingReviewId && (
                <div
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    background: T.primaryLight,
                    border: `1px solid ${T.primary}33`,
                    borderRadius: 10,
                    padding: "8px 10px",
                  }}
                >
                  <span style={{ fontSize: 12, color: T.text }}>
                    Bạn đã đánh giá món này. Bạn có thể sửa hoặc xóa.
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={handleEditOwnReview}
                      style={{
                        border: "none",
                        borderRadius: 8,
                        background: "#fff",
                        color: T.primary,
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 8px",
                        cursor: "pointer",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={handleDeleteOwnReview}
                      style={{
                        border: "none",
                        borderRadius: 8,
                        background: T.redBg,
                        color: T.red,
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 8px",
                        cursor: "pointer",
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setNewRating(s)}
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: canReview ? "pointer" : "not-allowed",
                      fontSize: 22,
                      color: s <= newRating ? "#F59E0B" : "#D1D5DB",
                      padding: 0,
                      opacity: canReview ? 1 : 0.6,
                    }}
                    title={`${s} sao`}
                    disabled={!canReview}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmitComment();
                  }}
                  placeholder={
                    canReview
                      ? "Chia sẻ cảm nhận của bạn..."
                      : "Hoàn thành đơn hàng để mở tính năng bình luận"
                  }
                  style={{
                    flex: 1,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    outline: "none",
                    background: canReview ? "#fff" : "#F5F5F5",
                  }}
                  disabled={!canReview}
                />
                <button
                  onClick={handleSubmitComment}
                  style={{
                    border: "none",
                    borderRadius: 10,
                    background: canReview ? T.primary : T.muted,
                    color: "#fff",
                    fontWeight: 700,
                    padding: "0 16px",
                    cursor: canReview ? "pointer" : "not-allowed",
                  }}
                  disabled={!canReview}
                >
                  {editingReviewId ? "Cập nhật" : "Gửi"}
                </button>
              </div>
            </div>

            <div
              style={{
                background: T.card,
                borderRadius: 18,
                border: `1px solid ${T.border}`,
                padding: 18,
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 34,
                    fontWeight: 900,
                    color: T.text,
                  }}
                >
                  {avgReview}
                </p>
                <div>
                  <p
                    style={{
                      margin: "0 0 4px",
                      color: "#F59E0B",
                      fontSize: 16,
                    }}
                  >
                    {"★".repeat(Math.max(1, Math.round(avgReview)))}
                    {"☆".repeat(Math.max(0, 5 - Math.round(avgReview)))}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: T.sub }}>
                    Dựa trên {reviews.length} nhận xét
                  </p>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                {[
                  ["newest", "Mới nhất"],
                  ["highest", "Điểm cao"],
                  ["lowest", "Điểm thấp"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setReviewSort(key)}
                    style={{
                      border: `1px solid ${reviewSort === key ? T.primary : T.border}`,
                      background: reviewSort === key ? T.primaryLight : "#fff",
                      color: reviewSort === key ? T.primary : T.text,
                      borderRadius: 999,
                      padding: "6px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {reviews.length === 0 ? (
              <div
                style={{
                  background: "#fff",
                  border: `1px dashed ${T.border}`,
                  borderRadius: 14,
                  padding: 14,
                  color: T.sub,
                  fontSize: 14,
                }}
              >
                Chưa có comment cho món này.
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {sortedReviews.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: "#fff",
                      border: `1px solid ${T.border}`,
                      borderRadius: 14,
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 800, color: T.text }}>
                        {r.user}
                      </p>
                      <span style={{ fontSize: 12, color: T.sub }}>
                        {r.created_at}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0 0 6px",
                        color: "#F59E0B",
                        fontSize: 13,
                      }}
                    >
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: T.sub,
                        fontSize: 14,
                        lineHeight: 1.6,
                      }}
                    >
                      {r.comment}
                    </p>
                    {r.user === currentUserName && (
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <button
                          onClick={handleEditOwnReview}
                          style={{
                            border: "none",
                            borderRadius: 8,
                            background: T.primaryLight,
                            color: T.primary,
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "4px 8px",
                            cursor: "pointer",
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          onClick={handleDeleteOwnReview}
                          style={{
                            border: "none",
                            borderRadius: 8,
                            background: T.redBg,
                            color: T.red,
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "4px 8px",
                            cursor: "pointer",
                          }}
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
          <div style={{ marginTop: 36 }}>
            <SectionTitle>Món cùng danh mục</SectionTitle>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
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
