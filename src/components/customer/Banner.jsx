import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../assets/styles/Banner.css";

const Banner = ({ data = [], onViewMenu }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const slides = useMemo(() => {
    return (data || []).filter((s) => s.active !== false);
  }, [data]);

  useEffect(() => {
    setActiveIdx(0);
  }, [slides]);

  const goSlide = (idx) => {
    setFading(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setFading(false);
    }, 300);
  };

  useEffect(() => {
    if (!slides.length) return;

    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const activeSlide = slides[activeIdx];

  if (!activeSlide) return null;

  return (
    <section className="customer-hero">
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`customer-hero-slide ${
            idx === activeIdx ? "customer-hero-slide--active" : ""
          } ${fading && idx === activeIdx ? "customer-hero-slide--fading" : ""}`}
          style={{ backgroundImage: `url("${s.image}")` }}
        />
      ))}

      <div className="customer-hero-overlay" />

      <div className="customer-hero-content">
        <p className="customer-hero-sub">JLER SKY RESTAURANT</p>
        <h1 className="customer-hero-title">{activeSlide.title}</h1>
        <div className="customer-hero-divider" />
        <p className="customer-hero-tagline">{activeSlide.desc}</p>
        <p className="customer-hero-hours">
          Mở cửa hàng ngày từ 8:00 sáng – 22:00 đêm
        </p>
        <div className="customer-hero-btns">
          <button
            type="button"
            className="customer-btn-primary"
            onClick={onViewMenu}
          >
            Xem Thực Đơn
          </button>
        </div>
      </div>

      <div className="customer-hero-dots">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            className={`customer-hero-dot ${
              idx === activeIdx ? "customer-hero-dot--active" : ""
            }`}
            onClick={() => goSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      <div className="customer-hero-scroll">
        <span>Cuộn</span>
        <div className="customer-scroll-line" />
      </div>
    </section>
  );
};

export default Banner;
