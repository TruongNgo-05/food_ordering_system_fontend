import React, { useState, useEffect } from "react";
import "../../assets/styles/user/Blog.css";

import BookingModal from "../../components/user/booking/BookingModal";
import Banner from "../../components/customer/Banner";
import CustomerChatWidget from "../../components/customer/CustomerChatWidget";
import BackToTopButton from "../../components/common/BackToTopButton";
import BrandLogo from "../../components/common/BrandLogo";
import SectionHeader from "../../components/common/SectionHeader";
import Footer from "../../layouts/Footer";

import { useNavigate } from "react-router-dom";
import { getBanner, getFoods } from "../../services/userService";

const Blog = () => {
  /* ── nav ── */
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── hero slider ── */
  const [slides, setSlides] = useState([]);
  const [foods, setFoods] = useState([]);

  /* ── gallery lightbox ── */
  const [lightbox, setLightbox] = useState(null);

  /* ── modals ── */
  const [showBookingModal, setShowBookingModal] = useState(false);

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
          title: item.title,
          desc: item.description,
          image: item.imageUrl,
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

  if (slides.length === 0) {
    return <div>Đang tải blog...</div>;
  }
  return (
    <div className="blog-page">
      {/* ══ NAVBAR ══ */}
      <header
        id="blog_navbar"
        className={`header header--customer ${scrolled ? "header--scrolled" : ""}`}
      >
        <div className="header-brand">
          <BrandLogo
            as="button"
            className="header-logo-text"
            onClick={() => navigate("/nhahangnqt")}
            ariaLabel="Về trang Blog"
          />
        </div>

        <ul className={`header-nav ${menuOpen ? "header-nav--open" : ""}`}>
          <li>
            <a
              className="header-nav-link"
              href="#blog_about-us"
              onClick={() => setMenuOpen(false)}
            >
              Về Chúng Tôi
            </a>
          </li>
          <li>
            <a
              className="header-nav-link"
              href="#blog_food"
              onClick={() => setMenuOpen(false)}
            >
              Thực Đơn
            </a>
          </li>
          <li>
            <a
              className="header-nav-link"
              href="#blog_location"
              onClick={() => setMenuOpen(false)}
            >
              Địa Điểm
            </a>
          </li>

          <li>
            <button
              className="customer-banner-btn-primary"
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
          className={`header-burger ${menuOpen ? "header-burger--open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <Banner
        data={slides}
        className="blog_hero"
        hoursText="Mở cửa hàng ngày từ 8:00 sáng – 22:00 đêm"
        renderActions={() => (
          <>
            <button
              type="button"
              className="customer-banner-btn-primary"
              onClick={() => setShowBookingModal(true)}
            >
              Đặt Bàn Ngay
            </button>
            <a
              href="https://maps.app.goo.gl/ZRvU42F4GJAFyTDk8"
              target="_blank"
              rel="noreferrer"
              className="customer-banner-btn-outline"
            >
              Đánh Giá &amp; Bản Đồ Google
            </a>
          </>
        )}
      />

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
              className="customer-banner-btn-primary"
              onClick={() => setShowBookingModal(true)}
            >
              Đặt Bàn Ngay
            </button>

            <button
              className="customer-banner-btn-outline"
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
            <span className="blog_about-stat-num">PM28.05</span>
            <span className="blog_about-stat-lbl">
              Đại học Kinh doanh &amp; Công nghệ
            </span>
          </div>
        </div>
      </section>

      {/* ══ FOOD ══ */}
      <section id="blog_food" className="blog_food-section">
        <SectionHeader
          label="Rooftop Dining"
          title="Thực Đơn Việt Nam"
          description="Thưởng thức ẩm thực Việt Nam chính thống — hương vị địa phương kết hợp tầm nhìn ngoạn mục thành phố."
        >
          <div>
            <div className="section-header-rule" />
            <p className="blog_food-hours">
              Phục vụ từ 08:00 – 22:00 · Gọi món cuối 21:30
            </p>
          </div>
        </SectionHeader>
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
            className="customer-banner-btn-outline"
          >
            Xem Thực Đơn Đầy Đủ
          </a>
        </div>
      </section>

      {/* ══ LOCATION ══ */}
      <section id="blog_location" className="blog_location-section">
        <div className="blog_location-info">
          <SectionHeader label="Địa Chỉ" title="Tìm Chúng Tôi">
            <div
              className="section-header-rule"
              style={{ margin: "0 0 32px" }}
            />
          </SectionHeader>
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
            className="customer-banner-btn-primary"
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
      <Footer />

      {/* ══ FLOAT BUTTONS ══ */}
      <CustomerChatWidget />
      <BackToTopButton />

      {/* ══ MODALS ══ */}
      <BookingModal
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
};

export default Blog;
