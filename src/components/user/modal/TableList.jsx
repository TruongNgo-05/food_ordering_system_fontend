import React, { useState } from "react";

// Mock data for tables
const MOCK_TABLES = [
  { id: 1, number: "A01", capacity: 2, status: "CÓ SẴN" },
  { id: 2, number: "A02", capacity: 2, status: "ĐANG SỬ DỤNG" },
  { id: 3, number: "A03", capacity: 4, status: "CÓ SẴN" },
  { id: 4, number: "A04", capacity: 4, status: "ĐÃ ĐẶT TRƯỚC" },
  { id: 5, number: "B01", capacity: 2, status: "CÓ SẴN" },
  { id: 6, number: "B02", capacity: 2, status: "ĐÃ ĐẶT TRƯỚC" },
  { id: 7, number: "B03", capacity: 6, status: "ĐANG SỬ DỤNG" },
  { id: 8, number: "B04", capacity: 6, status: "CÓ SẴN" },
  { id: 9, number: "C01", capacity: 4, status: "CÓ SẴN" },
  { id: 10, number: "C02", capacity: 4, status: "ĐANG SỬ DỤNG" },
  { id: 11, number: "C03", capacity: 8, status: "CÓ SẴN" },
  { id: 12, number: "C04", capacity: 8, status: "ĐÃ ĐẶT TRƯỚC" },
];

const TableList = ({ onTableClick }) => {
  const [tables] = useState(MOCK_TABLES);

  const getStatusClass = (status) => {
    switch (status) {
      case "CÓ SẴN":
        return "available";
      case "ĐANG SỬ DỤNG":
        return "using";
      case "ĐÃ ĐẶT TRƯỚC":
        return "booked";
      default:
        return "";
    }
  };

  return (
    <section className="tables-section">
      <h3>Danh sách các bàn</h3>
      <div className="tables-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table-item ${getStatusClass(table.status)} ${
              table.status === "CÓ SẴN" ? "clickable" : ""
            }`}
            onClick={() => onTableClick(table)}
            style={{
              cursor: table.status === "CÓ SẴN" ? "pointer" : "default",
            }}
          >
            <div className="table-number">{table.number}</div>
            <div className="table-capacity">{table.capacity} người</div>
            <div className="table-status">{table.status}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TableList;
