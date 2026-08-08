import React from "react";
import "../../assets/styles/Categories.css";

const Categories = ({
  categories = [],
  activeCategoryId = 0,
  onChange,
  className = "category-list",
  buttonClassName = "category-btn",
  activeButtonClassName = "active",
  buttonStyle = {},
  activeButtonStyle = {},
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {categories.map((cat) => {
        const isActive = activeCategoryId === cat.id;

        return (
          <button
            key={`cat-${cat.id}`}
            type="button"
            className={`${buttonClassName} ${isActive ? activeButtonClassName : ""}`}
            style={
              isActive ? { ...buttonStyle, ...activeButtonStyle } : buttonStyle
            }
            onClick={() => onChange(cat.id)}
          >
            {cat.icon ? (
              <span className="category-icon">{cat.icon}</span>
            ) : null}
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default Categories;
