import React, { useEffect, useMemo, useState } from "react";
import "../../assets/styles/Banner.css";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1920&auto=format&fit=crop",
    title: "Ăn gì hôm nay?",
    desc: "Khám phá thực đơn món Việt đa dạng, giao tận nơi chỉ trong vài phút.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=1920&auto=format&fit=crop",
    title: "Món ngon mỗi ngày",
    desc: "Từ bữa sáng đến bữa tối, luôn có món hợp vị cho bạn.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1920&auto=format&fit=crop",
    title: "Đặt nhanh trong 1 chạm",
    desc: "Ưu đãi hấp dẫn, thanh toán tiện lợi, giao hàng siêu tốc.",
  },
];

const Banner = ({ onOrderNow }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = useMemo(() => slides[activeIdx], [activeIdx]);

  const goPrev = () => {
    setActiveIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setActiveIdx((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="banner"
      style={{
        backgroundImage: `url("${activeSlide.image}")`,
      }}
    >
      <div className="banner-overlay" />
      <div className="banner-glow" />
      <button className="banner-nav banner-nav-left" onClick={goPrev} aria-label="Ảnh trước">
        ‹
      </button>
      <button className="banner-nav banner-nav-right" onClick={goNext} aria-label="Ảnh tiếp theo">
        ›
      </button>
      <div className="banner-content">
        <span className="banner-badge">Nhanh - Ngon - Nóng hổi</span>
        <h1>{activeSlide.title}</h1>
        <p>{activeSlide.desc}</p>
        <div className="banner-actions">
          <button className="banner-btn-primary" onClick={onOrderNow}>
            Mua ngay
          </button>
          <button className="banner-btn-secondary" onClick={onOrderNow}>
            Xem thực đơn
          </button>
        </div>
        <div className="banner-dots">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              className={`banner-dot ${idx === activeIdx ? "active" : ""}`}
              onClick={() => setActiveIdx(idx)}
              aria-label={`Chuyển ảnh ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
