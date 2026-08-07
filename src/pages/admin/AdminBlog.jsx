import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/admin/AdminBlog.css";
export default function AdminBlog() {
  return (
    <>
      {/* HEADER */}
      <UserHeader title="Quản lý Blog" description="Xem trang Blog" />
      <div className="blog-preview-wrapper">
        <iframe src="/nhahangnqt" title="Blog Preview" />
      </div>
    </>
  );
}
