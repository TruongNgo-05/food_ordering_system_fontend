import React from "react";
import "../../assets/styles/CustomerSearch.css";

const CustomerSearch = ({
  keyword,
  onKeywordChange,
  placeholder = "Tìm kiếm...",
  minDate,
  maxDate,
  onMinDateChange,
  onMaxDateChange,
  showDate = false,
}) => {
  return (
    <div className="customer-search">
      <input
        type="text"
        placeholder={placeholder}
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
      />

      {showDate && (
        <>
          <input
            type="date"
            value={minDate}
            onChange={(e) => onMinDateChange(e.target.value)}
          />

          <input
            type="date"
            value={maxDate}
            onChange={(e) => onMaxDateChange(e.target.value)}
          />
        </>
      )}
    </div>
  );
};

export default CustomerSearch;
