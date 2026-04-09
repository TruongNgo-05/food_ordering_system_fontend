import React from "react";
import { Form, Input, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.png";
import "../../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import Quenmatkhau from "../../components/modal/auth/Quenmatkhau";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [openForgot, setOpenForgot] = React.useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userData = await login(values);
      // Hiển thị cảnh báo nếu có lần đăng nhập sai
      if (userData.failCount > 0) {
        toast.warning(`Bạn đã nhập sai ${userData.failCount} lần`);
      }

      toast.success("Đăng nhập thành công!");

      // Điều hướng theo role (AuthContext đã lưu token/role)
      const role = userData.role;
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "STAFF") {
        navigate("/staff");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      // Sai tài khoản/mật khẩu -> báo cố định
      const status = error?.response?.status;
      if (status === 400 || status === 401 || status === 403) {
        toast.error("Bạn sai tài khoản hoặc mật khẩu");
      } else if (!error?.response) {
        // Không có response thường là lỗi mạng / backend không chạy
        toast.error("Không thể kết nối server");
      } else {
        toast.error("Đăng nhập thất bại, vui lòng thử lại");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`Đăng nhập bằng ${provider} đang được phát triển`);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="back-customer-link">
              <a onClick={() => navigate("/customer")}>← Quay lại trang khách hàng</a>
            </div>
            <div className="logo-container">
              <img src={logo} alt="Ngô Quang Trường" className="logo" />
            </div>
            <div className="restaurant-tag">NQT Restaurant</div>
            <h1>Chào mừng trở lại</h1>
            <p>Đăng nhập để đặt món nhanh và theo dõi đơn hàng</p>
          </div>

          <Form layout="vertical" className="login-form" onFinish={onFinish}>
            <Form.Item
              label="Email hoặc Username"
              name="emailOrUsername"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email hoặc username",
                },
              ]}
            >
              <Input
                prefix={<FontAwesomeIcon icon={faUser} />}
                placeholder="Email hoặc username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                prefix={<FontAwesomeIcon icon={faLock} />}
                placeholder="Nhập mật khẩu"
                size="large"
              />
            </Form.Item>

            <div className="form-options">
              <a
                className="forgot-password"
                onClick={() => setOpenForgot(true)}
              >
                Quên mật khẩu?
              </a>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Đăng nhập
            </Button>

            <div className="social-divider">
              <span>Hoặc đăng nhập bằng</span>
            </div>

            <div className="social-login-group">
              <button
                type="button"
                className="social-login-btn google"
                onClick={() => handleSocialLogin("Google")}
              >
                <span className="social-login-icon">G</span>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="social-login-btn facebook"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <span className="social-login-icon">f</span>
                <span>Facebook</span>
              </button>
            </div>

            <div className="auth-switch">
              Chưa có tài khoản?{" "}
              <a onClick={() => navigate("/register")}>Tạo tài khoản</a>
            </div>
          </Form>

          <div className="login-footer">
            <p>© {new Date().getFullYear()} NQT. All rights reserved.</p>
          </div>
        </div>

        <div className="info-side">
          <div className="info-content">
            <h2>Ẩm thực trọn vị tại NQT</h2>
            <p>Đăng nhập để khám phá thực đơn, ưu đãi và đặt món dễ dàng.</p>
          </div>
        </div>
      </div>

      <Quenmatkhau open={openForgot} onClose={() => setOpenForgot(false)} />
    </div>
  );
};

export default Login;
