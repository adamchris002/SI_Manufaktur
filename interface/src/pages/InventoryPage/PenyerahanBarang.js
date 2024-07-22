import React, { useState, useEffect } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import axios from "axios";
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
import DeleteIcon from "@mui/icons-material/Delete";
import MySelectTextField from "../../components/SelectTextField";
import DefaultButton from "../../components/Button";
import MySnackbar from "../../components/Snackbar";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const PenyerahanBarang = () => {
  const [estimatedOrders, setEstimatedOrders] = useState([]);
  const [selectedEstimatedOrdersId, setSelectedEstimatedOrdersId] =
    useState("");
  const [inventoryItems, setInventoryItems] = useState([]);
  // console.log(inventoryItems);
  const [dataBarangYangDiambil, setDatabarangYangDiambil] = useState({
    diambilOleh: "",
    tanggalPengambilan: dayjs(""),
    tanggalPenyerahan: dayjs(""),
    dataPengambilanPenyerahan: [
      {
        namaItem: "",
        kodeBarang: "",
        rincianItem: "",
        jumlahYangDiambil: { value: "", unit: "" },
        jumlahDigudang: { value: "", unit: "" },
        lokasiPeyimpanan: "",
      },
    ],
  });

  console.log(dataBarangYangDiambil);

  const [showError, setShowError] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

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

  const checkForSubmission = () => {
    if (
      !dataBarangYangDiambil.diambilOleh ||
      !dataBarangYangDiambil.tanggalPengambilan ||
      !dayjs(
        dataBarangYangDiambil.tanggalPengambilan,
        "MM/DD/YYYY hh:mm A",
        true
      ).isValid() ||
      !dataBarangYangDiambil.tanggalPenyerahan ||
      !dayjs(
        dataBarangYangDiambil.tanggalPenyerahan,
        "MM/DD/YYYY hh:mm A",
        true
      ).isValid()
    ) {
      return false;
    }

    for (const item of dataBarangYangDiambil.dataPengambilanPenyerahan) {
      if (
        !item.namaItem ||
        !item.kodeBarang ||
        !item.rincianItem ||
        !item.jumlahYangDiambil.value ||
        !item.jumlahYangDiambil.unit ||
        !item.jumlahDigudang.value ||
        !item.jumlahDigudang.unit ||
        !item.lokasiPeyimpanan
      ) {
        return false;
      }

      const jumlahDigudangValue = item.jumlahDigudang.value;
      const jumlahDigudangUnit = item.jumlahDigudang.unit;
      const jumlahYangDiambilValue = parseFloat(item.jumlahYangDiambil.value);
      const jumlahYangDiambilUnit = item.jumlahYangDiambil.unit;

      if (jumlahYangDiambilUnit === jumlahDigudangUnit) {
        if (jumlahYangDiambilValue > jumlahDigudangValue) {
          return false;
        }
      } else if (
        jumlahYangDiambilUnit === "Kg" &&
        jumlahDigudangUnit === "Ton"
      ) {
        const tempValue = jumlahDigudangValue * 1000;
        if (jumlahYangDiambilValue > tempValue) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  };

  const transformDataForSubmission = (data) => {
    return {
      ...data,
      dataPengambilanPenyerahan: data.dataPengambilanPenyerahan.map((item) => {
        return {
          ...item,
          jumlahDigudang: `${item.jumlahDigudang.value} ${item.jumlahDigudang.unit}`,
          jumlahYangDiambil: `${item.jumlahYangDiambil.value} ${item.jumlahYangDiambil.unit}`,
        };
      }),
    };
  };

  const handleAddPengambilanBarang = () => {
    const checkIfDataPengambilanComplete = checkForSubmission();
    if (checkIfDataPengambilanComplete === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage(
        "Tolong isi input dengan lengkap atau perbaiki data pada input"
      );
    } else {
      const transformedData = transformDataForSubmission(dataBarangYangDiambil);
      console.log(transformedData);
    }
  };

  const separateValueAndUnit = (str) => {
    if (!str) return { value: null, unit: null };
    const parts = str.split(" ");
    const value = parseFloat(parts[0]);
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllInventoryItem",
    }).then((result) => {
      if (result.status === 200) {
        const tempName = result?.data?.map((data) => ({
          value: data.namaItem,
          jumlahItem: separateValueAndUnit(data?.jumlahItem),
          ...data,
        }));
        setInventoryItems(tempName);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getAllProductionPlanning",
    }).then((result) => {
      if (result.status === 200) {
        const tempName = result?.data?.map((data) => ({
          value: data.id,
          ...data,
        }));
        setEstimatedOrders(tempName);
      } else {
      }
    });
  }, []);

  const getSelectedInventoryItem = (value, field, unit) => {
    const selectedItem = inventoryItems?.find(
      (result) => value === result.value
    );
    if (unit) {
      const valueAndUnit = separateValueAndUnit(selectedItem?.[field]);
      return selectedItem ? valueAndUnit : null;
    }
    return selectedItem ? selectedItem[field] : null;
  };

  const handleAddRow = () => {
    setDatabarangYangDiambil((oldArray) => {
      return {
        ...oldArray,
        dataPengambilanPenyerahan: [
          ...oldArray.dataPengambilanPenyerahan,
          {
            namaItem: "",
            kodeBarang: "",
            rincianItem: "",
            jumlahYangDiambil: { value: "", unit: "" },
            jumlahDigudang: { value: "", unit: "" },
            lokasiPeyimpanan: "",
          },
        ],
      };
    });
  };

  const handleRemoveItem = (id, index) => {
    if (!id || id === undefined) {
      setDatabarangYangDiambil((oldObject) => {
        return {
          ...oldObject,
          dataPengambilanPenyerahan: oldObject.dataPengambilanPenyerahan.filter(
            (_, j) => j !== index
          ),
        };
      });
    }
  };

  const handleChangeInput = (field, event, index, unit) => {
    const value = event && event.target ? event.target.value : event;

    setDatabarangYangDiambil((oldObject) => {
      if (
        field === "diambilOleh" ||
        field === "tanggalPengambilan" ||
        field === "tanggalPenyerahan"
      ) {
        return {
          ...oldObject,
          [field]: value,
        };
      } else {
        const updatedItems = oldObject.dataPengambilanPenyerahan.map(
          (item, i) => {
            if (i === index) {
              let updatedItem = { ...item };
              let hasError = false;

              if (unit) {
                const newUnit = value;
                const jumlahItem = getSelectedInventoryItem(
                  updatedItem.namaItem,
                  "jumlahItem",
                  true
                );

                if (newUnit === jumlahItem.unit) {
                  updatedItem = {
                    ...updatedItem,
                    [field]: {
                      value: updatedItem.jumlahYangDiambil.value,
                      unit: newUnit,
                    },
                    selisihJumlahItem: `${
                      jumlahItem.value - updatedItem.jumlahYangDiambil.value
                    } ${jumlahItem.unit}`,
                  };
                } else if (newUnit === "Kg" && jumlahItem.unit === "Ton") {
                  updatedItem = {
                    ...updatedItem,
                    [field]: {
                      value: updatedItem.jumlahYangDiambil.value,
                      unit: newUnit,
                    },
                    selisihJumlahItem: `${
                      (jumlahItem.value * 1000 -
                        updatedItem.jumlahYangDiambil.value) /
                      1000
                    } ${jumlahItem.unit}`,
                  };
                } else {
                  hasError = true;
                  setOpenSnackbar(true);
                  setSnackbarStatus(false);
                  setSnackbarMessage(
                    "Satuan pada barang yang diambil tidak sesuai dengan satuan pada jumlah barang"
                  );
                  // return item;
                }
              } else {
                if (field === "namaItem") {
                  updatedItem = { ...updatedItem, [field]: value };
                  const kodeBarang = getSelectedInventoryItem(
                    updatedItem.namaItem,
                    "kodeBarang"
                  );
                  const lokasiPenyimpanan = getSelectedInventoryItem(
                    updatedItem.namaItem,
                    "lokasi"
                  );
                  const rincianBarang = getSelectedInventoryItem(
                    updatedItem.namaItem,
                    "rincianItem"
                  );
                  const jumlahDigudang = getSelectedInventoryItem(
                    updatedItem.namaItem,
                    "jumlahItem",
                    true
                  );
                  updatedItem.kodeBarang = kodeBarang;
                  updatedItem.lokasiPeyimpanan = lokasiPenyimpanan;
                  updatedItem.rincianItem = rincianBarang;
                  updatedItem.jumlahDigudang = {
                    value: jumlahDigudang.value,
                    unit: jumlahDigudang.unit,
                  };
                }

                if (field === "jumlahYangDiambil") {
                  const jumlahDigudang = getSelectedInventoryItem(
                    updatedItem.namaItem,
                    "jumlahItem",
                    true
                  );
                  const jumlahDigudangValue = jumlahDigudang.value;
                  const jumlahDigudangUnit = jumlahDigudang.unit;

                  if (
                    updatedItem.jumlahYangDiambil.unit === jumlahDigudangUnit
                  ) {
                    const changeToNumber = parseFloat(value);
                    if (changeToNumber > jumlahDigudangValue) {
                      setOpenSnackbar(true);
                      setSnackbarStatus(false);
                      setSnackbarMessage(
                        "Jumlah barang yang diambil tidak boleh lebih besar daripada jumlah barang yang ada di gudang."
                      );
                      hasError = true;
                    } else {
                      hasError = false;
                    }
                    updatedItem = {
                      ...updatedItem,
                      jumlahYangDiambil: {
                        value: value,
                        unit: updatedItem.jumlahYangDiambil.unit,
                      },
                      selisihJumlahItem: `${
                        jumlahDigudangValue - changeToNumber
                      } ${jumlahDigudangUnit}`,
                    };
                  } else if (
                    updatedItem.jumlahYangDiambil.unit === "Kg" &&
                    jumlahDigudangUnit === "Ton"
                  ) {
                    const tempValue = jumlahDigudangValue * 1000;
                    const changeToNumber = parseFloat(value);
                    if (changeToNumber > tempValue) {
                      setOpenSnackbar(true);
                      setSnackbarStatus(false);
                      setSnackbarMessage(
                        "Jumlah barang yang diambil tidak boleh lebih besar daripada jumlah barang yang ada di gudang dalam satuan Kg."
                      );
                      hasError = true;
                    } else {
                      hasError = false;
                    }
                    let selisihJumlahItem = tempValue - changeToNumber;
                    updatedItem = {
                      ...updatedItem,
                      jumlahYangDiambil: {
                        value: value,
                        unit: updatedItem.jumlahYangDiambil.unit,
                      },
                      selisihJumlahItem: `${
                        selisihJumlahItem < 1000
                          ? selisihJumlahItem
                          : selisihJumlahItem / 1000
                      } ${
                        selisihJumlahItem < 1000
                          ? updatedItem.jumlahYangDiambil.unit
                          : jumlahDigudangUnit
                      }`,
                    };
                  } else {
                    setOpenSnackbar(true);
                    setSnackbarStatus(false);
                    setSnackbarMessage(
                      "Satuan pada barang yang diambil tidak sesuai dengan satuan pada jumlah barang"
                    );
                    hasError = true;
                  }
                }
              }

              const updatedErrorStates = [...showError];
              updatedErrorStates[index] = hasError;
              setShowError(updatedErrorStates);

              return updatedItem;
            }
            return item;
          }
        );
        return { ...oldObject, dataPengambilanPenyerahan: updatedItems };
      }
    });
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
            Penyerahan/Pengambilan Barang
          </Typography>
        </div>
        <div style={{ margin: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Laporan Perancanaan yang berlangsung
              </Typography>
              <div style={{ marginLeft: "8px" }}>
                <MySelectTextField
                  data={estimatedOrders}
                  width={"100px"}
                  value={selectedEstimatedOrdersId}
                  onChange={(event) => {
                    setSelectedEstimatedOrdersId(event.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              {estimatedOrders
                ?.filter((plan) => plan.id === selectedEstimatedOrdersId)
                ?.map((result, index) => {
                  return (
                    <div key={index}>
                      {result?.estimasiBahanBakus?.map(
                        (bahanBaku, bahanBakuIndex) => {
                          return (
                            <TableContainer
                              key={bahanBakuIndex}
                              component={Paper}
                              style={{ marginTop: "16px" }}
                            >
                              <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>{bahanBaku.jenis}</TableCell>
                                    <TableCell>{bahanBaku.informasi}</TableCell>
                                    <TableCell>Warna</TableCell>
                                    <TableCell>Estimasi Kebutuhan</TableCell>
                                    <TableCell>Waste</TableCell>
                                    <TableCell>Jumlah Kebutuhan</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {bahanBaku?.bahanBakuAkanDigunakans?.map(
                                    (itemBahanBaku, indexItemBahanBaku) => {
                                      return (
                                        <React.Fragment
                                          key={indexItemBahanBaku}
                                        >
                                          <TableRow>
                                            <TableCell>
                                              {indexItemBahanBaku + 1 + "."}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.namaJenis}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.dataInformasi}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.warna}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.estimasiKebutuhan}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.waste}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.jumlahKebutuhan}{" "}
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          );
                        }
                      )}
                    </div>
                  );
                })}
            </div>
            <div style={{ marginTop: "32px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Form Penyerahan/Pengambilan Barang{" "}
              </Typography>
              <div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "16px 0px",
                    }}
                  >
                    <div style={{ width: "200px" }}>
                      <Typography>Diambil Oleh: </Typography>
                    </div>
                    <Typography>
                      <TextField
                        value={dataBarangYangDiambil.diambilOleh}
                        onChange={(event) => {
                          handleChangeInput("diambilOleh", event);
                        }}
                      />
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "16px 0px",
                    }}
                  >
                    <div style={{ width: "200px" }}>
                      <Typography>Tanggal Pengambilan: </Typography>
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DateTimePicker"]}>
                        <DemoItem>
                          <DateTimePicker
                            disablePast
                            value={
                              dataBarangYangDiambil.tanggalPengambilan.isValid()
                                ? dataBarangYangDiambil.tanggalPengambilan
                                : null
                            }
                            onChange={(event) => {
                              handleChangeInput("tanggalPengambilan", event);
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "16px 0px",
                    }}
                  >
                    <div style={{ width: "200px" }}>
                      <Typography>Tanggal Penyerahan: </Typography>
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DateTimePicker"]}>
                        <DemoItem>
                          <DateTimePicker
                            disablePast
                            minDate={
                              !dataBarangYangDiambil.tanggalPengambilan.isValid()
                                ? undefined
                                : dataBarangYangDiambil.tanggalPengambilan
                            }
                            value={
                              dataBarangYangDiambil.tanggalPenyerahan.isValid()
                                ? dataBarangYangDiambil.tanggalPenyerahan
                                : null
                            }
                            onChange={(event) => {
                              handleChangeInput("tanggalPenyerahan", event);
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
                    justifyContent: "space-between",
                  }}
                >
                  <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                    Barang yang Diambil:
                  </Typography>
                  <DefaultButton
                    onClickFunction={() => {
                      handleAddRow();
                    }}
                  >
                    Tambah Item
                  </DefaultButton>
                </div>
                <TableContainer component={Paper} style={{ marginTop: "16px" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "50px" }}>No.</TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Nama Barang
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          kode Barang
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Rincian Item
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Jumlah yang Diambil
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Jumlah di Gudang
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Lokasi Penyimpanan
                        </TableCell>
                        <TableCell style={{ width: "60px" }} align="left">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataBarangYangDiambil?.dataPengambilanPenyerahan?.map(
                        (result, index) => {
                          const jumlahItemValueAndUnit =
                            getSelectedInventoryItem(
                              result.namaItem,
                              "jumlahItem",
                              true
                            );

                          return (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell>
                                  <MySelectTextField
                                    data={inventoryItems}
                                    value={result.namaItem}
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "namaItem",
                                        event,
                                        index
                                      );
                                    }}
                                    width={"200px"}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={getSelectedInventoryItem(
                                      result.namaItem,
                                      "kodeBarang"
                                    )}
                                    disabled
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "kodeBarang",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={getSelectedInventoryItem(
                                      result.namaItem,
                                      "rincianItem"
                                    )}
                                    disabled
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "rincianItem",
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
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <TextField
                                      type="number"
                                      style={{ width: "140px" }}
                                      error={showError[index] || false}
                                      value={result?.jumlahYangDiambil?.value}
                                      onChange={(event) => {
                                        handleChangeInput(
                                          "jumlahYangDiambil",
                                          event,
                                          index
                                        );
                                      }}
                                    />
                                    <MySelectTextField
                                      data={units}
                                      width={"70px"}
                                      value={result?.jumlahYangDiambil?.unit}
                                      onChange={(event) => {
                                        handleChangeInput(
                                          "jumlahYangDiambil",
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
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <TextField
                                      type="number"
                                      style={{ width: "140px" }}
                                      disabled
                                      value={jumlahItemValueAndUnit?.value}
                                    />
                                    <MySelectTextField
                                      disabled={true}
                                      data={units}
                                      width={"70px"}
                                      value={
                                        jumlahItemValueAndUnit !== null
                                          ? jumlahItemValueAndUnit?.unit
                                          : ""
                                      }
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={getSelectedInventoryItem(
                                      result.namaItem,
                                      "lokasi"
                                    )}
                                    disabled
                                  />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    onClick={() => {
                                      handleRemoveItem(result?.id, index);
                                    }}
                                  >
                                    <DeleteIcon sx={{ color: "red" }} />
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
              </div>
              <div
                style={{
                  padding: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    handleAddPengambilanBarang();
                  }}
                >
                  Tambah Form
                </DefaultButton>
                <Button
                  style={{ marginLeft: "8px" }}
                  color="error"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </div>
            </div>
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

export default PenyerahanBarang;
