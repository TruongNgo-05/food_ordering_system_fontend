import React, { useEffect, useState, useCallback, useRef } from "react";
import { Form, Input, Select, message } from "antd";

import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import FoodTable from "../../components/admin/FoodTable";
import FoodCreateModal from "../../components/modal/admin/FoodCreateModal";
import FoodUpdateModal from "../../components/modal/admin/FoodUpdateModal";
import FoodViewModal from "../../components/modal/admin/FoodViewModal";
import { getCategories } from "../../services/userService";
import adminFoodService from "../../services/admin/adminFoodService";

const pageSize = 5;
const parseAdditionalImages = (value) =>
  String(value || "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

const AdminFoods = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(undefined);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const searchTimeout = useRef(null);

  // ================= LOAD =================
  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFoodService.getFoodAdmin({
        page,
        limit: pageSize,
        name: search || undefined,
        categoryId: categoryFilter || undefined,
      });

      const data = res.data?.data || {};
      const content = Array.isArray(data.content) ? data.content : [];

      const mapped = content.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image || "",
        images: (item.images || []).map((img) => ({
          id: img.id,
          url: img.url,
        })),
        rating: item.rating,
        soldCount: item.soldCount,
        status: item.status ? "active" : "inactive",
        category_id:
          item.categoryId ??
          item.category_id ??
          (item.category && item.category.id) ??
          null,
        category_name:
          item.categoryName ||
          (item.category && item.category.name) ||
          item.categoryName ||
          "—",
        createdAt: item.createdAt,
      }));

      setItems(mapped);
      setTotal(data.totalElements ?? 0);
    } catch {
      message.error("Không thể tải danh sách món ăn");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      const data = res.data?.data || {};
      const content = Array.isArray(data.content) ? data.content : [];
      setCategories(content);
    } catch {
      message.error("Không thể tải danh mục");
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ================= STATUS =================
  const toggleStatus = async (id) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;

    const newStatus = target.status === "active" ? "inactive" : "active";

    try {
      await adminFoodService.updateFood(
        id,
        {
          name: target.name,
          description: target.description,
          categoryId: target.category_id,
          price: target.price,
          status: newStatus === "active",
          imageUrl: target.image,
          imageUrls: (target.images || []).map((img) => img.url),
          removeImage: false,
        },
        null,
        null,
      );
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: newStatus } : it)),
      );
    } catch {
      message.error("Cập nhật trạng thái thất bại");
    }
  };
  const handleView = async (r) => {
    try {
      const res = await adminFoodService.getFoodDetailAdmin(r.id);
      const d = res.data?.data;

      setViewRecord({
        ...d,
        status: d.status ? "active" : "inactive",
        category_name: d.categoryName || "—",
      });
      setOpenView(true);
    } catch {
      message.error("Không thể tải chi tiết món ăn");
    }
  };
  // ================= CRUD =================
  const handleAdd = async (values) => {
    try {
      await adminFoodService.createFood(
        {
          name: values.name,
          description: values.desc || "",
          categoryId: Number(values.category),
          price: (values.priceInThousand || 0) * 1000,
          imageUrl: values.imageFile
            ? null // ưu tiên file
            : values.removeImage
              ? ""
              : values.image || "",
          imageUrls: parseAdditionalImages(values.additionalImages),
        },
        values.imageFile,
        values.imageFiles || [],
      );

      message.success("Thêm món thành công");
      setOpenAdd(false);
      createForm.resetFields();
      fetchFoods();
      console.log("IMAGE FILE:", values.imageFile);
      console.log("IMAGES FILE:", values.imageFiles);
    } catch (err) {
      console.error(err);
      message.error("Thêm món thất bại");
    }
  };

  const handleEdit = async (values) => {
    try {
      await adminFoodService.updateFood(
        editingRecord.id,
        {
          name: values.name,
          description: values.desc || "",
          categoryId: Number(values.category),
          price: (values.priceInThousand || 0) * 1000,
          imageUrl: values.imageFile
            ? null
            : values.removeImage
              ? ""
              : values.image || "",
          imageUrls: parseAdditionalImages(values.additionalImages),
          removeImage: values.removeImage || false,
        },
        values.imageFile,
        values.imageFiles || [],
      );
      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);
      fetchFoods();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminFoodService.deleteFood(id);
      message.success("Xóa thành công");
      fetchFoods();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  return (
    <>
      <UserHeader
        title="Quản lý món ăn"
        description="Quản lý thực đơn"
        buttonText="Thêm món"
        handleAdd={() => {
          createForm.resetFields();
          setOpenAdd(true);
        }}
      />

      <StatsCards
        items={[
          { title: "Tổng món", value: total },
          {
            title: "Đang bán",
            value: items.filter((i) => i.status === "active").length,
          },
          {
            title: "Tạm hết",
            value: items.filter((i) => i.status === "inactive").length,
          },
        ]}
      />

      <div className="filter-bar">
        <div style={{ flex: 1, minWidth: 220 }}>
          <Input
            placeholder="Tìm tên món..."
            allowClear
            onChange={(e) => {
              const val = e.target.value;
              clearTimeout(searchTimeout.current);
              searchTimeout.current = setTimeout(() => {
                setSearch(val);
                setPage(0);
              }, 300);
            }}
          />
        </div>
        <div className="filter-divider" />
        <Select
          placeholder="Danh mục"
          allowClear
          style={{ width: 150 }}
          onChange={(v) => {
            setCategoryFilter(v);
            setPage(0);
          }}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>

      <div className="admin-table-wrapper">
        <FoodTable
          data={items}
          loading={loading}
          categories={categories}
          onToggleStatus={toggleStatus}
          onView={handleView}
          onEdit={(r) => {
            setEditingRecord(r);
            editForm.setFieldsValue({
              ...r,
              category: r.category_id,
              priceInThousand: r.price / 1000,
              imageFiles: [],
              additionalImages: (r.images || []).map((i) => i.url).join("\n"),
            });
            setOpenEdit(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      <AppPagination
        page={page}
        size={pageSize}
        total={total}
        onChange={(p) => setPage(p)}
      />

      <FoodViewModal
        open={openView}
        onCancel={() => setOpenView(false)}
        record={viewRecord}
        categories={categories}
      />

      <FoodCreateModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSubmit={handleAdd}
        categories={categories}
        form={createForm}
      />

      <FoodUpdateModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onSubmit={handleEdit}
        categories={categories}
        form={editForm}
        record={editingRecord}
      />
    </>
  );
};

export default AdminFoods;
