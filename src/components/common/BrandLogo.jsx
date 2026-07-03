import React from "react";
import "../../assets/styles/BrandLogo.css";

const BrandLogo = ({
  as = "a",
  href = "#",
  onClick,
  className = "",
  ariaLabel = "Về trang chủ",
  ...props
}) => {
  const Component = as === "button" ? "button" : "a";

  const sharedProps = {
    className: `brand-logo ${className}`.trim(),
    onClick,
    "aria-label": ariaLabel,
    ...props,
  };

  if (as === "button") {
    return (
      <Component type="button" {...sharedProps}>
        <span className="brand-logo__main">JLER</span>
        <span className="brand-logo__sub">SKY RESTAURANT</span>
      </Component>
    );
  }

  return (
    <Component href={href} {...sharedProps}>
      <span className="brand-logo__main">JLER</span>
      <span className="brand-logo__sub">SKY RESTAURANT</span>
    </Component>
  );
};

export default BrandLogo;
