import React from "react";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import FoodImage from "../../common/FoodImage";
import { Upload, Image, Button, Row, Col } from "antd";
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

const FoodCreateModal = ({ open, onCancel, onSubmit, categories, form }) => {
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
    form.setFieldValue("image", "");
    form.setFieldValue("additionalImages", "");
    onCancel();
  };

  return (
    <Modal
      title="Thêm món ăn"
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      width={600}
    >
      <Form form={form} layout="vertical">
        {/* NAME + CATEGORY */}
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
        <Form.Item name="desc" label="Mô tả">
          <Input.TextArea rows={3} placeholder="Nhập mô tả món ăn" />
        </Form.Item>
        {/* PRICE */}
        <Form.Item
          name="priceInThousand"
          label="Giá bán (nghìn đồng)"
          rules={[{ required: true, message: "Nhập giá bán" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} addonAfter=".000 đ" />
        </Form.Item>

        {/* IMAGE AVATAR */}
        <Form.Item
          label="Ảnh đại diện"
          required
          rules={[
            {
              validator: () => {
                if (!form.getFieldValue("image")) {
                  return Promise.reject("Chọn hoặc nhập ảnh đại diện");
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
                  {/* LEFT */}
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder="Nhập link ảnh..."
                      value={image}
                      onChange={(e) =>
                        form.setFieldValue("image", e.target.value)
                      }
                      style={{ marginBottom: 8 }}
                    />

                    {!image && (
                      <Upload
                        showUploadList={false}
                        beforeUpload={async (file) => {
                          const base64 = await fileToDataUrl(file);
                          form.setFieldValue("image", base64);
                          return false;
                        }}
                      >
                        <Button icon={<PlusOutlined />}>Tải ảnh</Button>
                      </Upload>
                    )}
                  </div>

                  {/* RIGHT */}
                  {image && (
                    <div style={{ position: "relative" }}>
                      <Image
                        src={image}
                        width={100}
                        height={100}
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />

                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                        }}
                        onClick={() => form.setFieldValue("image", "")}
                      />
                    </div>
                  )}
                </div>
              );
            }}
          </Form.Item>
        </Form.Item>

        {/* ADDITIONAL IMAGES */}
        <Form.Item label="Ảnh phụ">
          <Form.Item shouldUpdate noStyle>
            {() => {
              const images = parseAdditionalImages(
                form.getFieldValue("additionalImages"),
              );

              return (
                <>
                  {/* INPUT LINK */}
                  <Input.Search
                    placeholder="Nhập link ảnh phụ rồi nhấn Enter"
                    enterButton="Thêm"
                    onSearch={(value) => {
                      if (!value) return;
                      const current = [...images];
                      form.setFieldValue(
                        "additionalImages",
                        [...current, value].join("\n"),
                      );
                    }}
                    style={{ marginBottom: 10 }}
                  />

                  {/* GRID */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
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
                          style={{
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />

                        <Button
                          danger
                          size="small"
                          icon={<DeleteOutlined />}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                          }}
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

                    {/* UPLOAD */}
                    <Upload
                      multiple
                      showUploadList={false}
                      beforeUpload={async (file) => {
                        const base64 = await fileToDataUrl(file);
                        const current = [...images];
                        form.setFieldValue(
                          "additionalImages",
                          [...current, base64].join("\n"),
                        );
                        return false;
                      }}
                    >
                      <div
                        style={{
                          width: 80,
                          height: 80,
                          border: "1px dashed #d9d9d9",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
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
      </Form>
    </Modal>
  );
};

export default FoodCreateModal;
