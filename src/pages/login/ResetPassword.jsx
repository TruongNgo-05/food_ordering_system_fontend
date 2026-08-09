import React, { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/ResetPassword.css";
import {
  resetPasswordApi,
  sendOtpApi,
  verifyOtpApi,
} from "../../services/authService";
import {
  CloseOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Form, Input, Button, Modal } from "antd";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const otpInputRefs = useRef([]);

  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const timerRef = useRef(null);

  const [otpStatus, setOtpStatus] = useState("idle");
  const checkTokenRef = useRef(0);

  useEffect(() => {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Vui lòng nhập email trước khi đặt lại mật khẩu!");
      navigate("/login");
    }
  }, [navigate]);
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
      const res = await sendOtpApi({ email });
      toast.success(res.data?.message || res.data || "OTP mới đã được gửi!");
      startCountdown();
      setOtpValues(["", "", "", "", "", ""]);
      setOtpStatus("idle");
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
  const handleClose = () => {
    if (otpStatus === "valid") {
      Modal.confirm({
        title: "Bạn có chắc muốn thoát?",
        content:
          "Bạn đã xác thực OTP thành công. Nếu thoát bây giờ, bạn sẽ cần yêu cầu OTP mới để đặt lại mật khẩu.",
        okText: "Thoát",
        cancelText: "Ở lại",
        okButtonProps: { danger: true },
        onOk: () => {
          navigate("/login");
        },
      });
    } else {
      navigate("/login");
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);

    if (otpStatus !== "idle") {
      setOtpStatus("idle");
    }

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

  useEffect(() => {
    if (otp.length !== 6) {
      return;
    }

    const email = localStorage.getItem("resetEmail");
    if (!email) return;

    const myToken = ++checkTokenRef.current;
    setOtpStatus("checking");

    (async () => {
      try {
        await verifyOtpApi({ email, otp: Number(otp) });
        if (checkTokenRef.current === myToken) {
          setOtpStatus("valid");
          clearInterval(timerRef.current);
        }
      } catch (error) {
        if (checkTokenRef.current === myToken) {
          setOtpStatus("invalid");
        }
      }
    })();
  }, [otp]);

  const onFinish = async (values) => {
    if (otp.length !== 6 || otpStatus !== "valid") {
      toast.error("Vui lòng nhập đúng mã OTP gồm 6 chữ số");
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
        otp: Number(otp),
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

  const passwordFieldsDisabled = otpStatus !== "valid";

  return (
    <div className="reset-password-wrapper">
      <div className="reset-password-container">
        <div className="close-btn" onClick={handleClose}>
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
                  className={`otp-input ${
                    otpStatus === "valid" ? "otp-input-valid" : ""
                  } ${otpStatus === "invalid" ? "otp-input-invalid" : ""}`}
                  inputMode="numeric"
                  placeholder="0"
                  disabled={otpStatus === "checking"}
                />
              ))}
            </div>

            {otpStatus === "checking" && (
              <div className="otp-status otp-status-checking">
                Đang kiểm tra mã OTP...
              </div>
            )}
            {otpStatus === "valid" && (
              <div className="otp-status otp-status-valid">
                <CheckCircleFilled /> Mã OTP chính xác
              </div>
            )}
            {otpStatus === "invalid" && (
              <div className="otp-status otp-status-invalid">
                <CloseCircleFilled /> Mã OTP không chính xác
              </div>
            )}
          </div>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              disabled={passwordFieldsDisabled}
            />
          </Form.Item>

          <Form.Item
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu" }]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu"
              disabled={passwordFieldsDisabled}
            />
          </Form.Item>

          {otpStatus !== "valid" && (
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
          )}

          <Button
            type="primary"
            htmlType="submit"
            block
            disabled={passwordFieldsDisabled}
          >
            Đặt lại mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default ResetPassword;
