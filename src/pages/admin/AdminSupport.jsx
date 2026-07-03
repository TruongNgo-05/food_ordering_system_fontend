import React, { useState } from "react";
import { T } from "../../constants/customerTheme";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/admin/AdminSupport.css";
import { message, Modal } from "antd";

// ===== MOCK DATA =====
// FAQ (quản lý được: thêm / sửa / xóa)
const INIT_FAQ_DATA = [
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

// Yêu cầu hỗ trợ do người dùng gửi lên (từ trang Support.jsx phía khách hàng)
const INIT_TICKETS = [
  {
    id: 101,
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    subject: "Lỗi đơn hàng",
    message: "Tôi đặt đơn nhưng trạng thái vẫn hiển thị đang xử lý sau 2 giờ.",
    status: "pending", // pending | replied | resolved
    createdAt: "2026-07-01 09:12",
    reply: "",
  },
  {
    id: 102,
    name: "Trần Thị B",
    email: "thib@example.com",
    subject: "Thanh toán không thành công",
    message:
      "Tôi thanh toán qua Momo nhưng tiền đã bị trừ mà đơn hàng chưa được ghi nhận.",
    status: "replied",
    createdAt: "2026-07-01 14:45",
    reply: "Chúng tôi đã kiểm tra và hoàn tiền vào ví của bạn trong vòng 24h.",
  },
  {
    id: 103,
    name: "Lê Văn C",
    email: "vanc@example.com",
    subject: "Quên mật khẩu",
    message: "Tôi không nhận được email đặt lại mật khẩu.",
    status: "resolved",
    createdAt: "2026-06-30 08:20",
    reply: "Đã gửi lại email đặt lại mật khẩu, vui lòng kiểm tra hộp thư.",
  },
];

const STATUS_LABEL = {
  pending: "Chưa xử lý",
  replied: "Đã phản hồi",
  resolved: "Đã giải quyết",
};

const STATUS_COLOR = {
  pending: "#e74c3c",
  replied: "#f39c12",
  resolved: "#27ae60",
};

const AdminSupport = () => {
  const [activeTab, setActiveTab] = useState("tickets"); // tickets | faq

  // ===== TICKETS STATE =====
  const [tickets, setTickets] = useState(INIT_TICKETS);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // ===== FAQ STATE =====
  const [faqList, setFaqList] = useState(INIT_FAQ_DATA);
  const [faqForm, setFaqForm] = useState({
    id: null,
    question: "",
    answer: "",
  });
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqErrors, setFaqErrors] = useState({});

  // ---------- TICKET HANDLERS ----------
  const filteredTickets =
    statusFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.reply || "");
  };

  const closeTicket = () => {
    setSelectedTicket(null);
    setReplyText("");
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      message.warning("Vui lòng nhập nội dung phản hồi");
      return;
    }
    setSendingReply(true);
    setTimeout(() => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? { ...t, reply: replyText, status: "replied" }
            : t,
        ),
      );
      setSelectedTicket((prev) => ({
        ...prev,
        reply: replyText,
        status: "replied",
      }));
      setSendingReply(false);
      message.success("Đã gửi phản hồi cho khách hàng!");
    }, 800);
  };

  const handleMarkResolved = (ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: "resolved" } : t)),
    );
    if (selectedTicket?.id === ticket.id) {
      setSelectedTicket((prev) => ({ ...prev, status: "resolved" }));
    }
    message.success("Đã đánh dấu yêu cầu là đã giải quyết");
  };

  const handleDeleteTicket = (ticket) => {
    Modal.confirm({
      title: "Xóa yêu cầu hỗ trợ",
      content: `Bạn có chắc muốn xóa yêu cầu của "${ticket.name}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setTickets((prev) => prev.filter((t) => t.id !== ticket.id));
        if (selectedTicket?.id === ticket.id) closeTicket();
        message.success("Đã xóa yêu cầu hỗ trợ");
      },
    });
  };

  // ---------- FAQ HANDLERS ----------
  const openAddFaq = () => {
    setFaqForm({ id: null, question: "", answer: "" });
    setFaqErrors({});
    setFaqModalOpen(true);
  };

  const openEditFaq = (item) => {
    setFaqForm(item);
    setFaqErrors({});
    setFaqModalOpen(true);
  };

  const closeFaqModal = () => {
    setFaqModalOpen(false);
    setFaqForm({ id: null, question: "", answer: "" });
    setFaqErrors({});
  };

  const handleFaqChange = (e) => {
    const { name, value } = e.target;
    setFaqForm((prev) => ({ ...prev, [name]: value }));
    setFaqErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFaq = () => {
    const newErrors = {};
    if (!faqForm.question.trim()) newErrors.question = "Vui lòng nhập câu hỏi";
    if (!faqForm.answer.trim()) newErrors.answer = "Vui lòng nhập câu trả lời";
    return newErrors;
  };

  const handleSaveFaq = () => {
    const newErrors = validateFaq();
    if (Object.keys(newErrors).length > 0) {
      setFaqErrors(newErrors);
      return;
    }

    if (faqForm.id) {
      // update
      setFaqList((prev) =>
        prev.map((f) => (f.id === faqForm.id ? { ...faqForm } : f)),
      );
      message.success("Đã cập nhật câu hỏi thường gặp");
    } else {
      // create
      const newId = Math.max(0, ...faqList.map((f) => f.id)) + 1;
      setFaqList((prev) => [...prev, { ...faqForm, id: newId }]);
      message.success("Đã thêm câu hỏi thường gặp mới");
    }
    closeFaqModal();
  };

  const handleDeleteFaq = (item) => {
    Modal.confirm({
      title: "Xóa câu hỏi thường gặp",
      content: `Bạn có chắc muốn xóa câu hỏi "${item.question}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        setFaqList((prev) => prev.filter((f) => f.id !== item.id));
        message.success("Đã xóa câu hỏi thường gặp");
      },
    });
  };

  return (
    <div className="admin-support-page" style={{ background: T.bg }}>
      <div className="admin-support-container">
        <UserHeader
          title="Quản lý Hỗ trợ và thắc mắc"
          description="Quản lý câu hỏi thường gặp và yêu cầu hỗ trợ từ người dùng"
        />

        {/* TABS */}
        <div className="admin-support-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "tickets" ? "active" : ""}`}
            onClick={() => setActiveTab("tickets")}
          >
            Yêu cầu hỗ trợ
            <span className="admin-tab-count">{tickets.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "faq" ? "active" : ""}`}
            onClick={() => setActiveTab("faq")}
          >
            Câu hỏi thường gặp
            <span className="admin-tab-count">{faqList.length}</span>
          </button>
        </div>

        {/* ===== TICKETS TAB ===== */}
        {activeTab === "tickets" && (
          <div className="admin-support-section">
            <div className="admin-section-toolbar">
              <h3 className="admin-section-title">Danh sách yêu cầu hỗ trợ</h3>
              <div className="admin-filter-group">
                {["all", "pending", "replied", "resolved"].map((s) => (
                  <button
                    key={s}
                    className={`admin-filter-btn ${statusFilter === s ? "active" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === "all" ? "Tất cả" : STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-ticket-list">
              {filteredTickets.length === 0 && (
                <div className="admin-empty-state">Không có yêu cầu nào</div>
              )}

              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="admin-ticket-item">
                  <div
                    className="admin-ticket-main"
                    onClick={() => openTicket(ticket)}
                  >
                    <div className="admin-ticket-header">
                      <span className="admin-ticket-subject">
                        {ticket.subject}
                      </span>
                      <span
                        className="admin-ticket-status"
                        style={{ color: STATUS_COLOR[ticket.status] }}
                      >
                        ● {STATUS_LABEL[ticket.status]}
                      </span>
                    </div>
                    <div className="admin-ticket-meta">
                      <span>{ticket.name}</span>
                      <span>{ticket.email}</span>
                      <span>{ticket.createdAt}</span>
                    </div>
                    <div className="admin-ticket-preview">{ticket.message}</div>
                  </div>

                  <div className="admin-ticket-actions">
                    {ticket.status !== "resolved" && (
                      <button
                        className="admin-action-btn resolve"
                        onClick={() => handleMarkResolved(ticket)}
                      >
                        Đánh dấu đã giải quyết
                      </button>
                    )}
                    <button
                      className="admin-action-btn delete"
                      onClick={() => handleDeleteTicket(ticket)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== FAQ TAB ===== */}
        {activeTab === "faq" && (
          <div className="admin-support-section">
            <div className="admin-section-toolbar">
              <h3 className="admin-section-title">
                Quản lý câu hỏi thường gặp
              </h3>
              <button className="admin-add-btn" onClick={openAddFaq}>
                + Thêm câu hỏi
              </button>
            </div>

            <div className="admin-faq-list">
              {faqList.map((item) => (
                <div key={item.id} className="admin-faq-item">
                  <div className="admin-faq-content">
                    <div className="admin-faq-question">{item.question}</div>
                    <div className="admin-faq-answer">{item.answer}</div>
                  </div>
                  <div className="admin-faq-actions">
                    <button
                      className="admin-action-btn edit"
                      onClick={() => openEditFaq(item)}
                    >
                      Sửa
                    </button>
                    <button
                      className="admin-action-btn delete"
                      onClick={() => handleDeleteFaq(item)}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== TICKET DETAIL MODAL ===== */}
      {selectedTicket && (
        <div className="admin-modal-overlay" onClick={closeTicket}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{selectedTicket.subject}</h3>
              <button className="admin-modal-close" onClick={closeTicket}>
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-meta">
                <p>
                  <strong>Người gửi:</strong> {selectedTicket.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedTicket.email}
                </p>
                <p>
                  <strong>Thời gian:</strong> {selectedTicket.createdAt}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span style={{ color: STATUS_COLOR[selectedTicket.status] }}>
                    {STATUS_LABEL[selectedTicket.status]}
                  </span>
                </p>
              </div>

              <div className="admin-modal-message">
                <strong>Nội dung:</strong>
                <p>{selectedTicket.message}</p>
              </div>

              <div className="admin-modal-reply">
                <label htmlFor="reply">Phản hồi</label>
                <textarea
                  id="reply"
                  rows={4}
                  placeholder="Nhập nội dung phản hồi cho khách hàng..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              {selectedTicket.status !== "resolved" && (
                <button
                  className="admin-secondary-btn"
                  onClick={() => handleMarkResolved(selectedTicket)}
                >
                  Đánh dấu đã giải quyết
                </button>
              )}
              <button
                className="admin-primary-btn"
                disabled={sendingReply}
                onClick={handleSendReply}
              >
                {sendingReply ? "Đang gửi..." : "Gửi phản hồi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== FAQ ADD/EDIT MODAL ===== */}
      {faqModalOpen && (
        <div className="admin-modal-overlay" onClick={closeFaqModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{faqForm.id ? "Sửa câu hỏi" : "Thêm câu hỏi mới"}</h3>
              <button className="admin-modal-close" onClick={closeFaqModal}>
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="form-group">
                <label htmlFor="question">Câu hỏi</label>
                <input
                  id="question"
                  name="question"
                  type="text"
                  placeholder="Nhập câu hỏi"
                  value={faqForm.question}
                  onChange={handleFaqChange}
                  className={faqErrors.question ? "input-error" : ""}
                />
                {faqErrors.question && (
                  <span className="error-text">{faqErrors.question}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="answer">Câu trả lời</label>
                <textarea
                  id="answer"
                  name="answer"
                  rows={5}
                  placeholder="Nhập câu trả lời"
                  value={faqForm.answer}
                  onChange={handleFaqChange}
                  className={faqErrors.answer ? "input-error" : ""}
                />
                {faqErrors.answer && (
                  <span className="error-text">{faqErrors.answer}</span>
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-secondary-btn" onClick={closeFaqModal}>
                Hủy
              </button>
              <button className="admin-primary-btn" onClick={handleSaveFaq}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
