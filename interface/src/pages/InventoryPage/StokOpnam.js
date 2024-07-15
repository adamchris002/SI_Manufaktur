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

const StokOpnam = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const [dataStokOpnam, setDataStokOpnam] = useState({
    judulStokOpnam: "",
    tanggalStokOpnam: "",
    itemStokOpnams: [
      {
        suratPesanan: "",
        tanggalMasuk: dayjs(""),
        tanggalPengembalian: dayjs(""),
        jenisBarang: "",
        kodeBarang: "",
        lokasiPenyimpanan: "",
        stokOpnamAwal: "",
        stokOpnamAkhir: "",
        stokFisik: "",
        stokSelisih: "",
        keterangan: "",
      },
    ],
  });
  const [allPermohonanPembelianId, setAllPermohonanPembelianId] = useState([]);
  const [refreshPermohonanPembelian, setRefreshPermohonanPembelian] =
    useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
        }
      });
    }
  }, [refreshPermohonanPembelian]);

  const handleChangeInputStokOpnam = (field, event, index, unit) => {
    const value = event && event.target ? event.target.value : event;

    setDataStokOpnam((oldObject) => {
      if (field === "judulStokOpnam" || field === "tanggalStokOpnam") {
        return { ...oldObject, [field]: value };
      } else {
        const updatedItems = oldObject.itemStokOpnams.map((item, i) => {
          if (i === index) {
            let updatedItem = { ...item };
            if (unit) {
              updatedItem = {
                ...updatedItem,
                [field]: {
                  value: item[field],
                  unit: value,
                },
              };
            } else {
              updatedItem = { ...updatedItem, [field]: value };
            }
            return updatedItem;
          }
          return item;
        });

        return { ...oldObject, itemStokOpnams: updatedItems };
      }
    });
  };

  const checkStokOpnamIsEmpty = () => {
    if (
      dataStokOpnam.judulStokOpnam === "" ||
      dataStokOpnam.tanggalStokOpnam === "" ||
      !dayjs(dataStokOpnam.tanggalStokOpnam, "MM/DD/YYYY hh:mm A", true).isValid()
    ) {
      return false;
    }
  
    for (const item of dataStokOpnam.itemStokOpnams) {
      if (
        !item.suratPesanan ||
        !item.tanggalMasuk ||
        !dayjs(item.tanggalMasuk, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.tanggalPengembalian ||
        !dayjs(item.tanggalPengembalian, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.jenisBarang ||
        !item.kodeBarang ||
        !item.lokasiPenyimpanan ||
        !item.stokOpnamAwal.value ||
        !item.stokOpnamAwal.unit ||
        !item.stokOpnamAkhir.value ||
        !item.stokOpnamAkhir.unit ||
        !item.stokFisik ||
        !item.stokSelisih
      ) {
        return false;
      }
    }
    
    return true;
  };
  

  const modifyStokOpnam = () => {
    const changedStokOpnam = {
      judulStokOpnam: dataStokOpnam.judulStokOpnam,
      tanggalStokOpnam: dataStokOpnam.tanggalStokOpnam,
      itemStokOpnams: dataStokOpnam.itemStokOpnams.map((result) => {
        return {
          ...result,
          stokOpnamAwal: `${result.stokOpnamAwal.value} ${result.stokOpnamAwal.unit}`,
          stokOpnamAkhir: `${result.stokOpnamAkhir.value} ${result.stokOpnamAkhir.unit}`,
        };
      }),
    };
    return changedStokOpnam;
  };

  const handleAddStokOpnam = () => {
    const checkIfEmpty = checkStokOpnamIsEmpty();
    if (checkIfEmpty === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input");
    } else {
      const modifiedData = modifyStokOpnam();
      console.log(modifiedData);
      // axios({
      //   method: "POST",
      //   url: `http://localhost:3000/inventory/addStokOpnam/${userInformation?.data?.id}`,
      // });
    }
  };

  const handleAddRow = () => {
    setDataStokOpnam((oldArray) => {
      return {
        ...oldArray,
        itemStokOpnams: [
          ...oldArray.itemStokOpnams,
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
        ],
      };
    });
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
            Stok Opnam
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
                  {dataStokOpnam.itemStokOpnams.map((result, index) => {
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
                                  "suratPesanan",
                                  event,
                                  index
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoItem>
                                <DateTimePicker
                                  disablePast
                                  value={result?.tanggalMasuk}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      "tanggalMasuk",
                                      event,
                                      index
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
                                  value={result?.tanggalPengembalian}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      "tanggalPengembalian",
                                      event,
                                      index
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
                                  "jenisBarang",
                                  event,
                                  index
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.kodeBarang}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  "kodeBarang",
                                  event,
                                  index
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
                                  "lokasiPenyimpanan",
                                  event,
                                  index
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
                                    "stokOpnamAwal",
                                    event,
                                    index
                                  );
                                }}
                              />
                              <MySelectTextField
                                width={"60px"}
                                data={units}
                                value={result.stokOpnamAwal?.unit}
                                onChange={(event) => {
                                  handleChangeInputStokOpnam(
                                    "stokOpnamAwal",
                                    event,
                                    index,
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
                                    "stokOpnamAkhir",
                                    event,
                                    index
                                  );
                                }}
                              />
                              <MySelectTextField
                                width={"60px"}
                                data={units}
                                value={result.stokOpnamAkhir?.unit}
                                onChange={(event) => {
                                  handleChangeInputStokOpnam(
                                    "stokOpnamAkhir",
                                    event,
                                    index,
                                    true
                                  );
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.stokFisik}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  "stokFisik",
                                  event,
                                  index
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.stokSelisih}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  "stokSelisih",
                                  event,
                                  index
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.keterangan}
                              onChange={(event) => {
                                handleChangeInputStokOpnam(
                                  "keterangan",
                                  event,
                                  index
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
