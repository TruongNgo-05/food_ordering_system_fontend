import React from "react";
import "../../assets/styles/SectionHeader.css";

const SectionHeader = ({
  label,
  title,
  description,
  extra,
  children,
  headingLevel = 2,
  centered = false,
  className = "",
}) => {
  const HeadingTag = `h${Math.min(Math.max(headingLevel, 1), 6)}`;

  return (
    <div
      className={`section-header ${centered ? "section-header--centered" : ""} ${className}`.trim()}
    >
      <div className="section-header-main">
        <div className="section-header-text">
          {label && <span className="section-header-label">{label}</span>}
          <HeadingTag className="section-header-title">{title}</HeadingTag>
          {description && (
            <p className="section-header-description">{description}</p>
          )}
        </div>
        {extra && <div className="section-header-extra">{extra}</div>}
      </div>
      {children && <div className="section-header-children">{children}</div>}
    </div>
  );
};

export default SectionHeader;
