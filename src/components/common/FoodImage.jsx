import React, { useState } from "react";

const getImageUrl = (src) => {
  if (!src || typeof src !== "string") return "";

  const trimmed = src.trim();

  // Nếu đã có full URL
  if (
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Nếu là path tương đối, ghép với API base URL
  if (trimmed.startsWith("/")) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
    const baseUrl = apiUrl.replace("/api", ""); // Xóa /api để lấy base domain
    return baseUrl + trimmed;
  }

  // Nếu không phải path tương đối nhưng cũng không phải full URL, coi như nó là file path từ backend
  // Thêm base URL của backend vào
  if (trimmed) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
    const baseUrl = apiUrl.replace("/api", "");
    return baseUrl + "/" + trimmed;
  }

  return "";
};

const isValidImageUrl = (value) => {
  const url = getImageUrl(value);
  return url.length > 0;
};

export default function FoodImage({
  src,
  alt = "food",
  size = 40,
  radius = 10,
  textSize = 20,
  bg = "#f3f4f6",
}) {
  const [error, setError] = useState(false);

  const imageUrl = getImageUrl(src);
  const shouldShowImage = isValidImageUrl(src) && !error;
  
  // Debug: check actual URL
  if (src && src.trim()) {
    console.log(`[FoodImage] src: "${src}" -> url: "${imageUrl}"`);
  }

  if (shouldShowImage) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        onError={() => {
          console.error(`[FoodImage] Failed to load: ${imageUrl}`);
          setError(true);
        }}
        style={{
          width: size,
          height: size,
          objectFit: "cover",
          borderRadius: radius,
          display: "block",
          background: bg,
        }}
      />
    );
  }

  return (
    <span
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: textSize,
        background: bg,
        borderRadius: radius,
      }}
    >
      🍽️
    </span>
  );
}
