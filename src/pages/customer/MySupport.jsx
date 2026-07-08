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

import "../../assets/styles/customer/MySupport.css";

const { Paragraph, Title } = Typography;

const MySupport = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [supports, setSupports] = useState([]);

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);

  useEffect(() => {
    loadSupports();
  }, []);

  const loadSupports = async () => {
    try {
      setLoading(true);

      const res = await supportService.getMySupport();

      setSupports(res.data.data || []);
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

  const columns = [
    {
      title: "Mã hỗ trợ",
      dataIndex: "supportCode",
      width: 160,
      align: "center",
    },
    {
      title: "Chủ đề",
      dataIndex: "subject",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 170,
      align: "center",
      render: (status) => getStatusTag(status),
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      width: 190,
      align: "center",
      render: (value) => (value ? new Date(value).toLocaleString("vi-VN") : ""),
    },
    {
      title: "Thao tác",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Button
          className="btn-view"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedSupport(record);
            setOpenDetail(true);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="my-support-page">
      <div className="my-support-container">
        <UserHeader
          title="Yêu cầu hỗ trợ của tôi"
          description="Theo dõi trạng thái các yêu cầu đã gửi"
        />

        <div className="my-support-back">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/customer/support")}
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
            <Table
              className="my-support-table"
              rowKey="id"
              columns={columns}
              dataSource={supports}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
              }}
            />
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
                <div className="support-value">
                  {selectedSupport.supportCode}
                </div>

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

                <Paragraph style={{ marginBottom: 0 }}>
                  {selectedSupport.message}
                </Paragraph>
              </div>

              <div className="support-box">
                <div className="support-box-title">
                  Phản hồi từ quản trị viên
                </div>

                {selectedSupport.reply ? (
                  <Card className="reply-card" bordered={false}>
                    <Paragraph style={{ marginBottom: 0 }}>
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
    </div>
  );
};

export default MySupport;
