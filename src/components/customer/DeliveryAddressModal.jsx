import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

import addressService from "../../services/customer/addressService";
import "../../assets/styles/modal/DeliveryAddressModal.css";

const INIT_FORM = {
  receiverName: "",
  receiverPhone: "",
  city: "",
  district: "",
  ward: "",
  detailAddress: "",
};

export default function DeliveryAddressModal({ open, onCancel, onSave }) {
  const [addressData, setAddressData] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INIT_FORM);

  const setField = (key) => (e) =>
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

  // ================= LOAD =================
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then(setAddressData)
      .catch(() => {
        toast.error("Không tải được dữ liệu địa chỉ!");
      });
  }, []);

  useEffect(() => {
    if (!open) return;

    addressService
      .getMyAddresses()
      .then((res) => {
        setSavedAddresses(res.data.data || []);
      })
      .catch(() => {
        toast.error("Không tải được địa chỉ");
      });
  }, [open]);

  // ================= OPTIONS =================
  const districtOptions = useMemo(() => {
    return addressData.find((c) => c.name === form.city)?.districts || [];
  }, [form.city, addressData]);

  const wardOptions = useMemo(() => {
    return districtOptions.find((d) => d.name === form.district)?.wards || [];
  }, [districtOptions, form.district]);

  // ================= HELPERS =================
  const resetForm = () => {
    setEditingId(null);

    setForm(INIT_FORM);
  };

  const reloadAddresses = async () => {
    const res = await addressService.getMyAddresses();

    const addresses = res.data.data || [];

    setSavedAddresses(addresses);

    return addresses;
  };

  // ================= CHỌN ADDRESS =================
  const handleSelectAddress = async (item) => {
    try {
      await addressService.updateAddress(item.id, {
        isDefault: true,
      });

      setSavedAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === item.id,
        })),
      );

      onSave({
        id: item.id,
        address: item.address,
        receiverName: item.receiverName,
        receiverPhone: item.receiverPhone,
      });

      toast.success("Đã chọn địa chỉ");
    } catch {
      toast.error("Không thể đặt mặc định");
    }
  };

  // ================= THÊM ADDRESS =================
  const handleSave = async () => {
    const { receiverName, receiverPhone, city, district, ward, detailAddress } =
      form;

    if (
      !receiverName.trim() ||
      !receiverPhone.trim() ||
      !city ||
      !district ||
      !ward ||
      !detailAddress.trim()
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");

      return;
    }

    try {
      const fullAddress = `${detailAddress.trim()}, ${ward}, ${district}, ${city}`;

      await addressService.createAddress({
        address: fullAddress,
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        isDefault: savedAddresses.length === 0,
      });

      const addresses = await reloadAddresses();

      const newest = addresses[addresses.length - 1];

      onSave({
        id: newest?.id,
        address: newest?.address,
        receiverName: newest?.receiverName,
        receiverPhone: newest?.receiverPhone,
      });

      toast.success("Lưu địa chỉ thành công");

      resetForm();
    } catch {
      toast.error("Lưu địa chỉ thất bại");
    }
  };

  // ================= SỬA ADDRESS =================
  const handleEdit = async () => {
    if (!editingId) {
      toast.warning("Chưa chọn địa chỉ");

      return;
    }

    if (!form.receiverName.trim() || !form.receiverPhone.trim()) {
      toast.warning("Vui lòng nhập tên và số điện thoại");

      return;
    }

    try {
      await addressService.updateAddress(editingId, {
        receiverName: form.receiverName.trim(),
        receiverPhone: form.receiverPhone.trim(),
      });

      await reloadAddresses();

      toast.success("Cập nhật thành công");

      resetForm();
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  // ================= XÓA ADDRESS =================
  const handleDelete = async (id) => {
    try {
      await addressService.deleteAddress(id);

      await reloadAddresses();

      toast.success("Đã xóa địa chỉ");
    } catch {
      toast.error("Xóa địa chỉ thất bại");
    }
  };

  // ================= RENDER =================
  return (
    <Modal
      title={
        <span>
          <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 8 }} />
          Địa chỉ giao hàng
        </span>
      }
      open={open}
      onCancel={() => {
        resetForm();

        onCancel();
      }}
      onOk={editingId ? handleEdit : handleSave}
      okText={editingId ? "Cập nhật" : "Lưu địa chỉ"}
      cancelText="Hủy"
    >
      <div className="dam-container">
        {/* ADDRESS LIST */}
        {savedAddresses.length > 0 && (
          <div>
            <p className="dam-section-title">Địa chỉ đã lưu</p>

            <div className="dam-address-list">
              {savedAddresses.map((item) => (
                <div
                  key={item.id}
                  className={`dam-address-card ${
                    item.isDefault ? "dam-address-card--default" : ""
                  }`}
                  onClick={() => handleSelectAddress(item)}
                >
                  {/* HEADER */}
                  <div className="dam-address-card__header">
                    <span className="dam-address-card__name">
                      {item.receiverName}
                    </span>

                    <span className="dam-address-card__phone">
                      {item.receiverPhone}
                    </span>
                  </div>

                  {/* ADDRESS */}
                  <div className="dam-address-card__address">
                    {item.address}
                  </div>

                  {/* FOOTER */}
                  <div className="dam-address-card__footer">
                    {item.isDefault ? (
                      <span className="dam-badge--default">✓ Mặc định</span>
                    ) : (
                      <span />
                    )}

                    <div className="dam-address-card__actions">
                      {/* SỬA */}
                      <button
                        className="dam-btn dam-btn--edit"
                        onClick={(e) => {
                          e.stopPropagation();

                          setEditingId(item.id);

                          setForm((prev) => ({
                            ...prev,
                            receiverName: item.receiverName || "",
                            receiverPhone: item.receiverPhone || "",
                            detailAddress: item.address || "",
                          }));
                        }}
                      >
                        Sửa
                      </button>

                      {/* XÓA */}
                      <button
                        className="dam-btn dam-btn--delete"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDelete(item.id);
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= EDIT MODE ================= */}
        {editingId ? (
          <>
            {/* TÊN */}
            <div className="dam-field">
              <p className="dam-field__label">Tên người nhận</p>

              <input
                className="dam-input"
                value={form.receiverName}
                onChange={setField("receiverName")}
                placeholder="Nhập tên người nhận..."
              />
            </div>

            {/* PHONE */}
            <div className="dam-field">
              <p className="dam-field__label">Số điện thoại</p>

              <input
                className="dam-input"
                value={form.receiverPhone}
                onChange={setField("receiverPhone")}
                placeholder="Nhập số điện thoại..."
              />
            </div>

            {/* ADDRESS */}
            <div className="dam-field">
              <p className="dam-field__label">Địa chỉ hiện tại</p>

              <textarea
                className="dam-input"
                value={form.detailAddress}
                readOnly
                rows={3}
                style={{
                  resize: "none",
                  background: "#f5f5f5",
                  cursor: "not-allowed",
                }}
              />
            </div>

            {/* CANCEL */}
            <button
              className="dam-btn dam-btn--cancel-edit"
              onClick={resetForm}
            >
              Hủy sửa
            </button>
          </>
        ) : (
          <>
            {/* TÊN */}
            <div className="dam-field">
              <p className="dam-field__label">Tên người nhận</p>

              <input
                className="dam-input"
                value={form.receiverName}
                onChange={setField("receiverName")}
                placeholder="Nhập tên người nhận..."
              />
            </div>

            {/* PHONE */}
            <div className="dam-field">
              <p className="dam-field__label">Số điện thoại</p>

              <input
                className="dam-input"
                value={form.receiverPhone}
                onChange={setField("receiverPhone")}
                placeholder="Nhập số điện thoại..."
              />
            </div>

            {/* CITY */}
            <div className="dam-field">
              <p className="dam-field__label">Tỉnh/Thành phố</p>

              <select
                className="dam-select"
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    city: e.target.value,
                    district: "",
                    ward: "",
                  }))
                }
              >
                <option value="">Chọn Tỉnh/Thành phố</option>

                {addressData.map((item) => (
                  <option key={item.code} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DISTRICT */}
            <div className="dam-field">
              <p className="dam-field__label">Quận/Huyện</p>

              <select
                className="dam-select"
                value={form.district}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    district: e.target.value,
                    ward: "",
                  }))
                }
                disabled={!form.city}
              >
                <option value="">Chọn Quận/Huyện</option>

                {districtOptions.map((item) => (
                  <option key={item.code} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* WARD */}
            <div className="dam-field">
              <p className="dam-field__label">Phường/Xã</p>

              <select
                className="dam-select"
                value={form.ward}
                onChange={setField("ward")}
                disabled={!form.district}
              >
                <option value="">Chọn Phường/Xã</option>

                {wardOptions.map((item) => (
                  <option key={item.code} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DETAIL */}
            <div className="dam-field">
              <p className="dam-field__label">Địa chỉ chi tiết</p>

              <input
                className="dam-input"
                value={form.detailAddress}
                onChange={setField("detailAddress")}
                placeholder="Số nhà, tên đường..."
              />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
