import React from "react";
import "../../assets/styles/FloatingIcon.css";

/**

 * @param {string} type 
 * @param {string} [label] 
 * @param {function} [onClick] 
 * @param {string} [className] 
 */
const FloatingIcon = ({ type = "zalo", label, onClick, className = "" }) => {
  const baseClass = `floating-icon floating-icon-${type}`;

  if (type === "zalo") {
    return (
      <a
        href="https://zalo.me/0389582843"
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${className}`}
        title="Chat Zalo"
      >
        <span className="floating-icon-ping" />
        <span className="floating-icon-content">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
            alt="Zalo"
            className="floating-icon-img"
          />
        </span>
        {label && <span className="floating-icon-label">{label}</span>}
      </a>
    );
  }

  if (type === "chat") {
    return (
      <button
        className={`${baseClass} ${className}`}
        onClick={onClick}
        title="Chat AI"
      >
        <span className="floating-icon-ping" />
        <span className="floating-icon-content">💬</span>
        {label && <span className="floating-icon-label">{label}</span>}
      </button>
    );
  }

  return null;
};

export default FloatingIcon;
