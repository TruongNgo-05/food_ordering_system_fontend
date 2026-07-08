import React from "react";
import "../assets/styles/Footer.css";
import BrandLogo from "../components/common/BrandLogo";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer-container">
        <div className="app-footer-top">
          {/* Logo */}
          <div className="app-footer-brand">
            <BrandLogo as="a" href="/" className="footer-logo" />

            <p className="app-footer-desc">
              Tận hưởng vẻ đẹp toàn cảnh Hà Nội từ tầng cao cùng những món ăn
              mang đậm bản sắc Việt Nam, được chế biến tinh tế trong không gian
              sang trọng và hiện đại.
            </p>
          </div>

          {/* Giờ mở cửa */}
          <div className="app-footer-column">
            <h5>Giờ mở cửa</h5>

            <div className="footer-info">
              <span>Hàng ngày</span>
              <p>08:00 - 23:50</p>
            </div>

            <div className="footer-info">
              <span>Phục vụ món ăn</span>
              <p>11:00 - 22:00</p>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="app-footer-column">
            <h5>Liên hệ</h5>

            <a href="tel:+84389582843">(+84) 389 582 843</a>

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

        <div className="app-footer-bottom">
          <span>© 2026 JLER Sky Restaurant. All Rights Reserved.</span>

          <span>Designed by NQT Premium • Kinh Công</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
