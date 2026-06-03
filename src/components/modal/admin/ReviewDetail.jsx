import React, { useState } from "react";
import { Popconfirm, Rate } from "antd";

const RatingBadge = ({ rating }) => {
  const styles = {
    low: { background: "#FCEBEB", color: "#A32D2D" },
    mid: { background: "#FAEEDA", color: "#854F0B" },
    high: { background: "#EAF3DE", color: "#3B6D11" },
  };
  const key = rating <= 2 ? "low" : rating === 3 ? "mid" : "high";
  return (
    <span
      style={{
        ...styles[key],
        fontSize: 12,
        padding: "2px 10px",
        borderRadius: 99,
        fontWeight: 500,
      }}
    >
      {rating}★
    </span>
  );
};

const Avatar = ({ name }) => {
  const initials = (name || "")
    .trim()
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#E6F1FB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 500,
        color: "#185FA5",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
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
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: 16,
          fontSize: 15,
          display: "flex",
          alignItems: "center",
          gap: 4,
          color: "#555",
        }}
      >
        ← Quay lại
      </button>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* LEFT: Food info (sticky) */}
        <div
          style={{
            width: 260,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16,
          }}
        >
          {food.image ? (
            <img
              src={food.image}
              alt={food.foodName}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 10,
                marginBottom: 12,
              }}
            />
          ) : null}

          <div
            style={{
              width: "100%",
              height: 160,
              borderRadius: 10,
              marginBottom: 12,
              background: "#f5f5f5",
              display: food.image ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 50,
            }}
          >
            🍽️
          </div>

          <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{food.foodName}</h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <Rate disabled allowHalf value={avg} style={{ fontSize: 18 }} />

            <span
              style={{
                fontWeight: 600,
                fontSize: 18,
                color: "#222",
              }}
            >
              {avg.toFixed(1)}
            </span>
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#777",
              marginBottom: 14,
            }}
          >
            {food?.reviewCount || 0} đánh giá
          </div>

          {/* Filters */}
          <div
            style={{
              fontSize: 12,
              color: "#888",
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            Lọc theo sao
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 8,
                  border:
                    filter === f.key ? "1px solid #1677ff" : "1px solid #ddd",
                  background: filter === f.key ? "#e6f4ff" : "#f9f9f9",
                  cursor: "pointer",
                  fontSize: 13,
                  color: filter === f.key ? "#0958d9" : "#555",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: filter === f.key ? 500 : 400,
                }}
              >
                <span>{f.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    background: filter === f.key ? "#bae0ff" : "#eee",
                    color: filter === f.key ? "#0958d9" : "#888",
                    borderRadius: 99,
                    padding: "1px 8px",
                  }}
                >
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Reviews (scrollable) */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            maxHeight: 600,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
              Chưa có đánh giá nào
            </div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 10,
                  background: "#fff",
                }}
              >
                {/* Review header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <Avatar name={r.username} />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>
                        {r.username}
                      </div>
                      <div style={{ fontSize: 12, color: "#888" }}>
                        {new Date(r.createdAt).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <RatingBadge rating={r.rating} />
                    <Popconfirm
                      title="Xóa đánh giá?"
                      onConfirm={() => onDelete(r)}
                    >
                      <button
                        style={{
                          background: "none",
                          border: "1px solid #ddd",
                          borderRadius: 6,
                          padding: "3px 10px",
                          fontSize: 12,
                          cursor: "pointer",
                          color: "#666",
                        }}
                      >
                        Xóa
                      </button>
                    </Popconfirm>
                  </div>
                </div>

                {/* Stars */}
                <div style={{ marginBottom: 8 }}>
                  <Rate disabled value={r.rating} style={{ fontSize: 14 }} />
                </div>

                {/* Comment */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: "#444",
                    lineHeight: 1.6,
                  }}
                >
                  {r.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
