import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../assets/styles/Banner.css";

const Banner = ({
  data = [],
  onViewMenu,
  eyebrow = "JLER SKY RESTAURANT",
  hoursText = "Mở cửa hàng ngày từ 8:00 sáng – 22:00 đêm",
  renderActions,
  header = null,
  className = "",
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const slides = useMemo(() => {
    return (data || [])
      .filter((s) => s.active !== false)
      .map((s) => ({
        ...s,
        image: s.image || s.bg,
        desc: s.desc || s.sub,
        eye: s.eye || eyebrow,
      }));
  }, [data, eyebrow]);

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
    <section className={`customer-hero ${className}`.trim()}>
      {header ? <div className="customer-hero-header">{header}</div> : null}

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
        <p className="customer-hero-sub">{activeSlide.eye || eyebrow}</p>
        <h1
          className="customer-hero-title"
          style={{
            fontSize: "clamp(48px, 6vw, 78px)",
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "0.06em",
            lineHeight: 1.05,
            fontFamily: '"Cormorant Garamond", serif',
          }}
        >
          {activeSlide.title}
        </h1>
        <div className="customer-hero-divider" />
        <p className="customer-hero-tagline">{activeSlide.desc}</p>
        <p className="customer-hero-hours">{hoursText}</p>
        <div className="customer-hero-btns">
          {renderActions ? (
            renderActions(activeSlide)
          ) : (
            <button
              type="button"
              className="customer-banner-btn-primary"
              onClick={onViewMenu}
            >
              Xem Thực Đơn
            </button>
          )}
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
