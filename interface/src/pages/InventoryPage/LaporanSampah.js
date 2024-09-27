import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import logoPerusahaan from "../../assets/PT_Aridas_Karya_Satria_Logo.png";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import MySelectTextField from "../../components/SelectTextField";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { NumericFormat } from "react-number-format";
import { AppContext } from "../../App";
import DefaultButton from "../../components/Button";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import MyModal from "../../components/Modal";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const NumericFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="Rp."
    />
  );
});

const LaporanSampah = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();
  const { setSuccessMessage } = useAuth();
  const [dataLaporanSampah, setDataLaporanSampah] = useState({
    noOrderProduksi: "",
    tahapProduksi: "",
    laporanLimbahProduksiId: "",
    itemLaporanSampahs: [
      {
        tanggal: dayjs(""),
        pembeli: "",
        uraian: "",
        jumlah: { value: "", unit: "" },
        hargaSatuan: "",
        // { value: "", unit: "" },
        pembayaran: "",
        keterangan: "",
      },
    ],
  });

  const [allDataProduksiSelesai, setAllDataProduksiSelesai] = useState([]);
  const [allNoOrderProduksi, setAllNoOrderProduksi] = useState([]);
  const [allTahapProduksi, setAllTahapProduksi] = useState([]);
  const [selectedKegiatanProduksi, setSelectedKegiatanProduksi] = useState([]);
  const [allLaporanSampah, setAllLaporanSampah] = useState([]);

  const [dataLaporanSampahForEdit, setDataLaporanSampahForEdit] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [dataView, setDataView] = useState({});

  const [openModal, setOpenModal] = useState(false);

  const [refreshDataLaporanSampah, setRefreshDataLaporanSampah] =
    useState(true);

  const units = [
    {
      value: "Kg",
    },
    {
      value: "Ton",
    },
    {
      value: "Roll",
    },
    {
      value: "Kaleng",
    },
    {
      value: "Lembar",
    },
    {
      value: "Box",
    },
  ];

  useEffect(() => {
    if (refreshDataLaporanSampah) {
      console.log("Test");
      axios({
        method: "GET",
        url: "http://localhost:3000/production/getLaporanSampah",
      }).then((result) => {
        if (result.status === 200) {
          setAllLaporanSampah(result.data);
          setRefreshDataLaporanSampah(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data laporan sampah");
          setRefreshDataLaporanSampah(false);
        }
      });
    }
  }, [refreshDataLaporanSampah]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/production/getAllLaporanLimbahProduksi",
    }).then((result) => {
      if (result.status === 200) {
        if (result.status === 200) {
          const uniqueData = result.data.reduce((acc, item) => {
            if (
              !acc.some(
                (existingItem) =>
                  existingItem.noOrderProduksi === item.noOrderProduksi
              )
            ) {
              acc.push(item);
            }
            return acc;
          }, []);

          const tempNoOrderProduksiValue = uniqueData.map((item) => ({
            value: item.noOrderProduksi,
          }));

          setAllNoOrderProduksi(tempNoOrderProduksiValue);
          setAllDataProduksiSelesai(result.data);
        }
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data limbah hasil produksi"
        );
      }
    });
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleTambahItem = () => {
    setDataLaporanSampah((oldObject) => ({
      ...oldObject,
      itemLaporanSampahs: [
        ...oldObject.itemLaporanSampahs,
        {
          tanggal: dayjs(""),
          pembeli: "",
          uraian: "",
          jumlah: { value: "", unit: "" },
          hargaSatuan: "",
          //{ value: "", unit: "" },
          pembayaran: "",
          keterangan: "",
        },
      ],
    }));
  };

  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const handleDeleteItemLaporanSampah = (id, index) => {
    if (!id || id === undefined) {
      setDataLaporanSampah((oldObject) => ({
        ...oldObject,
        itemLaporanSampahs: oldObject?.itemLaporanSampahs?.filter(
          (_, j) => j !== index
        ),
      }));
    } else {
    }
  };

  const handleOpenModalForEditLaporanSampah = (
    noOrderProduksi,
    tahapProduksi
  ) => {
    const laporanForEdit = allLaporanSampah.filter((result) => {
      return (
        result.noOrderProduksi === noOrderProduksi &&
        result.tahapProduksi === tahapProduksi
      );
    });
    const modifyDataLaporanForEdit = {
      ...laporanForEdit[0],
      itemLaporanSampahs: laporanForEdit[0].itemLaporanSampahs.map((result) => {
        return {
          ...result,
          tanggal: dayjs(result.tanggal),
          jumlah: separateValueAndUnit(result.jumlah),
        };
      }),
    };
    setDataLaporanSampahForEdit(modifyDataLaporanForEdit);
    setOpenModal(true);
  };

  const handleChangeInputLaporanSampah = (event, field, index, unit) => {
    const value = event && event.target ? event.target.value : event;
    setDataLaporanSampah((oldObject) => {
      if (field === "noOrderProduksi") {
        const tempData = allDataProduksiSelesai
          .filter((result) => result.noOrderProduksi === value)
          .map((result) => {
            return {
              value: result.tahapProduksi,
            };
          });
        setAllTahapProduksi(tempData);
        if (oldObject.tahapProduksi !== "") {
          const tempSelectedKegiatanProduksi = allDataProduksiSelesai
            .filter(
              (result) =>
                result.noOrderProduksi === value &&
                result.tahapProduksi === oldObject.tahapProduksi
            )
            .map((result) => {
              return {
                ...result,
              };
            });
          oldObject.tahapProduksi = tempSelectedKegiatanProduksi;
        }
        return {
          ...oldObject,
          [field]: value,
        };
      } else if (field === "tahapProduksi") {
        const tempData = allDataProduksiSelesai
          .filter(
            (result) =>
              result.noOrderProduksi === oldObject.noOrderProduksi &&
              result.tahapProduksi === value
          )
          .map((result) => {
            return {
              ...result,
            };
          });
        setSelectedKegiatanProduksi(tempData);
        return {
          ...oldObject,
          [field]: value,
          laporanLimbahProduksiId: tempData[0].id,
        };
      } else {
        const updatedItems = oldObject.itemLaporanSampahs.map((item, i) => {
          if (i === index) {
            let updatedItem = { ...item };
            if (unit) {
              return {
                ...updatedItem,
                [field]: {
                  value: item[field]?.value || "",
                  unit: value,
                },
              };
            } else {
              if (field === "jumlah") {
                return {
                  ...updatedItem,
                  [field]: {
                    ...updatedItem[field],
                    value: value,
                  },
                };
              } else {
                updatedItem = { ...updatedItem, [field]: value };
              }
            }
            return updatedItem;
          }
          return item;
        });
        return { ...oldObject, itemLaporanSampahs: updatedItems };
      }
    });
  };

  const handleCheckIfLaporanSampahComplete = () => {
    if (
      !dataLaporanSampah.noOrderProduksi ||
      !dataLaporanSampah.tahapProduksi
    ) {
      return false;
    }
    for (const item of dataLaporanSampah.itemLaporanSampahs) {
      if (
        !item.hargaSatuan ||
        !item.keterangan ||
        !item.pembayaran ||
        !item.pembeli ||
        !item.tanggal ||
        !dayjs(item.tanggal, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.uraian ||
        !item.jumlah.value ||
        !item.jumlah.unit
      ) {
        return false;
      }
    }

    return true;
  };

  const handleModifyDataLaporanSampahForSubmission = () => {
    const changedDataLaporanSampah = {
      ...dataLaporanSampah,
      itemLaporanSampahs: dataLaporanSampah.itemLaporanSampahs.map((result) => {
        return {
          ...result,
          jumlah: `${result.jumlah.value} ${result.jumlah.unit}`,
        };
      }),
    };
    return changedDataLaporanSampah;
  };

  const handleAddLaporanSampah = () => {
    const checkIfDataLaporanComplete = handleCheckIfLaporanSampahComplete();
    if (checkIfDataLaporanComplete === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Lengkapi semua input");
    } else {
      const modifiedDataLaporanSampah =
        handleModifyDataLaporanSampahForSubmission();
      axios({
        method: "POST",
        url: `http://localhost:3000/production/addLaporanSampah/${userInformation?.data?.id}`,
        data: { dataLaporanSampah: modifiedDataLaporanSampah },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan laporan sampah");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menambahkan data laporan sampah");
        }
      });
    }
  };

  const handleDeleteLaporanSampah = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/production/deleteLaporanSampah/${id}`,
      params: { userId: userInformation?.data?.id },
    }).then((result) => {
      if (result.status === 200) {
        setRefreshDataLaporanSampah(true);
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus data laporan sampah");
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus data laporan sampah");
      }
    });
  };
  const handleDeleteItemLaporanSampahFromDB = (id, iDLaporanSampah) => {
    setRefreshDataLaporanSampah(false);
    axios({
      method: "DELETE",
      url: `http://localhost:3000/production/deleteItemLaporanSampah/${id}`,
      params: {
        userId: userInformation?.data?.id,
        iDLaporanSampah: iDLaporanSampah,
      },
    }).then((result) => {
      if (result.status === 200) {
        setRefreshDataLaporanSampah(true);
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus data item laporan sampah");
        handleCloseModal();
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus data item laporan sampah");
      }
    });
  };
  const handleTambahItemLaporanSampah = () => {
    const newItem = {
      tanggal: dayjs(""),
      pembeli: "",
      uraian: "",
      jumlah: { value: "", unit: "" },
      hargaSatuan: "",
      pembayaran: "",
      keterangan: "",
    };

    setDataLaporanSampahForEdit((oldArray) => {
      return {
        ...oldArray,
        itemLaporanSampahs: [...oldArray.itemLaporanSampahs, newItem],
      };
    });
  };

  const handleChangeInputEditLaporanSampah = (event, field, index, unit) => {
    const value = event && event.target ? event.target.value : event;
    setDataLaporanSampahForEdit((oldObject) => {
      const updatedItems = oldObject.itemLaporanSampahs.map((item, i) => {
        if (i === index) {
          let updatedItem = { ...item };
          if (unit) {
            return {
              ...updatedItem,
              [field]: {
                value: item[field]?.value || "",
                unit: value,
              },
            };
          } else {
            if (field === "jumlah") {
              return {
                ...updatedItem,
                [field]: {
                  ...updatedItem[field],
                  value: value,
                },
              };
            } else {
              updatedItem = { ...updatedItem, [field]: value };
            }
          }
          return updatedItem;
        }
        return item;
      });
      return { ...oldObject, itemLaporanSampahs: updatedItems };
    });
  };

  const handleCheckIfLaporanSampahForEditComplete = () => {
    if (
      !dataLaporanSampahForEdit.noOrderProduksi ||
      !dataLaporanSampahForEdit.tahapProduksi
    ) {
      return false;
    }
    for (const item of dataLaporanSampahForEdit.itemLaporanSampahs) {
      if (
        !item.hargaSatuan ||
        !item.keterangan ||
        !item.pembayaran ||
        !item.pembeli ||
        !item.tanggal ||
        !dayjs(item.tanggal, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.uraian ||
        !item.jumlah.value ||
        !item.jumlah.unit
      ) {
        return false;
      }
    }
    return true;
  };

  const handleModifyDataLaporanSampahForEdit = () => {
    const changedDataLaporanSampahForEdit = {
      ...dataLaporanSampahForEdit,
      itemLaporanSampahs: dataLaporanSampahForEdit.itemLaporanSampahs.map(
        (result) => {
          return {
            ...result,
            jumlah: `${result.jumlah.value} ${result.jumlah.unit}`,
          };
        }
      ),
    };
    return changedDataLaporanSampahForEdit;
  };

  const handleEditLaporanSampah = () => {
    const checkLaporanForEditIsComplete =
      handleCheckIfLaporanSampahForEditComplete();
    if (checkLaporanForEditIsComplete === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Lengkapi semua input");
    } else {
      const tempDataLaporanSampah = handleModifyDataLaporanSampahForEdit();
      axios({
        method: "PUT",
        url: `http://localhost:3000/production/updateLaporanSampah/${userInformation?.data?.id}`,
        data: { dataLaporanSampah: tempDataLaporanSampah },
      }).then((result) => {
        if (result.status === 200) {
          handleCloseModal();
          setRefreshDataLaporanSampah(true);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("Berhasil mengedit laporan sampah");
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil mengedit laporan sampah");
        }
      });
    }
  };

  const handleSaveAsExcel = async (id) => {
    const dataView = allLaporanSampah.find((item) => item.id === id);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const startRow = 3;
    const startCol = 2;

    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    worksheet.mergeCells("B2:I2");
    const titleCell = worksheet.getCell("B2");
    titleCell.value = `LAPORAN SAMPAH (${dataView.tahapProduksi})`;
    titleCell.border = {
      top: borderStyle.top,
      bottom: borderStyle.bottom,
      left: borderStyle.left,
      right: borderStyle.right,
    };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.font = { bold: true };

    let currentRow = startRow;

    const dataInformasiSampah = [
      [`No Order: ${dataView.noOrderProduksi}`, "", "", "", "", "", "", ""],
      [`Tanggal: ${dataView.createdAt}`, "", "", "", "", "", "", ""],
      [`PIC: ${userInformation?.data?.name}`, "", "", "", "", "", "", ""],
    ];

    dataInformasiSampah.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow + rowIndex);
      row.forEach((cellValue, colIndex) => {
        excelRow.getCell(startCol + colIndex).value = cellValue;
      });
    });

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

    for (let rowIndex = 3; rowIndex < 7; rowIndex++) {
      const isFirstRow = rowIndex === 3;
      const isLastRow = rowIndex === 7;
      applyBorderToRange(rowIndex, 2, 9, isFirstRow, isLastRow);
    }

    currentRow += dataInformasiSampah.length;

    let tableColumns = [
      [
        "No.",
        "Tanggal",
        "Pembeli",
        "Uraian",
        "Jumlah",
        "Harga Satuan",
        "Pembayaran",
        "Keterangan",
      ],
    ];

    const tableRow = [];

    dataView.itemLaporanSampahs.forEach((row, index) => {
      tableRow.push({
        no: index + 1 + ".",
        tanggal: dayjs(row.createdAt).format("MM/DD/YYYY hh:mm A"),
        pembeli: row.pembeli,
        uraian: row.uraian,
        jumlah: row.jumlah,
        hargaSatuan: `Rp. ${row.hargaSatuan
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`,
        pembayaran: `Rp. ${row.pembayaran
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`,
        keterangan: row.keterangan,
      });
    });

    tableColumns.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(currentRow);
      row.forEach((cellValue, colIndex) => {
        excelRow.getCell(startCol + colIndex).value = cellValue;
      });
      for (let i = 0; i <= 7; i++) {
        excelRow.getCell(startCol + i).border = borderStyle;
      }
    });

    currentRow += 1;

    tableRow.forEach((rowData, dataRowIndex) => {
      const excelTableRow = worksheet.getRow(currentRow + dataRowIndex);
      excelTableRow.getCell(startCol).value = rowData.no;
      excelTableRow.getCell(startCol + 1).value = rowData.tanggal;
      excelTableRow.getCell(startCol + 2).value = rowData.pembeli;
      excelTableRow.getCell(startCol + 3).value = rowData.uraian;
      excelTableRow.getCell(startCol + 4).value = rowData.jumlah;
      excelTableRow.getCell(startCol + 5).value = rowData.hargaSatuan;
      excelTableRow.getCell(startCol + 6).value = rowData.pembayaran;
      excelTableRow.getCell(startCol + 7).value = rowData.keterangan;
      for (let i = 0; i <= 7; i++) {
        excelTableRow.getCell(startCol + i).border = borderStyle;
      }
    });

    currentRow += tableRow.length;

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Laporan-Sampah_${dataView.id}.xlsx`);
  };

  const handleSaveAsPDF = (id) => {
    const dataView = allLaporanSampah.find((item) => item.id === id);
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

    pdf.text(`Laporan Sampah (${dataView.tahapProduksi})`, margin, y);
    y += 15;
    pdf.setFontSize(12);

    pdf.text(`No Order: ${dataView.noOrderProduksi}`, margin, y);
    y += 10;
    pdf.text(
      `Tanggal Pembuatan Laporan: ${dayjs().format("MM/DD/YYYY hh:mm A")}`,
      margin,
      y
    );
    y += 10;
    pdf.text(`PIC: ${userInformation?.data?.name}`, margin, y);
    y += 15;

    if (y + 50 > pageHeight) {
      addNewPage();
    }

    const tableHeaderColumns = [
      "No.",
      "Tanggal",
      "Pembeli",
      "Uraian",
      "Jumlah",
      "Harga Satuan",
      "Pembayaran",
      "Keterangan",
    ];

    const tableRow = [];

    dataView.itemLaporanSampahs.forEach((row, index) => {
      tableRow.push({
        no: index + 1 + ".",
        tanggal: dayjs(row.createdAt).format("MM/DD/YYYY hh:mm A"),
        pembeli: row.pembeli,
        uraian: row.uraian,
        jumlah: row.jumlah,
        hargaSatuan: `Rp. ${row.hargaSatuan
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`,
        pembayaran: `Rp. ${row.pembayaran
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`,
        keterangan: row.keterangan,
      });
    });

    pdf.autoTable({
      startY: y,
      head: [tableHeaderColumns],
      body: tableRow.map((row) => {
        return [
          row.no,
          row.tanggal,
          row.pembeli,
          row.uraian,
          row.jumlah,
          row.hargaSatuan,
          row.pembayaran,
          row.keterangan,
        ];
      }),
      theme: "striped",
      margin: { left: margin, right: margin },
    });

    pdf.save(`Laporan-Sampah${dataView.id}.pdf`);
  };

  return (
    <div
      className="hideScrollbar"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
        overflow: "auto",
      }}
    >
      <div style={{ width: "100%", height: "100vh" }}>
        <div style={{ margin: "32px" }}>
          <Typography
            style={{ color: "#0F607D", fontSize: isMobile ? "24px" : "3vw" }}
          >
            Laporan Sampah
          </Typography>
        </div>
        {userInformation?.data?.role === "Admin" && (
          <div style={{ margin: "32px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography style={{ width: "150px" }}>
                No Order Produksi:
              </Typography>
              <MySelectTextField
                data={allNoOrderProduksi}
                value={dataLaporanSampah.noOrderProduksi}
                onChange={(event) => {
                  handleChangeInputLaporanSampah(event, "noOrderProduksi");
                }}
                width="150px"
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <Typography style={{ width: "150px" }}>
                Tahap Produksi:
              </Typography>
              <MySelectTextField
                data={allTahapProduksi}
                value={dataLaporanSampah.tahapProduksi}
                onChange={(event) => {
                  handleChangeInputLaporanSampah(event, "tahapProduksi");
                }}
                width="150px"
              />
            </div>
          </div>
        )}
        <div style={{ margin: "32px" }}>
          {selectedKegiatanProduksi.length !== 0 && (
            <div>
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "18px" : "2vw",
                }}
              >
                Data Item Limbah Hasil Produksi
              </Typography>
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table
                  sx={{
                    minWidth: 650,
                    tableLayout: "fixed",
                    overflowX: "auto",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "25px" }}>No.</TableCell>
                      <TableCell>No Order Produksi</TableCell>
                      <TableCell>Nama Barang</TableCell>
                      <TableCell>Jumlah Barang</TableCell>
                      <TableCell>Keterangan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedKegiatanProduksi[0].itemLaporanLimbahProdukses?.map(
                      (result, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>{index + 1 + "."}</TableCell>
                              <TableCell>{result.noOrderProduksiId}</TableCell>
                              <TableCell>{result.namaBarang}</TableCell>
                              <TableCell>{result.jumlahBarang}</TableCell>
                              <TableCell>{result.keterangan}</TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
        {userInformation?.data?.role === "Admin" && (
          <div style={{ margin: "32px" }}>
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleTambahItem();
                }}
              >
                Tambah Item
              </DefaultButton>
            </div>
            <TableContainer component={Paper} style={{ overflowX: "auto" }}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                style={{ tableLayout: "fixed", overflowX: "auto" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell style={{ width: "300px" }}>Tanggal</TableCell>
                    <TableCell style={{ width: "200px" }}>Pembeli</TableCell>
                    <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                    <TableCell style={{ width: "200px" }}>Jumlah</TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Harga Satuan
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>Pembayaran</TableCell>
                    <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                    <TableCell style={{ width: "50px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataLaporanSampah?.itemLaporanSampahs?.map(
                    (result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      value={
                                        result.tanggal.isValid()
                                          ? result.tanggal
                                          : null
                                      }
                                      onChange={(event) => {
                                        handleChangeInputLaporanSampah(
                                          event,
                                          "tanggal",
                                          index
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          error={params.error || !params.value}
                                          helperText={
                                            params.error
                                              ? "Invalid date format"
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                  </DemoItem>
                                </DemoContainer>
                              </LocalizationProvider>
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.pembeli}
                                onChange={(event) => {
                                  handleChangeInputLaporanSampah(
                                    event,
                                    "pembeli",
                                    index
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.uraian}
                                onChange={(event) => {
                                  handleChangeInputLaporanSampah(
                                    event,
                                    "uraian",
                                    index
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  type="number"
                                  value={result.jumlah.value}
                                  onChange={(event) => {
                                    handleChangeInputLaporanSampah(
                                      event,
                                      "jumlah",
                                      index
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.jumlah.unit}
                                    height={"55px"}
                                    width={isMobile ? "75px" : "100px"}
                                    onChange={(event) => {
                                      handleChangeInputLaporanSampah(
                                        event,
                                        "jumlah",
                                        index,
                                        true
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="text"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: isMobile ? "50px" : "4vw",
                                    width: isMobile ? "200px" : "200px",
                                    fontSize: isMobile ? "10px" : "1.5vw",
                                    borderRadius: "10px",
                                    "& fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                  },
                                }}
                                InputProps={{
                                  inputComponent: NumericFormatCustom,
                                }}
                                value={result.hargaSatuan}
                                onChange={(event) => {
                                  handleChangeInputLaporanSampah(
                                    event,
                                    "hargaSatuan",
                                    index
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="text"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: isMobile ? "50px" : "4vw",
                                    width: isMobile ? "200px" : "200px",
                                    fontSize: isMobile ? "10px" : "1.5vw",
                                    borderRadius: "10px",
                                    "& fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                  },
                                }}
                                InputProps={{
                                  inputComponent: NumericFormatCustom,
                                }}
                                value={result.pembayaran}
                                onChange={(event) => {
                                  handleChangeInputLaporanSampah(
                                    event,
                                    "pembayaran",
                                    index
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.keterangan}
                                onChange={(event) => {
                                  handleChangeInputLaporanSampah(
                                    event,
                                    "keterangan",
                                    index
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleDeleteItemLaporanSampah(
                                    result?.id,
                                    index
                                  );
                                }}
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                padding: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleAddLaporanSampah();
                }}
              >
                Tambah Laporan Sampah
              </DefaultButton>
              <Button
                variant="outlined"
                color="error"
                style={{ textTransform: "none", marginLeft: "8px" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        <div
          style={{
            width: isMobile ? "100%" : "60%",
            padding: "0px 0px 32px 0px",
          }}
        >
          <div style={{ margin: "32px" }}>
            <Typography
              style={{
                fontSize: isMobile ? "20px" : "2vw",
                color: "#0F607D",
              }}
            >
              Data-data laporan sampah
            </Typography>
            {allLaporanSampah.length !== 0 ? (
              <TableContainer sx={{}} component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "25px" }}>No.</TableCell>
                      <TableCell style={{ width: "50px" }}>
                        No Order Produksi
                      </TableCell>
                      <TableCell style={{ width: "50px" }}>
                        Tahap Produksi
                      </TableCell>
                      {userInformation?.data?.role === "Admin" && (
                        <TableCell style={{ width: "20px" }}>Actions</TableCell>
                      )}
                      <TableCell style={{ width: "20px" }}>Download</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allLaporanSampah?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>{result.noOrderProduksi}</TableCell>
                            <TableCell>{result.tahapProduksi}</TableCell>
                            {userInformation?.data?.role === "Admin" && (
                              <TableCell>
                                <IconButton
                                  onClick={() => {
                                    handleOpenModalForEditLaporanSampah(
                                      result.noOrderProduksi,
                                      result.tahapProduksi
                                    );
                                  }}
                                >
                                  <EditIcon style={{ color: "#0F607D" }} />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    handleDeleteLaporanSampah(result.id);
                                  }}
                                >
                                  <DeleteIcon style={{ color: "red" }} />
                                </IconButton>
                              </TableCell>
                            )}
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleSaveAsPDF(result.id);
                                }}
                              >
                                <PictureAsPdfIcon sx={{ color: "#0F607D" }} />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  handleSaveAsExcel(result.id);
                                }}
                              >
                                <TextSnippetIcon sx={{ color: "#0F607D" }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>Belum ada data laporan sampah</Typography>
            )}
          </div>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                Edit Laporan Sampah
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  handleTambahItemLaporanSampah();
                }}
              >
                Tambah Item
              </DefaultButton>
            </div>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table
                aria-label="simple table"
                sx={{ minWidth: 650, tableLayout: "fixed", overflowX: "auto" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell style={{ width: "300px" }}>Tanggal</TableCell>
                    <TableCell style={{ width: "200px" }}>Pembeli</TableCell>
                    <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                    <TableCell style={{ width: "200px" }}>Jumlah</TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Harga Satuan
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>Pembayaran</TableCell>
                    <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                    <TableCell style={{ width: "50px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataLaporanSampahForEdit.itemLaporanSampahs.map(
                    (result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      value={
                                        result.tanggal.isValid()
                                          ? result.tanggal
                                          : null
                                      }
                                      onChange={(event) => {
                                        handleChangeInputEditLaporanSampah(
                                          event,
                                          "tanggal",
                                          index
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          error={params.error || !params.value}
                                          helperText={
                                            params.error
                                              ? "Invalid date format"
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                  </DemoItem>
                                </DemoContainer>
                              </LocalizationProvider>
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.pembeli}
                                onChange={(event) => {
                                  handleChangeInputEditLaporanSampah(
                                    event,
                                    "pembeli",
                                    index
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.uraian}
                                onChange={(event) => {
                                  handleChangeInputEditLaporanSampah(
                                    event,
                                    "uraian",
                                    index
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  type="number"
                                  value={result.jumlah.value}
                                  onChange={(event) => {
                                    handleChangeInputEditLaporanSampah(
                                      event,
                                      "jumlah",
                                      index
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    width={isMobile ? "75px" : "100px"}
                                    height={"55px"}
                                    value={result.jumlah.unit}
                                    onChange={(event) => {
                                      handleChangeInputEditLaporanSampah(
                                        event,
                                        "jumlah",
                                        index,
                                        true
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.hargaSatuan}
                                onChange={(event) => {
                                  handleChangeInputEditLaporanSampah(
                                    event,
                                    "hargaSatuan",
                                    index
                                  );
                                }}
                                type="text"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: isMobile ? "50px" : "4vw",
                                    width: isMobile ? "200px" : "200px",
                                    fontSize: isMobile ? "10px" : "1.5vw",
                                    borderRadius: "10px",
                                    "& fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                  },
                                }}
                                InputProps={{
                                  inputComponent: NumericFormatCustom,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.pembayaran}
                                onChange={(event) => {
                                  handleChangeInputEditLaporanSampah(
                                    event,
                                    "pembayaran",
                                    index
                                  );
                                }}
                                type="text"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    height: isMobile ? "50px" : "4vw",
                                    width: isMobile ? "200px" : "200px",
                                    fontSize: isMobile ? "10px" : "1.5vw",
                                    borderRadius: "10px",
                                    "& fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                    "&:hover fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: "#0F607D",
                                    },
                                  },
                                }}
                                InputProps={{
                                  inputComponent: NumericFormatCustom,
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.keterangan}
                                onChange={(event) => {
                                  handleChangeInputEditLaporanSampah(
                                    event,
                                    "keterangan",
                                    index
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleDeleteItemLaporanSampahFromDB(
                                    result.id,
                                    dataLaporanSampahForEdit.id
                                  );
                                }}
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleEditLaporanSampah();
                }}
              >
                Edit Laporan Sampah
              </DefaultButton>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  handleCloseModal();
                }}
                style={{ textTransform: "none", marginLeft: "8px" }}
              >
                Cancel
              </Button>
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

export default LaporanSampah;
