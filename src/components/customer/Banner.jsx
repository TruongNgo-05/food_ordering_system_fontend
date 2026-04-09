import React, { useEffect, useMemo, useState } from "react";
import { loadSharedBanners, SHARED_DATA_UPDATED_EVENT } from "../../utils/sharedData";
import "../../assets/styles/Banner.css";

const Banner = ({ onViewMenu }) => {
  const [slides, setSlides] = useState(() =>
    loadSharedBanners().filter((s) => s.active !== false),
  );
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const syncBanners = () =>
      setSlides(loadSharedBanners().filter((s) => s.active !== false));
    syncBanners();
    window.addEventListener("focus", syncBanners);
    window.addEventListener("storage", syncBanners);
    window.addEventListener(SHARED_DATA_UPDATED_EVENT, syncBanners);
    return () => {
      window.removeEventListener("focus", syncBanners);
      window.removeEventListener("storage", syncBanners);
      window.removeEventListener(SHARED_DATA_UPDATED_EVENT, syncBanners);
    };
  }, []);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides]);

  const activeSlide = useMemo(() => {
    if (!slides.length) return null;
    return slides[activeIdx] || slides[0];
  }, [activeIdx, slides]);

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
              aria-label={`Chuyển ảnh ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
