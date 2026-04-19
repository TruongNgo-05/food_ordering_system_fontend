import React, { useState, useEffect } from "react";
import { Form, Input, Modal, message } from "antd";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import BannerTable from "../../components/admin/BannerTable";
import BannerCreateModal from "../../components/modal/admin/BannerCreateModal";
import BannerUpdateModal from "../../components/modal/admin/BannerUpdateModal";
import bannerService from "../../services/admin/BannerService";
import "../../assets/styles/AdminPages.css";

const pageSize = 5;

const AdminBanners = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(pageSize);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // ================= LOAD =================
  const fetchBanners = async () => {
    try {
      setLoading(true);

      const res = await bannerService.getBannerAdmin({
        keyword: search || undefined,
        page,
        size,
      });

      const data = res?.data?.data;
      const content = data?.content || [];

      const mapped = content.map((b) => ({
        id: b.id,
        title: b.title,
        desc: b.description,
        image: b.imageUrl,
        active: b.isActive,
      }));

      setItems(mapped);
      setTotal(data?.totalElements || 0);
    } catch (err) {
      console.error(err);
      message.error("Lỗi load banner");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();

      await bannerService.createBanner({
        title: values.title,
        description: values.desc,
        imageUrl: values.image,
        isActive: values.active ?? true,
      });

      message.success("Thêm banner thành công");
      setOpenAdd(false);
      addForm.resetFields();
      fetchBanners();
    } catch {
      message.error("Thêm thất bại");
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      await bannerService.updateBanner(editingRecord.id, {
        title: values.title,
        description: values.desc,
        imageUrl: values.image,
        isActive: values.active,
      });

      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);
      fetchBanners();
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      await bannerService.deleteBanner(editingRecord.id);

      message.success("Xóa thành công");
      setOpenDelete(false);
      setEditingRecord(null);
      fetchBanners();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  // ================= TOGGLE =================
  const handleToggle = async (record, checked) => {
    try {
      await bannerService.updateBanner(record.id, {
        isActive: checked,
      });

      fetchBanners();
    } catch {
      message.error("Lỗi cập nhật trạng thái");
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchBanners();
    }, 300);

    return () => clearTimeout(delay);
  }, [search, page, size]);

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý banner"
        description="Quản lý banner hiển thị"
        buttonText=" Thêm banner"
        handleAdd={() => {
          addForm.resetFields();
          addForm.setFieldValue("active", true);
          setOpenAdd(true);
        }}
      />

      {/* STATS */}
      <StatsCards
        loading={loading}
        items={[
          { title: "Tổng banner", value: total },
          { title: "Hiển thị", value: items.length },
          {
            title: "Đang bật",
            value: items.filter((x) => x.active !== false).length,
          },
          {
            title: "Đã tắt",
            value: items.filter((x) => x.active === false).length,
          },
        ]}
      />

      {/* FILTER */}
      <div className="filter-bar">
        <div style={{ flex: 1 }}>
          <Input
            placeholder="Tìm banner..."
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
        <BannerTable
          data={items}
          loading={loading}
          onEdit={(record) => {
            setEditingRecord(record);
            editForm.resetFields();
            editForm.setFieldsValue(record);
            setOpenEdit(true);
          }}
          onDelete={(record) => {
            setEditingRecord(record);
            setOpenDelete(true);
          }}
          onToggle={handleToggle}
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
      <BannerCreateModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSubmit={handleAdd}
        form={addForm}
      />

      <BannerUpdateModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onSubmit={handleEdit}
        form={editForm}
      />

      <Modal
        title="Xác nhận xóa"
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onOk={handleDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn xóa banner này?</p>
      </Modal>
    </>
  );
};

export default AdminBanners;
