import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import logoPerusahaan from "../../assets/PT_Aridas_Karya_Satria_Logo.png";
import {
  Backdrop,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import MyModal from "../../components/Modal";
import { AppContext } from "../../App";
import dayjs from "dayjs";
import DefaultButton from "../../components/Button";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const OrderHistoryPage = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [dataView, setDataView] = useState({});

  const [imageIndex, setImageIndex] = useState(null);
  const [openImage, setOpenImage] = useState(false);

  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:5000/order/getAllOrderInfo/${userInformation?.data?.id}`,
    }).then((result) => {
      if (result.status === 200) {
        const tempData = result.data.filter(
          (item) => item.orderStatus === "Done"
        );
        setOrderHistory(tempData);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data history pesanan");
      }
    });
  }, []);

  const handleViewHistoryPerencanaanProduksi = (id) => {
    const data = orderHistory.find((item) => item.id === id);
    setDataView(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleOpenImage = (index) => {
    setImageIndex(index);
    setOpenImage(!openImage);
  };

  const saveAsPDF = () => {
    const pdf = new jsPDF("potrait", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let y = margin;

    const addNewPage = () => {
      pdf.addPage();
      pdf.addImage(factoryBackground, "png", 0, 0, pageWidth, pageHeight);
      y = margin;
    };

    pdf.addImage(factoryBackground, "png", 0, 0, pageWidth, pageHeight);
    pdf.addImage(logoPerusahaan, "png", 10, 5, 30, 30);
    pdf.setTextColor(15, 96, 125);
    pdf.setFontSize(24);
    pdf.text("PT. ARIDAS KARYA SATRIA", 45, 25);
    pdf.setFontSize(10);
    pdf.text(
      "Security Printing | Hologram Security | Smart Card | General Printing & Packaging | \nContinous Form Printing | Web Offset Printing",
      45,
      30
    );
    pdf.setFontSize(24);
    y = 40;
    pdf.setLineWidth(0.5);
    pdf.line(10, y, pageWidth - margin, y);

    y += 15;

    pdf.setFontSize(12);
    pdf.text(
      `Tanggal Pembuatan Laporan: ${dayjs().format("MM/DD/YYYY hh:mm A")}`,
      margin,
      y
    );
    y += 10;
    pdf.text(`PIC: ${userInformation?.data?.name}`, margin, y);
    y += 15;

    pdf.setFontSize(24);
    pdf.text(`Laporan Order ${dataView.id}`, margin, y);
    y += 15;
    pdf.setFontSize(12);

    if (y + 20 > pageHeight) {
      addNewPage();
    }

    pdf.text(`Nama Pesanan: ${dataView.orderTitle}`, margin, y);
    pdf.text(`Jumlah Pesanan: ${dataView.orderQuantity}`, 100, y);
    y += 10;

    pdf.text(`Jenis Cetakan: ${dataView.orderType}`, margin, y);
    pdf.text(`No Seri: ${dataView.orderNoSeries}`, 100, y);
    y += 10;

    pdf.text(`Detail Pesanan: ${dataView.orderDetails}`, margin, y);
    pdf.text(
      `Harga Pesanan: Rp. ${dataView.orderTotalPrice
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`,
      100,
      y
    );
    y += 10;
    pdf.text(
      `Tanggal Jatuh Tempo: ${dayjs(dataView.orderDueDate).format(
        "MM/DD/YYYY hh:mm A"
      )}`,
      margin,
      y
    );
    y += 10;

    pdf.text(`Detail Customer: ${dataView.customerDetail}`, margin, y);
    pdf.text(`Customer Channel: ${dataView.customerChannel}`, 100, y);

    y += 10;

    pdf.text(`Alamat Pengiriman: ${dataView.alamatPengiriman}`, margin, y);

    pdf.save(`Laporan-Order${dataView.id}.pdf`);
  };

  const saveAsExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const startRow = 4;
    const startCol = 2;

    let currentRow = startRow;

    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.mergeCells("B2:M3");
    const titleCell = worksheet.getCell("B2");
    titleCell.value = `LAPORAN PESANAN ${dataView.id}`;
    titleCell.border = borderStyle;
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    const tableHeader = [
      [
        "No.",
        "Nama Pesanan",
        "Tanggal",
        "Cetakan",
        "",
        "",
        "Detail Pesanan",
        "Jumlah Harga",
        "Tgl Jatuh Tempo Pengiriman",
        "Customer",
        "",
        "",
      ],
    ];

    const tableDataHeader = [
      [
        "",
        "",
        "",
        "Jenis Cetakan",
        "Jumlah Pesanan",
        "No Seri",
        "",
        "",
        "",
        "Detail Customer",
        "Customer Channel",
        "Alamat Pengiriman",
      ],
    ];

    const firstHeaderRow = worksheet.getRow(startRow);
    tableHeader[0].forEach((header, colIndex) => {
      const cell = firstHeaderRow.getCell(startCol + colIndex);
      cell.value = header;
      cell.border = borderStyle;
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    const secondHeaderRow = worksheet.getRow(startRow + 1);
    tableDataHeader[0].forEach((header, colIndex) => {
      const cell = secondHeaderRow.getCell(startCol + colIndex);
      cell.value = header;
      cell.border = borderStyle;
    });

    worksheet.mergeCells("E4:G4");
    const cetakanTitle = worksheet.getCell("E4");
    cetakanTitle.value = `Cetakan`;
    cetakanTitle.border = borderStyle;
    cetakanTitle.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells("K4:M4");
    const customerTitle = worksheet.getCell("K4");
    customerTitle.value = `Customer`;
    customerTitle.border = borderStyle;
    customerTitle.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.mergeCells(startRow, startCol, startRow + 1, startCol);
    worksheet.mergeCells(startRow, startCol + 1, startRow + 1, startCol + 1);
    worksheet.mergeCells(startRow, startCol + 2, startRow + 1, startCol + 2);
    worksheet.mergeCells(startRow, startCol + 6, startRow + 1, startCol + 6);
    worksheet.mergeCells(startRow, startCol + 7, startRow + 1, startCol + 7);
    worksheet.mergeCells(startRow, startCol + 8, startRow + 1, startCol + 8);

    currentRow += 2;

    let dataRow = [
      [
        "1.",
        dataView.orderTitle,
        dayjs(dataView.createdAt).format("MM/DD/YYYY hh:mm A"),
        dataView.jenisCetakan,
        dataView.orderQuantity,
        dataView.orderNoSeries,
        dataView.orderDetails,
        `Rp. ${dataView.orderTotalPrice
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`,
        dayjs(dataView.orderDueDate).format("MM/DD/YYYY hh:mm A"),
        dataView.customerDetail,
        dataView.customerChannel,
        dataView.alamatPengiriman,
      ],
    ];

    dataRow.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow + rowIndex);
      row.forEach((cellValue, colIndex) => {
        excelRow.getCell(startCol + colIndex).value = cellValue;
      });
      for (let i = 0; i <= 11; i++) {
        excelRow.getCell(startCol + i).border = borderStyle;
      }
    });

    workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Laporan_Order_${dataView.id}.xlsx`);
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ margin: "32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography style={{ fontSize: isMobile ? "6vw" : "3vw", color: "#0F607D" }}>
            Order History
          </Typography>
        </div>
        <div style={{ marginTop: "32px" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "25px" }}>No.</TableCell>
                  <TableCell style={{ width: "200px" }}>
                    Judul Pesanan
                  </TableCell>
                  <TableCell style={{ width: "200px" }}>
                    Jumlah Pesanan
                  </TableCell>
                  <TableCell style={{ width: "200px" }}>
                    Informasi Pemesan
                  </TableCell>
                  <TableCell style={{ width: "50px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderHistory.map((result, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{index + 1 + "."}</TableCell>
                        <TableCell>{result.orderTitle}</TableCell>
                        <TableCell>{result.orderQuantity}</TableCell>
                        <TableCell>{result.customerDetail}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              handleViewHistoryPerencanaanProduksi(result.id);
                            }}
                          >
                            <VisibilityIcon sx={{ color: "#0F607D" }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      {openModal === true && (
        <MyModal open={openModal} handleClose={handleCloseModal}>
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "100vw" : "50vw",
              maxHeight: "100vh",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ fontSize: "2vw", color: "#0F607D" }}>
                History Order {dataView.id}
              </Typography>
              <IconButton
                style={{ height: "50%" }}
                onClick={() => {
                  handleCloseModal();
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <Typography
              style={{
                color: "#0F607D",
                fontSize: "1.5vw",
                marginBottom: "16px",
              }}
            >
              Dokumen
            </Typography>
            {dataView.documents.length === 0 ? (
              <Typography style={{ color: "#0F607D" }}>
                Tidak ada data dokumen dari pesanan ini
              </Typography>
            ) : (
              <div>
                {dataView.documents.map((result, index) => {
                  return (
                    <img
                      style={{
                        height: isMobile ? "30px" : "120px",
                        width: isMobile ? "30px" : "120px",
                        marginRight: "16px",
                      }}
                      srcSet={`http://localhost:5000/uploads/${result.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`http://localhost:5000/uploads/${result.filename}?w=248&fit=crop&auto=format`}
                      alt=""
                      loading="lazy"
                      onClick={() => {
                        handleOpenImage(index);
                      }}
                    />
                  );
                })}
              </div>
            )}
            <div style={{ display: "flex", width: "100%", marginTop: "16px" }}>
              <div style={{ width: "50%" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                  Nama Pesanan: {dataView.orderTitle}
                </Typography>
              </div>
              <div style={{ width: "50%" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                  Jumlah Pesanan: {dataView.orderQuantity}
                </Typography>
              </div>
            </div>
            <div style={{ display: "flex", width: "100%", marginTop: "16px" }}>
              <div style={{ width: "50%" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                  Jenis Cetakan: {dataView.orderType}
                </Typography>
              </div>
              <div style={{ width: "50%" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                  No Seri: {dataView.orderNoSeries}
                </Typography>
              </div>
            </div>
            <div style={{ display: "flex", width: "100%", marginTop: "16px" }}>
              <div style={{ width: "50%" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                  Detail Pesanan: {dataView.orderDetails}
                </Typography>
              </div>
              <div style={{ width: "50%" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                  Harga Pesanan:{" "}
                  {`Rp. ${dataView.orderTotalPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`}
                </Typography>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                Tanggal Jatuh Tempo Pesanan:{" "}
                {dayjs(dataView.orderDueDate).format("MM/DD/YYYY hh:mm A")}
              </Typography>
            </div>
            <div style={{ display: "flex", width: "100%", marginTop: "16px" }}>
              <div style={{ width: "50%" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                  Detail Customer: {dataView.customerDetail}
                </Typography>
              </div>
              <div style={{ width: "50%" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                  Customer Channel: {dataView.customerChannel}
                </Typography>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                Alamat Pengiriman: {dataView.alamatPengiriman}
              </Typography>
            </div>
          </div>
          <div
            style={{
              margin: "32px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DefaultButton
              onClickFunction={() => {
                saveAsPDF();
              }}
            >
              Simpan PDF
            </DefaultButton>
            <div style={{ marginLeft: "8px" }}>
              <DefaultButton
                onClickFunction={() => {
                  saveAsExcel();
                }}
              >
                Simpan Excel
              </DefaultButton>
            </div>
          </div>
        </MyModal>
      )}
      {snackbarMessage !== ("" || null) && (
        <MySnackbar
          open={openSnackbar}
          handleClose={handleCloseSnackbar}
          messageStatus={snackbarStatus}
          popupMessage={snackbarMessage}
        />
      )}
      {openImage && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
          open={openImage}
          onClick={() => {
            setOpenImage(!openImage);
          }}
        >
          <div>
            <img
              style={{ width: "720px", height: "auto" }}
              // srcSet={`http://localhost:5000/uploads/${orderDetailInfo.data.documents[imageIndex].filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={
                dataView.documents[imageIndex].id !== undefined
                  ? `http://localhost:5000/uploads/${dataView.documents[imageIndex].filename}?w=248&fit=crop&auto=format`
                  : URL.createObjectURL(dataView.documents[imageIndex])
              }
              alt={""}
              loading="lazy"
            />
          </div>
        </Backdrop>
      )}
    </div>
  );
};

export default OrderHistoryPage;
