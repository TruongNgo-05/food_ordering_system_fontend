import { Drawer, Typography, Divider, List, Card, Tag } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const VoucherDetailDrawer = ({ open, onClose, data }) => {
  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "—";

  const formatMoney = (value) =>
    value ? `${Number(value).toLocaleString("vi-VN")} đ` : "0 đ";

  const listData = data
    ? [
        {
          label: "Mã voucher",
          value: <Tag color="blue">{data.voucherCode}</Tag>,
        },
        { label: "Mô tả", value: data.description || "—" },
        { label: "Giảm giá", value: formatMoney(data.discount) },
        { label: "Đơn tối thiểu", value: formatMoney(data.minOrderValue) },
        {
          label: "Giới hạn lượt dùng",
          value: data.usageLimit ?? "Không giới hạn",
        },
        { label: "Đã sử dụng", value: data.usedCount ?? 0 },
        {
          label: "Thời gian",
          value: `${formatDate(data.startDate)} → ${formatDate(data.endDate)}`,
        },
        { label: "Ngày tạo", value: formatDate(data.createdAt) },
      ]
    : [];

  return (
    <Drawer
      title="Chi tiết voucher"
      open={open}
      onClose={onClose}
      width={500}
      placement="right"
      destroyOnClose
    >
      <Card style={{ borderRadius: 12, background: "#fafafa" }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          Thông tin voucher
        </Title>

        <Divider style={{ margin: "12px 0" }} />

        <List
          dataSource={listData}
          renderItem={(item) => (
            <List.Item>
              <div style={{ width: "100%" }}>
                <Text type="secondary">{item.label}</Text>
                <br />
                <Text strong>{item.value}</Text>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </Drawer>
  );
};

export default VoucherDetailDrawer;
