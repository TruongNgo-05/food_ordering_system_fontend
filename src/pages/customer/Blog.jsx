import React from "react";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/Blog.css";

const STATS = [
  { num: "15+", label: "Năm hoạt động" },
  { num: "200", label: "Chỗ ngồi" },
  { num: "50+", label: "Món đặc sắc" },
  { num: "4.8★", label: "Đánh giá TB" },
];

const FEATURED_DISHES = [
  {
    name: "Phở bò đặc biệt",
    desc: "Nước dùng ninh 12 giờ, thịt bò hoa, hành trần",
    price: "89.000 đ",
    tag: "Bán chạy nhất",
  },
  {
    name: "Bún chả Hà Nội",
    desc: "Chả nướng than hoa, bún tươi, nước mắm pha chuẩn vị",
    price: "75.000 đ",
    tag: null,
  },
  {
    name: "Chả cá Lã Vọng",
    desc: "Cá lăng tươi, nghệ, thì là, mắm tôm nguyên chất",
    price: "149.000 đ",
    tag: "Đặc sản",
  },
  {
    name: "Canh chua cá thu",
    desc: "Cá thu Phú Quốc, cà chua, thơm, me chua thanh",
    price: "95.000 đ",
    tag: null,
  },
  {
    name: "Gà nướng mật ong",
    desc: "Gà ta thả vườn, ướp 8 tiếng, nướng than hoa",
    price: "185.000 đ",
    tag: "Đặc sản",
  },
  {
    name: "Bánh cuốn nóng",
    desc: "Tráng tươi tại chỗ, nhân thịt nấm, chả quế",
    price: "55.000 đ",
    tag: null,
  },
];

const REVIEWS = [
  {
    stars: 5,
    text: "Phở ở đây khiến tôi nhớ mãi hương vị của mẹ. Nước dùng trong, ngọt tự nhiên, không hề dùng bột ngọt.",
    author: "Minh Tú",
    city: "Hà Nội",
  },
  {
    stars: 5,
    text: "Không gian rất ấm cúng, phù hợp tiếp khách nước ngoài. Nhân viên phục vụ chu đáo và thân thiện.",
    author: "Hoàng Anh",
    city: "TP.HCM",
  },
  {
    stars: 4,
    text: "Chả cá Lã Vọng đúng kiểu truyền thống, ăn kèm mắm tôm thơm nức. Sẽ quay lại lần sau.",
    author: "Thu Hương",
    city: "Hải Phòng",
  },
];

const HOURS = [
  { day: "Thứ 2 — Thứ 6", time: "10:00 – 22:00" },
  { day: "Thứ 7 — Chủ nhật", time: "09:00 – 22:30" },
  { day: "Bữa trưa", time: "11:00 – 14:00" },
  { day: "Đặt bàn online", time: "Nhận trước 2 tiếng" },
];

const StarRating = ({ count }) => (
  <div className="star-rating">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < count ? "star filled" : "star"}>
        ★
      </span>
    ))}
  </div>
);

const Blog = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <UserHeader
          title="Giới thiệu nhà hàng"
          description="Hơn 15 năm mang đến hương vị ẩm thực Việt truyền thống giữa lòng Hà Nội"
        />

        {/* Hero */}
        <section className="about-hero">
          <div className="hero-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80"
              alt="Không gian Nhà Hàng NQT"
            />
            <div className="hero-overlay" />
          </div>
          <div className="hero-text">
            <span className="hero-badge">Thành lập năm 2008</span>
            <h2 className="hero-title">Nhà Hàng NQT</h2>
            <p className="hero-sub">
              Tự hào phục vụ hàng nghìn thực khách mỗi tháng với nguyên liệu
              tươi chọn lọc, công thức gia truyền và không gian ấm cúng mang đậm
              chất nhà cổ Hà Nội.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-row">
          {STATS.map((s, i) => (
            <div className="stat-card" key={i}>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Story */}
        <section className="story-section">
          <p className="section-label">Câu chuyện của chúng tôi</p>
          <div className="story-grid">
            <div className="story-card">
              <div className="story-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=700&q=80"
                  alt="Món phở truyền thống"
                />
              </div>
              <div className="story-body">
                <h3>Bắt đầu từ một tô phở</h3>
                <p>
                  Nhà hàng NQT được sáng lập năm 2008 bởi gia đình họ Nguyễn với
                  tâm huyết gìn giữ hương vị ẩm thực Bắc truyền thống giữa lòng
                  thành phố. Từ một quán nhỏ trên phố Hàng Bè, chúng tôi đã lớn
                  lên cùng niềm tin của thực khách.
                </p>
              </div>
            </div>
            <div className="story-card">
              <div className="story-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=80"
                  alt="Không gian nhà hàng"
                />
              </div>
              <div className="story-body">
                <h3>Không gian ấm cúng, tinh tế</h3>
                <p>
                  Thiết kế lấy cảm hứng từ kiến trúc nhà cổ Hà Nội — gỗ mộc, đèn
                  lồng đỏ, tranh thủy mặc — tạo bầu không khí thân mật và hoài
                  cổ, phù hợp cho mọi bữa tiệc gia đình hay gặp mặt bạn bè.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Menu */}
        <section className="blog-menu-section">
          <p className="section-label">Món đặc trưng</p>

          <div className="blog-menu-grid">
            {FEATURED_DISHES.map((dish, i) => (
              <div className="blog-menu-item" key={i}>
                <div className="blog-menu-top">
                  <span className="blog-dish-name">{dish.name}</span>

                  {dish.tag && (
                    <span className="blog-dish-tag">{dish.tag}</span>
                  )}
                </div>

                <span className="blog-dish-desc">{dish.desc}</span>

                <span className="blog-dish-price">{dish.price}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="reviews-section">
          <p className="section-label">Khách hàng nói gì</p>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <div className="review-card" key={i}>
                <StarRating count={r.stars} />
                <p className="review-text">"{r.text}"</p>
                <span className="review-author">
                  — {r.author}, {r.city}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Info */}
        <section className="info-section">
          <div className="info-grid">
            <div className="info-card">
              <h3>Thông tin liên hệ</h3>
              <div className="info-rows">
                {[
                  { key: "Địa chỉ", val: "36 Hàng Bè, Hoàn Kiếm, Hà Nội" },
                  { key: "Điện thoại", val: "024 3826 5050" },
                  { key: "Email", val: "hello@nhahang-nqt.vn" },
                  { key: "Website", val: "nhahang-nqt.vn" },
                ].map((row, i) => (
                  <div className="info-row" key={i}>
                    <span className="info-key">{row.key}</span>
                    <span className="info-val">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="info-card">
              <h3>Giờ mở cửa</h3>
              <div className="info-rows">
                {HOURS.map((row, i) => (
                  <div className="info-row" key={i}>
                    <span className="info-key">{row.day}</span>
                    <span className="info-val">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-bar">
          <div className="cta-text">
            <h3>Đặt bàn ngay hôm nay</h3>
            <p>
              Phục vụ tiệc sinh nhật, họp mặt gia đình và tiếp khách doanh
              nghiệp
            </p>
          </div>
          <button className="cta-btn">Liên hệ đặt bàn</button>
        </section>
      </div>
    </div>
  );
};

export default Blog;
