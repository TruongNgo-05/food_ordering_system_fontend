import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/CustomerHome.css";

const BackToTopButton = ({
  threshold = 280,
  label = "Về đầu trang",
  className = "",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={`customer-back-to-top-btn ${className}`.trim()}
      aria-label={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <span className="customer-back-to-top-icon">
        <FontAwesomeIcon icon={faArrowUp} />
      </span>
      <span className="customer-back-to-top-text">{label}</span>
    </button>
  );
};

export default BackToTopButton;
