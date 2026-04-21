import React from "react";
import UserHeader from "../../components/user/UserHeader";
import { T } from "../../constants/customerTheme";

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
    <div style={{ background: T.bg, minHeight: "100vh", padding: "24px 0 36px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 20px" }}>
        <UserHeader
          title="Blog Nhà Hàng"
          description="Cập nhật mẹo nấu ăn, câu chuyện món ngon và cảm hứng ẩm thực mỗi tuần"
        />

        <div
          style={{
            marginTop: 12,
            background: T.primaryLight,
            border: `1px solid ${T.primary}33`,
            borderRadius: 16,
            padding: "14px 16px",
            color: T.text,
            fontWeight: 600,
          }}
        >
          Mới nhất: Chương trình ưu đãi theo mùa sẽ được cập nhật tại chuyên mục blog.
        </div>

        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              style={{
                borderRadius: 16,
                background: T.card,
                border: `1px solid ${T.border}`,
                overflow: "hidden",
                boxShadow: "0 8px 22px rgba(14, 25, 40, .06)",
              }}
            >
              <img
                src={post.image}
                alt={post.title}
                style={{
                  width: "100%",
                  height: 190,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div style={{ padding: 16 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: T.primary,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                  }}
                >
                  {post.category}
                </p>
                <h3 style={{ margin: "8px 0 6px", color: T.text, fontSize: 19 }}>
                  {post.title}
                </h3>
                <p
                  style={{
                    margin: "0 0 12px",
                    color: T.sub,
                    lineHeight: 1.65,
                    fontSize: 14,
                  }}
                >
                  {post.excerpt}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: T.muted,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
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
