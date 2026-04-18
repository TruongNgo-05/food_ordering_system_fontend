import React, { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import FoodImage from "../../common/FoodImage";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const parseAdditionalImages = (value) =>
  String(value || "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

const EditFoodModal = ({
  open,
  onCancel,
  onSubmit,
  categories,
  form,
  record,
}) => {
  useEffect(() => {
    if (open && record) {
      form.setFieldsValue({
        name: record.name,
        image: record.image || "",
        additionalImages: (record.images || [])
          .filter((img) => img && img !== record.image)
          .join("\n"),
        category: record.category_id,
        priceInThousand: Math.round(record.price / 1000),
      });
    }
  }, [open, record, form]);

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      form.setFieldValue("image", dataUrl);
      message.success("Tải ảnh thành công");
    } catch {
      message.error("Không thể đọc ảnh. Vui lòng thử lại.");
    } finally {
      event.target.value = "";
    }
  };

  const handleUploadAdditionalImages = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    try {
      const dataUrls = await Promise.all(
        files.map((file) => fileToDataUrl(file)),
      );
      const current = parseAdditionalImages(
        form.getFieldValue("additionalImages"),
      );
      const next = [...current, ...dataUrls].filter(Boolean);
      form.setFieldValue("additionalImages", next.join("\n"));
      message.success("Tải ảnh phụ thành công");
    } catch {
      message.error("Không thể đọc ảnh phụ. Vui lòng thử lại.");
    } finally {
      event.target.value = "";
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      message.error("Vui lòng điền đầy đủ thông tin");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Sửa món ăn"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên món"
          rules={[{ required: true, message: "Nhập tên món" }]}
        >
          <Input placeholder="Nhập tên món ăn" />
        </Form.Item>

        <Form.Item
          name="image"
          label="Ảnh đại diện (link hoặc upload)"
          rules={[
            { required: true, message: "Nhập link ảnh hoặc tải ảnh từ máy" },
          ]}
        >
          <Input placeholder="https://... hoặc dùng nút tải ảnh bên dưới" />
        </Form.Item>

        <Form.Item label="Tải ảnh từ máy">
          <input type="file" accept="image/*" onChange={handleUploadImage} />
        </Form.Item>

        <Form.Item
          name="additionalImages"
          label="Ảnh phụ (mỗi dòng 1 link, hoặc ngăn cách bằng dấu phẩy)"
        >
          <Input.TextArea
            rows={3}
            placeholder="https://...&#10;https://... hoặc dùng nút tải ảnh phụ"
          />
        </Form.Item>

        <Form.Item label="Tải ảnh phụ từ máy">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadAdditionalImages}
          />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {() =>
            form.getFieldValue("image") ? (
              <div style={{ marginBottom: 12 }}>
                <FoodImage
                  src={form.getFieldValue("image")}
                  size={72}
                  radius={12}
                  textSize={28}
                />
              </div>
            ) : null
          }
        </Form.Item>

        <Form.Item
          name="category"
          label="Danh mục"
          rules={[{ required: true, message: "Chọn danh mục" }]}
        >
          <Select
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Chọn danh mục"
          />
        </Form.Item>

        <Form.Item
          name="priceInThousand"
          label="Giá bán (nghìn đồng)"
          rules={[{ required: true, message: "Nhập giá bán" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            addonAfter=".000 đ"
            placeholder="Ví dụ: 179"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFoodModal;
