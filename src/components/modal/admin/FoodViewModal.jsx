import React, { useState, useMemo, useEffect } from "react";
import { Modal, Tag } from "antd";
import FoodImage from "../../common/FoodImage";

const formatPrice = (v) => `${Number(v || 0).toLocaleString("vi-VN")}đ`;

const FoodViewModal = ({ open, onCancel, record, categories = [] }) => {
  const [activeImage, setActiveImage] = useState("");

  const galleryImages = useMemo(() => {
    if (!record) return [];

    return [...(record.image ? [record.image] : []), ...(record.images || [])];
  }, [record]);
  console.log("VIEW RECORD:", record);

  useEffect(() => {
    if (!record) return;
    setActiveImage(record.image || "");
  }, [record?.id, open]);

  const displayImage = activeImage || galleryImages[0] || record?.image || "";

  if (!record) return null;
  const categoryName =
    record.category_name ||
    categories.find((c) => c.id === record.category_id)?.name ||
    "—";

  return (
    <Modal
      title="Chi tiết món ăn"
      open={open}
      onCancel={() => {
        setActiveImage("");
        onCancel();
      }}
      footer={null}
      width={640}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* LEFT: ảnh */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: 16,
              overflow: "hidden",
              background: "#FFF7ED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FoodImage
              src={displayImage}
              size="100%"
              radius={0}
              textSize={80}
            />
          </div>

          {galleryImages.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 10,
                    overflow: "hidden",
                    border:
                      displayImage === img
                        ? "2px solid #F97316"
                        : "1.5px solid #e5e7eb",
                    background: "#fff",
                    padding: 0,
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <FoodImage src={img} size="100%" radius={0} textSize={20} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: thông tin */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Danh mục */}
          <span
            style={{
              display: "inline-block",
              background: "#FFF7ED",
              color: "#F97316",
              fontSize: 12,
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: 99,
              alignSelf: "flex-start",
              border: "1px solid #FED7AA",
            }}
          >
            {categoryName}
          </span>

          {/* Tên */}
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 900,
              color: "#111827",
              lineHeight: 1.3,
            }}
          >
            {record.name}
          </h2>

          {/* Mô tả */}
          {record.description && (
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#6B7280",
                lineHeight: 1.7,
              }}
            >
              {record.description}
            </p>
          )}
          {/* Rating + Sold */}
          <div style={{ display: "flex", gap: 16 }}>
            {record.rating != null && (
              <span>
                ⭐ <strong>{record.rating}</strong>
              </span>
            )}

            {record.soldCount != null && (
              <span>
                🔥 <strong>{record.soldCount}</strong> đã bán
              </span>
            )}
          </div>

          {/* Giá */}
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 12, color: "#9CA3AF" }}>
              Giá bán
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 900,
                color: "#F97316",
              }}
            >
              {formatPrice(record.price)}
            </p>
          </div>

          {/* Trạng thái */}
          <div>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "#9CA3AF" }}>
              Trạng thái
            </p>
            <Tag
              color={record.status === "active" ? "green" : "red"}
              style={{ fontWeight: 700, fontSize: 13 }}
            >
              {record.status === "active" ? "✓ Đang bán" : "✗ Tạm hết"}
            </Tag>
          </div>

          {/* Footer: ID + ngày tạo */}
          <div
            style={{
              marginTop: "auto",
              background: "#F9FAFB",
              borderRadius: 10,
              padding: "8px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>
              ID: <strong style={{ color: "#374151" }}>#{record.id}</strong>
            </span>
            {record.createdAt && (
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                Tạo lúc:{" "}
                <strong style={{ color: "#374151" }}>
                  {new Date(record.createdAt).toLocaleString("vi-VN")}
                </strong>
              </span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FoodViewModal;
