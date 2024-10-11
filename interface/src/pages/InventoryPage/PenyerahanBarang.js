import React, { useState, useEffect, useContext } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { AppContext } from "../../App";

const PenyerahanBarang = (props) => {
  const location = useLocation();
  const { penyerahanBarangId } = location.state || "";
  const { userInformation } = props;
  const navigate = useNavigate();
  const { setSuccessMessage } = useAuth();
  const { isMobile } = useContext(AppContext);

  const [estimatedOrders, setEstimatedOrders] = useState([]);
  const [selectedEstimatedOrder, setSelectedEstimatedOrder] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [dataBarangYangDiambil, setDatabarangYangDiambil] = useState({
    orderId: "",
    productionPlanningId: "",
    diambilOleh: "",
    tanggalPengambilan: dayjs(""),
    tanggalPenyerahan: dayjs(""),
    statusPenyerahan: "",
    itemPenyerahanBarangs: [
      {
        namaItem: "",
        kodeBarang: "",
        rincianItem: "",
        jumlahYangDiambil: { value: "", unit: "" },
        jumlahDigudang: { value: "", unit: "" },
        lokasiPeyimpanan: "",
        idBarang: "",
      },
    ],
  });

  const [showError, setShowError] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [refreshGetData, setRefreshGetData] = useState(true);

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

  const statusPenyerahan = [
    {
      value: "Barang sedang diambil",
    },
    {
      value: "Barang siap diambil",
    },
    {
      value: "Barang sudah diambil",
    },
  ];

  const handleChangeIdLaporanPerencanaan = (id) => {
    const selectedItem = estimatedOrders?.find((result) => id === result.id);
    setSelectedEstimatedOrder(selectedItem);
    setDatabarangYangDiambil((oldObject) => {
      return {
        ...oldObject,
        orderId: selectedItem.orderId,
        productionPlanningId: selectedItem.id,
      };
    });
  };

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
      ).isValid() ||
      !dataBarangYangDiambil.statusPenyerahan
    ) {
      return false;
    }

    if (penyerahanBarangId !== undefined) {
      for (const item of dataBarangYangDiambil.itemPenyerahanBarangs) {
        if (
          !item.namaItem ||
          !item.kodeBarang ||
          !item.rincianItem ||
          !item.jumlahYangDiambil.value ||
          !item.jumlahYangDiambil.unit ||
          !item.selisihBarang
        ) {
          return false;
        }
      }
    } else {
      for (const item of dataBarangYangDiambil.itemPenyerahanBarangs) {
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
        }
        //  else {
        //   return false;
        // }
      }
    }

    return true;
  };

  const transformDataForSubmission = (data) => {
    return {
      ...data,
      orderId: selectedEstimatedOrder.orderId,
      productionPlanningId: selectedEstimatedOrder.id,
      itemPenyerahanBarangs: data.itemPenyerahanBarangs.map((item) => {
        if (penyerahanBarangId !== undefined) {
          return {
            ...item,
            jumlahYangDiambil: `${item.jumlahYangDiambil.value} ${item.jumlahYangDiambil.unit}`,
          };
        } else {
          return {
            ...item,
            jumlahDigudang: `${item.jumlahDigudang.value} ${item.jumlahDigudang.unit}`,
            jumlahYangDiambil: `${item.jumlahYangDiambil.value} ${item.jumlahYangDiambil.unit}`,
          };
        }
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
      axios({
        method: "POST",
        url: `http://localhost:5000/inventory/addPenyerahanBarang/${userInformation?.data?.id}`,
        data: {
          dataPenyerahanBarang: transformedData,
          productionPlanningId: selectedEstimatedOrder.id,
        },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan form penyerahan barang");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menambahkan data penyerahan/pengambilan barang"
          );
        }
      });
    }
  };

  const handleEditPenyerahanBarang = () => {
    const checkIfDataPengambilanComplete = checkForSubmission();
    if (checkIfDataPengambilanComplete === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage(
        "Tolong isi input dengan lengkap atau perbaiki data pada input"
      );
    } else {
      const transformedData = transformDataForSubmission(dataBarangYangDiambil);
      axios({
        method: "PUT",
        url: `http://localhost:5000/inventory/editPenyerahanBarang/${userInformation?.data?.id}`,
        data: { dataPenyerahanBarang: transformedData },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan form penyerahan barang");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menambahkan data penyerahan/pengambilan barang"
          );
        }
      });
    }
  };

  const separateValueAndUnit = (str) => {
    if (!str) return { value: null, unit: null };
    const parts = str.split(" ");
    const value = parseFloat(parts[0]);
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const modifyDataForEdit = (data) => {
    const modifiedData = {
      ...data,
      tanggalPengambilan: dayjs(data.tanggalPengambilan),
      tanggalPenyerahan: dayjs(data.tanggalPenyerahan),
      itemPenyerahanBarangs: data.itemPenyerahanBarangs.map((result) => {
        return {
          ...result,
          jumlahYangDiambil: separateValueAndUnit(result.jumlahYangDiambil),
          namaItem: result.namaBarang,
        };
      }),
    };

    return modifiedData;
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:5000/inventory/getAllInventoryItem/${userInformation?.data?.id}`,
    }).then((result) => {
      if (result.status === 200) {
        const tempName = result?.data?.map((data) => ({
          value: data.namaItem,
          jumlahItem: separateValueAndUnit(data?.jumlahItem),
          ...data,
        }));
        setInventoryItems(tempName);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak dapat memanggil data bahan baku");
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:5000/productionPlanning/getAllProductionPlanStatusEstimated/${userInformation?.data?.id}`,
    }).then((result) => {
      if (result.status === 200) {
        const tempName = result?.data?.map((data) => ({
          value: data.id,
          ...data,
        }));
        setEstimatedOrders(tempName);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak dapat memanggil data perencanaan produksi");
      }
    });
  }, []);

  useEffect(() => {
    if (penyerahanBarangId !== undefined) {
      if (refreshGetData) {
        axios({
          method: "GET",
          url: `http://localhost:5000/inventory/getPenyerahanBarang/${penyerahanBarangId}`,
          params: { userId: userInformation?.data?.id },
        }).then((result) => {
          if (result.status === 200) {
            const modifiedPenyerahanBarang = modifyDataForEdit(result.data);
            setDatabarangYangDiambil(modifiedPenyerahanBarang);
            setRefreshGetData(false);
          } else {
            setOpenSnackbar(true);
            setSnackbarStatus(false);
            setSnackbarMessage(
              "Tidak dapat memanggil data form pengambilan/penyerahan barang untuk diedit"
            );
            setRefreshGetData(false);
          }
        });
      }
    }
  }, [refreshGetData]);

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
        itemPenyerahanBarangs: [
          ...oldArray.itemPenyerahanBarangs,
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
          itemPenyerahanBarangs: oldObject.itemPenyerahanBarangs.filter(
            (_, j) => j !== index
          ),
        };
      });
    } else {
      axios({
        method: "DELETE",
        url: `http://localhost:5000/inventory/deleteItemPenyerahanBarang/${id}`,
        params: {
          userId: userInformation?.data?.id,
          penyerahanBarangId: penyerahanBarangId,
        },
      }).then((result) => {
        if (result.status === 200) {
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage(
            "Berhasil menghapus item bahan baku dari penyerahan/pengambilan barang"
          );
          setRefreshGetData(true);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menghapus item bahan baku dari penyerahan/pengambilan barang"
          );
        }
      });
    }
  };

  const handleChangeInput = (field, event, index, unit) => {
    const value = event && event.target ? event.target.value : event;

    setDatabarangYangDiambil((oldObject) => {
      if (
        field === "diambilOleh" ||
        field === "tanggalPengambilan" ||
        field === "tanggalPenyerahan" ||
        field === "statusPenyerahan"
      ) {
        return {
          ...oldObject,
          [field]: value,
        };
      } else {
        const updatedItems = oldObject.itemPenyerahanBarangs.map((item, i) => {
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
                  selisihBarang: `${
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
                  selisihBarang: `${
                    (jumlahItem.value * 1000 -
                      updatedItem.jumlahYangDiambil.value) /
                    1000
                  } Ton`,
                };
              } else {
                hasError = true;
                setOpenSnackbar(true);
                setSnackbarStatus(false);
                setSnackbarMessage(
                  "Satuan pada barang yang diambil tidak sesuai dengan satuan pada jumlah barang"
                );
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
                const idBarang = getSelectedInventoryItem(
                  updatedItem.namaItem,
                  "id"
                );
                const inventoryHistorys = getSelectedInventoryItem(
                  updatedItem.namaItem,
                  "inventoryHistorys"
                );

                if (
                  inventoryHistorys.length === 0 ||
                  inventoryHistorys === null
                ) {
                  updatedItem.beratAwal = {
                    value: jumlahDigudang.value,
                    unit: jumlahDigudang.unit,
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
                  updatedItem.jumlahDigudang = {
                    value: tempvalue.value,
                    unit: tempvalue.unit,
                  };
                }

                updatedItem.jumlahDigudang = jumlahDigudang;
                updatedItem.kodeBarang = kodeBarang;
                updatedItem.lokasiPeyimpanan = lokasiPenyimpanan;
                updatedItem.rincianItem = rincianBarang;

                updatedItem.idBarang = idBarang;
              }

              if (field === "jumlahYangDiambil") {
                const jumlahDigudang = getSelectedInventoryItem(
                  updatedItem.namaItem,
                  "jumlahItem",
                  true
                );
                const jumlahDigudangValue = jumlahDigudang.value;
                const jumlahDigudangUnit = jumlahDigudang.unit;

                if (updatedItem.jumlahYangDiambil.unit === jumlahDigudangUnit) {
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
                    selisihBarang: `${
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
                  let selisihBarang = tempValue - changeToNumber;
                  updatedItem = {
                    ...updatedItem,
                    jumlahYangDiambil: {
                      value: value,
                      unit: updatedItem.jumlahYangDiambil.unit,
                    },
                    selisihBarang: `${
                      selisihBarang < 1000
                        ? selisihBarang
                        : selisihBarang / 1000
                    } ${
                      selisihBarang < 1000
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
        });
        return { ...oldObject, itemPenyerahanBarangs: updatedItems };
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
          <Typography
            style={{ color: "#0F607D", fontSize: isMobile ? "24px" : "3vw" }}
          >
            Penyerahan/Pengambilan Barang
          </Typography>
        </div>
        <div style={{ margin: "32px" }}>
          <div>
            {penyerahanBarangId === undefined ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography
                  style={{
                    color: "#0F607D",
                    fontSize: isMobile ? "18px" : "2vw",
                  }}
                >
                  Laporan Perencanaan yang berlangsung
                </Typography>
                <div style={{ marginLeft: "8px" }}>
                  <MySelectTextField
                    data={estimatedOrders}
                    width={"100px"}
                    value={selectedEstimatedOrder.id}
                    onChange={(event) => {
                      handleChangeIdLaporanPerencanaan(event.target.value);
                    }}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            <div>
              {estimatedOrders
                ?.filter((plan) => plan.id === selectedEstimatedOrder.id)
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
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "18px" : "2vw",
                }}
              >
                Form Penyerahan/Pengambilan Barang
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
                      <DemoContainer
                        sx={{
                          overflow: isMobile ? "hidden" : "",
                        }}
                        components={["DateTimePicker"]}
                      >
                        <DemoItem>
                          <DateTimePicker
                            sx={{
                              width: isMobile ? "100px" : "300px",
                              height: isMobile ? "30px" : "50px",
                              ".MuiInputBase-root": {
                                height: isMobile ? "30px" : "50px",
                                width: isMobile ? "195px" : "300px",
                                fontSize: isMobile ? "12px" : "",
                                minWidth: "",
                              },
                            }}
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
                      <DemoContainer
                        sx={{
                          padding: 0,
                          overflow: isMobile ? "hidden" : "",
                        }}
                        components={["DateTimePicker"]}
                      >
                        <DemoItem>
                          <DateTimePicker
                            sx={{
                              width: isMobile ? "100px" : "300px",
                              height: isMobile ? "30px" : "50px",
                              ".MuiInputBase-root": {
                                height: isMobile ? "30px" : "50px",
                                width: isMobile ? "195px" : "300px",
                                fontSize: isMobile ? "12px" : "",
                                minWidth: "",
                              },
                            }}
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "16px 32px 16px 0px",
                    }}
                  >
                    <div style={{ width: "200px" }}>
                      <Typography>Status Penyerahan: </Typography>
                    </div>
                    <MySelectTextField
                      width={"170px"}
                      data={statusPenyerahan}
                      value={dataBarangYangDiambil.statusPenyerahan}
                      onChange={(event) => {
                        handleChangeInput("statusPenyerahan", event);
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "20px" : "1.5vw",
                    }}
                  >
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
                <TableContainer
                  component={Paper}
                  style={{ marginTop: "16px", overflowX: "auto" }}
                >
                  <Table
                    sx={{
                      minWidth: 650,
                      tableLayout: "fixed",
                      overflowX: "auto",
                    }}
                    aria-label="simple table"
                  >
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
                      {dataBarangYangDiambil?.itemPenyerahanBarangs?.map(
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
                                    <div style={{ marginLeft: "8px" }}>
                                      <MySelectTextField
                                        data={units}
                                        width={isMobile ? "75px" : "100px"}
                                        height={"55px"}
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
                                      handleRemoveItem(result.id, index);
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
                    penyerahanBarangId === undefined
                      ? handleAddPengambilanBarang()
                      : handleEditPenyerahanBarang();
                  }}
                >
                  {penyerahanBarangId === undefined
                    ? "Tambah Form"
                    : "Edit Form"}
                </DefaultButton>
                <Button
                  style={{ marginLeft: "8px", textTransform: "none" }}
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    navigate(-1);
                  }}
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
