import React, { useState, useEffect } from "react";
import { Form, Input, Modal, message } from "antd";

import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import CategoryTable from "../../components/admin/CategoryTable";

import CategoryCreateModal from "../../components/modal/admin/CategoryCreateModal";
import CategoryUpdateModal from "../../components/modal/admin/CategoryUpdateModal";

import adminCategoriesService from "../../services/admin/adminCategoriesService";
import { getCategories } from "../../services/userService";

import "../../assets/styles/AdminPages.css";

const pageSize = 5;

const AdminCategories = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // ================= LOAD DATA =================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await getCategories({
        name: search || undefined,
        page: page,
        size: size,
      });

      const data = res?.data?.data;
      const content = data?.content || [];

      const mapped = content.map((c) => ({
        id: c.id,
        name: c.name,
      }));

      setItems(mapped);
      setTotal(data?.totalElements || 0);
    } catch (err) {
      console.error("Lỗi load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();

      await adminCategoriesService.createCategories({
        name: values.name,
        description: values.desc,
      });

      message.success("Thêm danh mục thành công");
      setOpenAdd(false);
      addForm.resetFields();
      fetchCategories();
    } catch (err) {
      message.error("Thêm thất bại");
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      await adminCategoriesService.updateCategories(editingRecord.id, {
        name: values.name,
      });

      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);
      fetchCategories();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await adminCategoriesService.deleteCategories(id);
      message.success("Xóa thành công");
      fetchCategories();
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, page, size]);

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý danh mục"
        description="Quản lý danh mục món ăn"
        buttonText=" Thêm danh mục"
        handleAdd={() => setOpenAdd(true)}
      />

      {/* STATS */}
      <StatsCards
        loading={loading}
        items={[
          { title: "Tổng danh mục", value: total },
          { title: "Hiển thị", value: items.length },
          { title: "Ẩn", value: 0 },
          { title: "Khác", value: 0 },
        ]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm danh mục..."
            allowClear
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <CategoryTable
          data={items}
          loading={loading}
          onEdit={(record) => {
            setEditingRecord(record);
            editForm.resetFields();
            editForm.setFieldsValue(record);
            setOpenEdit(true);
          }}
          onDelete={(id) => handleDelete(id)}
        />
      </div>

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={size}
        total={total}
        onChange={(p, s) => {
          setPage(p);
          setSize(s);
        }}
      />

      {/* MODALS */}
      <CategoryCreateModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSubmit={handleAdd}
        form={addForm}
      />

      <CategoryUpdateModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onSubmit={handleEdit}
        form={editForm}
      />
    </>
  );
};

export default AdminCategories;
