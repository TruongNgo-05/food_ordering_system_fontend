import React from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createAccount } from "../../services/userService";
import BrandLogo from "../../components/common/BrandLogo";
const Register = () => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createAccount({
        username: values.username,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        passWord: values.password,
        confirmPassword: values.confirmPassword,
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
            <div className="back-customer-link">
              <a onClick={() => navigate("/login")}>← Quay lại trang Login</a>
            </div>
            <div className="logo-container">
              <BrandLogo
                className="brand-logo-login"
                ariaLabel="Jler Sky Restaurant"
              />
            </div>
            <h1>Tạo tài khoản mới</h1>
            <p>Đăng ký để đặt bàn, đặt món và nhận ưu đãi thành viên</p>
          </div>
          <Form layout="vertical" className="login-form" onFinish={onFinish}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Tên đăng nhập"
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập username" },
                  ]}
                >
                  <Input
                    placeholder="Username"
                    prefix={<FontAwesomeIcon icon={faUser} />}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input
                    placeholder="Họ và tên"
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
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại phải có 10-11 chữ số",
                },
              ]}
            >
              <Input
                placeholder="Số điện thoại"
                prefix={<FontAwesomeIcon icon={faUser} />}
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
              Đã có tài khoản?{" "}
              <a onClick={() => navigate("/login")}>Đăng nhập ngay</a>
            </div>
          </Form>

          <div className="login-footer">
            <p>© {new Date().getFullYear()} NQT. All rights reserved.</p>
          </div>
        </div>

        <div className="info-side">
          <div className="info-content">
            <h2>Ẩm thực trọn vị tại Jler Sky Restaurant</h2>
            <p>Đăng ký để khám phá thực đơn, ưu đãi và đặt món dễ dàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
