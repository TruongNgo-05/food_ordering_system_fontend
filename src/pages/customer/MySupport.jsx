import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Modal,
  Typography,
  Empty,
  Spin,
  message,
} from "antd";
import { EyeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import UserHeader from "../../components/user/UserHeader";
import supportService from "../../services/customer/supportService";
import SupportTable from "../../components/customer/SupportTable";
import AppPagination from "../../components/common/AppPagination";

import "../../assets/styles/customer/MySupport.css";

const { Paragraph, Title } = Typography;

const MySupport = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [supports, setSupports] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);

  useEffect(() => {
    loadSupports();
  }, [page, size]);

  const loadSupports = async () => {
    try {
      setLoading(true);

      const res = await supportService.getMySupport(page, size);

      const data = res.data.data;

      setSupports(data.content || []);
      setTotal(data.totalElements || 0);
    } catch (error) {
      message.error("Không thể tải danh sách yêu cầu hỗ trợ.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "PENDING":
        return <Tag className="status-pending">Đang chờ</Tag>;

      case "REPLIED":
        return <Tag className="status-replied">Đã phản hồi</Tag>;

      case "RESOLVED":
        return <Tag className="status-resolved">Đã giải quyết</Tag>;

      default:
        return <Tag>{status}</Tag>;
    }
  };

  return (
    <div>
      <UserHeader
        title="Yêu cầu hỗ trợ của tôi"
        description="Theo dõi trạng thái các yêu cầu đã gửi"
      />

      <div className="my-support-back">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/support")}
        >
          Quay lại
        </Button>
      </div>

      <Card className="my-support-card">
        {loading ? (
          <div className="my-support-loading">
            <Spin size="large" />
          </div>
        ) : supports.length === 0 ? (
          <Empty description="Bạn chưa gửi yêu cầu hỗ trợ nào." />
        ) : (
          <>
            <SupportTable
              data={supports}
              loading={loading}
              onView={(record) => {
                setSelectedSupport(record);
                setOpenDetail(true);
              }}
            />

            <AppPagination
              page={page}
              size={size}
              total={total}
              onChange={(newPage, newSize) => {
                setPage(newPage);
                setSize(newSize);
              }}
            />
          </>
        )}
      </Card>

      <Modal
        className="support-detail-modal"
        open={openDetail}
        width={750}
        footer={null}
        title="Chi tiết yêu cầu hỗ trợ"
        onCancel={() => {
          setOpenDetail(false);
          setSelectedSupport(null);
        }}
      >
        {selectedSupport && (
          <>
            <div className="support-info">
              <div className="support-label">Mã hỗ trợ</div>
              <div className="support-value">{selectedSupport.supportCode}</div>

              <div className="support-label">Chủ đề</div>
              <div className="support-value">{selectedSupport.subject}</div>

              <div className="support-label">Trạng thái</div>
              <div className="support-value">
                {getStatusTag(selectedSupport.status)}
              </div>

              <div className="support-label">Ngày gửi</div>
              <div className="support-value">
                {new Date(selectedSupport.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>

            <div className="support-box">
              <div className="support-box-title">Nội dung yêu cầu</div>

              <Paragraph className="support-message">
                {selectedSupport.message}
              </Paragraph>
            </div>

            <div className="support-box">
              <div className="support-box-title">Phản hồi từ quản trị viên</div>

              {selectedSupport.reply ? (
                <Card className="reply-card" bordered={false}>
                  <Paragraph className="support-message">
                    {selectedSupport.reply}
                  </Paragraph>
                </Card>
              ) : (
                <div className="reply-empty">
                  Chưa có phản hồi từ quản trị viên.
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MySupport;
