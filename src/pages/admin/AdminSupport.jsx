import React, { useState, useEffect } from "react";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/admin/AdminSupport.css";
import adminSupportService from "../../services/admin/adminSupportService";
import adminFAQService from "../../services/admin/adminFAQService";
import { getFAQ } from "../../services/userService";
import { message, Modal } from "antd";
import AppPagination from "../../components/common/AppPagination";

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
  const [activeTab, setActiveTab] = useState("faq"); // tickets | faq

  // ===== TICKETS STATE =====
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [ticketPage, setTicketPage] = useState(0);
  const [ticketSize] = useState(5);
  const [ticketTotal, setTicketTotal] = useState(0);

  // ===== FAQ STATE (đưa lên trước để tránh lỗi TDZ) =====
  const [faqList, setFaqList] = useState([]);
  const [loadingFAQ, setLoadingFAQ] = useState(false);
  const [faqForm, setFaqForm] = useState({
    id: null,
    question: "",
    answer: "",
  });
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [faqErrors, setFaqErrors] = useState({});
  const [faqPage, setFaqPage] = useState(0);
  const [faqSize] = useState(5);
  const [faqTotal, setFaqTotal] = useState(0);

  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);

      const params =
        statusFilter === "all"
          ? {}
          : {
              status: statusFilter.toUpperCase(),
            };

      const res = await adminSupportService.getAllTickets({
        ...params,
        page: ticketPage,
        size: ticketSize,
      });

      const list = res.data.data.content.map((item) => ({
        id: item.id,
        name: item.fullName,
        email: item.email,
        subject: item.subject,
        message: item.message,
        status: item.status.toLowerCase(),
        createdAt: new Date(item.createdAt).toLocaleString("vi-VN"),
        reply: item.reply || "",
        supportCode: item.supportCode,
        userId: item.userId,
      }));
      setTicketTotal(res.data.data.totalElements);
      setTickets(list);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách yêu cầu hỗ trợ");
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchFAQ = async () => {
    try {
      setLoadingFAQ(true);

      const res = await getFAQ(faqPage, faqSize);
      const pageData = res?.data?.data ?? {};
      const list = Array.isArray(pageData.content)
        ? pageData.content
        : Array.isArray(pageData)
          ? pageData
          : [];

      setFaqList(list);
      setFaqTotal(pageData.totalElements ?? list.length ?? 0);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải danh sách FAQ");
    } finally {
      setLoadingFAQ(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, ticketPage]);

  useEffect(() => {
    fetchFAQ();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faqPage]);

  // ---------- TICKET HANDLERS ----------
  const filteredTickets =
    statusFilter === "all"
      ? tickets
      : tickets.filter((t) => t.status === statusFilter);

  const openTicket = async (ticket) => {
    try {
      const res = await adminSupportService.getTicketById(ticket.id);
      const data = res.data.data;

      setSelectedTicket({
        id: data.id,
        name: data.fullName,
        email: data.email,
        subject: data.subject,
        message: data.message,
        reply: data.reply || "",
        status: data.status.toLowerCase(),
        createdAt: new Date(data.createdAt).toLocaleString("vi-VN"),
      });

      setReplyText(data.reply || "");
    } catch (error) {
      message.error("Không thể tải chi tiết yêu cầu");
    }
  };

  const closeTicket = () => {
    setSelectedTicket(null);
    setReplyText("");
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      message.warning("Vui lòng nhập nội dung phản hồi");
      return;
    }

    try {
      setSendingReply(true);

      await adminSupportService.replyTicket(selectedTicket.id, {
        reply: replyText,
      });

      message.success("Đã gửi phản hồi");

      setSelectedTicket((prev) => ({
        ...prev,
        reply: replyText,
        status: "replied",
      }));

      fetchTickets();
    } catch (error) {
      message.error("Gửi phản hồi thất bại");
    } finally {
      setSendingReply(false);
    }
  };

  const handleMarkResolved = (ticket) => {
    if (!replyText.trim()) {
      message.warning("Bạn cần nhập nội dung phản hồi trước.");
      return;
    }

    Modal.confirm({
      title: "Xác nhận",
      content: "Bạn có chắc chắn muốn đánh dấu yêu cầu này đã được giải quyết?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      centered: true,

      onOk: async () => {
        try {
          await adminSupportService.replyTicket(ticket.id, {
            reply: replyText,
          });

          await adminSupportService.resolveTicket(ticket.id);

          message.success("Đã phản hồi và đánh dấu yêu cầu đã giải quyết");

          setSelectedTicket((prev) =>
            prev
              ? {
                  ...prev,
                  reply: replyText,
                  status: "resolved",
                }
              : prev,
          );

          fetchTickets();
        } catch (error) {
          message.error("Không thể cập nhật trạng thái");
        }
      },
    });
  };

  // ---------- FAQ HANDLERS ----------
  const openAddFaq = () => {
    setFaqForm({
      id: null,
      question: "",
      answer: "",
    });

    setFaqErrors({});
    setFaqModalOpen(true);
  };

  const openEditFaq = (item) => {
    setFaqForm({
      id: item.id,
      question: item.question,
      answer: item.answer,
    });

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

  const handleSaveFaq = async () => {
    const newErrors = validateFaq();

    if (Object.keys(newErrors).length > 0) {
      setFaqErrors(newErrors);
      return;
    }

    try {
      const data = {
        question: faqForm.question,
        answer: faqForm.answer,
      };

      if (faqForm.id) {
        await adminFAQService.updateFAQ(faqForm.id, data);
        message.success("Cập nhật FAQ thành công");
      } else {
        await adminFAQService.createFAQ(data);
        message.success("Thêm FAQ thành công");
      }

      setFaqPage(0);
      await fetchFAQ();

      closeFaqModal();
    } catch (error) {
      console.error(error);
      message.error("Lưu FAQ thất bại");
    }
  };

  const handleDeleteFaq = (item) => {
    Modal.confirm({
      title: "Xóa FAQ",
      content: `Bạn có chắc muốn xóa câu hỏi "${item.question}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          await adminFAQService.deleteFAQ(item.id);

          setFaqList((prev) => prev.filter((faq) => faq.id !== item.id));
          setFaqTotal((prev) => Math.max(prev - 1, 0));
          setFaqPage(0);

          message.success("Đã xóa FAQ");
        } catch (error) {
          console.error(error);
          message.error("Xóa FAQ thất bại");
        }
      },
    });
  };

  const handleDeleteTicket = (ticket) => {
    Modal.confirm({
      title: "Xóa yêu cầu hỗ trợ",
      content: `Bạn có chắc muốn xóa yêu cầu "${ticket.subject}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true,
      onOk: async () => {
        try {
          await adminSupportService.deleteTicket(ticket.id);

          setTickets((prev) => prev.filter((item) => item.id !== ticket.id));
          setTicketTotal((prev) => Math.max(prev - 1, 0));
          setTicketPage(0);

          message.success("Đã xóa yêu cầu hỗ trợ");
        } catch (error) {
          console.error(error);
          message.error("Xóa yêu cầu hỗ trợ thất bại");
        }
      },
    });
  };

  return (
    <div className="admin-support-page">
      <UserHeader
        title="Quản lý Hỗ trợ và thắc mắc"
        description="Quản lý câu hỏi thường gặp và yêu cầu hỗ trợ từ người dùng"
      />

      {/* TABS */}
      <div className="admin-support-tabs">
        <button
          className={`admin-tab-btn ${activeTab === "faq" ? "active" : ""}`}
          onClick={() => setActiveTab("faq")}
        >
          Câu hỏi thường gặp
          <span className="admin-tab-count">{faqTotal}</span>
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "tickets" ? "active" : ""}`}
          onClick={() => setActiveTab("tickets")}
        >
          Yêu cầu hỗ trợ
          <span className="admin-tab-count">{ticketTotal}</span>
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
            {loadingTickets && (
              <div className="admin-empty-state">Đang tải dữ liệu...</div>
            )}
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
                <div className="admin-faq-actions">
                  <button
                    className="admin-action-btn delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTicket(ticket);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
          <AppPagination
            page={ticketPage}
            size={ticketSize}
            total={ticketTotal}
            onChange={(page) => {
              setTicketPage(page);
            }}
          />
        </div>
      )}

      {/* ===== FAQ TAB ===== */}
      {activeTab === "faq" && (
        <div className="admin-support-section">
          <div className="admin-section-toolbar">
            <h3 className="admin-section-title">Quản lý câu hỏi thường gặp</h3>
            <button className="admin-add-btn" onClick={openAddFaq}>
              + Thêm câu hỏi
            </button>
          </div>

          <div className="admin-faq-list">
            {loadingFAQ && (
              <div className="admin-empty-state">Đang tải dữ liệu...</div>
            )}
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
          <AppPagination
            page={faqPage}
            size={faqSize}
            total={faqTotal}
            onChange={(page) => {
              setFaqPage(page);
            }}
          />
        </div>
      )}

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
              <div className="admin-modal-reply">
                <label htmlFor="reply">Phản hồi</label>
                <textarea
                  id="reply"
                  rows={6}
                  placeholder="Nhập nội dung phản hồi cho khách hàng..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-modal-footer">
              {selectedTicket.status !== "resolved" && (
                <>
                  <button
                    className="admin-secondary-btn"
                    onClick={() => handleMarkResolved(selectedTicket)}
                  >
                    Đánh dấu đã giải quyết
                  </button>

                  <button
                    className="admin-primary-btn"
                    disabled={sendingReply}
                    onClick={handleSendReply}
                  >
                    {sendingReply ? "Đang gửi..." : "Gửi phản hồi"}
                  </button>
                </>
              )}
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
