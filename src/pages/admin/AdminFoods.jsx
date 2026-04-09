import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, InputNumber, Modal, Select, message } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import AdminViewDrawer from "../../components/admin/AdminViewDrawer";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import FoodImage from "../../components/common/FoodImage";
import {
  loadSharedFoods,
  loadSharedCategories,
  saveSharedFoods,
  SHARED_DATA_UPDATED_EVENT,
} from "../../utils/sharedData";

const pageSize = 4;
const formatPriceVND = (priceValue) =>
  `${Number(priceValue || 0).toLocaleString("vi-VN")} đ`;
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

const AdminFoods = () => {
  const [items, setItems] = useState(() => loadSharedFoods());
  const [categories, setCategories] = useState(() =>
    loadSharedCategories().filter((c) => c.id !== 1),
  );
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form] = Form.useForm();

  useEffect(() => {
    const syncSharedData = () => {
      setItems(loadSharedFoods());
      setCategories(loadSharedCategories().filter((c) => c.id !== 1));
    };
    syncSharedData();
    window.addEventListener("focus", syncSharedData);
    window.addEventListener("storage", syncSharedData);
    window.addEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
    return () => {
      window.removeEventListener("focus", syncSharedData);
      window.removeEventListener("storage", syncSharedData);
      window.removeEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchKeyword =
        !keyword || String(item.name).toLowerCase().includes(keyword);
      const matchCategory =
        categoryFilter === "all" ||
        String(item.category_id) === String(categoryFilter);
      const matchStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchKeyword && matchCategory && matchStatus;
    });
  }, [categoryFilter, items, search, statusFilter]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 80,
      render: (image) => (
        <FoodImage src={image} size={44} radius={10} textSize={22} />
      ),
    },
    { title: "Món ăn", dataIndex: "name" },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      render: (id) =>
        categories.find((c) => c.id === id)?.name || "Chưa phân loại",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (v) => formatPriceVND(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => (
        <span
          className={`admin-status ${record.status === "active" ? "ok" : "warn"}`}
        >
          {record.status === "active" ? "Đang bán" : "Tạm hết"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={true}
          onView={(r) => {
            setEditingRecord(r);
            setOpenView(true);
          }}
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
    const nextItems = [
      ...items,
      {
        id: Date.now(),
        name: values.name,
        category_id: Number(values.category),
        price: (values.priceInThousand || 0) * 1000,
        image: values.image || "",
        images: [
          values.image || "",
          ...parseAdditionalImages(values.additionalImages),
        ].filter(Boolean),
        rating: 4.5,
        sold: 0,
        desc: "Món mới cập nhật từ admin.",
        badge: null,
        status: "active",
      },
    ];
    setItems(nextItems);
    saveSharedFoods(nextItems);
    setOpenAdd(false);
    form.resetFields();
  };

  const onOpenEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      image: record.image || "",
      additionalImages: (record.images || [])
        .filter((img) => img && img !== record.image)
        .join("\n"),
      category: record.category_id,
      priceInThousand: Math.round(record.price / 1000),
    });
    setOpenEdit(true);
  };

  const onEdit = async () => {
    const values = await form.validateFields();
    const nextItems = items.map((it) =>
      it.id === editingRecord?.id
        ? {
            ...it,
            name: values.name,
            image: values.image || "",
            images: [
              values.image || "",
              ...parseAdditionalImages(values.additionalImages),
            ].filter(Boolean),
            category_id: Number(values.category),
            price: (values.priceInThousand || 0) * 1000,
          }
        : it,
    );
    setItems(nextItems);
    saveSharedFoods(nextItems);
    setOpenEdit(false);
    setEditingRecord(null);
  };

  const onUploadImage = async (event) => {
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

  const onUploadAdditionalImages = async (event) => {
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

  const onDelete = () => {
    const nextItems = items.filter((it) => it.id !== editingRecord?.id);
    setItems(nextItems);
    saveSharedFoods(nextItems);
    setOpenDelete(false);
    setEditingRecord(null);
  };

  return (
    <>
      <AdminPageSection
        title="Quản lý món ăn"
        subtitle="Quản lý thực đơn, giá bán, trạng thái hiển thị và chất lượng món."
        stats={[
          { label: "Tổng món", value: "168" },
          { label: "Đang bán", value: "142" },
          { label: "Tạm ngưng", value: "19" },
          { label: "Món nổi bật", value: "7" },
        ]}
        actionLabel="+ Thêm món ăn"
        onAddClick={() => {
          form.resetFields();
          form.setFieldValue("image", "");
          form.setFieldValue("additionalImages", "");
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm món ăn..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="admin-control"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="admin-control"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="inactive">Tạm hết</option>
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
      <Modal
        title="Thêm món ăn"
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={onAdd}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên món"
            rules={[{ required: true, message: "Nhập tên món" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Ảnh đại diện (link hoặc upload)"
            rules={[
              { required: true, message: "Nhập link ảnh hoặc tải ảnh từ máy" },
            ]}
          >
            <Input placeholder="https://... hoặc dùng nút tải ảnh bên dưới" />
          </Form.Item>
          <Form.Item label="Tải ảnh từ máy">
            <input type="file" accept="image/*" onChange={onUploadImage} />
          </Form.Item>
          <Form.Item
            name="additionalImages"
            label="Ảnh phụ (mỗi dòng 1 link, hoặc ngăn cách bằng dấu phẩy)"
          >
            <Input.TextArea
              rows={3}
              placeholder="https://...&#10;https://... hoặc dùng nút tải ảnh phụ"
            />
          </Form.Item>
          <Form.Item label="Tải ảnh phụ từ máy">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onUploadAdditionalImages}
            />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {() =>
              form.getFieldValue("image") ? (
                <div style={{ marginBottom: 12 }}>
                  <FoodImage
                    src={form.getFieldValue("image")}
                    size={72}
                    radius={12}
                    textSize={28}
                  />
                </div>
              ) : null
            }
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Chọn danh mục" }]}
          >
            <Select
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Chọn danh mục"
            />
          </Form.Item>
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
        </Form>
      </Modal>
      <Modal
        title="Sửa món ăn"
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={onEdit}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên món"
            rules={[{ required: true, message: "Nhập tên món" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="image"
            label="Ảnh đại diện (link hoặc upload)"
            rules={[
              { required: true, message: "Nhập link ảnh hoặc tải ảnh từ máy" },
            ]}
          >
            <Input placeholder="https://... hoặc dùng nút tải ảnh bên dưới" />
          </Form.Item>
          <Form.Item label="Tải ảnh từ máy">
            <input type="file" accept="image/*" onChange={onUploadImage} />
          </Form.Item>
          <Form.Item
            name="additionalImages"
            label="Ảnh phụ (mỗi dòng 1 link, hoặc ngăn cách bằng dấu phẩy)"
          >
            <Input.TextArea
              rows={3}
              placeholder="https://...&#10;https://... hoặc dùng nút tải ảnh phụ"
            />
          </Form.Item>
          <Form.Item label="Tải ảnh phụ từ máy">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onUploadAdditionalImages}
            />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {() =>
              form.getFieldValue("image") ? (
                <div style={{ marginBottom: 12 }}>
                  <FoodImage
                    src={form.getFieldValue("image")}
                    size={72}
                    radius={12}
                    textSize={28}
                  />
                </div>
              ) : null
            }
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Chọn danh mục" }]}
          >
            <Select
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Chọn danh mục"
            />
          </Form.Item>
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
        </Form>
      </Modal>
      <Modal
        open={openDelete}
        title="Xác nhận xóa món"
        onCancel={() => setOpenDelete(false)}
        onOk={onDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn xóa món này?</p>
      </Modal>

      <AdminViewDrawer
        title="Thông tin món ăn"
        open={openView}
        onClose={() => {
          setOpenView(false);
          setEditingRecord(null);
        }}
        fields={[
          {
            label: "Ảnh",
            value: editingRecord?.image ? (
              <FoodImage
                src={editingRecord.image}
                size={72}
                radius={10}
                textSize={30}
              />
            ) : (
              "—"
            ),
          },
          {
            label: "Ảnh phụ",
            value:
              editingRecord?.images && editingRecord.images.length > 1 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {editingRecord.images
                    .filter((img) => img && img !== editingRecord.image)
                    .map((img, idx) => (
                      <FoodImage
                        key={`${editingRecord.id}-extra-${idx}`}
                        src={img}
                        size={56}
                        radius={8}
                        textSize={22}
                      />
                    ))}
                </div>
              ) : (
                "—"
              ),
          },
          { label: "Tên món", value: editingRecord?.name },
          {
            label: "Danh mục",
            value: categories.find((c) => c.id === editingRecord?.category_id)
              ?.name,
          },
          { label: "Giá", value: formatPriceVND(editingRecord?.price) },
          {
            label: "Trạng thái",
            value: editingRecord?.status === "active" ? "Đang bán" : "Tạm hết",
          },
          { label: "Mô tả", value: editingRecord?.desc },
        ]}
      />
    </>
  );
};
export default AdminFoods;
