import React, { useEffect, useState } from "react";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MySelectTextField from "../../components/SelectTextField";
import DefaultButton from "../../components/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";
import dayjs from "dayjs";

const KegiatanProduksi = (props) => {
  const { userInformation } = props;

  const [personil, setPersonil] = useState([
    {
      nama: "",
    },
  ]);

  const [allProductionPlan, setAllProductionPlan] = useState([]);
  const [allInventoryItem, setAllInventoryItem] = useState([]);
  const [dataProduksi, setDataProduksi] = useState({
    tanggalProduksi: dayjs(""),
    noOrderProduksi: "",
    jenisCetakan: "",
    mesin: "",
    dibuatOleh: "",
    tahapProduksi: "",
    bahanProduksis: [
      {
        jenis: "",
        kode: "",
        beratAwal: { value: "", unit: "" },
        beratAkhir: { value: "", unit: "" },
        keterangan: "",
      },
    ],
    jadwalProduksi: [
      {
        jamAwalProduksi: dayjs(""),
        jamAkhirProduksi: dayjs(""),
        noOrderProduksi: "",
        jenisCetakan: "",
        perolehanCetakan: { value: "", unit: "" },
        waste: { value: "", unit: "" },
      },
    ],
  });
  const [showError, setShowError] = useState([]);
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

  const tahapProduksi = [
    { value: "Produksi Pracetak" },
    { value: "Produksi Cetak" },
    { value: "Produksi Fitur" },
  ];

  const getSelectedOrder = (value, field) => {
    const selectedOrder = allProductionPlan?.find(
      (result) => value === result.value
    );
    return selectedOrder ? selectedOrder[field] : null;
  };

  const getSelectedInventoryItem = (value, field) => {
    const selectedItem = allInventoryItem?.find(
      (result) => value === result.value
    );
    return selectedItem ? selectedItem[field] : null;
  };
  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const handleChangeDataProduksi = (event, field, index, unit) => {
    const value = event && event.target ? event.target.value : event;
    setDataProduksi((oldObject) => {
      if (
        field === "tanggalProduksi" ||
        field === "noOrderProduksi" ||
        field === "jenisCetakan" ||
        field === "mesin" ||
        field === "dibuatOleh" ||
        field === "tahapProduksi"
      ) {
        if (field === "noOrderProduksi") {
          return {
            ...oldObject,
            noOrderProduksi: value,
            jenisCetakan: getSelectedOrder(value, "jenisCetakan"),
          };
        }
        return { ...oldObject, [field]: value };
      } else {
        const updatedItems = oldObject.bahanProduksis.map((item, i) => {
          if (i === index) {
            let updatedItem = { ...item };
            let hasError = false;

            if (unit) {
              if (
                value === updatedItem.beratAwal.unit ||
                (value === "Kg" && updatedItem.beratAwal.unit === "Ton")
              ) {
                updatedItem = {
                  ...updatedItem,
                  [field]: {
                    value: item[field].value || "", // Preserve existing value or set empty string
                    unit: value,
                  },
                };
              } else {
                hasError = true;
                setOpenSnackbar(true);
                setSnackbarStatus(false);
                setSnackbarMessage(
                  "Satuan barang yang diinput tidak sesuai dengan satuan barang pada berat awal"
                );
              }
            } else {
              if (field === "beratAkhir") {
                if (
                  updatedItem.beratAkhir.unit === updatedItem.beratAwal.unit
                ) {
                  if (value <= updatedItem.beratAwal.value && value >= 0) {
                    updatedItem = {
                      ...updatedItem,
                      [field]: {
                        ...updatedItem[field],
                        value: value,
                      },
                    };
                  } else {
                    hasError = true;
                    setOpenSnackbar(true);
                    setSnackbarStatus(false);
                    setSnackbarMessage(
                      "Jumlah yang anda masukkan tidak melebihi berat awal atau kurang dari nol"
                    );
                  }
                } else if (
                  updatedItem.beratAkhir.unit === "Kg" &&
                  updatedItem.beratAwal.unit === "Ton"
                ) {
                  const beratAwalDalamKg = updatedItem.beratAwal.value * 1000;
                  if (value <= beratAwalDalamKg && value >= 0) {
                    updatedItem = {
                      ...updatedItem,
                      [field]: {
                        ...updatedItem[field],
                        value: value,
                      },
                    };
                  } else {
                    hasError = true;
                    setOpenSnackbar(true);
                    setSnackbarStatus(false);
                    setSnackbarMessage(
                      "Jumlah yang anda masukkan tidak melebihi berat awal dalam Kg atau kurang dari nol"
                    );
                  }
                } else {
                  hasError = true;
                  setOpenSnackbar(true);
                  setSnackbarStatus(false);
                  setSnackbarMessage(
                    "Jumlah yang anda masukkan tidak melebihi atau kurang dari nol"
                  );
                }
              } else {
                updatedItem = { ...updatedItem, [field]: value };

                if (field === "jenis") {
                  const kodeBarang = getSelectedInventoryItem(
                    updatedItem.jenis,
                    "kodeBarang"
                  );
                  const inventoryHistorys = getSelectedInventoryItem(
                    updatedItem.jenis,
                    "inventoryHistorys"
                  );
                  const beratAwal = separateValueAndUnit(
                    getSelectedInventoryItem(updatedItem.jenis, "jumlahItem")
                  );
                  if (inventoryHistorys.length === 0) {
                    updatedItem.beratAwal = {
                      value: beratAwal.value,
                      unit: beratAwal.unit,
                    };
                  } else {
                    const mostRecentItem = inventoryHistorys.reduce(
                      (latest, item) => {
                        return new Date(item.createdAt) >
                          new Date(latest.createdAt)
                          ? item
                          : latest;
                      }
                    );
                    const tempvalue = separateValueAndUnit(
                      mostRecentItem.stokOpnamAkhir
                    );
                    updatedItem.beratAwal = {
                      value: tempvalue.value,
                      unit: tempvalue.unit,
                    };
                  }
                  updatedItem.kode = kodeBarang;
                }
              }
            }

            const updatedErrorStates = [...showError];
            updatedErrorStates[index] = hasError;
            setShowError(updatedErrorStates);
            return updatedItem;
          }
          return item;
        });

        return { ...oldObject, bahanProduksis: updatedItems };
      }
    });
  };

  const handleChangeInputPersonil = (event, index) => {
    setPersonil((oldArray) => {
      return oldArray.map((result, count) => {
        if (index === count) {
          return {
            ...result,
            name: event.target.value,
          };
        }
        return result;
      });
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getAllProductionPlanning",
    }).then((result) => {
      if (result.status === 200) {
        const tempData = result.data.map((data) => ({
          value: data.orderId,
          ...data,
        }));
        setAllProductionPlan(tempData);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data pesanan");
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllInventoryItem",
    }).then((result) => {
      if (result.status === 200) {
        const tempValue = result.data.map((data) => ({
          value: data.namaItem,
          ...data,
        }));
        setAllInventoryItem(tempValue);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil item bahan baku");
      }
    });
  }, []);

  const handleAddPersonil = () => {
    setPersonil((oldArray) => {
      return [...oldArray, { nama: "" }];
    });
  };

  const handleAddBahan = () => {
    setDataProduksi((oldObject) => {
      return {
        ...oldObject,
        bahanProduksis: [
          ...oldObject.bahanProduksis,
          {
            jenis: "",
            kode: "",
            beratAwal: { value: "", unit: "" },
            beratAkhir: { value: "", unit: "" },
            keterangan: "",
          },
        ],
      };
    });
  };

  const handleDeletePersonil = (id, index) => {
    if (!id || id === undefined) {
      setPersonil((oldArray) => oldArray.filter((_, j) => j !== index));
    }
  };

  const handleDeleteBahan = (id, index) => {
    if (!id || id === undefined) {
      setDataProduksi((oldObject) => {
        return {
          ...oldObject,
          bahanProduksis: oldObject.bahanProduksis.filter(
            (_, j) => j !== index
          ),
        };
      });
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
      <div style={{ height: "100%", width: "100%" }}>
        <div style={{ margin: "32px" }}>
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Kegiatan Produksi
          </Typography>
        </div>
        <div
          style={{
            margin: "32px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "50%" }}>
            <Typography
              style={{
                color: "#0F607D",
                fontSize: "2vw",
                marginBottom: "16px",
              }}
            >
              Informasi Kegiatan Produksi
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{ width: "250px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Tanggal Produksi:{" "}
              </Typography>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DemoItem>
                      <DateTimePicker
                        disablePast
                        value={
                          dataProduksi.tanggalProduksi.isValid()
                            ? dataProduksi.tanggalProduksi
                            : null
                        }
                        onChange={(event) => {
                          handleChangeDataProduksi(event, "tanggalProduksi");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={params.error || !params.value}
                            helperText={
                              params.error ? "Invalid date format" : ""
                            }
                          />
                        )}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "250px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                No Order Produksi:
              </Typography>
              <div>
                <MySelectTextField
                  value={dataProduksi.noOrderProduksi}
                  onChange={(event) => {
                    handleChangeDataProduksi(event, "noOrderProduksi");
                  }}
                  data={allProductionPlan}
                  width={"200px"}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "250px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Jenis Cetakan:{" "}
              </Typography>
              <div>
                <TextField value={dataProduksi.jenisCetakan} disabled={true} />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "250px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Mesin:{" "}
              </Typography>
              <div>
                <TextField
                  value={dataProduksi.mesin}
                  onChange={(event) => {
                    handleChangeDataProduksi(event, "mesin");
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "250px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Dibuat Oleh:{" "}
              </Typography>
              <div>
                <TextField
                  value={dataProduksi.dibuatOleh}
                  onChange={(event) => {
                    handleChangeDataProduksi(event, "dibuatOleh");
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "250px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Tahap Produksi:{" "}
              </Typography>
              <div>
                <MySelectTextField
                  data={tahapProduksi}
                  value={dataProduksi.tahapProduksi}
                  onChange={(event) => {
                    handleChangeDataProduksi(event, "tahapProduksi");
                  }}
                  width={"200px"}
                />
              </div>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: "2vw",
                }}
              >
                Personil
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  handleAddPersonil();
                }}
              >
                Tambah Personil
              </DefaultButton>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell style={{ width: "25px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personil?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <TextField
                              onChange={(event) => {
                                handleChangeInputPersonil(event, index);
                              }}
                              style={{ width: "100%" }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                handleDeletePersonil(result?.id, index);
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
        <div style={{ padding: "0px 32px 64px 32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
              Bahan
            </Typography>
            <DefaultButton
              onClickFunction={() => {
                handleAddBahan();
              }}
            >
              Tambah Bahan
            </DefaultButton>
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Jenis</TableCell>
                    <TableCell>Kode</TableCell>
                    <TableCell>Berat Awal</TableCell>
                    <TableCell>Berat Akhir</TableCell>
                    <TableCell>Keterangan</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataProduksi?.bahanProduksis?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <MySelectTextField
                              data={allInventoryItem}
                              value={result.jenis}
                              onChange={(event) => {
                                handleChangeDataProduksi(event, "jenis", index);
                              }}
                              width={"200px"}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField value={result.kode} disabled />
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                value={result.beratAwal.value}
                                disabled
                                type="number"
                              />
                              <div style={{ marginLeft: "8px" }}>
                                <MySelectTextField
                                  disabled
                                  value={result.beratAwal.unit}
                                  data={units}
                                />
                              </div>
                            </div>
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
                                error={showError[index] || false}
                                value={result.beratAkhir.value}
                                onChange={(event) => {
                                  handleChangeDataProduksi(
                                    event,
                                    "beratAkhir",
                                    index
                                  );
                                }}
                              />
                              <div style={{ marginLeft: "8px" }}>
                                <MySelectTextField
                                  value={result.beratAkhir.unit}
                                  data={units}
                                  error={showError[index] || false}
                                  onChange={(event) => {
                                    handleChangeDataProduksi(
                                      event,
                                      "beratAkhir",
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
                              value={result.keterangan}
                              onChange={(event) => {
                                handleChangeDataProduksi(
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
                                handleDeleteBahan(result?.id, index);
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
        {dataProduksi.tahapProduksi === "Produksi Pracetak" && (
          <div style={{ padding: "0px 32px 64px 32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Jadwal Produksi
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  // handleAddBahan();
                }}
              >
                Tambah Jadwal Produksi
              </DefaultButton>
            </div>
            <div>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Jam Produksi Awal</TableCell>
                      <TableCell>Jam Produksi Akhir</TableCell>
                      <TableCell>No Order Produksi</TableCell>
                      <TableCell>Jenis Cetakan</TableCell>
                      <TableCell>Perolehan Cetakan</TableCell>
                      <TableCell>Waste</TableCell>
                      <TableCell>Keterangan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataProduksi?.jadwalProduksi?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      // value={
                                      //   dataProduksi.tanggalProduksi.isValid()
                                      //     ? dataProduksi.tanggalProduksi
                                      //     : null
                                      // }
                                      // onChange={(event) => {
                                      //   handleChangeDataProduksi(
                                      //     event,
                                      //     "tanggalProduksi"
                                      //   );
                                      // }}
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      // value={
                                      //   dataProduksi.tanggalProduksi.isValid()
                                      //     ? dataProduksi.tanggalProduksi
                                      //     : null
                                      // }
                                      // onChange={(event) => {
                                      //   handleChangeDataProduksi(
                                      //     event,
                                      //     "tanggalProduksi"
                                      //   );
                                      // }}
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
                              <MySelectTextField width="200px" />
                            </TableCell>
                            <TableCell>
                              <TextField disabled />
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <TextField type="number" />
                                <MySelectTextField />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <TextField type="number" />
                                <MySelectTextField />
                              </div>
                            </TableCell>
                            <TableCell><TextField /></TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        )}
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

export default KegiatanProduksi;
