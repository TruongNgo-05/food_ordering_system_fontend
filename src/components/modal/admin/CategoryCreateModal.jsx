import { Form, Input, InputNumber, Modal } from "antd";

const CategoryCreateModal = ({ open, onCancel, onSubmit, form }) => {
  return (
    <Modal
      title="Thêm danh mục"
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: "Nhập tên danh mục" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryCreateModal;
