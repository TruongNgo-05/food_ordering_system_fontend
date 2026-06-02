import React, { useState } from "react";
import UserHeader from "../../components/user/UserHeader";
import TableList from "../../components/user/modal/TableList";
import TableReservationModal from "../../components/user/modal/TableReservationModal";
import "../../assets/styles/user/TableReservation.css";

const TableReservation = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableClick = (table) => {
    if (table.status === "CÓ SẴN") {
      setSelectedTable(table);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTable(null);
  };

  const handleSubmit = (formData) => {
    console.log("Booking data:", {
      ...formData,
      tableNumber: selectedTable.number,
    });
    // TODO: Send to API
    setShowModal(false);
    setSelectedTable(null);
  };

  return (
    <div className="table-reservation-page">
      <UserHeader
        title="Đặt bàn"
        description="Chọn bàn yêu thích và đặt ngay"
      />

      <div className="table-reservation-container">
        {/* Contact Button Section */}
        <section className="contact-section">
          <h2>Liên hệ đặt bàn</h2>
          <p>
            Chọn bàn từ danh sách bên dưới. Bàn có sẵn có thể đặt ngay, các bàn
            khác vui lòng quay lại sau hoặc liên hệ trực tiếp
          </p>
          <div className="contact-info">
            <div className="info-item">
              <span className="info-label">Điện thoại:</span>
              <span className="info-value">024 3826 5050</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">hello@nhahang-nqt.vn</span>
            </div>
          </div>
        </section>

        {/* Table Status Legend */}
        <section className="status-legend">
          <div className="legend-item">
            <span className="legend-dot available"></span>
            <span>Có sẵn</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot using"></span>
            <span>Đang sử dụng</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot booked"></span>
            <span>Đã đặt trước</span>
          </div>
        </section>

        {/* Tables List */}
        <TableList onTableClick={handleTableClick} />
      </div>

      {/* Modal */}
      {showModal && selectedTable && (
        <TableReservationModal
          table={selectedTable}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TableReservation;
