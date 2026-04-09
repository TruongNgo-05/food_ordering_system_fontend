import React, { useMemo, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { T } from "../../constants/customerTheme";

const ADDRESS_OPTIONS = [
  {
    name: "TP. Ho Chi Minh",
    districts: [
      {
        name: "Quận 1",
        wards: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Cầu Ông Lãnh"],
      },
      {
        name: "Quận 7",
        wards: ["Phường Tân Phú", "Phường Tân Hưng", "Phường Tân Phong"],
      },
      {
        name: "TP. Thủ Đức",
        wards: ["Phường Hiệp Bình Chánh", "Phường Linh Trung", "Phường An Phú"],
      },
    ],
  },
  {
    name: "Ha Noi",
    districts: [
      {
        name: "Quận Cầu Giấy",
        wards: ["Phường Dịch Vọng", "Phường Quan Hoa", "Phường Nghĩa Đô"],
      },
      {
        name: "Quận Ba Đình",
        wards: ["Phường Kim Mã", "Phường Cống Vị", "Phường Liễu Giai"],
      },
      {
        name: "Quận Hoàng Mai",
        wards: ["Phường Định Công", "Phường Đại Kim", "Phường Hoàng Liệt"],
      },
    ],
  },
  {
    name: "Da Nang",
    districts: [
      {
        name: "Quận Hải Châu",
        wards: ["Phường Thạch Thang", "Phường Hải Châu I", "Phường Bình Hiên"],
      },
      {
        name: "Quận Sơn Trà",
        wards: ["Phường An Hải Bắc", "Phường Mân Thái", "Phường Phước Mỹ"],
      },
      {
        name: "Quận Thanh Khê",
        wards: ["Phường Thanh Khê Đông", "Phường Xuân Hà", "Phường Chính Gián"],
      },
    ],
  },
];

export default function DeliveryAddressModal({ open, onCancel, onSave }) {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const districtOptions = useMemo(
    () => ADDRESS_OPTIONS.find((c) => c.name === city)?.districts || [],
    [city],
  );

  const wardOptions = useMemo(
    () => districtOptions.find((d) => d.name === district)?.wards || [],
    [districtOptions, district],
  );

  const handleSave = () => {
    if (!city || !district || !ward || !detailAddress.trim()) {
      toast.warning(
        "Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã và địa chỉ chi tiết",
      );
      return;
    }
    const fullAddress = `${detailAddress.trim()}, ${ward}, ${district}, ${city}`;
    onSave(fullAddress);
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
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: T.text }}>
            Tỉnh/Thành phố
          </p>
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict("");
              setWard("");
            }}
            style={{
              width: "100%",
              height: 38,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              padding: "0 10px",
            }}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {ADDRESS_OPTIONS.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: T.text }}>
            Quận/Huyện
          </p>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setWard("");
            }}
            disabled={!city}
            style={{
              width: "100%",
              height: 38,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              padding: "0 10px",
              background: city ? "#fff" : "#f8fafc",
            }}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districtOptions.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: T.text }}>
            Phường/Xã
          </p>
          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={!district}
            style={{
              width: "100%",
              height: 38,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              padding: "0 10px",
              background: district ? "#fff" : "#f8fafc",
            }}
          >
            <option value="">Chọn Phường/Xã</option>
            {wardOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: T.text }}>
            Địa chỉ chi tiết
          </p>
          <input
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            placeholder="Số nhà, tên đường..."
            style={{
              width: "100%",
              height: 38,
              borderRadius: 10,
              border: `1px solid ${T.border}`,
              padding: "0 10px",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
