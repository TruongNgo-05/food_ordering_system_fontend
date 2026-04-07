import { useNavigate } from "react-router-dom";
import "../assets/style/errors.css";
export default function NotFound() {
  const navigate = useNavigate();

  const handleBackhome = () => {
    navigate("/");
  };

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="big-404">404</div>

        <div className="icon-wrapper">
          <div className="icon-circle">
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
        </div>

        <div className="content-card">
          <h1>Oops! Trang Không Tồn Tại</h1>

          <p className="subtitle">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc trang đã bị xóa
          </p>

          <div className="suggestions">
            <h3>Bạn có thể thử:</h3>
            <ul>
              <li>Kiểm tra lại đường dẫn URL & tìm kiếm lại</li>
              <li>Liên hệ với chúng tôi nếu bạn nghĩ đây là lỗi</li>
            </ul>
          </div>

          <div className="button-group">
            <button onClick={handleBackhome} className="btn btn-primary">
              Về Trang Chủ
            </button>

            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Quay Lại
            </button>
          </div>
        </div>

        <p className="footer-text">Error Code: 404 | Page Not Found</p>
      </div>
    </div>
  );
}
