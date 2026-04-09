import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/images/logo.png";
import "../../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("/api/auth/register", {
        email: values.email,
        username: values.username,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
      });

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Không thể kết nối server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="restaurant-tag">NQT Restaurant</div>
            <h1>Tạo tài khoản mới</h1>
            <p>Đăng ký để đặt bàn, đặt món và nhận ưu đãi thành viên</p>
          </div>
          <Form layout="vertical" className="login-form" onFinish={onFinish}>
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: "Vui lòng nhập username" }]}
            >
              <Input
                placeholder="Username"
                prefix={<FontAwesomeIcon icon={faUser} />}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Họ"
                  name="firstName"
                  rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                >
                  <Input
                    placeholder="Họ"
                    prefix={<FontAwesomeIcon icon={faUser} />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tên"
                  name="lastName"
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input
                    placeholder="Tên"
                    prefix={<FontAwesomeIcon icon={faUser} />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                placeholder="Email"
                prefix={<FontAwesomeIcon icon={faEnvelope} />}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password
                placeholder="Mật khẩu"
                prefix={<FontAwesomeIcon icon={faLock} />}
              />
            </Form.Item>

            <Form.Item
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu"
                prefix={<FontAwesomeIcon icon={faLock} />}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                Đăng ký
              </Button>
            </Form.Item>

            <div className="auth-switch">
              Đã có tài khoản? <a onClick={() => navigate("/login")}>Đăng nhập ngay</a>
            </div>
          </Form>

          <div className="login-footer">
            <p>© {new Date().getFullYear()} NQT. All rights reserved.</p>
          </div>
        </div>

        <div className="info-side">
          <div className="info-content">
            <h2>Gia nhập cộng đồng NQT</h2>
            <p>Tích điểm mỗi đơn hàng, theo dõi lịch sử và nhận quà ưu đãi.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
