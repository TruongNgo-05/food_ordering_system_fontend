import React, { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { Upload, Image, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

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

const FoodUpdateModal = ({
  open,
  onCancel,
  onSubmit,
  categories,
  form,
  record,
}) => {
  useEffect(() => {
    if (open && record) {
      form.setFieldsValues({
        name: record.name,
        desc: record.description || "", // ← đổi record.desc → record.description
        image: record.image || "",
        additionalImages: (record.images || [])
          .filter((img) => img && img !== record.image)
          .join("\n"),
        category: record.category_id,
        priceInThousand: Math.round(record.price / 1000),
      });
    }
  }, [open, record, form]);

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
      width={720}
      okText="Lưu thay đổi"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#111827" }}>
            Thông tin cơ bản
          </p>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên món"
                rules={[{ required: true, message: "Nhập tên món" }]}
              >
                <Input placeholder="Nhập tên món ăn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                  placeholder="Chọn danh mục"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item name="desc" label="Mô tả">
                <Input.TextArea rows={3} placeholder="Nhập mô tả món ăn" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#111827" }}>
            Hình ảnh món ăn
          </p>
          <Form.Item label="Ảnh đại diện">
            <Form.Item shouldUpdate noStyle>
              {() => {
                const image = form.getFieldValue("image");
                return (
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <Input
                        placeholder="Nhập link ảnh..."
                        value={image}
                        onChange={(e) =>
                          form.setFieldValue("image", e.target.value)
                        }
                        style={{ marginBottom: 8 }}
                      />
                      <Upload
                        showUploadList={false}
                        beforeUpload={async (file) => {
                          const base64 = await fileToDataUrl(file);
                          form.setFieldValue("image", base64);
                          return false;
                        }}
                      >
                        <Button icon={<PlusOutlined />}>Tải ảnh từ máy</Button>
                      </Upload>
                    </div>

                    <div
                      style={{
                        width: 118,
                        height: 118,
                        border: "1px dashed #d1d5db",
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                        background: "#f9fafb",
                      }}
                    >
                      {image ? (
                        <>
                          <Image
                            src={image}
                            width={118}
                            height={118}
                            style={{ objectFit: "cover" }}
                          />
                          <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ position: "absolute", top: 6, right: 6 }}
                            onClick={() => form.setFieldValue("image", "")}
                          />
                        </>
                      ) : (
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>
                          Preview
                        </span>
                      )}
                    </div>
                  </div>
                );
              }}
            </Form.Item>
          </Form.Item>

          <Form.Item label="Ảnh phụ">
            <Form.Item shouldUpdate noStyle>
              {() => {
                const images = parseAdditionalImages(
                  form.getFieldValue("additionalImages"),
                );
                return (
                  <>
                    <Input.Search
                      placeholder="Nhập link ảnh phụ rồi nhấn Enter"
                      enterButton="Thêm"
                      onSearch={(value) => {
                        const trimmed = value.trim();
                        if (!trimmed) return;
                        form.setFieldValue(
                          "additionalImages",
                          [...images, trimmed].join("\n"),
                        );
                      }}
                      style={{ marginBottom: 10 }}
                    />

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {images.map((img, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            width: 80,
                            height: 80,
                          }}
                        >
                          <Image
                            src={img}
                            width={80}
                            height={80}
                            style={{ objectFit: "cover", borderRadius: 8 }}
                          />
                          <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ position: "absolute", top: 2, right: 2 }}
                            onClick={() => {
                              const list = [...images];
                              list.splice(index, 1);
                              form.setFieldValue(
                                "additionalImages",
                                list.join("\n"),
                              );
                            }}
                          />
                        </div>
                      ))}

                      <Upload
                        multiple
                        showUploadList={false}
                        beforeUpload={async (file) => {
                          const base64 = await fileToDataUrl(file);
                          form.setFieldValue(
                            "additionalImages",
                            [...images, base64].join("\n"),
                          );
                          return false;
                        }}
                      >
                        <div
                          style={{
                            width: 80,
                            height: 80,
                            border: "1px dashed #d1d5db",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            background: "#f9fafb",
                          }}
                        >
                          <PlusOutlined />
                        </div>
                      </Upload>
                    </div>
                  </>
                );
              }}
            </Form.Item>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default FoodUpdateModal;
