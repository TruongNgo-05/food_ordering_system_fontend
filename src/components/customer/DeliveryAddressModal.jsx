import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { T } from "../../constants/customerTheme";

export default function DeliveryAddressModal({ open, onCancel, onSave }) {
  const [addressData, setAddressData] = useState([]);

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then((data) => setAddressData(data))
      .catch(() => {
        toast.error("Không tải được dữ liệu địa chỉ!");
      });
  }, []);

  //  LẤY QUẬN
  const districtOptions = useMemo(() => {
    return addressData.find((c) => c.name === city)?.districts || [];
  }, [city, addressData]);

  //  LẤY PHƯỜNG
  const wardOptions = useMemo(() => {
    return districtOptions.find((d) => d.name === district)?.wards || [];
  }, [districtOptions, district]);

  //  SAVE
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
        {/* CITY */}
        <div>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
            }}
          >
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
            {addressData.map((item) => (
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* DISTRICT */}
        <div>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
            }}
          >
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
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* WARD */}
        <div>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
            }}
          >
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
              <option key={item.code} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* DETAIL */}
        <div>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 13,
              fontWeight: 700,
              color: T.text,
            }}
          >
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
