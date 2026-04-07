import { useNavigate } from "react-router-dom";
import "../assets/style/errors.css";

export default function Forbidden403() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="big-404">403</div>

        <div className="icon-wrapper">
          <div className="icon-circle danger">
            <i className="fa-solid fa-ban"></i>
          </div>
        </div>

        <div className="content-card">
          <h1>Truy Cập Bị Từ Chối</h1>

          <p className="subtitle">Bạn không có quyền truy cập vào trang này</p>

          <div className="suggestions">
            <h3>Bạn có thể:</h3>
            <ul>
              <li>Đăng nhập bằng tài khoản khác</li>
              <li>Liên hệ quản trị viên để được cấp quyền</li>
            </ul>
          </div>

          <div className="button-group">
            <button onClick={() => navigate("/")} className="btn btn-primary">
              Về Trang Chủ
            </button>

            <button onClick={() => navigate(-1)} className="btn btn-secondary">
              Quay Lại
            </button>
          </div>
        </div>

        <p className="footer-text">Error Code: 403 | Forbidden</p>
      </div>
    </div>
  );
}
