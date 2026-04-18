import React, { useMemo, useState, useEffect } from "react";
import { Form, Input, Modal, Switch } from "antd";
import AdminPageSection from "../../components/admin/AdminPageSection";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import AddBannerModal from "../../components/admin/banner/AddBannerModal";
import EditBannerModal from "../../components/admin/banner/EditBannerModal";
import bannerService from "../../services/admin/BannerService";
const pageSize = 4;

const AdminBanners = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchKeyword =
        !keyword ||
        String(item.title).toLowerCase().includes(keyword) ||
        String(item.desc).toLowerCase().includes(keyword);
      const isActive = item.active !== false;
      const matchActive =
        activeFilter === "all" ||
        (activeFilter === "active" && isActive) ||
        (activeFilter === "inactive" && !isActive);
      return matchKeyword && matchActive;
    });
  }, [activeFilter, items, search]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );

  const columns = [
    { title: "Tiêu đề", dataIndex: "title" },
    { title: "Mô tả", dataIndex: "desc" },
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (v) => (
        <a href={v} target="_blank" rel="noreferrer">
          Link ảnh
        </a>
      ),
    },
    {
      title: "Hiển thị",
      dataIndex: "active",
      render: (_, r) => (
        <Switch
          checked={r.active !== false}
          onChange={async (checked) => {
            const newItems = items.map((it) =>
              it.id === r.id ? { ...it, active: checked } : it,
            );
            setItems(newItems);

            try {
              await bannerService.updateBanner(r.id, {
                isActive: checked,
              });
            } catch (error) {
              console.error(error);
              fetchBanners();
            }
          }}
        />
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          showView={false}
          onEdit={(r) => {
            setEditingRecord(r);
            editForm.setFieldsValue(r);
            setOpenEdit(true);
          }}
          onDelete={(id) => {
            const found = items.find((x) => x.id === id);
            setEditingRecord(found || null);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];
  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();

      await bannerService.createBanner({
        title: values.title,
        description: values.desc,
        imageUrl: values.image,
        isActive: values.active ?? true,
      });

      await fetchBanners();
      setOpenAdd(false);
      addForm.resetFields();
    } catch (error) {
      console.error("Lỗi thêm banner:", error);
    }
  };
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      await bannerService.updateBanner(editingRecord.id, {
        title: values.title,
        description: values.desc,
        imageUrl: values.image,
        isActive: values.active,
      });

      await fetchBanners();

      setOpenEdit(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("Lỗi update banner:", error);
    }
  };
  const handleDelete = async () => {
    try {
      await bannerService.deleteBanner(editingRecord.id);

      await fetchBanners();

      setOpenDelete(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("Lỗi xóa banner:", error);
    }
  };

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await bannerService.getBannerAdmin();

      const raw = res.data.data.content;
      const mapped = raw.map((item) => ({
        id: item.id,
        title: item.title,
        desc: item.description,
        image: item.imageUrl,
        active: item.isActive,
      }));

      setItems(mapped);
    } catch (error) {
      console.error("Lỗi load banner:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <>
      <AdminPageSection
        title="Quản lý banner"
        subtitle="Tạo và cập nhật banner hiển thị trên trang khách hàng."
        stats={[
          { label: "Tổng banner", value: items.length },
          {
            label: "Đang hiển thị",
            value: items.filter((x) => x.active !== false).length,
          },
          {
            label: "Đã tắt",
            value: items.filter((x) => x.active === false).length,
          },
          {
            label: "Tỉ lệ hiển thị",
            value: `${items.length ? Math.round((items.filter((x) => x.active !== false).length / items.length) * 100) : 0}%`,
          },
        ]}
        actionLabel="+ Thêm banner"
        onAddClick={() => {
          addForm.resetFields();
          addForm.setFieldValue("active", true);
          setOpenAdd(true);
        }}
        topControls={
          <>
            <input
              className="admin-control search"
              placeholder="Tìm banner..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
            <select
              className="admin-control"
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hiển thị</option>
              <option value="inactive">Đã tắt</option>
            </select>
          </>
        }
        table={
          <BaseTable columns={columns} data={pageData} loading={loading} />
        }
        pagination={
          <AppPagination
            page={page}
            size={pageSize}
            total={filteredItems.length}
            onChange={(p) => setPage(p)}
          />
        }
      />

      <AddBannerModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={handleAdd}
        form={addForm}
      />

      <EditBannerModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={handleEdit}
        form={editForm}
      />

      <Modal
        title="Xác nhận xóa banner"
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
