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
import GalleryUpload from "./GalleryUpload";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

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
      form.setFieldsValue({
        name: record.name,
        desc: record.description || "",
        image: record.image || "",

        additionalImages: (record.images || [])
          .map((img) => img.url)
          .join("\n"),
        existingImages: record.images || [],

        category: record.category_id,
        priceInThousand: Math.round(record.price / 1000),

        imageFile: null,
        imageFiles: [],
        removeImage: false,
      });
    }
  }, [open, record]);

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
                          form.setFieldValue("imageFile", file);

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
                            onClick={() => {
                              form.setFieldValue("image", null);
                              form.setFieldValue("imageFile", null);
                              form.setFieldValue("removeImage", true);
                            }}
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
            <GalleryUpload form={form} />
          </Form.Item>
        </div>
        <Form.Item name="image" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="removeImage" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="imageFile" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="imageFiles" hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FoodUpdateModal;
