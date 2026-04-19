import React, { useEffect, useMemo, useState } from "react";
import "../../assets/styles/Banner.css";

const Banner = ({ data = [], onViewMenu }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const slides = useMemo(() => {
    return (data || []).filter((s) => s.active !== false);
  }, [data]);

  useEffect(() => {
    setActiveIdx(0);
  }, [slides]);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides]);

  const activeSlide = slides[activeIdx];

  if (!activeSlide) return null;

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

      <button className="banner-nav banner-nav-left" onClick={goPrev}>
        ‹
      </button>

      <button className="banner-nav banner-nav-right" onClick={goNext}>
        ›
      </button>

      <div className="banner-content">
        <span className="banner-badge">Nhanh - Ngon - Nóng hổi</span>

        <h1>{activeSlide.title}</h1>
        <p>{activeSlide.desc}</p>

        <div className="banner-actions">
          <button className="banner-btn-secondary" onClick={onViewMenu}>
            Xem thực đơn
          </button>
        </div>

        <div className="banner-dots">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              className={`banner-dot ${idx === activeIdx ? "active" : ""}`}
              onClick={() => setActiveIdx(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
