import React, { useState, useEffect } from "react";
import { Input, Button, Image } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Upload } from "antd";

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
  const [imageFilePreviews, setImageFilePreviews] = useState({});

  useEffect(() => {
    const generatePreviews = async () => {
      const previews = {};
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file instanceof File && !previews[i]) {
          previews[i] = await fileToDataUrl(file);
        }
      }
      setImageFilePreviews(previews);
    };
    generatePreviews();
  }, [imageFiles]);

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
              preview={true}
            />
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{ position: "absolute", top: 2, right: 2 }}
              onClick={() => {
                const list = [...imageUrls];
                list.splice(i, 1);
                form.setFieldValue("additionalImages", list.join("\n"));
              }}
            />
          </div>
        ))}

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
                  preview={true}
                />
                <Button
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  style={{ position: "absolute", top: 2, right: 2 }}
                  onClick={() => {
                    const list = [...imageFiles];
                    list.splice(i, 1);
                    form.setFieldValue("imageFiles", list);
                  }}
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
              transition: "all 0.3s",
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
