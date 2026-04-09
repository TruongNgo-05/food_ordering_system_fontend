import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/ResetPassword.css";
import { resetPasswordApi } from "../../services/authService";
import { CloseOutlined } from "@ant-design/icons";
const ResetPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Vui lòng nhập email trước khi đặt lại mật khẩu!");
      navigate("/login");
    }
  }, [navigate]);
  const onFinish = async (values) => {
    const { otp, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    const email = localStorage.getItem("resetEmail");

    try {
      const res = await resetPasswordApi({
        email: email,
        otp: otp,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });

      toast.success(res.data.message || "Đặt lại mật khẩu thành công!");

      localStorage.removeItem("resetEmail");

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại!",
      );
    }
  };
  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-container">
        <div className="close-btn" onClick={() => navigate("/login")}>
          <CloseOutlined />
        </div>
        <div className="reset-password-header">
          <h2>Đặt lại mật khẩu</h2>
        </div>
        <p className="reset-password-subtitle">
          Nhập OTP đã gửi về email và tạo mật khẩu mới an toàn.
        </p>

        <Form
          layout="vertical"
          onFinish={onFinish}
          className="reset-password-form"
        >
          <Form.Item
            label="Mã OTP"
            name="otp"
            rules={[
              { required: true, message: "Vui lòng nhập mã OTP" },
              { len: 6, message: "OTP phải gồm 6 số" },
            ]}
          >
            <Input placeholder="Nhập mã OTP 6 số" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Đặt lại mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default ResetPassword;