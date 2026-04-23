import React, { useState } from "react";

const isImageSource = (value) => {
  if (typeof value !== "string") return false;
  const src = value.trim();
  if (!src) return false;

  return (
    src.startsWith("data:image/") ||
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/") ||
    src.startsWith("blob:")
  );
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

  const shouldShowImage = isImageSource(src) && !error;

  if (shouldShowImage) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
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
