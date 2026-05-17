import React, { useState, useEffect } from "react";
import { Input, Button, Image, Upload, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import adminFoodService from "../../../services/admin/adminFoodService";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const parseAdditionalImages = (value) =>
  String(value || "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

const GalleryUpload = ({ form }) => {
  const imageUrls = parseAdditionalImages(
    form.getFieldValue("additionalImages") || "",
  );

  const imageFiles = form.getFieldValue("imageFiles") || [];

  const existingImages = form.getFieldValue("existingImages") || [];

  const [imageFilePreviews, setImageFilePreviews] = useState({});

  useEffect(() => {
    const generatePreviews = async () => {
      const previews = {};
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file instanceof File) {
          previews[i] = await fileToDataUrl(file);
        }
      }
      setImageFilePreviews(previews);
    };
    generatePreviews();
  }, [imageFiles]);

  // ================= DELETE IMAGE URL =================
  const handleDeleteUrl = (img, index) => {
    try {
      const list = [...imageUrls];
      list.splice(index, 1);

      form.setFieldValue("additionalImages", list.join("\n"));

      message.success("Đã xóa khỏi danh sách (sẽ cập nhật khi bấm Lưu)");
    } catch (err) {
      console.error(err);
      message.error("Xóa ảnh thất bại");
    }
  };

  // ================= DELETE FILE =================
  const handleDeleteFile = (index) => {
    const list = [...imageFiles];
    list.splice(index, 1);
    form.setFieldValue("imageFiles", list);
  };

  return (
    <>
      <Input.Search
        placeholder="Nhập link ảnh phụ"
        enterButton="Thêm"
        onSearch={(value) => {
          if (!value.trim()) return;

          form.setFieldValue(
            "additionalImages",
            [...imageUrls, value].join("\n"),
          );
        }}
        style={{ marginBottom: 10 }}
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {/* ================= URL IMAGES ================= */}
        {imageUrls.map((img, i) => (
          <div
            key={`url-${i}`}
            style={{
              position: "relative",
              width: 80,
              height: 80,
            }}
          >
            <Image
              src={img}
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />

            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{ position: "absolute", top: 2, right: 2 }}
              onClick={() => handleDeleteUrl(img, i)}
            />
          </div>
        ))}

        {/* ================= FILE IMAGES ================= */}
        {imageFiles.map((file, i) => (
          <div
            key={`file-${i}`}
            style={{
              position: "relative",
              width: 80,
              height: 80,
            }}
          >
            {imageFilePreviews[i] ? (
              <>
                <Image
                  src={imageFilePreviews[i]}
                  width={80}
                  height={80}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />

                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ position: "absolute", top: 2, right: 2 }}
                  onClick={() => handleDeleteFile(i)}
                />
              </>
            ) : (
              <div
                style={{
                  width: 80,
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#f3f4f6",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#999",
                }}
              >
                Loading...
              </div>
            )}
          </div>
        ))}

        {/* ================= UPLOAD ================= */}
        <Upload
          multiple
          showUploadList={false}
          beforeUpload={(file) => {
            const current = form.getFieldValue("imageFiles") || [];
            form.setFieldValue("imageFiles", [...current, file]);
            return false;
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              border: "1px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <PlusOutlined style={{ fontSize: 24, color: "#999" }} />
          </div>
        </Upload>
      </div>
    </>
  );
};

export default GalleryUpload;
