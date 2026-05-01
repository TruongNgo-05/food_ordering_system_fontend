import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { T } from "../../constants/customerTheme";
import addressService from "../../services/customer/addressService";

export default function DeliveryAddressModal({ open, onCancel, onSave }) {
  const [addressData, setAddressData] = useState([]);

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const [savedAddresses, setSavedAddresses] = useState([]);

  // ================= LOAD PROVINCE =================
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then((data) => setAddressData(data))
      .catch(() => {
        toast.error("Không tải được dữ liệu địa chỉ!");
      });
  }, []);

  // ================= LOAD ADDRESS BACKEND =================
  useEffect(() => {
    if (open) {
      addressService
        .getMyAddresses()
        .then((res) => {
          setSavedAddresses(res.data.data || []);
        })
        .catch(() => {
          toast.error("Không tải được địa chỉ đã lưu");
        });
    }
  }, [open]);

  // ================= LOGIC =================
  const districtOptions = useMemo(() => {
    return addressData.find((c) => c.name === city)?.districts || [];
  }, [city, addressData]);

  const wardOptions = useMemo(() => {
    return districtOptions.find((d) => d.name === district)?.wards || [];
  }, [districtOptions, district]);

  const handleSelectOldAddress = async (item) => {
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

      onSave(item.address);
    } catch {
      toast.error("Không thể đặt mặc định");
    }
  };

  const handleSave = async () => {
    if (!city || !district || !ward || !detailAddress.trim()) {
      toast.warning("Vui lòng nhập đầy đủ địa chỉ");
      return;
    }

    const fullAddress = `${detailAddress.trim()}, ${ward}, ${district}, ${city}`;

    try {
      await addressService.createAddress({
        address: fullAddress,
        isDefault: savedAddresses.length === 0,
      });

      onSave(fullAddress);
      toast.success("Lưu địa chỉ thành công");
    } catch {
      toast.error("Lưu địa chỉ thất bại");
    }
  };
  const handleDeleteAddress = async (id) => {
    try {
      await addressService.deleteAddress(id);
      const res = await addressService.getMyAddresses();
      setSavedAddresses(res.data.data || []);

      toast.success("Đã xóa địa chỉ");
    } catch {
      toast.error("Xóa địa chỉ thất bại");
    }
  };
  return (
    <Modal
      title={
        <span>
          <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: 8 }} />
          Địa chỉ giao hàng
        </span>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Lưu địa chỉ"
      cancelText="Hủy"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* ================= ADDRESS CŨ ================= */}
        {savedAddresses.length > 0 && (
          <div>
            <p style={{ fontWeight: 700, marginBottom: 6 }}>Địa chỉ đã lưu</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {savedAddresses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectOldAddress(item)}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    cursor: "pointer",
                    background: item.isDefault ? "#f0fdf4" : "#fff",
                  }}
                >
                  <div style={{ fontSize: 13 }}>{item.address}</div>

                  {item.isDefault && (
                    <span style={{ color: "green", fontSize: 12 }}>
                      Mặc định
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(item.id);
                    }}
                    style={{
                      border: "none",
                      background: "#fee2e2",
                      color: "#dc2626",
                      padding: "6px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CITY ================= */}
        <div>
          <p style={{ marginBottom: 6, fontWeight: 700, color: T.text }}>
            Tỉnh/Thành phố
          </p>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict("");
              setWard("");
            }}
            style={{ width: "100%", height: 38 }}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {addressData.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* ================= DISTRICT ================= */}
        <div>
          <p style={{ marginBottom: 6, fontWeight: 700, color: T.text }}>
            Quận/Huyện
          </p>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setWard("");
            }}
            disabled={!city}
            style={{ width: "100%", height: 38 }}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districtOptions.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* ================= WARD ================= */}
        <div>
          <p style={{ marginBottom: 6, fontWeight: 700, color: T.text }}>
            Phường/Xã
          </p>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={!district}
            style={{ width: "100%", height: 38 }}
          >
            <option value="">Chọn Phường/Xã</option>
            {wardOptions.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* ================= DETAIL ================= */}
        <div>
          <p style={{ marginBottom: 6, fontWeight: 700, color: T.text }}>
            Địa chỉ chi tiết
          </p>
          <input
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="Số nhà, tên đường..."
            style={{ width: "100%", height: 38 }}
          />
        </div>
      </div>
    </Modal>
  );
}
