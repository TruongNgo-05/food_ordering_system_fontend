import React from "react";
import "../../assets/styles/user/BrandLogo.css";

const BrandLogo = ({
  as: Component = "a",
  href,
  to,
  onClick,
  className = "",
  ariaLabel = "Về trang chủ",
  ...props
}) => {
  const sharedProps = {
    className: `brand-logo ${className}`.trim(),
    onClick,
    "aria-label": ariaLabel,
    ...props,
  };

  if (Component === "button") {
    return (
      <button type="button" {...sharedProps}>
        <span className="brand-logo__main">JLER</span>
        <span className="brand-logo__sub">SKY RESTAURANT</span>
      </button>
    );
  }

  return (
    <Component {...sharedProps} {...(to ? { to } : { href })}>
      <span className="brand-logo__main">JLER</span>
      <span className="brand-logo__sub">SKY RESTAURANT</span>
    </Component>
  );
};

export default BrandLogo;
