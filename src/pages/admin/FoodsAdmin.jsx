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
        description: item.description, // ← đổi từ desc → description
        price: item.price,
        image: item.image || "",
        images: item.images || [],
        rating: item.rating,
        soldCount: item.soldCount, // ← đổi từ sold → soldCount
        status: item.status ? "active" : "inactive",
        category_id: item.categories?.id ?? null,
        category_name: item.categoryName || "—",
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
      await adminFoodService.updateFood(id, {
        status: newStatus === "active",
      });
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
      let imageUrl = "";

      if (values.image?.startsWith("data:")) {
        // base64 → File
        const res = await fetch(values.image);
        const blob = await res.blob();
        imageFile = new File([blob], "image.jpg", { type: blob.type });
      } else {
        imageUrl = values.image || "";
      }

      // Ảnh phụ: tách base64 và URL
      const additionalList = parseAdditionalImages(values.additionalImages);
      const imageFiles = [];
      const imageUrls = [];

      for (const img of additionalList) {
        if (img.startsWith("data:")) {
          const res = await fetch(img);
          const blob = await res.blob();
          imageFiles.push(new File([blob], "img.jpg", { type: blob.type }));
        } else {
          imageUrls.push(img);
        }
      }

      await adminFoodService.createFood(
        {
          name: values.name,
          description: values.desc || "",
          categoryId: Number(values.category),
          price: (values.priceInThousand || 0) * 1000,
          image: imageUrl, // URL ảnh đại diện (nếu có)
          images: imageUrls, // URL ảnh phụ (nếu có)
        },
        imageFile, // File ảnh đại diện (nếu upload từ máy)
        imageFiles, // File[] ảnh phụ (nếu upload từ máy)
      );

      message.success("Thêm món thành công");
      setOpenAdd(false);
      createForm.resetFields();
      fetchFoods();
    } catch {
      message.error("Thêm món thất bại");
    }
  };

  const handleEdit = async (values) => {
    try {
      let imageFile = undefined;
      let imageUrl = "";

      if (values.image?.startsWith("data:")) {
        const res = await fetch(values.image);
        const blob = await res.blob();
        imageFile = new File([blob], "image.jpg", { type: blob.type });
      } else {
        imageUrl = values.image || "";
      }

      const additionalList = parseAdditionalImages(values.additionalImages);
      const imageFiles = [];
      const imageUrls = [];

      for (const img of additionalList) {
        if (img.startsWith("data:")) {
          const res = await fetch(img);
          const blob = await res.blob();
          imageFiles.push(new File([blob], "img.jpg", { type: blob.type }));
        } else {
          imageUrls.push(img);
        }
      }

      await adminFoodService.updateFood(
        editingRecord.id,
        {
          name: values.name,
          description: values.desc || "",
          categoryId: Number(values.category),
          price: (values.priceInThousand || 0) * 1000,
          image: imageUrl,
          images: imageUrls,
        },
        imageFile,
        imageFiles,
      );

      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);
      fetchFoods();
    } catch {
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
