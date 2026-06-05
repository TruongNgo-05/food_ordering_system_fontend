import React from "react";
import "../../assets/styles/user/Blog.css";

const Blog = () => {
  const handleBook = (e) => {
    e.preventDefault();
    alert("Booking submitted!");
  };

  return (
    <div className="blog-page">
      {/* NAV */}
      <nav id="blog_navbar">
        <div className="blog_nav-logo">
          <a href="#">
            <img src="../../assets/images/logo.png" alt="Solar Sky Bar" />
          </a>
        </div>

        <ul className="blog_nav-links">
          <li>
            <a href="#blog_about-us">About Us</a>
          </li>
          <li>
            <a href="#blog_food">Food</a>
          </li>
          <li>
            <a href="#blog_photo-gallery">Gallery</a>
          </li>
          <li>
            <a href="#blog_location">Location</a>
          </li>
          <li>
            <a href="#blog_book-a-table" className="blog_nav-book">
              Book A Table
            </a>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="blog_hero">
        <div className="blog_hero-bg"></div>

        <div className="blog_hero-content">
          <p className="blog_hero-sub">Rooftop City View · Hanoi Old Quarter</p>

          <h1 className="blog_hero-title">
            SOLAR
            <br />
            SKY BAR
          </h1>

          <div className="blog_hero-divider"></div>

          <p className="blog_hero-tagline">
            11th & 12th Floor · GM Premium Hotel · 41 Hang Bong Street
          </p>

          <p className="blog_hero-hours">Open daily from 11:00 am – 23:50 pm</p>

          <div className="blog_hero-btns">
            <a href="#blog_book-a-table" className="blog_btn-primary">
              Book A Table
            </a>

            <a
              href="https://maps.app.goo.gl/DDpQ8qBNZAEsVvHp9"
              target="_blank"
              rel="noreferrer"
              className="blog_btn-outline"
            >
              Google Reviews & Map
            </a>
          </div>
        </div>

        <div className="blog_hero-scroll">
          <span>Scroll</span>
          <div className="blog_scroll-line"></div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <div className="blog_highlights">
        <div className="blog_highlight-item">
          <div className="blog_highlight-icon">🌅</div>
          <div className="blog_highlight-text">
            <strong>Panoramic Views</strong>
            <span>Hanoi skyline & Old Quarter</span>
          </div>
        </div>

        <div className="blog_highlight-item">
          <div className="blog_highlight-icon">🍹</div>
          <div className="blog_highlight-text">
            <strong>Craft Cocktails</strong>
            <span>Signature drinks & beverages</span>
          </div>
        </div>

        <div className="blog_highlight-item">
          <div className="blog_highlight-icon">🍜</div>
          <div className="blog_highlight-text">
            <strong>Vietnamese Cuisine</strong>
            <span>Authentic dishes & fusion</span>
          </div>
        </div>

        <div className="blog_highlight-item">
          <div className="blog_highlight-icon">🎵</div>
          <div className="blog_highlight-text">
            <strong>Live Atmosphere</strong>
            <span>Music & outdoor vibes</span>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section id="blog_about-us">
        <div>
          <p className="blog_about-label">Welcome To</p>

          <h2 className="blog_about-title">
            Solar Sky Bar
            <br />
            Hanoi
          </h2>

          <p className="blog_about-text">
            Capturing the full beauty of Hanoi's Old Quarter with breathtaking
            views from high above.
          </p>

          <div className="blog_about-tags">
            <span className="blog_about-tag">#Top_1_Rooftop_Bar_Hanoi</span>
            <span className="blog_about-tag">
              #The_Best_Sky_Bar_Old_Quarter_Hanoi
            </span>
            <span className="blog_about-tag">
              #Best_Bar_in_Hanoi_Stunning_View
            </span>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <a href="#blog_book-a-table" className="blog_btn-primary">
              Book Now
            </a>

            <a
              href="https://solarrooftopbar.com/UploadFile/PDF-MENU/SOLAR-DRINKS.pdf"
              target="_blank"
              rel="noreferrer"
              className="blog_btn-outline"
            >
              See Our Menu
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
            <span className="blog_about-stat-num">12F</span>
            <span className="blog_about-stat-lbl">Rooftop Floor</span>
          </div>
        </div>
      </section>

      {/* BOOK */}
      <section id="blog_book-a-table">
        <div className="blog_book-inner">
          <div className="blog_section-header">
            <span className="blog_section-label">Reservations</span>
            <h2 className="blog_section-title">Book A Table</h2>
            <div className="blog_section-rule"></div>
          </div>

          <form className="blog_book-form" onSubmit={handleBook}>
            <div className="blog_form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Your full name" />
            </div>

            <div className="blog_form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" />
            </div>

            <div className="blog_form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="+84..." />
            </div>

            <div className="blog_form-group blog_full">
              <label>Your Message</label>
              <textarea placeholder="Special requests..."></textarea>
            </div>

            <button type="submit" className="blog_form-submit">
              Confirm Booking
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="blog_footer-bottom">
          <span>© 2026 Solar Sky Bar. All rights reserved.</span>
        </div>
      </footer>

      <a href="#blog_book-a-table" className="blog_float-book">
        🗓 Book A Table
      </a>
    </div>
  );
};

export default Blog;
