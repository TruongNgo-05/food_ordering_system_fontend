import { Drawer, Typography, Divider, List, Card, Tag } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function UserViewDrawer({
  title = "Chi tiết người dùng",
  open,
  onClose,
  user,
}) {
  if (!user) return null;

  const avatar = user?.avatar || "";

  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const avatarUrl = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${IMG_URL}${avatar}`
    : "";

  const formatDate = (date) =>
    date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "—";

  const data = [
    { label: "Họ tên", value: user.fullName },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "SĐT", value: user.phone },
    { label: "Vai trò", value: user.role },

    {
      label: "Trạng thái",
      value:
        user.status === "ACTIVED" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Khóa</Tag>
        ),
    },

    {
      label: "Ngày tạo",
      value: formatDate(user.createdDate),
    },

    {
      label: "Lock time",
      value: formatDate(user.lockTime),
    },
  ];

  return (
    <Drawer title={title} open={open} onClose={onClose} width={500}>
      <Card
        style={{
          borderRadius: 12,
          background: "#fafafa",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar-user"
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #e5e7eb",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user.fullName || "User") +
                  "&background=4f46e5&color=fff&size=128";
              }}
            />
          ) : (
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                border: "2px dashed #d1d5db",
                background: "#fff",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              No Avatar
            </div>
          )}
        </div>

        <Title level={5} style={{ marginBottom: 16 }}>
          Thông tin người dùng
        </Title>

        <Divider style={{ margin: "12px 0" }} />

        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <div style={{ width: "100%" }}>
                <Text type="secondary">{item.label}</Text>
                <br />
                <Text strong>{item.value || "—"}</Text>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </Drawer>
  );
}
