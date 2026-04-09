import React, { useMemo } from "react";
import { toast } from "react-toastify";
import { T } from "../../constants/customerTheme";
import UserHeader from "../../components/user/UserHeader";
import "../../assets/styles/CustomerTableQrSamples.css";

const TABLES = Array.from({ length: 20 }, (_, idx) => `B${String(idx + 1).padStart(2, "0")}`);

const getBaseUrl = () => {
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "http://localhost:5173";
};

const TableQrSamples = () => {
  const baseUrl = getBaseUrl();

  const tableQrData = useMemo(() => {
    return TABLES.map((tableNo) => {
      const orderUrl = `${baseUrl}/customer/table-order?table=${tableNo}`;
      const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(orderUrl)}`;
      return { tableNo, orderUrl, qrSrc };
    });
  }, [baseUrl]);

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã copy link QR");
    } catch {
      toast.error("Không thể copy link");
    }
  };

  return (
    <div className="table-qr-page" style={{ background: T.bg }}>
      <div className="table-qr-container">
        <UserHeader
          title="QR mẫu cho từng bàn"
          description="In các mã này và đặt trên bàn để khách quét gọi món"
        />

        <div className="table-qr-grid">
          {tableQrData.map((item) => (
            <div className="table-qr-card" key={item.tableNo}>
              <p className="table-qr-title">Bàn {item.tableNo}</p>
              <img src={item.qrSrc} alt={`QR ${item.tableNo}`} className="table-qr-image" />
              <p className="table-qr-link">{item.orderUrl}</p>
              <div className="table-qr-actions">
                <button type="button" onClick={() => window.open(item.orderUrl, "_blank", "noopener,noreferrer")}>
                  Mở thử
                </button>
                <button type="button" className="ghost" onClick={() => copyLink(item.orderUrl)}>
                  Copy link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableQrSamples;
