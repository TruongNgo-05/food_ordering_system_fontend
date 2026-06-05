import { Form, Input, Modal } from "antd";

const TableCreateAndUpdateModal = ({
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
          name="tableNumber"
          label="Tên bàn"
          rules={[
            {
              required: true,
              message: "Nhập tên bàn",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableCreateAndUpdateModal;
