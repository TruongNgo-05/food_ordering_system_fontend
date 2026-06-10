import React, { useState } from "react";
import { message } from "antd";
import "../../assets/styles/user/Blog.css";
import BookingTableModal from "../../components/modal/BookingTableModal";
import tableService from "../../services/user/tableService";

const Blog = () => {
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [arrivalTime, setArrivalTime] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");

  const handleBook = async (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      return message.error("Vui lòng nhập họ tên");
    }

    if (!customerPhone.trim()) {
      return message.error("Vui lòng nhập số điện thoại");
    }

    if (!arrivalTime) {
      return message.error("Vui lòng chọn thời gian đến");
    }

    if (!selectedTable) {
      return message.error("Vui lòng chọn bàn");
    }

    try {
      const payload = {
        customerName,
        customerPhone,
        tableId: selectedTable.tableId,
        note,
        timeComes: `${arrivalTime}:00`,
      };

      await tableService.createBooking(payload);

      message.success("Đặt bàn thành công!");

      setCustomerName("");
      setCustomerPhone("");
      setNote("");
      setArrivalTime("");
      setSelectedTable(null);
    } catch (error) {
      console.error(error);

      message.error(error?.response?.data?.message || "Đặt bàn thất bại");
    }
  };

  return (
    <div className="blog-page">
      {/* THANH ĐIỀU HƯỚNG */}
      <nav id="blog_navbar">
        <div className="blog_nav-logo">
          <a href="#">
            <img src="../../assets/images/logo.png" alt="JLER Sky Bar" />
          </a>
        </div>

        <ul className="blog_nav-links">
          <li>
            <a href="#blog_about-us">Về Chúng Tôi</a>
          </li>
          <li>
            <a href="#blog_food">Thực Đơn</a>
          </li>
          <li>
            <a href="#blog_location">Địa Điểm</a>
          </li>
          <li>
            <a href="#blog_book-a-table" className="blog_nav-book">
              Đặt Bàn
            </a>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="blog_hero">
        <div className="blog_hero-bg"></div>

        <div className="blog_hero-content">
          <p className="blog_hero-sub">Quán Bar Sân Thượng · Phố Cổ Hà Nội</p>

          <h1 className="blog_hero-title">
            JLER
            <br />
            SKY BAR
          </h1>

          <div className="blog_hero-divider"></div>

          <p className="blog_hero-tagline">Nhà hàng NQT Premium · Kinh Công</p>

          <p className="blog_hero-hours">
            Mở cửa hàng ngày từ 8:00 sáng – 23:50 đêm
          </p>

          <div className="blog_hero-btns">
            <a href="#blog_book-a-table" className="blog_btn-primary">
              Đặt Bàn
            </a>
            <a
              href="https://maps.app.goo.gl/K84QFPxF5bxJs9Qy7"
              target="_blank"
              rel="noreferrer"
              className="blog_btn-outline"
            >
              Đánh Giá & Bản Đồ Google
            </a>
          </div>
        </div>

        <div className="blog_hero-scroll">
          <span>Cuộn</span>
          <div className="blog_scroll-line"></div>
        </div>
      </section>

      {/* NỔI BẬT */}
      <div className="blog_highlights">
        <div className="blog_highlight-item">
          <div className="blog_highlight-text">
            <strong>Tầm Nhìn Toàn Cảnh</strong>
            <span>Đường chân trời Hà Nội & Phố Cổ</span>
          </div>
        </div>
        <div className="blog_highlight-item">
          <div className="blog_highlight-text">
            <strong>Trà sữa Đậm vị</strong>
            <span>Đồ uống đặc trưng & thức uống sáng tạo</span>
          </div>
        </div>
        <div className="blog_highlight-item">
          <div className="blog_highlight-text">
            <strong>Ẩm Thực Việt Nam</strong>
            <span>Món ăn truyền thống & fusion</span>
          </div>
        </div>
        <div className="blog_highlight-item">
          <div className="blog_highlight-text">
            <strong>Không Khí Sôi Động</strong>
            <span>Âm nhạc & không gian ngoài trời</span>
          </div>
        </div>
      </div>

      {/* GIỚI THIỆU */}
      <section id="blog_about-us">
        <div>
          <p className="blog_about-label">Chào Mừng Đến Với</p>

          <h2 className="blog_about-title">
            JLER Sky Bar
            <br />
            Hà Nội
          </h2>

          <p className="blog_about-text">
            Tận hưởng vẻ đẹp trọn vẹn khung cảnh Hà Nội với những món ăn đậm bản
            sắc Việt Nam.
          </p>

          <div className="blog_about-tags">
            <span className="blog_about-tag">#Top_1_food_Hanoi</span>
            <span className="blog_about-tag">#The_Best_Sky_Hanoi</span>
            <span className="blog_about-tag">
              #Best_Bar_in_Hanoi_Stunning_View
            </span>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#blog_book-a-table" className="blog_btn-primary">
              Đặt Ngay
            </a>
            <a
              href="https://solarrooftopbar.com/UploadFile/PDF-MENU/SOLAR-DRINKS.pdf"
              target="_blank"
              rel="noreferrer"
              className="blog_btn-outline"
            >
              Xem Thực Đơn
            </a>
          </div>
        </div>

        <div className="blog_about-img-wrap">
          <img
            className="blog_about-img-main"
            src="https://solarrooftopbar.com/UploadFile/Gallery/Moment- Gallery/Solar-Sky-Bar-hanoi-36.jpg"
            alt=""
          />
          <img
            className="blog_about-img-accent"
            src="https://solarrooftopbar.com/UploadFile/Gallery/Drink-Gallery/Solar-Sky-Bar-hanoi-14.jpg"
            alt=""
          />
          <div className="blog_about-stat">
            <span className="blog_about-stat-num">TH28.06</span>
            <span className="blog_about-stat-lbl">
              Trường đại học kinh doanh và công nghệ
            </span>
          </div>
        </div>
      </section>

      {/* ĐẶT BÀN */}
      <section id="blog_book-a-table">
        <div className="blog_book-inner">
          <div className="blog_section-header">
            <span className="blog_section-label">Đặt Chỗ</span>
            <h2 className="blog_section-title">Đặt Bàn</h2>
            <div className="blog_section-rule"></div>
          </div>

          <form className="blog_book-form" onSubmit={handleBook}>
            <div className="blog_form-group">
              <label>Họ và Tên</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Họ và tên của bạn"
              />
            </div>

            <div className="blog_form-group">
              <label>Số Điện Thoại</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+84..."
              />
            </div>

            <div className="blog_form-group blog_full">
              <label>Lời Nhắn</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Yêu cầu đặc biệt..."
              />
            </div>

            <div className="blog_form-group">
              <label>Thời Gian Đến</label>
              <input
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* CHỌN BÀN */}
            <div className="blog_form-group blog_full">
              <label>Bàn Đã Chọn</label>
              <div className="blog_table-picker-row">
                <div
                  className={`blog_table-preview${selectedTable ? " has-table" : ""}`}
                >
                  {selectedTable ? (
                    <>
                      <span className="blog_preview-id">
                        {selectedTable.tableNumber}
                      </span>
                    </>
                  ) : (
                    <span className="blog_preview-empty">Chưa chọn bàn</span>
                  )}
                </div>
                <button
                  type="button"
                  className="blog_pick-table-btn"
                  onClick={() => setShowModal(true)}
                >
                  {selectedTable ? "Đổi Bàn" : "Chọn Bàn"}
                </button>
              </div>
            </div>

            <button type="submit" className="blog_form-submit">
              Xác Nhận Đặt Bàn
            </button>
          </form>
        </div>
      </section>

      {/* CHÂN TRANG */}
      <footer>
        <div className="blog_footer-bottom">
          <span>© 2026 JLER Sky Bar. Bản quyền thuộc về chúng tôi.</span>
        </div>
      </footer>

      <a href="#blog_book-a-table" className="blog_float-book">
        🗓 Đặt Bàn
      </a>

      {/* MODAL CHỌN BÀN */}
      <BookingTableModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={(table) => setSelectedTable(table)}
        selectedTable={selectedTable}
      />
    </div>
  );
};

export default Blog;
