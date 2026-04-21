import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/ResetPassword.css";
import { resetPasswordApi } from "../../services/authService";
import { CloseOutlined } from "@ant-design/icons";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Vui lòng nhập email trước khi đặt lại mật khẩu!");
      navigate("/login");
    }
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    // Chỉ cho phép số
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1); // Lấy ký tự cuối cùng
    setOtpValues(newOtpValues);

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Xử lý Backspace
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
    // Xử lý Arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const otp = otpValues.join("");

  const onFinish = async (values) => {
    // Kiểm tra OTP đầy đủ
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đầy đủ 6 chữ số OTP");
      return;
    }

    const { password, confirmPassword } = values;
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
          form={form}
        >
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
            >
              Mã OTP
            </label>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el;
                  }}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  maxLength="1"
                  style={{
                    width: "48px",
                    height: "48px",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    border: "2px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "0",
                  }}
                  inputMode="numeric"
                  placeholder="0"
                />
              ))}
            </div>
          </div>

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
