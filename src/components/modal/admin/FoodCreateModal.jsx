import React from "react";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import { Upload, Image, Button, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import GalleryUpload from "./GalleryUpload";

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const FoodCreateModal = ({ open, onCancel, onSubmit, categories, form }) => {
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
    form.setFieldValue("image", "");
    form.setFieldValue("imageFile", null); 
    form.setFieldValue("additionalImages", "");
    form.setFieldValue("imageFiles", []); 
    onCancel();
  };

  return (
    <Modal
      title="Thêm món ăn"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      width={720}
      okText="Lưu món ăn"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        {/* ================= BASIC ================= */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
            marginBottom: 14,
          }}
        >
          <p style={{ margin: "0 0 12px", fontWeight: 700 }}>
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
                  label="Giá (nghìn)"
                  rules={[{ required: true, message: "Nhập giá" }]}
                >
                  <InputNumber
                    min={1}
                    style={{ width: "100%" }}
                    addonAfter=".000 đ"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="desc" label="Mô tả">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </div>

        {/* ================= IMAGE ================= */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <p style={{ margin: "0 0 12px", fontWeight: 700 }}>Hình ảnh món ăn</p>

          {/* ===== MAIN IMAGE ===== */}
          <Form.Item
            label="Ảnh đại diện"
            required
            rules={[
              {
                validator: () => {
                  if (!form.getFieldValue("image")) {
                    return Promise.reject("Chọn ảnh đại diện");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Form.Item shouldUpdate noStyle>
              {() => {
                const image = form.getFieldValue("image");

                return (
                  <div style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        placeholder="Link ảnh..."
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

                          // preview
                          form.setFieldValue("image", base64);

                          // file thật
                          form.setFieldValue("imageFile", file);

                          return false;
                        }}
                      >
                        <Button icon={<PlusOutlined />}>
                          Tải ảnh đại diện
                        </Button>
                      </Upload>
                    </div>

                    {/* preview */}
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        border: "1px dashed #ccc",
                        borderRadius: 8,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {image ? (
                        <>
                          <Image
                            src={image}
                            width={120}
                            height={120}
                            style={{ objectFit: "cover" }}
                          />
                          <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ position: "absolute", top: 5, right: 5 }}
                            onClick={() => {
                              form.setFieldValue("image", "");
                              form.setFieldValue("imageFile", null);
                            }}
                          />
                        </>
                      ) : (
                        <div style={{ textAlign: "center", marginTop: 40 }}>
                          Preview
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            </Form.Item>
          </Form.Item>

          {/* ===== GALLERY ===== */}
          <Form.Item label="Ảnh phụ">
            <GalleryUpload form={form} />
          </Form.Item>
        </div>
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

export default FoodCreateModal;
