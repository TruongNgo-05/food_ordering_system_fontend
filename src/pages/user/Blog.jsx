import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import "../../assets/styles/user/Blog.css";
import BookingTableModal from "../../components/modal/BookingTableModal";
import BookingModal from "../../components/modal/BookingModal";
import tableService from "../../services/user/tableService";
import { useNavigate } from "react-router-dom";
import { getBanner, getFoods } from "../../services/userService";

function genCaptcha() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 5 },
    () => c[Math.floor(Math.random() * c.length)],
  ).join("");
}

const Blog = () => {
  /* ── nav ── */
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── hero slider ── */
  const [slides, setSlides] = useState([]);
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);
  // food
  const [foods, setFoods] = useState([]);

  /* ── gallery lightbox ── */
  const [lightbox, setLightbox] = useState(null);

  /* ── modals ── */
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* ── booking form ── */
  const [selectedTable, setSelectedTable] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [note, setNote] = useState("");
  const [captcha, setCaptcha] = useState(genCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  /* scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await getBanner();

        const banners = (res.data?.data || []).map((item) => ({
          id: item.id,
          bg: item.imageUrl,
          eye: "JLER SKY RESTAURANT",
          title: item.title,
          sub: item.description,
        }));

        setSlides(banners);
      } catch (error) {
        console.error("Load banner failed:", error);
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const res = await getFoods({
          page: 0,
          size: 50,
        });

        setFoods(res.data?.data?.content || []);
      } catch (error) {
        console.error("Load foods failed:", error);
      }
    };

    loadFoods();
  }, []);
  /* hero auto-slide */
  const goSlide = (idx) => {
    setFading(true);
    setTimeout(() => {
      setSlide(idx);
      setFading(false);
    }, 300);
  };

  useEffect(() => {
    if (!slides.length) return;

    timerRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  /* booking submit */
  const handleBook = async (e) => {
    e.preventDefault();
    if (!customerName.trim()) return message.error("Vui lòng nhập họ tên");
    if (!customerPhone.trim())
      return message.error("Vui lòng nhập số điện thoại");
    if (!arrivalTime) return message.error("Vui lòng chọn thời gian đến");
    if (!selectedTable) return message.error("Vui lòng chọn bàn");
    if (captchaInput.trim().toUpperCase() !== captcha) {
      setCaptcha(genCaptcha());
      setCaptchaInput("");
      return message.error("Mã bảo mật không chính xác");
    }
    setSubmitting(true);
    try {
      await tableService.createBooking({
        customerName,
        customerPhone,
        tableId: selectedTable.tableId,
        note,
        timeComes: `${arrivalTime}:00`,
      });
      message.success("Đặt bàn thành công!");
      setCustomerName("");
      setCustomerPhone("");
      setNote("");
      setArrivalTime("");
      setSelectedTable(null);
      setCaptcha(genCaptcha());
      setCaptchaInput("");
    } catch (err) {
      message.error(err?.response?.data?.message || "Đặt bàn thất bại");
    } finally {
      setSubmitting(false);
    }
  };
  if (slides.length === 0) {
    return <div className="blog-loading-banner">Đang tải blog...</div>;
  }
  return (
    <div className="blog-page">
      {/* ══ NAVBAR ══ */}
      <nav id="blog_navbar" className={scrolled ? "blog_scrolled" : ""}>
        <div className="blog_nav-logo">
          <a href="#blog_hero" className="blog_logo-text">
            <span className="blog_logo-main">JLER</span>
            <span className="blog_logo-sub">SKY RESTAURANT</span>
          </a>
        </div>

        <ul className={`blog_nav-links ${menuOpen ? "blog_nav-open" : ""}`}>
          <li>
            <a href="#blog_about-us" onClick={() => setMenuOpen(false)}>
              Về Chúng Tôi
            </a>
          </li>
          <li>
            <a href="#blog_food" onClick={() => setMenuOpen(false)}>
              Thực Đơn
            </a>
          </li>
          <li>
            <a href="#blog_location" onClick={() => setMenuOpen(false)}>
              Địa Điểm
            </a>
          </li>

          <li>
            <button
              className="blog_btn-primary blog_nav-book"
              onClick={() => {
                setShowBookingModal(true);
                setMenuOpen(false);
              }}
            >
              Đặt Bàn
            </button>
          </li>
        </ul>

        <button
          className={`blog_burger ${menuOpen ? "blog_burger-open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* ══ HERO SLIDER ══ */}

      <section id="blog_hero" className="blog_hero">
        {slides.map((s) => (
          <div
            key={s.id}
            className={`blog_hero-slide ${
              s.id === slides[slide]?.id ? "blog_slide-active" : ""
            }`}
            style={{ backgroundImage: `url(${s.bg})` }}
          />
        ))}
        <div className="blog_hero-overlay" />

        <div className="blog_hero-content">
          {slides.length > 0 && (
            <>
              <p className="blog_hero-sub">{slides[slide]?.eye}</p>

              <h1 className="blog_hero-title">{slides[slide]?.title}</h1>

              <div className="blog_hero-divider" />

              <p className="blog_hero-tagline">{slides[slide]?.sub}</p>
            </>
          )}
          <p className="blog_hero-hours">
            Mở cửa hàng ngày từ 8:00 sáng – 22:00 đêm
          </p>
          <div className="blog_hero-btns">
            <button
              className="blog_btn-primary"
              onClick={() => setShowBookingModal(true)}
            >
              Đặt Bàn Ngay
            </button>
            <a
              href="https://maps.app.goo.gl/ZRvU42F4GJAFyTDk8"
              target="_blank"
              rel="noreferrer"
              className="blog_btn-outline"
            >
              Đánh Giá &amp; Bản Đồ Google
            </a>
          </div>
        </div>

        {/* dots */}
        <div className="blog_hero-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`blog_hero-dot ${i === slide ? "blog_dot-active" : ""}`}
              onClick={() => goSlide(i)}
            />
          ))}
        </div>

        <div className="blog_hero-scroll">
          <span>Cuộn</span>
          <div className="blog_scroll-line" />
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="blog_about-us">
        <div className="blog_about-text-col">
          <p className="blog_about-label">Chào Mừng Đến Với</p>
          <h2 className="blog_about-title">
            JLER Sky Restaurant
            <br />
            Hà Nội
          </h2>
          <p className="blog_about-text">
            Tận hưởng vẻ đẹp trọn vẹn khung cảnh Hà Nội từ tầng cao — nơi giao
            thoa giữa hương vị Việt Nam thuần túy và không gian sân thượng hiện
            đại. Điểm dừng lý tưởng cho những buổi chiều tà đẫm màu hoàng hôn.
          </p>
          <div className="blog_about-tags">
            <span className="blog_about-tag">#Top_1_food_Hanoi</span>
            <span className="blog_about-tag">#The_Best_Sky_Hanoi</span>
            <span className="blog_about-tag">
              #Best_Bar_in_Hanoi_Stunning_View
            </span>
          </div>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button
              className="blog_btn-primary"
              onClick={() => setShowBookingModal(true)}
            >
              Đặt Bàn Ngay
            </button>

            <button
              className="blog_btn-outline"
              onClick={() => window.open("/customer", "_blank")}
            >
              Trang chủ nhà hàng
            </button>
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
              Đại học Kinh doanh &amp; Công nghệ
            </span>
          </div>
        </div>
      </section>

      {/* ══ FOOD ══ */}
      <section id="blog_food" className="blog_food-section">
        <div className="blog_section-header">
          <span className="blog_section-label">Rooftop Dining</span>
          <h2 className="blog_section-title">Thực Đơn Việt Nam</h2>
          <div className="blog_section-rule" />
          <p className="blog_food-desc">
            Thưởng thức ẩm thực Việt Nam chính thống — hương vị địa phương kết
            hợp tầm nhìn ngoạn mục thành phố.
          </p>
          <p className="blog_food-hours">
            Phục vụ từ 08:00 – 22:00 · Gọi món cuối 21:30
          </p>
        </div>
        <div className="blog_food-slider">
          <div className="blog_food-track">
            {[...foods, ...foods].map((food, index) => (
              <div
                className="blog_food-card"
                key={`${food.id}-${index}`}
                onClick={() => setLightbox(food.image)}
              >
                <img src={food.image} alt={food.name} loading="lazy" />

                <div className="blog_food-overlay">
                  <span>{food.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a
            href="https://drive.google.com/file/d/1qpwItu_BH9yMxfeptIN0U2LPbvqX7Vqh/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="blog_btn-outline"
          >
            Xem Thực Đơn Đầy Đủ
          </a>
        </div>
      </section>

      {/* ══ LOCATION ══ */}
      <section id="blog_location" className="blog_location-section">
        <div className="blog_location-info">
          <span className="blog_section-label">Địa Chỉ</span>
          <h2 className="blog_section-title">Tìm Chúng Tôi</h2>
          <div className="blog_section-rule" style={{ margin: "0 0 32px" }} />
          <div className="blog_loc-rows">
            <div className="blog_loc-row">
              <span>📍</span>
              <div>
                <strong>Địa chỉ</strong>
                <p>Phố Cổ Hà Nội, Việt Nam</p>
              </div>
            </div>
            <div className="blog_loc-row">
              <span>🕐</span>
              <div>
                <strong>Giờ mở cửa</strong>
                <p>Hàng ngày: 08:00 – 22:00</p>
                <p>Phục vụ ăn: 08:00 – 21:30</p>
              </div>
            </div>
            <div className="blog_loc-row">
              <span>📞</span>
              <div>
                <strong>Liên hệ</strong>
                <p>
                  <a href="tel:+84389582843">+84 389 582 843</a>
                </p>
              </div>
            </div>
          </div>
          <a
            href="https://maps.app.goo.gl/K84QFPxF5bxJs9Qy7"
            target="_blank"
            rel="noreferrer"
            className="blog_btn-primary"
          >
            Google Maps &amp; Đánh Giá
          </a>
        </div>
        <div className="blog_location-map">
          <iframe
            title="JLER Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7449.639347082264!2d105.87513381083463!3d20.999864380561522!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aeaa17c35b81%3A0x79d8becf2f06f8dc!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaW5oIGRvYW5oIHbDoCBDw7RuZyBuZ2jhu4cgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1781265996050!5m2!1svi!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="blog_footer-top">
          <div className="blog_footer-brand">
            <p
              className="blog_logo-main"
              style={{ fontSize: "2rem", marginBottom: "4px" }}
            >
              JLER
            </p>
            <p className="blog_logo-sub" style={{ marginBottom: "16px" }}>
              SKY RESTAURANT
            </p>
            <p className="blog_footer-desc">
              Tận hưởng vẻ đẹp trọn vẹn khung cảnh Hà Nội với những món ăn đậm
              bản sắc Việt Nam từ tầng cao.
            </p>
          </div>
          <div>
            <h5>Giờ Mở Cửa</h5>
            <p>Hàng ngày: 08:00 – 23:50</p>
            <p>Phục vụ ăn: 11:00 – 22:00</p>
          </div>
          <div>
            <h5>Liên Hệ</h5>
            <a href="tel:+84389582843">+84 389 582 843</a>
            <a
              href="https://zalo.me/0389582843"
              target="_blank"
              rel="noreferrer"
            >
              Zalo
            </a>
            <a
              href="https://maps.app.goo.gl/BmNLUiEoo7PGbsHm6"
              target="_blank"
              rel="noreferrer"
            >
              Google Maps
            </a>
          </div>
        </div>
        <div className="blog_footer-bottom">
          <span>© 2026 JLER Sky Restaurant. Bản quyền thuộc về chúng tôi.</span>
          <span>Nhà hàng NQT Premium · Kinh Công</span>
        </div>
      </footer>

      {/* ══ FLOAT BUTTONS ══ */}
      <a
        href="https://zalo.me/0389582843"
        target="_blank"
        rel="noopener noreferrer"
        className="blog_float-call"
        title="Chat Zalo"
      >
        <span className="blog_float-ping" />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
          alt="Zalo"
        />
      </a>

      {/* ══ LIGHTBOX ══ */}
      {lightbox && (
        <div className="blog_lightbox" onClick={() => setLightbox(null)}>
          <button
            className="blog_lightbox-close"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img src={lightbox} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* ══ MODALS ══ */}
      <BookingModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
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
