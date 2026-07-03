import React from "react";
import { Form, Input, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import Quenmatkhau from "../../components/modal/auth/Quenmatkhau";
import BrandLogo from "../../components/common/BrandLogo";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import api from "../../services/apiClient";

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const [openForgot, setOpenForgot] = React.useState(false);
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };
  const handleFacebookLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/facebook";
  };
  const onFinish = async (values) => {
    setLoading(true);

    try {
      const userData = await login(values);
      if (userData.failCount > 0) {
        toast.warning(`Bạn đã nhập sai ${userData.failCount} lần`);
      }
      toast.success("Đăng nhập thành công!");

      const role = userData.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "STAFF") {
        navigate("/staff");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      if (message) {
        toast.error(message);
      } else if (!error?.response) {
        toast.error("Không thể kết nối server");
      } else {
        if (status === 401) {
          toast.error("Sai tài khoản hoặc mật khẩu");
        } else if (status === 403) {
          toast.error("Tài khoản bị khóa");
        } else {
          toast.error("Đăng nhập thất bại, vui lòng thử lại");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    toast.info(`Đăng nhập bằng ${provider} đang được phát triển`);
  };
  const [params] = useSearchParams();

  useEffect(() => {
    const error = params.get("error");

    if (error === "locked") {
      toast.error("Tài khoản đã bị khóa");
      navigate("/login", { replace: true }); // xoá query
    }
  }, []);
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="back-customer-link">
              <a onClick={() => navigate("/customer")}>
                ← Quay lại trang khách hàng
              </a>
            </div>
            <div className="logo-container">
              <BrandLogo
                className="brand-logo-login"
                ariaLabel="Jler Sky Restaurant"
              />
            </div>
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
                onClick={handleGoogleLogin}
              >
                <span className="social-login-icon">G</span>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="social-login-btn facebook"
                onClick={handleFacebookLogin}
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
            <h2>Ẩm thực trọn vị tại Jler Sky Restaurant</h2>
            <p>Đăng nhập để khám phá thực đơn, ưu đãi và đặt món dễ dàng.</p>
          </div>
        </div>
      </div>

      <Quenmatkhau open={openForgot} onClose={() => setOpenForgot(false)} />
    </div>
  );
};

export default Login;
