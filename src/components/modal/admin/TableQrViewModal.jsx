import React from "react";
import { Modal, Button, Space, message } from "antd";
import {
  CopyOutlined,
  ExportOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

const TableQrViewModal = ({ open, table, onCancel }) => {
  if (!table) {
    return null;
  }

  const tableNumber = table.tableNumber;
  const qrCode = table.qrCode;

  // Link mà QR đang chứa
  const tableUrl = `${window.location.origin}/table-order?table=${encodeURIComponent(
    tableNumber,
  )}`;

  // =========================================================
  // COPY LINK
  // =========================================================
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(tableUrl);
      message.success("Đã sao chép link QR");
    } catch (error) {
      console.error("Copy link error:", error);
      message.error("Không thể sao chép link");
    }
  };

  // =========================================================
  // OPEN TABLE
  // =========================================================
  const openTable = () => {
    window.open(
      `/table-order?table=${encodeURIComponent(tableNumber)}`,
      "_blank",
    );
  };

  // =========================================================
  // PRINT QR
  // =========================================================
  const printQr = () => {
    if (!qrCode) {
      message.warning(`Bàn ${tableNumber} chưa có mã QR`);
      return;
    }

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      message.error(
        "Không thể mở cửa sổ in. Vui lòng cho phép cửa sổ bật lên.",
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Bàn ${tableNumber}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;

              font-family: Arial, sans-serif;

              text-align: center;

              background: #fff;
              color: #000;
            }

            .qr-container {
              width: 100%;

              display: flex;
              flex-direction: column;
              align-items: center;
            }

            h1 {
              margin: 0 0 20px;

              font-size: 30px;
              font-weight: 700;
            }

            .qr-image {
              width: 350px;
              height: 350px;

              object-fit: contain;

              display: block;
            }

            .link {
              margin-top: 20px;

              max-width: 600px;

              font-size: 14px;

              word-break: break-all;

              color: #333;
            }

            @media print {
              body {
                padding: 20px;
              }

              .qr-image {
                width: 350px;
                height: 350px;
              }
            }
          </style>
        </head>

        <body>
          <div class="qr-container">

            <h1>BÀN ${tableNumber}</h1>

            <img
              class="qr-image"
              src="${qrCode}"
              alt="QR Bàn ${tableNumber}"
            />

            <div class="link">
              ${tableUrl}
            </div>

          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // =======================================================
    // ĐỢI ẢNH BACKEND LOAD XONG RỒI MỚI IN
    // =======================================================
    const printImage = printWindow.document.querySelector(".qr-image");

    if (printImage) {
      printImage.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

      printImage.onerror = () => {
        message.error("Không thể tải ảnh QR để in");
        printWindow.close();
      };
    } else {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 800);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <Modal
      open={open}
      title={`QR Bàn ${tableNumber}`}
      onCancel={onCancel}
      footer={null}
      centered
      width={430}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "10px 0 5px",
        }}
      >
        {/* =================================================
            QR IMAGE
        ================================================= */}
        <div
          style={{
            background: "#fff",
            padding: 12,
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        >
          {qrCode ? (
            <img
              src={qrCode}
              alt={`QR Bàn ${tableNumber}`}
              style={{
                width: 280,
                height: 280,
                display: "block",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                width: 280,
                height: 280,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: "#999",
                fontSize: 14,

                textAlign: "center",
              }}
            >
              Bàn này chưa có mã QR
            </div>
          )}
        </div>

        {/* =================================================
            TABLE URL
        ================================================= */}
        <div
          style={{
            width: "100%",

            textAlign: "center",

            wordBreak: "break-all",

            fontSize: 13,

            color: "#777",
          }}
        >
          {tableUrl}
        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}
        <Space
          wrap
          style={{
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* COPY */}
          <Button icon={<CopyOutlined />} onClick={copyLink}>
            Sao chép link
          </Button>

          {/* OPEN */}
          <Button icon={<ExportOutlined />} onClick={openTable}>
            Mở thử
          </Button>

          {/* PRINT */}
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={printQr}
            disabled={!qrCode}
          >
            In
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default TableQrViewModal;
