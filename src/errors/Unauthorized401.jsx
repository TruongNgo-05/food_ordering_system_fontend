import { useNavigate } from "react-router-dom";
import "../assets/style/errors.css";

export default function Unauthorized401() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="big-404">401</div>

        <div className="icon-wrapper">
          <div className="icon-circle warning">
            <i className="fa-solid fa-user-lock"></i>
          </div>
        </div>

        <div className="content-card">
          <h1>Bạn Chưa Đăng Nhập</h1>

          <p className="subtitle">
            Vui lòng đăng nhập để tiếp tục truy cập vào hệ thống
          </p>

          <div className="button-group">
            <button
              onClick={() => navigate("/login")}
              className="btn btn-primary"
            >
              Đăng Nhập
            </button>

            <button onClick={() => navigate("/")} className="btn btn-secondary">
              Về Trang Chủ
            </button>
          </div>
        </div>

        <p className="footer-text">Error Code: 401 | Unauthorized</p>
      </div>
    </div>
  );
}
