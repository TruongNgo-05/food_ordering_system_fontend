import React from "react";
import { T } from "../../constants/customerTheme";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/Support.css";

const Support = () => {
  return (
    <div className="support-page" style={{ background: T.bg }}>
      <div className="support-container">
        <UserHeader
          title="Hỗ trợ & Thắc mắc"
          description="Liên hệ trực tiếp với chúng tôi"
        />

        {/* Hero */}
        <div className="support-hero">
          <div className="support-hero-icon">🤝</div>
          <div>
            <h2>Chúng tôi luôn sẵn sàng hỗ trợ!</h2>
            <p>
              Hotline hỗ trợ nhanh: <strong>1800-1234</strong>
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="support-grid">
          <div className="support-card">
            <span className="label">☎️ Hotline</span>
            <span className="value primary">0389-582-843</span>
          </div>

          <div className="support-card">
            <span className="label">💬 Chat</span>
            <span className="value blue">8:00 - 22:00</span>
          </div>

          <div className="support-card">
            <span className="label">📧 Email</span>
            <span className="value green">ngoquangtruongwork05@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
