import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/admin/AdminBlog.css";
export default function AdminBlog() {
  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý Blog"
        description="Xem và chỉnh sửa trang Blog"
        buttonText="Sửa Blog"
        handleAdd={() => console.log("Edit Blog")}
      />
      <div className="blog-preview-wrapper">
        <iframe src="/nhahangnqt" title="Blog Preview" />
      </div>
    </>
  );
}
