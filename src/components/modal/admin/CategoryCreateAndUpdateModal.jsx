import { Form, Input, Modal } from "antd";

const CategoryCreateAndUpdateModal = ({
  open,
  onCancel,
  onSubmit,
  form,
  title,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[
            {
              required: true,
              message: "Nhập tên danh mục",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryCreateAndUpdateModal;
