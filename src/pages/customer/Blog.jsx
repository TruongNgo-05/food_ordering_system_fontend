import React from "react";
import UserHeader from "../../components/user/UserHeader";
import { T } from "../../constants/customerTheme";
import "../../assets/styles/Blog.css";

const BLOG_POSTS = [
  {
    id: 1,
    title: "5 bí quyết chọn nguyên liệu tươi cho món Việt",
    excerpt:
      "Chọn rau củ theo mùa, kiểm tra độ đàn hồi của thịt và bảo quản đúng nhiệt độ giúp món ăn luôn đậm vị.",
    category: "Mẹo bếp",
    readTime: "4 phút đọc",
    date: "20/04/2026",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Câu chuyện món phở bò đặc biệt của Nhà Hàng NQT",
    excerpt:
      "Nước dùng ninh 12 giờ, kết hợp quế hồi rang thơm và thịt bò chọn lọc tạo nên hương vị đặc trưng.",
    category: "Câu chuyện thương hiệu",
    readTime: "6 phút đọc",
    date: "17/04/2026",
    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Gợi ý thực đơn cuối tuần cho gia đình 4 người",
    excerpt:
      "Combo canh chua cá, gà nướng mật ong và rau luộc chấm kho quẹt giúp bữa cơm cân bằng dinh dưỡng.",
    category: "Gợi ý thực đơn",
    readTime: "5 phút đọc",
    date: "14/04/2026",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
  },
];

const Blog = () => {
  return (
    <div className="blog-page" style={{ background: T.bg }}>
      <div className="blog-container">
        <UserHeader
          title="Blog Nhà Hàng"
          description="Cập nhật mẹo nấu ăn, câu chuyện món ngon và cảm hứng ẩm thực"
        />

        <div className="blog-notice">
          Mới nhất: Ưu đãi theo mùa sẽ được cập nhật tại blog.
        </div>

        <div className="blog-grid">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-image-wrapper">
                <img src={post.image} alt={post.title} />
                <span className="blog-category">{post.category}</span>
              </div>

              <div className="blog-content">
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>

                <div className="blog-footer">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;