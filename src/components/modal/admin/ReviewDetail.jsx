import React, { useState } from "react";
import { Popconfirm, Rate } from "antd";
import "../../../assets/styles/admin/ReviewDetail.css";

const RatingBadge = ({ rating }) => {
  const key = rating <= 2 ? "low" : rating === 3 ? "mid" : "high";
  return <span className={`review-detail-badge ${key}`}>{rating}★</span>;
};

const FILTERS = [
  { key: "all", label: "Tất cả" },
  { key: "high", label: "4-5 ★" },
  { key: "mid", label: "3 ★" },
  { key: "low", label: "1-2 ★" },
];

const ReviewDetail = ({ food, rows = [], onBack, onDelete }) => {
  const [filter, setFilter] = useState("all");

  const avg = food?.averageRating || 0;

  const counts = {
    all: rows.length,
    high: rows.filter((r) => r.rating >= 4).length,
    mid: rows.filter((r) => r.rating === 3).length,
    low: rows.filter((r) => r.rating <= 2).length,
  };

  const filtered = rows.filter((r) => {
    if (filter === "high") return r.rating >= 4;
    if (filter === "mid") return r.rating === 3;
    if (filter === "low") return r.rating <= 2;
    return true;
  });

  return (
    <div className="review-detail-shell">
      <button onClick={onBack} className="review-detail-back-btn">
        ← Quay lại
      </button>

      <div className="review-detail-layout">
        <div className="review-detail-sidebar">
          {food.image ? (
            <img
              src={food.image}
              alt={food.foodName}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
              className="review-detail-image"
            />
          ) : null}

          <div
            className="review-detail-image-fallback"
            style={{ display: food.image ? "none" : "flex" }}
          >
            🍽️
          </div>

          <h3 className="review-detail-title">{food.foodName}</h3>

          <div className="review-detail-rating-row">
            <Rate disabled allowHalf value={avg} style={{ fontSize: 18 }} />

            <span className="review-detail-rating-value">{avg.toFixed(1)}</span>
          </div>

          <div className="review-detail-review-count">
            {food?.reviewCount || 0} đánh giá
          </div>

          <div className="review-detail-filters-title">Lọc theo sao</div>
          <div className="review-detail-filter-list">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`review-detail-filter-button ${
                  filter === f.key ? "active" : ""
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`review-detail-filter-count ${
                    filter === f.key ? "active" : ""
                  }`}
                >
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Reviews (scrollable) */}
        <div className="review-detail-list">
          {filtered.length === 0 ? (
            <div className="review-detail-empty">Chưa có đánh giá nào</div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="review-detail-card">
                {/* Review header */}
                <div className="review-detail-header">
                  <div className="review-detail-user-info">
                    <div className="review-detail-username">{r.username}</div>
                    <div className="review-detail-date">
                      {new Date(r.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>

                  <div className="review-detail-actions">
                    <RatingBadge rating={r.rating} />
                    <Popconfirm
                      title="Xóa đánh giá?"
                      onConfirm={() => onDelete(r)}
                    >
                      <button className="review-detail-delete-btn">Xóa</button>
                    </Popconfirm>
                  </div>
                </div>

                <div className="review-detail-stars">
                  <Rate disabled value={r.rating} style={{ fontSize: 14 }} />
                </div>

                <p className="review-detail-comment">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
