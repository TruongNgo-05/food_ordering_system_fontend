import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import dayjs from "dayjs";
import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import AppPagination from "../../components/common/AppPagination";
import VoucherTable from "../../components/admin/VoucherTable";
import adminVoucherService from "../../services/admin/adminVoucher";
import VoucherCreateModal from "../../components/modal/admin/VoucherCreateModal";
import VoucherEditModal from "../../components/modal/admin/VoucherUpdateModal";
import VoucherDetailModal from "../../components/modal/admin/VoucherDetailModal";

const pageSize = 5;

const AdminVouchers = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [detailRecord, setDetailRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // ================= FETCH =================
  const fetchVouchers = async () => {
    try {
      setLoading(true);

      const res = await adminVoucherService.getAllVoucher({
        page: page - 1, // FIX: backend bắt đầu từ 0
        size: pageSize,
        keyword: search,
      });

      const data = res.data?.data;

      setItems(data?.content || []);
      setTotal(data?.totalElements || 0);
    } catch (e) {
      message.error("Load voucher thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVouchers();
    }, 300);

    return () => clearTimeout(timer);
  }, [page, search]);

  // ================= ADD =================
  const handleAdd = async () => {
    try {
      const values = await createForm.validateFields();

      const payload = {
        ...values,
        startDate: values.startDate?.format("YYYY-MM-DDTHH:mm:ss"),
        endDate: values.endDate?.format("YYYY-MM-DDTHH:mm:ss"),
      };

      await adminVoucherService.createVoucher(payload);

      message.success("Thêm voucher thành công");
      setOpenAdd(false);
      createForm.resetFields();

      fetchVouchers();
    } catch (e) {
      message.error("Thêm thất bại");
    }
  };

  // ================= EDIT =================
  const handleEdit = async () => {
    try {
      const values = await editForm.validateFields();

      const payload = {
        ...values,
        startDate: values.startDate?.format("YYYY-MM-DDTHH:mm:ss"),
        endDate: values.endDate?.format("YYYY-MM-DDTHH:mm:ss"),
      };

      await adminVoucherService.updateVoucher(editingRecord.id, payload);

      message.success("Cập nhật thành công");
      setOpenEdit(false);
      setEditingRecord(null);

      fetchVouchers();
    } catch (e) {
      message.error("Cập nhật thất bại");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await adminVoucherService.deleteVoucher(id);
      message.success("Xóa thành công");
      fetchVouchers();
    } catch (e) {
      message.error("Xóa thất bại");
    }
  };

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý voucher"
        description="Quản lý mã giảm giá"
        buttonText="Thêm voucher"
        handleAdd={() => {
          createForm.resetFields();
          setOpenAdd(true);
        }}
      />

      {/* STATS */}
      <StatsCards
        loading={loading}
        items={[
          { title: "Tổng voucher", value: total },
          { title: "Đang dùng", value: items.length },
          { title: "Hết hạn", value: 0 },
          { title: "Khác", value: 0 },
        ]}
      />

      {/* SEARCH */}
      <div className="filter-bar">
        <Input
          placeholder="Tìm voucher..."
          allowClear
          onChange={(e) => {
            setPage(1); // reset page khi search
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* TABLE */}
      <VoucherTable
        data={items}
        onView={(record) => {
          setDetailRecord(record);
          setOpenDetail(true);
        }}
        onEdit={(record) => {
          setEditingRecord(record);
          editForm.setFieldsValue({
            ...record,
            startDate: record.startDate ? dayjs(record.startDate) : null,
            endDate: record.endDate ? dayjs(record.endDate) : null,
          });
          setOpenEdit(true);
        }}
        onDelete={handleDelete}
      />

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={pageSize}
        total={total}
        onChange={(p) => setPage(p)}
      />

      {/* DETAIL */}
      <VoucherDetailModal
        open={openDetail}
        onCancel={() => setOpenDetail(false)}
        data={detailRecord}
      />

      {/* CREATE */}
      <VoucherCreateModal
        form={createForm}
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onOk={handleAdd}
      />

      {/* EDIT */}
      <VoucherEditModal
        form={editForm}
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={handleEdit}
      />
    </>
  );
};

export default AdminVouchers;
