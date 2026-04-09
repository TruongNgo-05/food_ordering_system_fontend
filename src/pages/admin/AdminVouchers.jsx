import React, { useMemo, useState } from "react";
import { Form, Input, InputNumber, Modal } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import { loadSharedVouchers, saveSharedVouchers } from "../../utils/sharedData";

const pageSize = 4;
const toInputDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toDisplayDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
};

const getVoucherTiming = (voucher) => {
  const now = Date.now();
  const start = voucher.start_at ? new Date(voucher.start_at).getTime() : null;
  const end = voucher.end_at ? new Date(voucher.end_at).getTime() : null;

  if (start && now < start) return { label: "Sắp diễn ra", className: "warn" };
  if (end && now > end) return { label: "Hết hạn", className: "danger" };
  return { label: "Đang áp dụng", className: "ok" };
};

const AdminVouchers = () => {
  const [items, setItems] = useState(() => loadSharedVouchers());
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [timingFilter, setTimingFilter] = useState("all");
  const [form] = Form.useForm();

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const timing = getVoucherTiming(item);
      const timingKey =
        timing.label === "Sắp diễn ra"
          ? "upcoming"
          : timing.label === "Hết hạn"
            ? "expired"
            : "running";
      const matchKeyword = !keyword || String(item.code).toLowerCase().includes(keyword);
      const matchTiming = timingFilter === "all" || timingKey === timingFilter;
      return matchKeyword && matchTiming;
    });
  }, [items, search, timingFilter]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );
  const columns = [
    { title: "Mã", dataIndex: "code" },
    {
      title: "Giảm giá",
      dataIndex: "discount_value",
      render: (v, r) =>
        r.discount_type === "percent" ? `${v}%` : `${Number(v || 0).toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Khung giờ",
      render: (_, record) =>
        `${toDisplayDateTime(record.start_at)} - ${toDisplayDateTime(record.end_at)}`,
    },
    { title: "Số lượt", dataIndex: "used" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => {
        const timing = getVoucherTiming(record);
        return <span className={`admin-status ${timing.className}`}>{timing.label}</span>;
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={false}
          onEdit={(r) => onOpenEdit(r)}
          onDelete={(id) => {
            const found = items.find((x) => x.id === id);
            setEditingRecord(found || null);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  const onAdd = async () => {
    const values = await form.validateFields();
    const nextItem = {
      id: Date.now(),
      code: values.code,
      discount_type: "percent",
      discount_value: values.percent,
      min_order: 0,
      max_discount: 9999999,
      description: `Giảm ${values.percent}%`,
      expired: values.end_at || "",
      start_at: values.start_at,
      end_at: values.end_at,
      used: values.used || 0,
      status: "active",
      statusClass: "ok",
    };
    const nextItems = [...items, nextItem];
    setItems(nextItems);
    saveSharedVouchers(nextItems);
    setOpenAdd(false);
    form.resetFields();
  };
  const onOpenEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      code: record.code,
      percent: record.discount_value,
      start_at: toInputDateTime(record.start_at),
      end_at: toInputDateTime(record.end_at || record.expired),
      used: record.used,
    });
    setOpenEdit(true);
  };
  const onEdit = async () => {
    const values = await form.validateFields();
    const nextItems = items.map((it) =>
      it.id === editingRecord?.id
        ? {
            ...it,
            code: values.code,
            discount_type: "percent",
            discount_value: values.percent,
            description: `Giảm ${values.percent}%`,
            expired: values.end_at || "",
            start_at: values.start_at,
            end_at: values.end_at,
            used: values.used || 0,
          }
        : it,
    );
    setItems(nextItems);
    saveSharedVouchers(nextItems);
    setOpenEdit(false);
    setEditingRecord(null);
  };
  const onDelete = () => {
    const nextItems = items.filter((it) => it.id !== editingRecord?.id);
    setItems(nextItems);
    saveSharedVouchers(nextItems);
    setOpenDelete(false);
    setEditingRecord(null);
  };

  return (
    <>
      <AdminPageSection
        title="Quản lý khuyến mãi"
        subtitle="Thiết lập mã giảm giá, thời gian áp dụng và theo dõi hiệu quả chiến dịch."
        stats={[
          { label: "Voucher đang chạy", value: "15" },
          { label: "Đã hết hạn", value: "21" },
          { label: "Tỷ lệ sử dụng", value: "63%" },
          { label: "Giảm giá trung bình", value: "12%" },
        ]}
        actionLabel="+ Tạo voucher"
        onAddClick={() => {
          form.resetFields();
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm mã voucher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="admin-control"
              value={timingFilter}
              onChange={(e) => {
                setTimingFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="running">Đang áp dụng</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="expired">Hết hạn</option>
            </select>
          </>
        }
        table={<BaseTable columns={columns} data={pageData} />}
        pagination={
          <AppPagination
            page={page}
            size={pageSize}
            total={filteredItems.length}
            onChange={(p) => setPage(p)}
          />
        }
      />
      <Modal title="Tạo voucher" open={openAdd} onCancel={() => setOpenAdd(false)} onOk={onAdd}>
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Mã voucher" rules={[{ required: true, message: "Nhập mã voucher" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="percent" label="Giảm giá (%)" rules={[{ required: true, message: "Nhập % giảm" }]}>
            <InputNumber min={1} max={100} style={{ width: "100%" }} addonAfter="%" />
          </Form.Item>
          <Form.Item
            name="start_at"
            label="Bắt đầu"
            rules={[{ required: true, message: "Chọn giờ bắt đầu" }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="end_at"
            label="Kết thúc"
            dependencies={["start_at"]}
            rules={[
              { required: true, message: "Chọn giờ kết thúc" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const start = getFieldValue("start_at");
                  if (!start || !value || new Date(value).getTime() > new Date(start).getTime()) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Giờ kết thúc phải sau giờ bắt đầu"));
                },
              }),
            ]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="used" label="Số lượt">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="Sửa voucher" open={openEdit} onCancel={() => setOpenEdit(false)} onOk={onEdit}>
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Mã voucher" rules={[{ required: true, message: "Nhập mã voucher" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="percent" label="Giảm giá (%)" rules={[{ required: true, message: "Nhập % giảm" }]}>
            <InputNumber min={1} max={100} style={{ width: "100%" }} addonAfter="%" />
          </Form.Item>
          <Form.Item
            name="start_at"
            label="Bắt đầu"
            rules={[{ required: true, message: "Chọn giờ bắt đầu" }]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item
            name="end_at"
            label="Kết thúc"
            dependencies={["start_at"]}
            rules={[
              { required: true, message: "Chọn giờ kết thúc" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const start = getFieldValue("start_at");
                  if (!start || !value || new Date(value).getTime() > new Date(start).getTime()) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Giờ kết thúc phải sau giờ bắt đầu"));
                },
              }),
            ]}
          >
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="used" label="Số lượt">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal open={openDelete} title="Xác nhận xóa voucher" onCancel={() => setOpenDelete(false)} onOk={onDelete} okText="Xóa" okButtonProps={{ danger: true }}>
        <p>Bạn chắc chắn muốn xóa voucher này?</p>
      </Modal>
    </>
  );
};
export default AdminVouchers;
