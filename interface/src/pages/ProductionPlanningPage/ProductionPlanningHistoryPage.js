import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import logoPerusahaan from "../../assets/PT_Aridas_Karya_Satria_Logo.png";
import {
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
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
import dayjs from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../../App";
import MyModal from "../../components/Modal";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import DefaultButton from "../../components/Button";
import { saveAs } from "file-saver";

const ProductionPlanningHistoryPage = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const [dataPerencanaanProduksi, setDataPerencanaanProduksi] = useState([]);
  const [dataView, setDataView] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getAllProductionPlanning",
    }).then((result) => {
      if (result.status === 200) {
        const tempData = result.data
          .filter((item) => item.statusProductionPlanning === "Done")
          .map((data) => {
            return {
              ...data,
              estimasiBahanBakus: groupBahanBakuAkanDigunakans(
                data.estimasiBahanBakus
              ),
            };
          });
        setDataPerencanaanProduksi(tempData);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data history perencanaan produksi"
        );
      }
    });
  }, []);

  const groupBahanBakuAkanDigunakans = (estimasiBahanBaku) => {
    return estimasiBahanBaku?.map((bahanBaku) => {
      const groupedData = bahanBaku.bahanBakuAkanDigunakans.reduce(
        (acc, item) => {
          const { groupIndex } = item;
          if (!acc[groupIndex]) {
            acc[groupIndex] = [];
          }
          acc[groupIndex].push({
            ...item,
          });
          return acc;
        },
        {}
      );

      const newBahanBakuAkanDigunakans = Object.values(groupedData).map(
        (dataJenis) => ({
          dataJenis: dataJenis,
        })
      );

      return {
        ...bahanBaku,
        bahanBakuAkanDigunakans: newBahanBakuAkanDigunakans,
      };
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleViewHistoryPerencanaanProduksi = (id) => {
    const data = dataPerencanaanProduksi.find((item) => item.id === id);
    setDataView(data);
    setOpenModal(true);
  };

  const handleSaveAsPdf = () => {
    const pdf = new jsPDF("landscape", "mm", "a4");
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
      "Security Printing | Hologram Security | Smart Card | General Printing & Packaging | Continous Form Printing | Web Offset Printing",
      45,
      30
    );
    pdf.setFontSize(24);
    y = 40;
    pdf.setLineWidth(0.5);
    pdf.line(10, y, pageWidth - margin, y);

    y += 15;

    pdf.text(`Laporan Perencanaan Produksi ${dataView.id}`, margin, y);
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

    if (y + 20 > pageHeight) {
      addNewPage();
    }

    pdf.text(`Pemesan: ${dataView.pemesan}`, margin, y);
    pdf.text(
      `Tanggal Pengiriman: ${dayjs(dataView.tanggalPengirimanBarang).format(
        "MM/DD/YYYY hh:mm A"
      )}`,
      80,
      y
    );
    y += 10;
    if (y + 20 > pageHeight) {
      addNewPage();
    }
    pdf.text(
      `Alamat Pengiriman Produk: ${dataView.alamatKirimBarang}`,
      margin,
      y
    );
    y += 10;
    if (y + 20 > pageHeight) {
      addNewPage();
    }
    pdf.text(`Jenis Cetakan: ${dataView.jenisCetakan}`, margin, y);
    pdf.text(`Ply: ${dataView.ply}`, 80, y);
    y += 10;
    if (y + 20 > pageHeight) {
      addNewPage();
    }
    pdf.text(`Ukuran: ${dataView.ukuran}`, margin, y);
    pdf.text(`Seri: ${dataView.seri}`, 80, y);
    y += 10;
    if (y + 20 > pageHeight) {
      addNewPage();
    }
    pdf.text(`Kuantitas: ${dataView.kuantitas}`, margin, y);
    pdf.text(`Nomorator: ${dataView.nomorator}`, 80, y);
    y += 10;
    if (y + 20 > pageHeight) {
      addNewPage();
    }
    pdf.text(`Isi per box: ${dataView.isiPerBox}`, margin, y);
    y += 10;
    if (y + 20 > pageHeight) {
      addNewPage();
    }
    pdf.text(`Contoh: ${dataView.contoh === true ? "V" : "X"}`, margin, y);
    pdf.text(`Setting: ${dataView.setting === true ? "V" : "X"}`, 80, y);
    y += 10;
    if (y + 20 > pageHeight) {
      addNewPage();
    }
    pdf.text(`Plate: ${dataView.plate === true ? "V" : "X"}`, margin, y);
    y += 30;

    if (y + 20 > pageHeight) {
      addNewPage();
    }
    if (y + 50 > pageHeight) {
      addNewPage();
    }
    y += 15;
    pdf.setFontSize(18);
    pdf.text("Bahan Baku & Bahan Pembantu", margin, y);
    pdf.setFontSize(12);
    y += 10;

    let tableColumnsBahanBaku = [];

    tableColumnsBahanBaku = dataView.estimasiBahanBakus.map((result, index) => {
      return [
        "No.",
        result.jenis,
        result.informasi,
        "Warna",
        "Estimasi Kebutuhan",
        "Waste",
        "Jumlah Kebutuhan",
      ];
    });

    let tableRows = [];
    dataView.estimasiBahanBakus.forEach((estimasi, estimasiIndex) => {
      estimasi.bahanBakuAkanDigunakans.forEach((bahanBaku) => {
        bahanBaku.dataJenis.forEach((dataJenisItem) => {
          tableRows.push({
            count: estimasiIndex + 1,
            jenis: dataJenisItem.namaJenis,
            informasi: dataJenisItem.dataInformasi,
            warna: dataJenisItem.warna,
            estimasiKebutuhan: dataJenisItem.estimasiKebutuhan,
            waste: dataJenisItem.waste,
            jumlahKebutuhan: dataJenisItem.jumlahKebutuhan,
          });
        });
      });
    });

    tableColumnsBahanBaku.forEach((tableColumns, tableIndex) => {
      const filteredRows = tableRows.filter(
        (row) => row.count === tableIndex + 1
      );

      pdf.autoTable({
        startY: y,
        head: [tableColumns],
        body: filteredRows.map((row, rowIndex) => {
          return [
            rowIndex + 1 + ".",
            row.jenis,
            row.informasi,
            row.warna,
            row.estimasiKebutuhan,
            row.waste,
            row.jumlahKebutuhan,
          ];
        }),
        theme: "striped",
        margin: { left: margin, right: margin },
      });

      y = pdf.lastAutoTable.finalY + 15;
    });

    if (y + 50 > pageHeight) {
      addNewPage();
    }

    y += 15;
    pdf.setFontSize(18);
    pdf.text("Jangka Waktu Produksi", margin, y);
    pdf.setFontSize(12);
    y += 10;

    let tableColumnsJangkaWaktu = [
      "Bagian",
      "Jenis Pekerjaan",
      "Tanggal Mulai",
      "Tanggal Selesai",
      "Jumlah Hari",
    ];

    let tableRowsJangkaWaktu = [];

    dataView.estimasiJadwalProdukses.forEach((row, index) => {
      row.rencanaJadwalProdukses.forEach((pekerjaan, pekerjaanIndex) => {
        tableRowsJangkaWaktu.push({
          bagian: pekerjaanIndex === 0 ? row.bagian : "",
          jenisPekerjaan: pekerjaan.jenisPekerjaan,
          tanggalMulai: dayjs(pekerjaan.tanggalMulai).format(
            "MM/DD/YYYY hh:mm A"
          ),
          tanggalSelesai: dayjs(pekerjaan.tanggalSelesai).format(
            "MM/DD/YYYY hh:mm A"
          ),
          jumlahHari: pekerjaan.jumlahHari,
        });
      });
    });

    pdf.autoTable({
      startY: y,
      head: [tableColumnsJangkaWaktu],
      body: tableRowsJangkaWaktu.map((row) => {
        return [
          row.bagian,
          row.jenisPekerjaan,
          row.tanggalMulai,
          row.tanggalSelesai,
          row.jumlahHari,
        ];
      }),
      theme: "striped",
      margin: { left: margin, right: margin },
    });
    y = pdf.lastAutoTable.finalY + 15;

    if (y + 50 > pageHeight) {
      addNewPage();
    }
    y += 15;
    pdf.setFontSize(18);
    pdf.text("Rincian Cetakan", margin, y);
    y += 10;
    pdf.setFontSize(12);

    let tableColumnsRincianCetakan = [
      "No.",
      "Nama Cetakan",
      "Ukuran",
      "Jenis Kertas",
      "Berat Kertas",
      "Warna",
      "Kuantitas",
      "Ply",
      "Isi",
      "Nomorator",
      "Keterangan",
    ];

    let tableRowsRincianCetakan = [];

    dataView.rincianCetakans.forEach((result, index) => {
      tableRowsRincianCetakan.push({
        no: index + 1 + ".",
        namaCetakan: result.namaCetakan,
        ukuran: result.ukuran,
        jenisKertas: result.jenisKertas,
        beratKertas: result.beratKertas,
        warna: result.warna,
        kuantitas: result.kuantitas,
        ply: result.ply,
        isi: result.isi,
        nomorator: result.nomorator,
        keterangan: result.keterangan,
      });
    });

    pdf.autoTable({
      startY: y,
      head: [tableColumnsRincianCetakan],
      body: tableRowsRincianCetakan.map((row, rowIndex) => {
        return [
          row.no,
          row.namaCetakan,
          row.ukuran,
          row.jenisKertas,
          row.beratKertas,
          row.warna,
          row.kuantitas,
          row.ply,
          row.isi,
          row.nomorator,
          row.keterangan,
        ];
      }),
      theme: "striped",
      margin: { left: margin, right: margin },
    });
    y = pdf.lastAutoTable.finalY + 15;

    if (y + 50 > pageHeight) {
      addNewPage();
    }

    y += 15;
    pdf.setFontSize(18);
    pdf.text("Perincian", margin, y);
    pdf.setFontSize(12);
    y += 10;

    const tableHeaders = [
      [
        {
          content: "PERINCIAN REKANAN",
          colSpan: 4,
          styles: { halign: "center" },
        },
        {
          content: "PERINCIAN HARGA CETAK",
          colSpan: 3,
          styles: { halign: "center" },
        },
      ],
      [
        { content: "No.", colSpan: 1 },
        { content: "Nama Rekanan", colSpan: 1 },
        { content: "Keterangan", colSpan: 1 },
        { content: "No.", colSpan: 1 },
        { content: "Jenis Cetakan", colSpan: 1 },
        { content: "Isi", colSpan: 1 },
        { content: "Harga", colSpan: 1 },
      ],
    ];

    let tableRowPerincian = [];

    dataView.perincians.forEach((result, index) => {
      tableRowPerincian.push({
        no: index + 1,
        namaRekanan: result.namaRekanan,
        keterangan: result.keterangan,
        noJc: index + 1,
        jenisCetakan: result.jenisCetakan,
        isi: result.isi,
        harga: `Rp. ${result.harga
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`,
      });
    });

    pdf.autoTable({
      startY: y,
      head: tableHeaders,
      body: tableRowPerincian.map((row) => {
        return [
          `${row.no}.`,
          row.namaRekanan,
          row.keterangan,
          `${row.noJc}.`,
          row.jenisCetakan,
          row.isi,
          row.harga,
        ];
      }),
      theme: "striped",
      margin: { left: margin, right: margin },
    });

    y = pdf.lastAutoTable.finalY + 15;

    pdf.save("laporan-perencanaan-produksi.pdf");
  };

  const handleSaveAsExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const startRow = 4;
    const startCol = 2;

    const dataHeader = [
      ["", "", "", "", "", "", dayjs().format("MM/DD/YYYY hh:mm A")],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", `No Order: ${dataView.orderId}`],
      ["", "", "", "", "", "", ""],
      ["", "", "", `LAPORAN PERENCANAAN PRODUKSI ${dataView.id}`, "", "", ""],
    ];

    const dataInformasi = [
      [
        `Pemesan: ${dataView.pemesan}`,
        "",
        "",
        "",
        `Alamat Kirim Barang: ${dataView.alamatKirimBarang}`,
        "",
        "",
      ],
      [
        `Tanggal Pengiriman Barang: ${dayjs(
          dataView.tanggalPengirimanBarang
        ).format("MM/DD/YYYY hh:mm A")}`,
        "",
        "",
        "",
        "",
        "",
        "",
      ],
    ];
    const dataInformasiDetail = [
      [
        `Jenis Cetakan: ${dataView.jenisCetakan}`,
        "",
        "",
        "",
        `Ply: ${dataView.ply}`,
        "",
        "",
      ],
      [
        `Ukuran: ${dataView.ukuran}`,
        "",
        "",
        "",
        `Seri: ${dataView.seri}`,
        "",
        "",
      ],
      [
        `Kuantitas: ${dataView.kuantitas}`,
        "",
        "",
        "",
        `Nomorator: ${dataView.nomorator}`,
        "",
        "",
      ],
      [`Isi per box: ${dataView.isiPerBox}`, "", "", "", "", "", ""],
    ];

    let currentRow = startRow;

    dataHeader.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(startRow + rowIndex);
      row.forEach((cellValue, colIndex) => {
        excelRow.getCell(startCol + colIndex).value = cellValue;
      });
    });

    currentRow += dataHeader.length;

    dataInformasi.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow + rowIndex);
      row.forEach((cellValue, colIndex) => {
        excelRow.getCell(startCol + colIndex).value = cellValue;
      });
    });

    currentRow += dataInformasi.length;

    dataInformasiDetail.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow + rowIndex);
      row.forEach((cellValue, colIndex) => {
        excelRow.getCell(startCol + colIndex).value = cellValue;
      });
    });

    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const applyBorderToRange = (
      rowNumber,
      startCol,
      endCol,
      isFirstRow,
      isLastRow
    ) => {
      for (let col = startCol; col <= endCol; col++) {
        const cell = worksheet.getCell(rowNumber, col);
        cell.border = {
          top: isFirstRow ? borderStyle.top : undefined,
          bottom: isLastRow ? borderStyle.bottom : undefined,
          left: col === startCol ? borderStyle.left : undefined,
          right: col === endCol ? borderStyle.right : undefined,
        };
      }
    };

    for (let rowIndex = 4; rowIndex < 8; rowIndex++) {
      const isFirstRow = rowIndex === 4;
      const isLastRow = rowIndex === 8;
      applyBorderToRange(rowIndex, 2, 8, isFirstRow, isLastRow);
    }

    worksheet.mergeCells("B8:H8");
    const titleCell = worksheet.getCell("B8");
    titleCell.value = `LAPORAN PERENCANAAN PRODUKSI ${dataView.id}`;
    titleCell.border = {
      top: borderStyle.top,
      bottom: borderStyle.bottom,
      left: borderStyle.left,
      right: borderStyle.right,
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell(`B8`).font = { bold: true };

    for (let rowIndex = 9; rowIndex < 11; rowIndex++) {
      const isFirstRow = rowIndex === 9;
      const isLastRow = rowIndex === 11;
      applyBorderToRange(rowIndex, 2, 8, isFirstRow, isLastRow);
    }

    for (let rowIndex = 11; rowIndex < 15; rowIndex++) {
      const isFirstRow = rowIndex === 11;
      const isLastRow = rowIndex === 15;
      applyBorderToRange(rowIndex, 2, 8, isFirstRow, isLastRow);
    }

    worksheet.mergeCells("B15:H15");
    const bahanBakuTitle = worksheet.getCell("B15");
    bahanBakuTitle.value = `Bahan Baku & Bahan Pembantu`;
    bahanBakuTitle.border = {
      top: borderStyle.top,
      bottom: borderStyle.bottom,
      left: borderStyle.left,
      right: borderStyle.right,
    };
    bahanBakuTitle.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell(`B15`).font = { bold: true };

    let tableColumnsBahanBaku = [];

    tableColumnsBahanBaku = dataView.estimasiBahanBakus.map((result, index) => {
      return [
        "No.",
        result.jenis,
        result.informasi,
        "Warna",
        "Estimasi Kebutuhan",
        "Waste",
        "Jumlah Kebutuhan",
      ];
    });

    let tableRow = [];
    dataView.estimasiBahanBakus.forEach((estimasi, estimasiIndex) => {
      estimasi.bahanBakuAkanDigunakans.forEach((bahanBaku) => {
        bahanBaku.dataJenis.forEach((dataJenisItem) => {
          tableRow.push({
            count: estimasiIndex + 1,
            jenis: dataJenisItem.namaJenis,
            informasi: dataJenisItem.dataInformasi,
            warna: dataJenisItem.warna,
            estimasiKebutuhan: dataJenisItem.estimasiKebutuhan,
            waste: dataJenisItem.waste,
            jumlahKebutuhan: dataJenisItem.jumlahKebutuhan,
          });
        });
      });
    });

    currentRow += dataInformasiDetail.length + 1;

    tableColumnsBahanBaku.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow);
      row.forEach((cellValue, colIndex) => {
        const cell = excelRow.getCell(startCol + colIndex);
        cell.value = cellValue;
        cell.border = borderStyle;
      });

      currentRow += 1;
      const filteredRows = tableRow.filter((row) => row.count === rowIndex + 1);

      filteredRows.forEach((rowData, dataRowIndex) => {
        const excelTableRow = worksheet.getRow(currentRow + dataRowIndex);
        excelTableRow.getCell(startCol).value = dataRowIndex + 1 + ".";
        excelTableRow.getCell(startCol + 1).value = rowData.jenis;
        excelTableRow.getCell(startCol + 2).value = rowData.informasi;
        excelTableRow.getCell(startCol + 3).value = rowData.warna;
        excelTableRow.getCell(startCol + 4).value = rowData.estimasiKebutuhan;
        excelTableRow.getCell(startCol + 5).value = rowData.waste;
        excelTableRow.getCell(startCol + 6).value = rowData.jumlahKebutuhan;

        for (let i = 0; i <= 6; i++) {
          excelTableRow.getCell(startCol + i).border = borderStyle;
        }
      });
      currentRow += filteredRows.length;
    });

    worksheet.mergeCells(`B${currentRow}:H${currentRow}`);
    const jangkaWaktuTitle = worksheet.getCell(`B${currentRow}`);
    jangkaWaktuTitle.value = `Jangka Waktu Produksi`;
    jangkaWaktuTitle.border = {
      top: borderStyle.top,
      bottom: borderStyle.bottom,
      left: borderStyle.left,
      right: borderStyle.right,
    };
    jangkaWaktuTitle.alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell(`B${currentRow}`).font = { bold: true };

    currentRow += 1;

    let tableColumnsJangkaWaktu = [
      [
        "Bagian",
        "Jenis Pekerjaan",
        "Tanggal Mulai",
        "",
        "Tanggal Selesai",
        "",
        "Jumlah Hari",
      ],
    ];
    let tableRowsJangkaWaktu = [];

    dataView.estimasiJadwalProdukses.forEach((row, index) => {
      row.rencanaJadwalProdukses.forEach((pekerjaan, pekerjaanIndex) => {
        tableRowsJangkaWaktu.push({
          bagian: pekerjaanIndex === 0 ? row.bagian : "",
          jenisPekerjaan: pekerjaan.jenisPekerjaan,
          tanggalMulai: dayjs(pekerjaan.tanggalMulai).format(
            "MM/DD/YYYY hh:mm A"
          ),
          tanggalSelesai: dayjs(pekerjaan.tanggalSelesai).format(
            "MM/DD/YYYY hh:mm A"
          ),
          jumlahHari: pekerjaan.jumlahHari,
        });
      });
    });

    tableColumnsJangkaWaktu.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow);
      row.forEach((cellValue, colIndex) => {
        const cell = excelRow.getCell(startCol + colIndex);
        cell.value = cellValue;
        cell.border = borderStyle;
      });
      worksheet.mergeCells(currentRow, startCol + 2, currentRow, startCol + 3);
      worksheet.mergeCells(currentRow, startCol + 4, currentRow, startCol + 5);
      currentRow += 1;
    });

    tableRowsJangkaWaktu.forEach((rowData, dataRowIndex) => {
      const excelTableRow = worksheet.getRow(currentRow + dataRowIndex);

      excelTableRow.getCell(startCol).value = rowData.bagian;
      excelTableRow.getCell(startCol + 1).value = rowData.jenisPekerjaan;

      excelTableRow.getCell(startCol + 2).value = rowData.tanggalMulai;
      worksheet.mergeCells(
        currentRow + dataRowIndex,
        startCol + 2,
        currentRow + dataRowIndex,
        startCol + 3
      );

      excelTableRow.getCell(startCol + 4).value = rowData.tanggalSelesai;
      worksheet.mergeCells(
        currentRow + dataRowIndex,
        startCol + 4,
        currentRow + dataRowIndex,
        startCol + 5
      );

      excelTableRow.getCell(startCol + 6).value = rowData.jumlahHari;

      for (let i = 0; i <= 6; i++) {
        excelTableRow.getCell(startCol + i).border = borderStyle;
      }
    });

    currentRow += tableRowsJangkaWaktu.length;

    worksheet.mergeCells(`B${currentRow}:H${currentRow}`);
    const rincianCetakanTitle = worksheet.getCell(`B${currentRow}`);
    rincianCetakanTitle.value = `Rincian Cetakan`;
    rincianCetakanTitle.border = {
      top: borderStyle.top,
      bottom: borderStyle.bottom,
      left: borderStyle.left,
      right: borderStyle.right,
    };
    rincianCetakanTitle.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getCell(`B${currentRow}`).font = { bold: true };

    currentRow += 1;

    const tableColumnsRincianCetakan = [
      [
        "No.",
        "Nama Cetakan",
        "Ukuran",
        "Jenis Kertas",
        "Berat Kertas (Gram)",
        "Warna",
        "Kuantitas",
        "Ply",
        "Isi",
        "Nomorator",
        "Keterangan",
      ],
    ];

    let tableRowsRincianCetakan = [];

    dataView.rincianCetakans.forEach((result, index) => {
      tableRowsRincianCetakan.push({
        no: index + 1 + ".",
        namaCetakan: result.namaCetakan,
        ukuran: result.ukuran,
        jenisKertas: result.jenisKertas,
        beratKertas: result.beratKertas,
        warna: result.warna,
        kuantitas: result.kuantitas,
        ply: result.ply,
        isi: result.isi,
        nomorator: result.nomorator,
        keterangan: result.keterangan,
      });
    });

    tableColumnsRincianCetakan.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow);
      row.forEach((cellValue, colIndex) => {
        const cell = excelRow.getCell(startCol + colIndex);
        cell.value = cellValue;
        cell.border = borderStyle;
      });
    });

    currentRow += 1;

    tableRowsRincianCetakan.forEach((rowData, dataRowIndex) => {
      const excelTableRow = worksheet.getRow(currentRow + dataRowIndex);
      excelTableRow.getCell(startCol).value = dataRowIndex + 1 + ".";
      excelTableRow.getCell(startCol + 1).value = rowData.namaCetakan;
      excelTableRow.getCell(startCol + 2).value = rowData.ukuran;
      excelTableRow.getCell(startCol + 3).value = rowData.jenisKertas;
      excelTableRow.getCell(startCol + 4).value = rowData.beratKertas;
      excelTableRow.getCell(startCol + 5).value = rowData.warna;
      excelTableRow.getCell(startCol + 6).value = rowData.kuantitas;
      excelTableRow.getCell(startCol + 7).value = rowData.ply;
      excelTableRow.getCell(startCol + 8).value = rowData.isi;
      excelTableRow.getCell(startCol + 9).value = rowData.nomorator;
      excelTableRow.getCell(startCol + 10).value = rowData.keterangan;
      for (let i = 0; i <= 10; i++) {
        excelTableRow.getCell(startCol + i).border = borderStyle;
      }
    });

    currentRow += tableRowsRincianCetakan.length;

    worksheet.mergeCells(`B${currentRow}:H${currentRow}`);
    const perincianTitle = worksheet.getCell(`B${currentRow}`);
    perincianTitle.value = `Perincian`;
    perincianTitle.border = {
      top: borderStyle.top,
      bottom: borderStyle.bottom,
      left: borderStyle.left,
      right: borderStyle.right,
    };
    perincianTitle.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getCell(`B${currentRow}`).font = { bold: true };

    currentRow += 1;

    const tableColumnsPerincianHeader = [
      ["Perincian Rekanan", "", "", "Perincian Harga Cetak", "", "", ""],
    ];

    const tableColumnsPerincian = [
      [
        "No.",
        "Nama Rekanan",
        "Keterangan",
        "No.",
        "Jenis Cetakan",
        "Isi",
        "Harga",
      ],
    ];

    let tableRowPerincian = [];

    dataView.perincians.forEach((result, index) => {
      tableRowPerincian.push({
        no: index + 1,
        namaRekanan: result.namaRekanan,
        keterangan: result.keterangan,
        noJc: index + 1,
        jenisCetakan: result.jenisCetakan,
        isi: result.isi,
        harga: `Rp. ${result.harga
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`,
      });
    });

    tableColumnsPerincianHeader.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow);
      row.forEach((cellValue, colIndex) => {
        const cell = excelRow.getCell(startCol + colIndex);
        cell.value = cellValue;
        cell.border = borderStyle;
      });
      worksheet.mergeCells(currentRow, startCol + 0, currentRow, startCol + 2);
      worksheet.mergeCells(currentRow, startCol + 3, currentRow, startCol + 6);
    });

    currentRow += 1;

    tableColumnsPerincian.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow);
      row.forEach((cellValue, colIndex) => {
        const cell = excelRow.getCell(startCol + colIndex);
        cell.value = cellValue;
        cell.border = borderStyle;
      });
    });

    currentRow += 1;

    tableRowPerincian.forEach((rowData, dataRowIndex) => {
      const excelTableRow = worksheet.getRow(currentRow + dataRowIndex);
      excelTableRow.getCell(startCol).value = dataRowIndex + 1 + ".";
      excelTableRow.getCell(startCol + 1).value = rowData.namaRekanan;
      excelTableRow.getCell(startCol + 2).value = rowData.keterangan;
      excelTableRow.getCell(startCol + 3).value = dataRowIndex + 1 + ".";
      excelTableRow.getCell(startCol + 4).value = rowData.jenisCetakan;
      excelTableRow.getCell(startCol + 5).value = rowData.isi;
      excelTableRow.getCell(startCol + 6).value = rowData.harga;
      for (let i = 0; i <= 6; i++) {
        excelTableRow.getCell(startCol + i).border = borderStyle;
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "laporan-perencanaan-produksi.xlsx");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
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
          <Typography style={{ fontSize: "3vw", color: "#0F607D" }}>
            History Perencanaan Produksi
          </Typography>
        </div>
        <div style={{ marginTop: "32px" }}>
          <TableContainer sx={{ overflowX: "auto" }} component={Paper}>
            <Table
              aria-label="simple table"
              sx={{ minWidth: 650, overflowX: "auto", tableLayout: "fixed" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "25px" }}>No.</TableCell>
                  <TableCell>ID Pesanan</TableCell>
                  <TableCell>Tanggal Pembuatan Data</TableCell>
                  <TableCell>Tanggal Terakhir Data Diubah</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataPerencanaanProduksi.map((data, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{index + 1 + "."}</TableCell>
                        <TableCell>{data.orderId}</TableCell>
                        <TableCell>
                          {dayjs(data.createdAt).format("MM/DD/YYYY hh:mm A")}
                        </TableCell>
                        <TableCell>
                          {dayjs(data.updatedAt).format("MM/DD/YYYY hh:mm A")}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              handleViewHistoryPerencanaanProduksi(data.id);
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
              width: isMobile ? "80vw" : "50vw",
              maxHeight: "80vh",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography style={{ fontSize: "2vw", color: "#0F607D" }}>
                History Perencanaan Produksi {dataView.id}
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                Perencanaan Produksi
              </Typography>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                    Pemesan: {dataPerencanaanProduksi[0].pemesan}
                  </Typography>
                </div>
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                    Tanggal Pengiriman:{" "}
                    {dayjs(dataPerencanaanProduksi[0].tanggalPengiriman).format(
                      "MM/DD/YYYY hh:mm A"
                    )}
                  </Typography>
                </div>
              </div>
              <Typography
                style={{ color: "#0F607D", fontSize: "1vw", marginTop: "8px" }}
              >
                Alamat Pengiriman Produk:{" "}
                {dataPerencanaanProduksi[0].alamatKirimBarang}
              </Typography>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                    Jenis Cetakan: {dataPerencanaanProduksi[0].jenisCetakan}
                  </Typography>
                </div>
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                    Ply: {dataPerencanaanProduksi[0].ply}
                  </Typography>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                    Ukuran: {dataPerencanaanProduksi[0].ukuran}
                  </Typography>
                </div>
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                    Seri: {dataPerencanaanProduksi[0].seri}
                  </Typography>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                    Kuantitas: {dataPerencanaanProduksi[0].kuantitas}
                  </Typography>
                </div>
                <div style={{ width: "50%" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "1vw" }}>
                    Nomorator: {dataPerencanaanProduksi[0].nomorator}
                  </Typography>
                </div>
              </div>
              <Typography
                style={{ color: "#0F607D", fontSize: "1vw", marginTop: "8px" }}
              >
                Isi per box: {dataPerencanaanProduksi[0].isiPerBox}
              </Typography>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: isMobile ? "12px" : "1vw",
                      color: "#0F607D",
                      marginRight: "8px",
                    }}
                  >
                    Contoh:
                  </Typography>
                  <FormControlLabel
                    sx={{
                      display: "block",
                    }}
                    control={
                      <Switch
                        disabled
                        value={dataPerencanaanProduksi[0].contoh}
                        name="loading"
                        color="primary"
                      />
                    }
                  />
                </div>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: isMobile ? "12px" : "1vw",
                      color: "#0F607D",
                      marginRight: "8px",
                    }}
                  >
                    Setting:
                  </Typography>
                  <FormControlLabel
                    sx={{
                      display: "block",
                    }}
                    control={
                      <Switch
                        disabled
                        value={dataPerencanaanProduksi[0].setting}
                        name="loading"
                        color="primary"
                      />
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  //   marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{
                    fontSize: isMobile ? "12px" : "1vw",
                    color: "#0F607D",
                    marginRight: "8px",
                  }}
                >
                  Plate:
                </Typography>
                <FormControlLabel
                  sx={{
                    display: "block",
                  }}
                  control={
                    <Switch
                      disabled
                      value={dataPerencanaanProduksi[0].plate}
                      name="loading"
                      color="primary"
                    />
                  }
                />
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                Bahan Baku & Bahan Pembantu
              </Typography>
              <div style={{ marginTop: "16px" }}>
                {dataView.estimasiBahanBakus.map((result, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableContainer
                        sx={{ overflowX: "auto", marginTop: "16px" }}
                        component={Paper}
                      >
                        <Table
                          aria-label="simple table"
                          sx={{
                            overflowX: "auto",
                            tableLayout: "fixed",
                            minWidth: 650,
                          }}
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ width: "50px" }}>
                                No.
                              </TableCell>
                              <TableCell
                                style={{ width: "200px" }}
                                align="left"
                              >
                                {result.jenis}
                              </TableCell>
                              <TableCell
                                style={{ width: "200px" }}
                                align="left"
                              >
                                {result.informasi}
                              </TableCell>
                              <TableCell
                                style={{ width: "200px" }}
                                align="left"
                              >
                                Warna
                              </TableCell>
                              <TableCell
                                style={{ width: "200px" }}
                                align="left"
                              >
                                Estimasi Kebutuhan
                              </TableCell>
                              <TableCell
                                style={{ width: "200px" }}
                                align="left"
                              >
                                Waste
                              </TableCell>
                              <TableCell
                                style={{ width: "200px" }}
                                align="left"
                              >
                                Jumlah Kebutuhan
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {result?.bahanBakuAkanDigunakans?.map(
                              (dataItem, dataItemIndex) => (
                                <React.Fragment
                                  key={`${index}-${dataItemIndex}`}
                                >
                                  {dataItem?.dataJenis?.map(
                                    (dataJenis, dataJenisIndex) => (
                                      <TableRow
                                        key={`${index}-${dataItemIndex}-${dataJenisIndex}`}
                                      >
                                        {dataJenisIndex === 0 ? (
                                          <TableCell>
                                            {dataItemIndex + 1}
                                          </TableCell>
                                        ) : (
                                          <TableCell></TableCell>
                                        )}
                                        <TableCell>
                                          {dataJenis?.namaJenis}
                                        </TableCell>
                                        <TableCell>
                                          {dataJenis.dataInformasi}
                                        </TableCell>
                                        <TableCell>{dataJenis.warna}</TableCell>
                                        <TableCell>
                                          {dataJenis.estimasiKebutuhan}
                                        </TableCell>
                                        <TableCell>{dataJenis.waste}</TableCell>
                                        <TableCell>
                                          {dataJenis.jumlahKebutuhan}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </React.Fragment>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                Jangka Waktu Produksi
              </Typography>
              <div style={{ marginTop: "16px" }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "200px" }}>Bagian</TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Jenis Pekerjaan{" "}
                        </TableCell>
                        <TableCell style={{ width: "300px" }} align="left">
                          Tanggal Mulai
                        </TableCell>
                        <TableCell style={{ width: "300px" }} align="left">
                          Tanggal Selesai
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Jumlah Hari
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataView.estimasiJadwalProdukses.map((row, index) => (
                        <React.Fragment key={index}>
                          {row.rencanaJadwalProdukses.map(
                            (pekerjaan, pekerjaanIndex) => (
                              <TableRow
                                key={`${index}-${pekerjaanIndex}`}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                {pekerjaanIndex === 0 ? (
                                  <TableCell>{row.bagian}</TableCell>
                                ) : (
                                  <TableCell></TableCell>
                                )}
                                <TableCell align="left">
                                  {pekerjaan.jenisPekerjaan}
                                </TableCell>
                                <TableCell align="left">
                                  {dayjs(pekerjaan.tanggalMulai).format(
                                    "MM/DD/YYYY hh:mm A"
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  {dayjs(pekerjaan.tanggalSelesai).format(
                                    "MM/DD/YYYY hh:mm A"
                                  )}
                                </TableCell>
                                <TableCell align="left">
                                  {pekerjaan.jumlahHari}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                Rincian Cetakan
              </Typography>
              <div style={{ marginTop: "16px" }}>
                <TableContainer sx={{ overflowX: "auto" }} component={Paper}>
                  <Table
                    aria-label="simple table"
                    sx={{ overflowX: "auto", tableLayout: "fixed" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "25px" }}>No.</TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Nama Cetakan
                        </TableCell>
                        <TableCell style={{ width: "200px" }}>Ukuran</TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Jenis Kertas
                        </TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Berat Kertas (Gram)
                        </TableCell>
                        <TableCell style={{ width: "200px" }}>Warna</TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Kuantitas
                        </TableCell>
                        <TableCell style={{ width: "100px" }}>Ply</TableCell>
                        <TableCell style={{ width: "200px" }}>Isi</TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Nomorator
                        </TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Keterangan
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataView.rincianCetakans.map((result, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>{index + 1 + "."}</TableCell>
                              <TableCell>{result.namaCetakan}</TableCell>
                              <TableCell>{result.ukuran}</TableCell>
                              <TableCell>{result.jenisKertas}</TableCell>
                              <TableCell>{result.beratKertas}</TableCell>
                              <TableCell>{result.warna}</TableCell>
                              <TableCell>{result.kuantitas}</TableCell>
                              <TableCell>{result.ply}</TableCell>
                              <TableCell>{result.isi}</TableCell>
                              <TableCell>{result.nomorator}</TableCell>
                              <TableCell>{result.keterangan}</TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                Perincian
              </Typography>
              <div>
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table
                    aria-label="simple table"
                    sx={{
                      minWidth: 650,
                      overflowX: "auto",
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell colSpan={3} style={{ width: "50%" }}>
                          <Typography style={{ fontSize: "16px" }}>
                            Perincian Rekanan
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={5} style={{ width: "50%" }}>
                          <Typography style={{ fontSize: "16px" }}>
                            Perincian Harga Cetak
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ width: "25px" }}>No.</TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Nama Rekanan
                        </TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Keterangan
                        </TableCell>
                        <TableCell style={{ width: "25px" }}>No.</TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Jenis Cetakan
                        </TableCell>
                        <TableCell style={{ width: "100px" }}>Isi</TableCell>
                        <TableCell style={{ width: "200px" }}>Harga</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataView.perincians.map((result, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>{index + 1 + "."}</TableCell>
                              <TableCell>{result.namaRekanan}</TableCell>
                              <TableCell>{result.keterangan}</TableCell>
                              <TableCell>{index + 1 + "."}</TableCell>
                              <TableCell>{result.jenisCetakan}</TableCell>
                              <TableCell>{result.isi}</TableCell>
                              <TableCell>{`Rp. ${result.harga
                                .toString()
                                .replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  "."
                                )},-`}</TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <div
              style={{
                margin: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleSaveAsPdf();
                }}
              >
                Simpan PDF
              </DefaultButton>
              <div style={{ marginLeft: "8px" }}>
                <DefaultButton
                  onClickFunction={() => {
                    handleSaveAsExcel();
                  }}
                >
                  Simpan Excel
                </DefaultButton>
              </div>
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
    </div>
  );
};

export default ProductionPlanningHistoryPage;
