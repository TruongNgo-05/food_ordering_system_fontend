import React, { useEffect, useMemo, useState } from "react";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import { T } from "../../constants/customerTheme";
import { SectionTitle } from "../../components/customer/SharedUI";

import orderService from "../../services/customer/orderService";
import reviewService from "../../services/customer/reviewService";

const FoodReviews = ({
  itemId,
  fallbackRating = 0,
  isLoggedIn,
  requireLoginAction,
  onStatsChange,
}) => {
  const [showReviews, setShowReviews] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewSort, setReviewSort] = useState("newest");



  const fetchReviews = async () => {
    try {
      const res = await reviewService.getReviewByFood(itemId);

      setReviews(res?.data?.data?.content || []);
    } catch (err) {
      console.error("Lỗi load review:", err);

      setReviews([]);
    }
  };

  useEffect(() => {
    if (itemId) {
      fetchReviews();
    }

  }, [itemId]);



  const [reviewEligibility, setReviewEligibility] = useState({
    loading: false,
    canReview: false,
  });

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!isLoggedIn || !itemId) {
        setReviewEligibility({
          loading: false,
          canReview: false,
        });

        return;
      }

      try {
        setReviewEligibility({
          loading: true,
          canReview: false,
        });

        const res = await orderService.myOrders({
          page: 0,
          size: 50,
        });

        const orders = res?.data?.data?.content || [];

        const canReview = orders.some((order) => {
          const status = String(order?.status || "").toUpperCase();

          const items = Array.isArray(order?.items) ? order.items : [];

          return (
            status === "COMPLETED" &&
            items.some(
              (orderItem) =>
                Number(orderItem?.foodId ?? orderItem?.id) === Number(itemId),
            )
          );
        });

        setReviewEligibility({
          loading: false,
          canReview,
        });
      } catch (err) {
        console.error("Check review eligibility error:", err);

        setReviewEligibility({
          loading: false,
          canReview: false,
        });
      }
    };

    if (itemId) {
      checkReviewEligibility();
    }
  }, [itemId, isLoggedIn]);

  

  const { user } = useAuth();

  const currentUserName = useMemo(() => {
    if (!user) return "Bạn";
    return user.username || user.fullName || user.name || user.email || "Bạn";
  }, [user]);

  const isOwnReview = (review) => {
    if (!user || !review) return false;

    const reviewName = String(review.username || review.userName || "").trim();
    const candidateNames = [user.username, user.fullName, user.name, user.email]
      .filter(Boolean)
      .map((value) => String(value).trim());

    if (candidateNames.includes(reviewName)) {
      return true;
    }

    if (review.userId && (user.id || user.userId)) {
      return (
        String(review.userId) === String(user.id) ||
        String(review.userId) === String(user.userId)
      );
    }

    return false;
  };



  const ownReview = useMemo(() => {
    return reviews.find((review) => isOwnReview(review));
  }, [reviews, user]);



  const sortedReviews = useMemo(() => {
    const list = [...reviews];

    if (reviewSort === "highest") {
      return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    if (reviewSort === "lowest") {
      return list.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
    }

    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [reviews, reviewSort]);



  const avgReview = useMemo(() => {
    if (!reviews.length) {
      return Number(fallbackRating || 0);
    }

    const total = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    return Number((total / reviews.length).toFixed(1));
  }, [reviews, fallbackRating]);



  useEffect(() => {
    onStatsChange?.({ avgReview, count: reviews.length });
   
  }, [avgReview, reviews.length]);



  const handleEditOwnReview = () => {
    if (!ownReview) {
      return;
    }

    setEditingReviewId(ownReview.id);
    setNewRating(Number(ownReview.rating || 5));
    setNewComment(ownReview.comment || "");
  };

  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    setNewRating(5);
    setNewComment("");
  };



  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      requireLoginAction();
      return;
    }

    if (!reviewEligibility.canReview) {
      toast.info(
        "Bạn chỉ có thể đánh giá sau khi đơn hàng chứa món này đã hoàn tất.",
      );

      return;
    }

    if (!newComment.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá");

      return;
    }

    try {
      await reviewService.createReview({
        foodId: itemId,
        rating: newRating,
        comment: newComment.trim(),
      });

      toast.success("Đánh giá thành công!");

      setNewComment("");
      setNewRating(5);

      await fetchReviews();
    } catch (err) {
      const msg = err?.response?.data?.message || "Gửi đánh giá thất bại!";

      toast.error(msg);
    }
  };

  const handleUpdateReview = async () => {
    if (!editingReviewId) {
      return;
    }

    if (!reviewEligibility.canReview) {
      toast.info(
        "Bạn chỉ có thể đánh giá sau khi đơn hàng chứa món này đã hoàn tất.",
      );

      return;
    }

    if (!newComment.trim()) {
      toast.warning("Vui lòng nhập nội dung đánh giá");

      return;
    }

    try {
      await reviewService.updateReview(editingReviewId, {
        rating: newRating,
        comment: newComment.trim(),
      });

      toast.success("Cập nhật thành công!");

      setEditingReviewId(null);
      setNewComment("");
      setNewRating(5);

      await fetchReviews();
    } catch (err) {
      console.error("Update review error:", err);

      const msg = err?.response?.data?.message || "Cập nhật thất bại!";

      toast.error(msg);
    }
  };

  const handleDeleteOwnReview = async () => {
    if (!ownReview) {
      return;
    }

    try {
      await reviewService.deleteReview(ownReview.id);

      toast.success("Xóa thành công!");

      setEditingReviewId(null);
      setNewComment("");
      setNewRating(5);

      await fetchReviews();
    } catch (err) {
      console.error("Delete review error:", err);

      toast.error("Xóa thất bại!");
    }
  };

 

  return (
    <>
      <button
        onClick={() => setShowReviews((prev) => !prev)}
        className="fd-toggle-reviews-btn"
        style={{
          borderColor: T.border,
          color: T.text,
        }}
      >
        {showReviews ? "Ẩn comment & đánh giá" : "Xem comment & đánh giá"}
      </button>

      {showReviews && (
        <div className="fd-reviews-section">
          <SectionTitle count={reviews.length}>Đánh giá & comment</SectionTitle>

          {/* WRITE REVIEW */}

          {reviewEligibility.loading ? (
            <div
              className="fd-write-review-box"
              style={{ background: T.card, borderColor: T.border }}
            >
              <p className="fd-write-review-title" style={{ color: T.text }}>
                Đang kiểm tra đơn hàng...
              </p>
            </div>
          ) : reviewEligibility.canReview ? (
            <div
              className="fd-write-review-box"
              style={{ background: T.card, borderColor: T.border }}
            >
              <p className="fd-write-review-title" style={{ color: T.text }}>
                {editingReviewId
                  ? "Chỉnh sửa đánh giá"
                  : "Viết đánh giá của bạn"}
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
                    Bạn đã đánh giá món này.
                  </span>
                </div>
              )}

              <div className="fd-star-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="fd-star-btn"
                    style={{
                      cursor: "pointer",
                      color: star <= newRating ? "#F59E0B" : "#D1D5DB",
                    }}
                    title={`${star} sao`}
                  >
                    ★
                  </button>
                ))}
              </div>

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
                  placeholder="Chia sẻ cảm nhận của bạn..."
                  className="fd-comment-input"
                  style={{ borderColor: T.border }}
                />

                <button
                  onClick={
                    editingReviewId ? handleUpdateReview : handleSubmitComment
                  }
                  className="fd-comment-submit-btn"
                  style={{ background: T.primary, cursor: "pointer" }}
                >
                  {editingReviewId ? "Cập nhật" : "Gửi"}
                </button>

                {editingReviewId && (
                  <button
                    onClick={handleCancelEditReview}
                    type="button"
                    style={{
                      border: `1px solid ${T.border}`,
                      background: T.card,
                      color: T.sub,
                      borderRadius: 8,
                      padding: "0 14px",
                      cursor: "pointer",
                    }}
                  >
                    Hủy
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              className="fd-write-review-box"
              style={{ background: T.card, borderColor: T.border }}
            >
              <p className="fd-write-review-title" style={{ color: T.text }}>
                Bạn chưa thể đánh giá món này
              </p>

              <p style={{ color: T.sub, margin: 0 }}>
                Chỉ có thể gửi đánh giá sau khi đơn hàng chứa món này đã hoàn
                tất.
              </p>
            </div>
          )}

          {/* SUMMARY */}

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
                  {"★".repeat(Math.min(5, Math.max(0, Math.round(avgReview))))}
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
                    background:
                      reviewSort === key ? T.primaryLight : "transparent",
                    color: reviewSort === key ? T.primary : T.text,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* LIST */}

          {reviews.length === 0 ? (
            <div
              className="fd-no-reviews"
              style={{ borderColor: T.border, color: T.sub }}
            >
              Chưa có comment cho món này.
            </div>
          ) : (
            <div className="fd-review-list">
              {sortedReviews.map((review) => (
                <div
                  key={review.id}
                  className="fd-review-card"
                  style={{ borderColor: T.border }}
                >
                  <div className="fd-review-card-header">
                    <p className="fd-review-user" style={{ color: T.text }}>
                      {review.username}
                    </p>

                    <span className="fd-review-date" style={{ color: T.sub }}>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </div>

                  <p className="fd-review-stars">
                    {"★".repeat(Number(review.rating || 0))}
                    {"☆".repeat(Math.max(0, 5 - Number(review.rating || 0)))}
                  </p>

                  <p className="fd-review-comment" style={{ color: T.sub }}>
                    {review.comment}
                  </p>

                  {isOwnReview(review) && (
                    <>
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

                        <Popconfirm
                          title="Bạn có chắc muốn xóa bình luận này không?"
                          okText="Xóa"
                          cancelText="Hủy"
                          onConfirm={handleDeleteOwnReview}
                        >
                          <button
                            className="fd-review-delete-btn"
                            style={{ background: T.redBg, color: T.red }}
                          >
                            Xóa
                          </button>
                        </Popconfirm>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FoodReviews;
