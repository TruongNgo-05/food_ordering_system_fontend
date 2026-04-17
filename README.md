# 🍽️ Hệ Thống Đặt Hàng Thực Phẩm - Frontend

Ứng dụng web đặt hàng thực phẩm hiện đại với giao diện khách hàng và bảng điều khiển quản trị viên.

## ✨ Tính Năng Chính

### Khách Hàng

- 📱 Duyệt menu thực phẩm
- 🛒 Quản lý giỏ hàng
- 📦 Theo dõi đơn hàng
- ❤️ Lưu yêu thích
- 🪑 Đặt bàn tại nhà hàng
- 💬 Chat hỗ trợ trực tiếp

### Quản Trị Viên

- 📊 Bảng điều khiển thống kê
- 👥 Quản lý người dùng
- 🍔 Quản lý menu thực phẩm
- 📋 Quản lý đơn hàng
- 🎟️ Quản lý voucher
- ⭐ Xem đánh giá khách hàng

## 🛠️ Công Nghệ

| Công Nghệ    | Phiên Bản |
| ------------ | --------- |
| React        | 19.2.4    |
| Vite         | 7.3.1     |
| Ant Design   | 6.3.2     |
| React Router | 7.13.1    |
| Axios        | 1.13.6    |
| Bootstrap    | 5.3.8     |

## 🚀 Cài Đặt Nhanh

### Yêu Cầu

- Node.js v16+
- npm hoặc yarn

### Các Bước

1. **Clone dự án**

   ```bash
   git clone https://github.com/yourusername/food_ordering_system_fontend.git
   cd food_ordering_system_fontend
   ```

2. **Cài đặt phụ thuộc**

   ```bash
   npm install
   ```

3. **Tạo file `.env`**

   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_GOOGLE_CLIENT_ID=101891197501-b8sp0vq7f264d8st9k019i7jlrm88rhq.apps.googleusercontent.com
   ```

4. **Khởi chạy**
   ```bash
   npm run dev
   ```
   Truy cập: `http://localhost:5173`

## 📋 Lệnh Chính

```bash
npm run dev      # Chế độ phát triển (hot reload)
npm run build    # Build sản xuất
npm run preview  # Xem trước bản build
npm run lint     # Kiểm tra code
```

## 🔐 Xác Thực

- **JWT Token**: Đăng nhập với email/password
- **Google OAuth**: Đăng nhập bằng Google
- **Role-based**: Kiểm soát truy cập Admin/Customer

## 🎨 Giao Diện

- ✅ Responsive (desktop, tablet, mobile)
- ✅ UI professional với Ant Design
- ✅ Dark/Light theme support
- ✅ Thông báo real-time

## 📱 Responsive Design

Ứng dụng hoạt động tốt trên:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablet

## 🚢 Triển Khai

- Cấu hình sẵn cho **Vercel**
- Build: `npm run build`
- Output: Thư mục `dist/`

---

**Phiên bản**: 1.0.0  
**Cập nhật**: Tháng 4, 2026
