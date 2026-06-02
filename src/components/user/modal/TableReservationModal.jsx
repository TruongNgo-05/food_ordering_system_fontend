import React, { useState } from "react";

const TableReservationModal = ({ table, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    timeSlot: "18:00",
    guestCount: 2,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.timeSlot) {
      newErrors.timeSlot = "Vui lòng chọn khung giờ";
    }

    if (formData.guestCount < 1 || formData.guestCount > table.capacity) {
      newErrors.guestCount = `Số người phải từ 1 đến ${table.capacity}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Đặt bàn {table.number}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="table-info">
            <span className="info-badge">Sức chứa: {table.capacity} người</span>
          </div>

          <form onSubmit={handleSubmit} className="reservation-form">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Tên *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <span className="error-msg">{errors.phone}</span>
              )}
            </div>

            {/* Time Slot */}
            <div className="form-group">
              <label htmlFor="timeSlot">Khung giờ *</label>
              <select
                id="timeSlot"
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className={errors.timeSlot ? "error" : ""}
              >
                <option value="">-- Chọn khung giờ --</option>
                <option value="11:00">11:00 - 12:30 (Trưa)</option>
                <option value="12:00">12:00 - 13:30</option>
                <option value="13:00">13:00 - 14:30</option>
                <option value="17:00">17:00 - 18:30</option>
                <option value="18:00">18:00 - 19:30</option>
                <option value="19:00">19:00 - 20:30</option>
                <option value="20:00">20:00 - 21:30</option>
              </select>
              {errors.timeSlot && (
                <span className="error-msg">{errors.timeSlot}</span>
              )}
            </div>

            {/* Guest Count */}
            <div className="form-group">
              <label htmlFor="guestCount">
                Số người * (Tối đa {table.capacity})
              </label>
              <div className="guest-input">
                <button
                  type="button"
                  className="btn-minus"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      guestCount: Math.max(1, prev.guestCount - 1),
                    }))
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      guestCount: Math.min(
                        table.capacity,
                        Math.max(1, parseInt(e.target.value) || 1),
                      ),
                    }))
                  }
                  min="1"
                  max={table.capacity}
                  className={errors.guestCount ? "error" : ""}
                />
                <button
                  type="button"
                  className="btn-plus"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      guestCount: Math.min(table.capacity, prev.guestCount + 1),
                    }))
                  }
                >
                  +
                </button>
              </div>
              {errors.guestCount && (
                <span className="error-msg">{errors.guestCount}</span>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-submit">
              Xác nhận đặt bàn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TableReservationModal;
