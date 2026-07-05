import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/ResetPassword.css";
import { resetPasswordApi, sendOtpApi } from "../../services/authService"; // <-- đổi sendOtpApi thành đúng tên hàm gọi API gửi OTP bên service của bạn
import { CloseOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);

  // ==== Đếm ngược 60s ====
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Vui lòng nhập email trước khi đặt lại mật khẩu!");
      navigate("/login");
    }
  }, [navigate]);

  // Bắt đầu đếm ngược khi component mount
  useEffect(() => {
    startCountdown();
    return () => clearInterval(timerRef.current);
  }, []);

  const startCountdown = () => {
    clearInterval(timerRef.current);
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Không tìm thấy email, vui lòng thực hiện lại từ đầu!");
      navigate("/login");
      return;
    }

    setResending(true);
    try {
      const res = await sendOtpApi({ email }); // <-- sửa lại payload cho khớp với API backend (vd: forgetpw.getEmail())
      toast.success(res.data?.message || res.data || "OTP mới đã được gửi!");
      startCountdown(); // reset lại 60s
      setOtpValues(["", "", "", "", "", ""]); // xóa OTP cũ trên UI
      otpInputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Gửi lại OTP thất bại, vui lòng thử lại!",
      );
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const otp = otpValues.join("");

  const onFinish = async (values) => {
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
          <div className="otp-section">
            <label className="otp-label">Mã OTP</label>
            <div className="otp-container">
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  maxLength={1}
                  className="otp-input"
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

          {/* ==== Khu vực gửi lại OTP ==== */}
          <div className="resend-otp-section">
            {countdown > 0 ? (
              <span className="resend-otp-countdown">
                Gửi lại OTP sau {countdown}s
              </span>
            ) : (
              <span
                className="resend-otp-link"
                onClick={!resending ? handleResendOtp : undefined}
              >
                {resending ? "Đang gửi..." : "Gửi lại OTP"}
              </span>
            )}
          </div>

          <Button type="primary" htmlType="submit" block>
            Đặt lại mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default ResetPassword;
