import { Form, Input, Modal } from "antd";

const CategoryUpdateModal = ({ open, onCancel, onSubmit, form }) => {
  return (
    <Modal title="Sửa danh mục" open={open} onCancel={onCancel} onOk={onSubmit}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: "Nhập tên danh mục" }]}
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
      </Form>
    </Modal>
  );
};

export default CategoryUpdateModal;
