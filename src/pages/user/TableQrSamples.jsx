import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserHeader from "../../components/user/UserHeader";
import { T } from "../../constants/customerTheme";
import "../../assets/styles/CustomerTableQrSamples.css";
import tableService from "../../services/user/tableService";

const TableQrSamples = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const res = await tableService.getQrTable();

      setTables(res.data.data || []);
    } catch (error) {
      console.error("Load tables error:", error);
      toast.error("Không thể tải danh sách QR bàn");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã copy link QR");
    } catch (error) {
      toast.error("Không thể copy link");
    }
  };

  if (loading) {
    return (
      <div className="table-qr-page" style={{ background: T.bg }}>
        <div className="table-qr-container">
          <h3>Đang tải...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="table-qr-page" style={{ background: T.bg }}>
      <div className="table-qr-container">
        <UserHeader
          title="QR Code các bàn"
          description="In mã QR và đặt trên bàn để khách quét gọi món"
        />

        <div className="table-qr-grid">
          {tables.length > 0 ? (
            tables.map((table) => (
              <div className="table-qr-card" key={table.tableNumber}>
                <p className="table-qr-title">{table.tableNumber}</p>

                <img
                  src={table.qrCode}
                  alt={table.tableNumber}
                  className="table-qr-image"
                />

                <div className="table-qr-actions">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/table-order?table=${table.tableNumber}`,
                        "_blank",
                      )
                    }
                  >
                    Mở thử
                  </button>

                  <button
                    type="button"
                    className="ghost"
                    onClick={() =>
                      copyLink(
                        `${window.location.origin}/table-order?table=${table.tableNumber}`,
                      )
                    }
                  >
                    Copy link
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">Không có dữ liệu bàn</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableQrSamples;
