import React from "react";

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
  bg = "transparent",
}) {
  if (isImageSource(src)) {
    return (
      <img
        src={src}
        alt={alt}
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
        fontSize: textSize,
        lineHeight: 1,
      }}
    >
      {src || "🍽️"}
    </span>
  );
}
