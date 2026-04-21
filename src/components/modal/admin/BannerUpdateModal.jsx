import { Form, Input, Modal, Switch } from "antd";

const BannerUpdateModal = ({ open, onCancel, onSubmit, form }) => {
  const imageUrl = Form.useWatch("image", form);

  return (
    <Modal title="Sửa banner" open={open} onCancel={onCancel} onOk={onSubmit}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Nhập tiêu đề" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="desc"
          label="Mô tả"
          rules={[{ required: true, message: "Nhập mô tả" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="image"
          label="Link ảnh"
          rules={[{ required: true, message: "Nhập link ảnh" }]}
        >
          <Input />
        </Form.Item>

        {imageUrl && (
          <div style={{ marginTop: -12, marginBottom: 16 }}>
            <img
              src={imageUrl}
              alt="Preview"
              onError={(e) => (e.currentTarget.style.display = "none")}
              onLoad={(e) => (e.currentTarget.style.display = "block")}
              style={{
                display: "none",
                width: "100%",
                maxHeight: 180,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
            />
          </div>
        )}
        <Form.Item name="active" label="Hiển thị" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BannerUpdateModal;
