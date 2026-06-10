import { Form, Input, InputNumber, Modal } from "antd";

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
          label="Mã bàn"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mã bàn",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="capacity"
          label="Số người tối đa"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số người",
            },
          ]}
        >
          <InputNumber
            min={1}
            max={10}
            style={{ width: "100%" }}
            placeholder="Nhập số người"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableCreateAndUpdateModal;
