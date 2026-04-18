import React, { useMemo, useState, useEffect } from "react";
import { Form, Input, InputNumber, Modal } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import AddCategoryModal from "../../components/admin/category/AddCategoryModal";
import EditCategoryModal from "../../components/admin/category/EditCategoryModal";
import adminCategoriesService from "../../services/admin/adminCategoriesService";
import { getCategories } from "../../services/userService";
const pageSize = 4;

const AdminCategories = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [countFilter, setCountFilter] = useState("all");
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const pageData = items.slice(page * pageSize, page * pageSize + pageSize);
  const columns = [
    { title: "Tên danh mục", dataIndex: "name" },
    { title: "Mô tả", dataIndex: "desc" },
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
    try {
      const values = await addForm.validateFields();

      await adminCategoriesService.createCategories({
        name: values.name,
        description: values.desc,
      });

      await fetchCategories();

      setOpenAdd(false);
      addForm.resetFields();
    } catch (err) {
      console.error("Lỗi thêm:", err);
    }
  };
  const onOpenEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue(record);
    setOpenEdit(true);
  };
  const onEdit = async () => {
    try {
      const values = await editForm.validateFields();

      await adminCategoriesService.updateCategories(editingRecord.id, {
        name: values.name,
        description: values.desc,
      });

      await fetchCategories();

      setOpenEdit(false);
      setEditingRecord(null);
    } catch (err) {
      console.error("Lỗi update:", err);
    }
  };
  const onDelete = async () => {
    try {
      await adminCategoriesService.deleteCategories(editingRecord.id);

      await fetchCategories();

      setOpenDelete(false);
      setEditingRecord(null);
    } catch (err) {
      console.error("Lỗi delete:", err);
    }
  };
  const fetchCategories = async (keyword = "") => {
    setLoading(true);
    try {
      const res = await getCategories({
        name: keyword || undefined,
      });

      const list = res.data?.data?.content || [];

      const mapped = list.map((c) => ({
        id: c.id,
        name: c.name,
        desc: c.description || `Danh mục ${c.name}`,
        count: 0,
      }));

      setItems(mapped);
    } catch (err) {
      console.error("Lỗi load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCategories(search);
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);
  return (
    <>
      <AdminPageSection
        title="Quản lý danh mục"
        subtitle="Nhóm món ăn theo danh mục để hiển thị rõ ràng và tìm kiếm nhanh."
        stats={[
          { label: "Tổng danh mục", value: "12" },
          { label: "Đang hoạt động", value: "10" },
          { label: "Ẩn tạm thời", value: "2" },
          { label: "Món trung bình/danh mục", value: "14" },
        ]}
        actionLabel="+ Thêm danh mục"
        onAddClick={() => {
          addForm.resetFields();
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm tên danh mục..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </>
        }
        table={
          <BaseTable columns={columns} data={pageData} loading={loading} />
        }
        pagination={
          <AppPagination
            page={page}
            size={pageSize}
            total={items.length}
            onChange={(p) => setPage(p)}
          />
        }
      />
      <AddCategoryModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSubmit={onAdd}
        form={addForm}
      />

      <EditCategoryModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onSubmit={onEdit}
        form={editForm}
      />
      <Modal
        open={openDelete}
        title="Xác nhận xóa danh mục"
        onCancel={() => setOpenDelete(false)}
        onOk={onDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn xóa danh mục này?</p>
      </Modal>
    </>
  );
};
export default AdminCategories;
