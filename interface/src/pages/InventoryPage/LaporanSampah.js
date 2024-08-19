import React, { useContext, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import {
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
import DeleteIcon from "@mui/icons-material/Delete";
import { NumericFormat } from "react-number-format";
import { AppContext } from "../../App";
import DefaultButton from "../../components/Button";

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

const LaporanSampah = () => {
  const { isMobile } = useContext(AppContext);
  const [dataLaporanSampah, setDataLaporanSampah] = useState({
    noOrderProduksi: "",
    tahapProduksi: "",
    itemLaporanSampah: [
      {
        tanggal: dayjs(""),
        pembeli: "",
        uraian: "",
        jumlah: { value: "", unit: "" },
        hargaSatuan: { value: "", unit: "" },
        pembayaran: "",
        keterangan: "",
      },
    ],
  });

  const handleTambahItem = () => {
    setDataLaporanSampah((oldObject) => ({
      ...oldObject,
      itemLaporanSampah: [
        ...oldObject.itemLaporanSampah,
        {
          tanggal: dayjs(""),
          pembeli: "",
          uraian: "",
          jumlah: { value: "", unit: "" },
          hargaSatuan: { value: "", unit: "" },
          pembayaran: "",
          keterangan: "",
        },
      ],
    }));
  };

  const handleDeleteItemLaporanSampah = (id, index) => {
    if (!id || id === undefined) {
      setDataLaporanSampah((oldObject) => ({
        ...oldObject,
        itemLaporanSampah: oldObject?.itemLaporanSampah?.filter(
          (_, j) => j !== index
        ),
      }));
    } else {
    }
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
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Laporan Sampah
          </Typography>
        </div>
        <div style={{ margin: "32px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography style={{ width: "150px" }}>
              No Order Produksi:
            </Typography>
            <MySelectTextField width="150px" />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "16px" }}
          >
            <Typography style={{ width: "150px" }}>Tahap Produksi:</Typography>
            <MySelectTextField width="150px" />
          </div>
        </div>
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
                  <TableCell style={{ width: "200px" }}>Harga Satuan</TableCell>
                  <TableCell style={{ width: "200px" }}>Pembayaran</TableCell>
                  <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                  <TableCell style={{ width: "50px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLaporanSampah?.itemLaporanSampah?.map((result, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{index + 1 + "."}</TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                              <DemoItem>
                                <DateTimePicker />
                              </DemoItem>
                            </DemoContainer>
                          </LocalizationProvider>
                        </TableCell>
                        <TableCell>
                          <TextField />
                        </TableCell>
                        <TableCell>
                          <TextField />
                        </TableCell>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField type="number" />
                            <div style={{ marginLeft: "8px" }}>
                              <MySelectTextField />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                width: isMobile ? "120px" : "200px",
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
                            InputProps={{ inputComponent: NumericFormatCustom }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                width: isMobile ? "120px" : "200px",
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
                            InputProps={{ inputComponent: NumericFormatCustom }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              handleDeleteItemLaporanSampah(result?.id, index);
                            }}
                          >
                            <DeleteIcon style={{ color: "red" }} />
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
    </div>
  );
};

export default LaporanSampah;
