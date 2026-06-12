import React, { useState } from "react";
import { T } from "../../constants/customerTheme";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/Support.css";
import { message } from "antd";

// ===== MOCK DATA =====
const FAQ_DATA = [
  {
    id: 1,
    question: "Làm sao để đặt món trên hệ thống?",
    answer:
      "Bạn chỉ cần chọn nhà hàng/quán mong muốn, thêm món vào giỏ hàng và tiến hành thanh toán. Đơn hàng sẽ được xác nhận ngay sau khi bạn hoàn tất bước đặt hàng.",
  },
  {
    id: 2,
    question: "Tôi có thể hủy đơn hàng sau khi đã đặt không?",
    answer:
      "Bạn có thể hủy đơn trong vòng 5 phút sau khi đặt nếu đơn chưa được nhà hàng xác nhận. Sau thời gian này, vui lòng liên hệ hotline để được hỗ trợ.",
  },
  {
    id: 3,
    question: "Thanh toán bằng hình thức nào?",
    answer:
      "Hệ thống hỗ trợ thanh toán tiền mặt khi nhận hàng, chuyển khoản ngân hàng và các ví điện tử phổ biến như Momo, ZaloPay, VNPay.",
  },
  {
    id: 4,
    question: "Tôi quên mật khẩu, phải làm sao?",
    answer:
      'Tại trang đăng nhập, chọn "Quên mật khẩu" và làm theo hướng dẫn để đặt lại mật khẩu qua email đã đăng ký.',
  },
  {
    id: 5,
    question: "Thời gian phản hồi yêu cầu hỗ trợ là bao lâu?",
    answer:
      "Đội ngũ hỗ trợ sẽ phản hồi trong vòng 24 giờ làm việc. Với các yêu cầu khẩn cấp, vui lòng gọi trực tiếp hotline để được xử lý nhanh nhất.",
  },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const toggleFaq = (id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập họ tên";
    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.subject.trim()) newErrors.subject = "Vui lòng nhập chủ đề";
    if (!form.message.trim()) newErrors.message = "Vui lòng nhập nội dung";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);

      message.success("Yêu cầu hỗ trợ đã được gửi thành công!");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1200);
  };

  return (
    <div className="support-page" style={{ background: T.bg }}>
      <div className="support-container">
        <UserHeader
          title="Hỗ trợ & Thắc mắc"
          description="Liên hệ trực tiếp với chúng tôi"
        />

        {/* FAQ */}
        <div className="support-section">
          <h3 className="support-section-title">Câu hỏi thường gặp</h3>
          <div className="faq-list">
            {FAQ_DATA.map((item) => (
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
          {/* Contact Form */}
          <div className="support-section">
            <h3 className="support-section-title">Gửi yêu cầu hỗ trợ</h3>
            <form className="support-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    value={form.name}
                    onChange={handleChange}
                    className={errors.name ? "input-error" : ""}
                  />
                  {errors.name && (
                    <span className="error-text">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Chủ đề</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
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
                <label htmlFor="message">Nội dung</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Mô tả chi tiết vấn đề bạn đang gặp..."
                  value={form.message}
                  onChange={handleChange}
                  className={errors.message ? "input-error" : ""}
                />
                {errors.message && (
                  <span className="error-text">{errors.message}</span>
                )}
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
      </div>
    </div>
  );
};

export default Support;
