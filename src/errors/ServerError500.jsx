import { useNavigate } from "react-router-dom";
import "../assets/style/errors.css";

export default function ServerError500() {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="big-404">500</div>

        <div className="icon-wrapper">
          <div className="icon-circle error">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>

        <div className="content-card">
          <h1>Lỗi Hệ Thống</h1>

          <p className="subtitle">
            Máy chủ đang gặp sự cố. Vui lòng thử lại sau
          </p>

          <div className="suggestions">
            <h3>Gợi ý:</h3>
            <ul>
              <li>Tải lại trang sau vài phút</li>
              <li>Liên hệ bộ phận kỹ thuật nếu lỗi tiếp diễn</li>
            </ul>
          </div>

          <div className="button-group">
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Tải Lại
            </button>

            <button onClick={() => navigate("/")} className="btn btn-secondary">
              Về Trang Chủ
            </button>
          </div>
        </div>

        <p className="footer-text">Error Code: 500 | Internal Server Error</p>
      </div>
    </div>
  );
}
