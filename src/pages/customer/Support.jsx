import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import { confirmLoginWithModal } from "../../utils/authGuards";
import UserHeader from "../../components/user/UserHeader";
import { getFAQ } from "../../services/userService";
import supportService from "../../services/customer/supportService";
import Footer from "../../layouts/Footer";
import "../../assets/styles/Support.css";
import AppPagination from "../../components/common/AppPagination";

const Support = () => {
  const navigate = useNavigate();

  const isLogin = !!localStorage.getItem("accessToken");

  const [faqData, setFaqData] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFAQ(page, size);
  }, [page, size]);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const fetchFAQ = async (page, size) => {
    try {
      const res = await getFAQ(page, size);

      setFaqData(res.data.data.content || []);
      setTotal(res.data.data.totalElements || 0);
    } catch (err) {
      message.error("Không thể tải FAQ");
    }
  };

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.subject.trim()) {
      newErrors.subject = "Vui lòng nhập chủ đề";
    }

    if (!form.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin) {
      confirmLoginWithModal(navigate);
      return;
    }

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (captchaInput.trim().toUpperCase() !== captcha) {
      generateCaptcha();
      setCaptchaInput("");
      return message.error("Mã bảo mật không chính xác");
    }
    try {
      setSubmitting(true);

      await supportService.createSupport({
        subject: form.subject,
        message: form.message,
      });

      message.success("Yêu cầu hỗ trợ đã được gửi thành công!");

      setForm({
        subject: "",
        message: "",
      });

      setCaptchaInput("");
      generateCaptcha();

      setErrors({});
    } catch (error) {
      message.error(error.response?.data?.message || "Gửi yêu cầu thất bại!");
    } finally {
      setSubmitting(false);
    }
  };
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setCaptcha(code);
  };
  return (
    <div className="support-page">
      <div className="support-container">
        <UserHeader
          title="Hỗ trợ & Thắc mắc"
          description="Liên hệ trực tiếp với chúng tôi"
        />

        {isLogin && (
          <div className="support-header-action">
            <button
              className="my-support-btn"
              onClick={() => navigate("/my-support")}
            >
              Xem yêu cầu hỗ trợ của tôi
            </button>
          </div>
        )}

        <div className="support-section">
          <h3 className="support-section-title">Câu hỏi thường gặp</h3>

          <div className="faq-list">
            {faqData.map((item) => (
              <div
                key={item.id}
                className={`faq-item ${openFaq === item.id ? "faq-open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(item.id)}
                >
                  <span>{item.question}</span>

                  <span className="faq-icon">
                    {openFaq === item.id ? "−" : "+"}
                  </span>
                </button>

                {openFaq === item.id && (
                  <div className="faq-answer">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
          <AppPagination
            page={page}
            size={size}
            total={total}
            onChange={(newPage) => {
              setPage(newPage);
              setOpenFaq(null);
            }}
          />
        </div>

        <div className="support-section">
          <h3 className="support-section-title">Gửi yêu cầu hỗ trợ</h3>

          <form className="support-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Chủ đề</label>

              <input
                type="text"
                name="subject"
                placeholder="Ví dụ: Lỗi đơn hàng, thanh toán..."
                value={form.subject}
                onChange={handleChange}
                className={errors.subject ? "input-error" : ""}
              />

              {errors.subject && (
                <span className="error-text">{errors.subject}</span>
              )}
            </div>

            <div className="form-group">
              <label>Nội dung</label>

              <textarea
                rows={5}
                name="message"
                placeholder="Mô tả chi tiết vấn đề bạn đang gặp..."
                value={form.message}
                onChange={handleChange}
                className={errors.message ? "input-error" : ""}
              />

              {errors.message && (
                <span className="error-text">{errors.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>Mã bảo mật</label>

              <div className="support-captcha-row">
                <div className="support-captcha-box">{captcha}</div>

                <button
                  type="button"
                  className="support-refresh-btn"
                  onClick={generateCaptcha}
                  title="Làm mới mã"
                >
                  ↻
                </button>

                <input
                  type="text"
                  className="support-captcha-input"
                  placeholder="Nhập mã"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  maxLength={5}
                />
              </div>
            </div>
            <button
              type="submit"
              className="support-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
