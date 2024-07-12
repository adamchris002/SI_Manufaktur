import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { AppContext } from "../../App";
import {
  Button,
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
import DefaultButton from "../../components/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MySelectTextField from "../../components/SelectTextField";
import axios from "axios";
import dayjs from "dayjs";
import MySnackbar from "../../components/Snackbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";

const StokOpnam = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate()
  const [dataStokOpnam, setDataStokOpnam] = useState([
    {
      suratPesanan: "",
      tanggalMasuk: dayjs(""),
      tanggalPengembalian: dayjs(""),
      jenisBarang: "",
      kodeBarang: "",
      lokasiPenyimpanan: "",
      stokOpnamAwal: "",
      stokOpnamAkhir: "",
      tanggalKeluar: dayjs(""),
      jumlahPengambilan: "",
      diambilOleh: "",
      untukPekerjaan: "",
      stokFisik: "",
      stokSelisih: "",
      keterangan: "",
    },
  ]);
  console.log(dataStokOpnam);
  const [allPermohonanPembelianId, setAllPermohonanPembelianId] = useState([]);
  const [refreshPermohonanPembelian, setRefreshPermohonanPembelian] =
    useState(true);

    const {setSuccessMessage} = useAuth()
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("false");

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

  const lokasi = [
    { value: "Jakarta" },
    { value: "Semarang" },
    { value: "Purwokerto" },
  ];

  useEffect(() => {
    if (refreshPermohonanPembelian) {
      axios({
        method: "GET",
        url: "http://localhost:3000/inventory/getAllPermohonanPembelian",
      }).then((result) => {
        if (result.status === 200) {
          const newPermohonanPembelianIds = result.data.map((data) => ({
            value: data.id,
          }));
          setAllPermohonanPembelianId(newPermohonanPembelianIds);
          setRefreshPermohonanPembelian(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak dapat memanggil data permohonan pembelian");
        }
      });
    }
  }, [refreshPermohonanPembelian]);

  const handleChangeInputStokOpnam = (event, index, field, unit) => {
    const value = event && event.target ? event.target.value : event;

    setDataStokOpnam((oldArray) => {
      const newArrayData = oldArray.map((item, i) => {
        if (i === index) {
          if (unit) {
            return {
              ...item,
              [field]: {
                value: item[field],
                unit: value,
              },
            };
          } else {
            return {
              ...item,
              [field]: value,
            };
          }
        }
        return item;
      });
      return newArrayData;
    });
  };

  const checkStokOpnamIsEmpty = () => {
    for (const item of dataStokOpnam) {
      if (
        item.suratPesanan === "" ||
        item.tanggalMasuk === "" ||
        !dayjs(item.tanggalMasuk, "MM/DD/YYYY hh:mm A", true).isValid() ||
        item.tanggalPengembalian === "" ||
        !dayjs(
          item.tanggalPengembalian,
          "MM/DD/YYYY hh:mm A",
          true
        ).isValid() ||
        item.jenisBarang === "" ||
        item.kodeBarang === "" ||
        item.lokasiPenyimpanan === "" ||
        item.stokOpnamAwal.value === "" ||
        item.stokOpnamAwal.unit === "" ||
        item.stokOpnamAkhir.value === "" ||
        item.stokOpnamAkhir.unit === "" ||
        item.tanggalKeluar === "" ||
        !dayjs(item.tanggalKeluar, "MM/DD/YYYY hh:mm A", true).isValid() ||
        item.jumlahPengambilan.value === "" ||
        item.jumlahPengambilan.unit === "" ||
        item.diambilOleh === "" ||
        item.untukPekerjaan === "" ||
        item.stokFisik === "" ||
        item.stokSelisih === ""
      ) {
        return false;
      }
      return true;
    }
  };

  const transformStokOpnamData = () => {
    return dataStokOpnam.map((item) => {
      return {
        ...item,
        stokOpnamAwal: `${item.stokOpnamAwal.value} ${item.stokOpnamAwal.unit}`,
        stokOpnamAkhir: `${item.stokOpnamAkhir.value} ${item.stokOpnamAkhir.unit}`,
        jumlahPengambilan: `${item.jumlahPengambilan.value} ${item.jumlahPengambilan.unit}`,
      };
    });
  };

  const handleAddStokOpnam = () => {
    const checkIfEmpty = checkStokOpnamIsEmpty();
    console.log(checkIfEmpty);
    if (checkIfEmpty === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input");
    } else {
      const transformedData = transformStokOpnamData();
      axios({
        method: "POST",
        url: `http://localhost:3000/inventory/addStokOpnam/${userInformation?.data?.id}`,
        data: { dataStokOpnam: transformedData },
      }).then((result) => {
        if (result.status === 200) {
          setSnackbarStatus(true);
          setSuccessMessage("Berhasil menambah stok opnam");
          navigate(-1)
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("Tidak berhasil menambah stok opnam");
        }
      });
    }
  };

  const handleAddRow = () => {
    setDataStokOpnam((oldArray) => [
      ...oldArray,
      {
        suratPesanan: "",
        tanggalMasuk: dayjs(""),
        tanggalPengembalian: dayjs(""),
        jenisBarang: "",
        kodeBarang: "",
        lokasiPenyimpanan: "",
        stokOpnamAwal: "",
        stokOpnamAkhir: "",
        tanggalKeluar: dayjs(""),
        jumlahPengambilan: "",
        diambilOleh: "",
        untukPekerjaan: "",
        stokFisik: "",
        stokSelisih: "",
        keterangan: "",
      },
    ]);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
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
      <div style={{ height: "100%", width: "100%" }}>
        <div
          style={{
            display: isMobile ? "" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "32px",
          }}
        >
          <Typography
            style={{ fontSize: isMobile ? "" : "3vw", color: "#0F607D" }}
          >
            Tambah Stok Opnam
          </Typography>
          <DefaultButton
            onClickFunction={() => {
              handleAddRow();
            }}
          >
            Tambah Item
          </DefaultButton>
        </div>
        <div style={{ width: "100%" }}>
          <div style={{ margin: "32px" }}>
            <TableContainer component={Paper} style={{ overflowX: "auto" }}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                style={{ tableLayout: "fixed", overflowX: "auto" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 50 }}>No.</TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Surat Pesanan
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Tanggal Masuk
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Tanggal Pengembalian
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Jenis Barang
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Kode Barang
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Lokasi Penyimpanan
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Stok Opnam Awal
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Stok Opnam Akhir
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Tanggal Keluar
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Jumlah Pengambilan
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Diambil Oleh
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Untuk Pekerjaan
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Stok Fisik
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Stok Selisih
                    </TableCell>
                    <TableCell align="left" style={{ width: "200px" }}>
                      Keterangan
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataStokOpnam.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <MySelectTextField
                              width={"200px"}
                              data={allPermohonanPembelianId}
                              value={result.suratPesanan}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "suratPesanan"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoItem>
                                <DateTimePicker
                                  disablePast
                                  value={dayjs(result.tanggalMasuk)}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      event,
                                      index,
                                      "tanggalMasuk"
                                    );
                                  }}
                                />
                              </DemoItem>
                            </LocalizationProvider>
                          </TableCell>
                          <TableCell>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoItem>
                                <DateTimePicker
                                  disablePast
                                  value={dayjs(result.tanggalPengembalian)}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      event,
                                      index,
                                      "tanggalPengembalian"
                                    );
                                  }}
                                />
                              </DemoItem>
                            </LocalizationProvider>
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.jenisBarang}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "jenisBarang"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.kodeBarang}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "kodeBarang"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <MySelectTextField
                              width="200px"
                              data={lokasi}
                              value={result.lokasi}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "lokasiPenyimpanan"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "130px" }}
                                type="number"
                                value={result.stokOpnamAwal?.value}
                                onChange={(event) => {
                                  handleChangeInputStokOpnam(
                                    event,
                                    index,
                                    "stokOpnamAwal"
                                  );
                                }}
                              />
                              <MySelectTextField
                                width={"60px"}
                                data={units}
                                value={result.stokOpnamAwal?.unit}
                                onChange={(event) => {
                                  handleChangeInputStokOpnam(
                                    event,
                                    index,
                                    "stokOpnamAwal",
                                    true
                                  );
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "130px" }}
                                type="number"
                                value={result.stokOpnamAkhir?.value}
                                onChange={(event) => {
                                  handleChangeInputStokOpnam(
                                    event,
                                    index,
                                    "stokOpnamAkhir"
                                  );
                                }}
                              />
                              <MySelectTextField
                                width={"60px"}
                                data={units}
                                value={result.stokOpnamAkhir?.unit}
                                onChange={(event) => {
                                  handleChangeInputStokOpnam(
                                    event,
                                    index,
                                    "stokOpnamAkhir",
                                    true
                                  );
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoItem>
                                <DateTimePicker
                                  disablePast
                                  value={result.tanggalKeluar}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      event,
                                      index,
                                      "tanggalKeluar"
                                    );
                                  }}
                                />
                              </DemoItem>
                            </LocalizationProvider>
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                sx={{ width: "130px" }}
                                type="number"
                                value={result.jumlahPengambilan?.value}
                                onChange={(event) => {
                                  handleChangeInputStokOpnam(
                                    event,
                                    index,
                                    "jumlahPengambilan"
                                  );
                                }}
                              />
                              <MySelectTextField
                                width={"60px"}
                                data={units}
                                value={result.jumlahPengambilan?.unit}
                                onChange={(event) => {
                                  handleChangeInputStokOpnam(
                                    event,
                                    index,
                                    "jumlahPengambilan",
                                    true
                                  );
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.diambilOleh}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "diambilOleh"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.untukPekerjaan}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "untukPekerjaan"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.stokFisik}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "stokFisik"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.stokSelisih}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "stokSelisih"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.keterangan}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  event,
                                  index,
                                  "keterangan"
                                );
                              }}
                              multiline
                            />
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div
            style={{
              display: "flex",
              margin: "32px",
              justifyContent: "center",
            }}
          >
            <DefaultButton
              onClickFunction={() => {
                handleAddStokOpnam();
              }}
            >
              Tambah Stok Opnam
            </DefaultButton>
            <Button
              color="error"
              variant="outlined"
              style={{ textTransform: "none", marginLeft: "8px" }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
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

export default StokOpnam;
