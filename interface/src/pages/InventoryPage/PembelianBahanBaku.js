import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import "./PembelianBahan.css";
import factoryBackground from "../../assets/factorybackground.png";
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
import axios from "axios";
import MySnackbar from "../../components/Snackbar";
import DefaultButton from "../../components/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";

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

const PembelianBahanBaku = (props) => {
  const { userInformation } = props;
  const location = useLocation();
  const { pembelianBahanBakuId } = location.state || {};

  const navigate = useNavigate();
  const { setSuccessMessage } = useAuth();

  const [
    allAcceptedPermohonanPembelianId,
    setAllAcceptedPermohonanPembelianId,
  ] = useState([]);
  const [allOrdersId, setAllOrdersId] = useState([]);
  const [allInventoryItems, setAllInventoryItems] = useState([]);
  const [permohonanPembelian, setPermohonanPembelian] = useState([]);
  const [pembelianBahanBaku, setPembelianBahanBaku] = useState({
    leveransir: "",
    alamat: "",
    items: [
      {
        tanggal: dayjs(""),
        noOrder: "",
        jenisBarang: "",
        rincianBarang: "",
        jumlahOrder: { unit: "", value: "" },
        hargaSatuan: "",
        jumlahHarga: "",
        tanggalSuratJalan: dayjs(""),
        noSuratJalan: "",
        tanggalTerimaBarang: dayjs(""),
        diterimaOleh: "",
        fakturPajak: "",
        tanggalJatuhTempo: dayjs(""),
        tanggalPengiriman: dayjs(""),
        jumlahTerimaPengiriman: { unit: "", value: "" },
        sisaPengiriman: { unit: "", value: "" },
      },
    ],
  });

  const [refreshPembelianBahanBaku, setRefreshPembelianBahanbaku] =
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

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { isMobile } = useContext(AppContext);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllInventoryItem",
    }).then((result) => {
      if (result.status === 200) {
        const tempInventoryData = result.data.map((data) => ({
          value: data.namaItem,
          id: data.id,
        }));
        setAllInventoryItems(tempInventoryData);
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
      url: "http://localhost:3000/order/getAllOrderInfo",
    }).then((result) => {
      if (result.status === 200) {
        const orderIdList = result.data.map((data) => ({
          ...data,
          value: data.id,
        }));
        setAllOrdersId(orderIdList);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak dapat memanggil data pesanan");
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllAcceptedPermohonanPembelian",
    }).then((result) => {
      if (result.status === 200) {
        const allIds = result.data.map((data) => ({
          ...data,
          value: data.id,
        }));
        setAllAcceptedPermohonanPembelianId(allIds);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak dapat memanggil data permohonan pembelian yang sudah diacc"
        );
      }
    });
  }, []);

  const handleSelectId = (idPermohonanPembelian) => {
    axios({
      method: "GET",
      url: `http://localhost:3000/inventory/getPermohonanPembelian/${idPermohonanPembelian.target.value}`,
    }).then((result) => {
      setPermohonanPembelian(result);
    });
  };

  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  useEffect(() => {
    if (pembelianBahanBakuId) {
      if (refreshPembelianBahanBaku) {
        axios({
          method: "GET",
          url: `http://localhost:3000/inventory/getPembelianBahanBaku/${pembelianBahanBakuId}`,
        }).then((result) => {
          if (result.status === 200) {
            setPembelianBahanBaku({
              createdAt: result.data.createdAt,
              updatedAt: result.data.updatedAt,
              id: result.data.id,
              permohonanPembelianId: result.data.permohonanPembelianId,
              leveransir: result.data.leveransir,
              alamat: result.data.alamat,
              items: result?.data?.itemPembelianBahanBakus?.map((data) => {
                return {
                  id: data.id,
                  jenisBarang: data.jenisBarang,
                  jumlahHarga: data.jumlahHarga,
                  hargaSatuan: data.hargaSatuan,
                  pembelianBahanBakuId: data.pembelianBahanBakuId,
                  tanggal: dayjs(data.tanggal),
                  createdAt: data.createdAt,
                  jumlahOrder: separateValueAndUnit(data.jumlahOrder),
                  rincianBarang: data.rincianBarang,
                  updatedAt: data.updatedAt,
                  noOrder: data.noOrder,
                  tanggalSuratJalan: dayjs(data.tanggalSuratJalan),
                  noSuratJalan: data.noSuratJalan,
                  tanggalTerimaBarang: dayjs(data.tanggalTerimaBarang),
                  diterimaOleh: data.diterimaOleh,
                  fakturPajak: data.fakturPajak,
                  tanggalJatuhTempo: dayjs(data.tanggalJatuhTempo),
                  tanggalPengiriman: dayjs(data.tanggalPengiriman),
                  jumlahTerimaPengiriman: separateValueAndUnit(
                    data.jumlahTerimaPengiriman
                  ),
                  sisaPengiriman: separateValueAndUnit(data.sisaPengiriman),
                };
              }),
            });
            setRefreshPembelianBahanbaku(false);
          } else {
            setOpenSnackbar(true);
            setSnackbarStatus(false);
            setSnackbarMessage(
              "Tidak dapat memanggil data pembelian bahan baku"
            );
          }
        });
      }
    }
  }, [refreshPembelianBahanBaku]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isPembelianBahanBakuComplete = () => {
    if (
      pembelianBahanBaku.leveransir === "" ||
      PembelianBahanBaku.alamat === ""
    ) {
      return false;
    }
    for (const item of pembelianBahanBaku.items) {
      if (
        !item.noOrder ||
        !item.tanggal ||
        !dayjs(item.tanggal, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.jenisBarang ||
        !item.rincianBarang ||
        !item.jumlahOrder.value ||
        !item.jumlahOrder.unit ||
        !item.hargaSatuan ||
        !item.jumlahHarga ||
        !item.tanggalSuratJalan ||
        !dayjs(item.tanggalSuratJalan, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.tanggalTerimaBarang ||
        !dayjs(
          item.tanggalTerimaBarang,
          "MM/DD/YYYY hh:mm A",
          true
        ).isValid() ||
        !item.noSuratJalan ||
        !item.diterimaOleh ||
        !item.fakturPajak ||
        !item.tanggalJatuhTempo ||
        !dayjs(item.tanggalJatuhTempo, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.tanggalPengiriman ||
        !dayjs(item.tanggalPengiriman, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.jumlahTerimaPengiriman.unit ||
        !item.jumlahTerimaPengiriman.value ||
        !item.sisaPengiriman.value ||
        !item.sisaPengiriman.unit
      ) {
        return false;
      }
    }
    return true;
  };

  const transformPembelianBahanBaku = () => {
    const newPembelianBahanBaku = {
      leveransir: pembelianBahanBaku.leveransir,
      alamat: pembelianBahanBaku.alamat,
      items: pembelianBahanBaku.items.map((result) => {
        return {
          ...result,
          jumlahOrder: `${result.jumlahOrder.value} ${result.jumlahOrder.unit}`,
          jumlahTerimaPengiriman: `${result.jumlahTerimaPengiriman.value} ${result.jumlahTerimaPengiriman.unit}`,
          sisaPengiriman: `${result.sisaPengiriman.value} ${result.sisaPengiriman.unit}`,
        };
      }),
    };
    return newPembelianBahanBaku;
  };

  const handleRemoveItemPembelianBahanBaku = (id, index) => {
    if (!id || id === undefined) {
      setPembelianBahanBaku((oldObject) => {
        return {
          ...oldObject,
          items: oldObject.items.filter((_, j) => j !== index),
        };
      });
    } else {
      axios({
        method: "DELETE",
        url: `http://localhost:3000/inventory/deleteItemPembelianBahanBaku/${id}`,
      }).then((result) => {
        if (result.status === 200) {
          setRefreshPembelianBahanbaku(true);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("Berhasil menghapus item pembelian bahan baku");
        } else {
          setOpenSnackbar(true);
          setSnackbarMessage(
            "Tidak berhasil menghapus item pembelian bahan baku"
          );
          setSnackbarStatus(false);
        }
      });
    }
  };

  const handleEditPembelianBahanBaku = (id) => {
    const isPembelianBahanBakuNotEmpty = isPembelianBahanBakuComplete();

    if (isPembelianBahanBakuNotEmpty === true) {
      const transformedPembelianBahanBaku = transformPembelianBahanBaku();
      axios({
        method: "PUT",
        url: `http://localhost:3000/inventory/editPembelianBahanBaku/${id}`,
        data: {
          pembelianBahanBakuId: pembelianBahanBakuId,
          dataPembelianBahanBaku: transformedPembelianBahanBaku,
        },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil mengedit data pembelian bahan baku");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil mengedit pembelian bahan baku");
        }
      });
    } else {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input");
    }
  };

  const handleAddPembelianBahanBaku = (id) => {
    const isPembelianBahanBakuNotEmpty = isPembelianBahanBakuComplete();

    if (isPembelianBahanBakuNotEmpty === true) {
      const transformedPembelianBahanBaku = transformPembelianBahanBaku();
      axios({
        method: "POST",
        url: `http://localhost:3000/inventory/addPembelianBahanBaku/${id}`,
        data: {
          permohonanPembelianId: permohonanPembelian?.data?.id,
          dataPembelianBahanBaku: transformedPembelianBahanBaku,
        },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan pembelian bahan baku");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Error dalam menambahkan pembelian bahan baku");
        }
      });
    } else {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Error dalam menambahkan pembelian bahan baku");
    }
  };

  const handleChangeInput = (field, event, index, unit) => {
    const value = event && event.target ? event.target.value : event;

    setPembelianBahanBaku((oldObject) => {
      if (field === "leveransir" || field === "alamat") {
        return { ...oldObject, [field]: value };
      } else {
        const updatedItems = oldObject.items.map((result, i) => {
          if (i === index) {
            let updatedResult = { ...result };
            if (unit) {
              return {
                ...updatedResult,
                [field]: {
                  value: result[field]?.value || "",
                  unit: value,
                },
              };
            } else {
              if (
                field === "jumlahTerimaPengiriman" ||
                field === "sisaPengiriman"
              ) {
                return {
                  ...updatedResult,
                  [field]: {
                    ...result[field],
                    value: value,
                  },
                };
              }
              if (field === "hargaSatuan") {
                const hargaSatuan = parseFloat(value.replace(/,/g, ""));
                const jumlahOrder = parseFloat(result.jumlahOrder.value);
                updatedResult.jumlahHarga = jumlahOrder * hargaSatuan;
                updatedResult = { ...updatedResult, [field]: value };
              } else if (field === "jumlahOrder") {
                const jumlahOrder = parseFloat(value.replace(/,/g, ""));
                const hargaSatuan = parseFloat(
                  result.hargaSatuan.replace(/,/g, "")
                );
                updatedResult.jumlahHarga = jumlahOrder * hargaSatuan;
                updatedResult = {
                  ...updatedResult,
                  [field]: {
                    ...result[field],
                    value: value,
                  },
                };
              } else {
                updatedResult = { ...updatedResult, [field]: value };
              }
            }

            return updatedResult;
          }
          return result;
        });

        return { ...oldObject, items: updatedItems };
      }
    });
  };

  const handleAddDataPembelianBahan = () => {
    setPembelianBahanBaku((oldObject) => {
      return {
        ...oldObject,
        items: [
          ...oldObject.items,
          {
            tanggal: dayjs(""),
            noOrder: "",
            jenisBarang: "",
            rincianBarang: "",
            jumlahOrder: { unit: "", value: "" },
            hargaSatuan: "",
            jumlahHarga: "",
            tanggalSuratJalan: dayjs(""),
            noSuratJalan: "",
            tanggalTerimaBarang: dayjs(""),
            diterimaOleh: "",
            fakturPajak: "",
            tanggalJatuhTempo: dayjs(""),
            tanggalPengiriman: dayjs(""),
            jumlahTerimaPengiriman: { unit: "", value: "" },
            sisaPengiriman: { unit: "", value: "" },
          },
        ],
      };
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
            style={{ fontSize: isMobile ? "24px" : "2vw", color: "#0F607D" }}
          >
            {pembelianBahanBakuId
              ? "Edit Pembelian Bahan Baku/Bahan Pembantu"
              : "Tambah Pembelian Bahan Baku/Bahan Pembantu"}
          </Typography>
          {!pembelianBahanBakuId && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: isMobile ? "16px" : "0px",
              }}
            >
              <Typography
                style={{
                  fontSize: isMobile ? "20px" : "1.5vw",
                  color: "#0F607D",
                }}
              >
                Pilih Id Permohonan Pembelian
              </Typography>
              <div style={{ marginLeft: "8px" }}>
                <MySelectTextField
                  width={isMobile ? "60px" : "80px"}
                  height={"30px"}
                  value={permohonanPembelian?.data?.id}
                  data={allAcceptedPermohonanPembelianId}
                  type="text"
                  onChange={handleSelectId}
                />
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: "32px", width: "100%" }}>
          {permohonanPembelian.length !== 0 || pembelianBahanBaku.id ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0px 32px",
                }}
              >
                <Typography
                  style={{
                    color: "#0F607D",
                    fontSize: isMobile ? "12px" : "1.5vw",
                  }}
                >
                  Leveransir:
                </Typography>
                <div style={{ marginLeft: "8px" }}>
                  <TextField
                    onChange={(event) => {
                      handleChangeInput("leveransir", event);
                    }}
                    value={pembelianBahanBaku.leveransir}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: isMobile ? "30px" : "3vw",
                        width: isMobile ? "200px" : "40vw",
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
                  />
                </div>
              </div>
              <div
                style={{
                  margin: "16px 32px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{
                    color: "#0F607D",
                    fontSize: isMobile ? "12px" : "1.5vw",
                  }}
                >
                  Alamat:{" "}
                </Typography>
                <div style={{ marginLeft: "8px" }}>
                  <TextField
                    onChange={(event) => {
                      handleChangeInput("alamat", event);
                    }}
                    value={pembelianBahanBaku.alamat}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: isMobile ? "30px" : "3vw",
                        width: isMobile ? "200px" : "40vw",
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
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: "32px",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    handleAddDataPembelianBahan();
                  }}
                >
                  <Typography
                    style={{
                      // color: "#0F607D",
                      fontSize: isMobile ? "12px" : "1vw",
                    }}
                  >
                    Tambah Item Pembelian
                  </Typography>
                </DefaultButton>
              </div>
              <div style={{ width: "100%" }}>
                <div style={{ margin: "32px" }}>
                  <TableContainer
                    component={Paper}
                    style={{ overflowX: "auto" }}
                  >
                    <Table
                      sx={{ minWidth: 650 }}
                      aria-label="simple table"
                      style={{ tableLayout: "fixed", overflowX: "auto" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: 50 }}>No.</TableCell>
                          <TableCell style={{ width: "300px" }} align="left">
                            Tanggal
                          </TableCell>
                          <TableCell style={{ width: "70px" }} align="left">
                            No. Order
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Jenis Barang
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Rincian Barang
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Jumlah Order
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Harga Satuan
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Jumlah Harga
                          </TableCell>
                          <TableCell style={{ width: "300px" }} align="left">
                            Tanggal Surat Jalan
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            No Surat Jalan
                          </TableCell>
                          <TableCell style={{ width: "300px" }} align="left">
                            Tanggal Terima Barang
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Diterima Oleh
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Faktur Pajak & Kwitansi/Invoice
                          </TableCell>
                          <TableCell style={{ width: "300px" }} align="left">
                            Tanggal Jatuh Tempo
                          </TableCell>
                          <TableCell style={{ width: "300px" }} align="left">
                            Tanggal Pengiriman
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Jumlah Terima Pengiriman
                          </TableCell>
                          <TableCell style={{ width: "200px" }} align="left">
                            Sisa Pengiriman
                          </TableCell>
                          <TableCell style={{ width: 50 }} align="left">
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pembelianBahanBaku.items.map((result, index) => {
                          return (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      sx={{ padding: 0 }}
                                      components={["DateTimePicker"]}
                                    >
                                      <DemoItem sx={{ padding: 0 }}>
                                        <DateTimePicker
                                          value={
                                            result.tanggal.isValid()
                                              ? result.tanggal
                                              : null
                                          }
                                          disablePast
                                          onChange={(event) =>
                                            handleChangeInput(
                                              "tanggal",
                                              event,
                                              index
                                            )
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              error={
                                                params.error || !params.value
                                              }
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
                                  <MySelectTextField
                                    width="70px"
                                    data={allOrdersId}
                                    value={result.noOrder}
                                    type="text"
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "noOrder",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <MySelectTextField
                                    width="200px"
                                    data={allInventoryItems}
                                    value={result.jenisBarang}
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "jenisBarang",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={result.rincianBarang}
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "rincianBarang",
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
                                    }}
                                  >
                                    <TextField
                                      type="number"
                                      value={result.jumlahOrder.value}
                                      onChange={(event) => {
                                        handleChangeInput(
                                          "jumlahOrder",
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
                                        value={result.jumlahOrder.unit}
                                        onChange={(event) => {
                                          handleChangeInput(
                                            "jumlahOrder",
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
                                  <TextField
                                    type="text"
                                    value={result.hargaSatuan}
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "hargaSatuan",
                                        event,
                                        index
                                      );
                                    }}
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
                                    type="text"
                                    disabled
                                    value={result.jumlahHarga}
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
                                {/* bagian ini belom dimasukkin ke database */}
                                <TableCell>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      sx={{ padding: 0 }}
                                      components={["DateTimePicker"]}
                                    >
                                      <DemoItem sx={{ padding: 0 }}>
                                        <DateTimePicker
                                          disablePast
                                          value={
                                            result.tanggalSuratJalan.isValid()
                                              ? result.tanggalSuratJalan
                                              : null
                                          }
                                          onChange={(event) => {
                                            handleChangeInput(
                                              "tanggalSuratJalan",
                                              event,
                                              index
                                            );
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              error={
                                                params.error || !params.value
                                              }
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
                                    type="text"
                                    value={result.noSuratJalan}
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "noSuratJalan",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      sx={{ padding: 0 }}
                                      components={["DateTimePicker"]}
                                    >
                                      <DemoItem sx={{ padding: 0 }}>
                                        <DateTimePicker
                                          disablePast
                                          value={
                                            result.tanggalTerimaBarang.isValid()
                                              ? result.tanggalTerimaBarang
                                              : null
                                          }
                                          onChange={(event) => {
                                            handleChangeInput(
                                              "tanggalTerimaBarang",
                                              event,
                                              index
                                            );
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              error={
                                                params.error || !params.value
                                              }
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
                                    type="text"
                                    value={result.diterimaOleh}
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "diterimaOleh",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    type="text"
                                    value={result.fakturPajak}
                                    onChange={(event) => {
                                      handleChangeInput(
                                        "fakturPajak",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      sx={{ padding: 0 }}
                                      components={["DateTimePicker"]}
                                    >
                                      <DemoItem sx={{ padding: 0 }}>
                                        <DateTimePicker
                                          disablePast
                                          value={
                                            result.tanggalJatuhTempo.isValid()
                                              ? result.tanggalJatuhTempo
                                              : null
                                          }
                                          onChange={(event) => {
                                            handleChangeInput(
                                              "tanggalJatuhTempo",
                                              event,
                                              index
                                            );
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              error={
                                                params.error || !params.value
                                              }
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
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      sx={{ padding: 0 }}
                                      components={["DateTimePicker"]}
                                    >
                                      <DemoItem sx={{ padding: 0 }}>
                                        <DateTimePicker
                                          disablePast
                                          value={
                                            result.tanggalPengiriman.isValid()
                                              ? result.tanggalPengiriman
                                              : null
                                          }
                                          onChange={(event) => {
                                            handleChangeInput(
                                              "tanggalPengiriman",
                                              event,
                                              index
                                            );
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              error={
                                                params.error || !params.value
                                              }
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
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <TextField
                                      type="number"
                                      value={
                                        result.jumlahTerimaPengiriman?.value
                                      }
                                      onChange={(event) => {
                                        handleChangeInput(
                                          "jumlahTerimaPengiriman",
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
                                        value={
                                          result.jumlahTerimaPengiriman?.unit
                                        }
                                        onChange={(event) => {
                                          handleChangeInput(
                                            "jumlahTerimaPengiriman",
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
                                    }}
                                  >
                                    <TextField
                                      type="number"
                                      value={result.sisaPengiriman?.value}
                                      onChange={(event) => {
                                        handleChangeInput(
                                          "sisaPengiriman",
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
                                        value={result.sisaPengiriman?.unit}
                                        onChange={(event) => {
                                          handleChangeInput(
                                            "sisaPengiriman",
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
                                  <IconButton
                                    onClick={() => {
                                      handleRemoveItemPembelianBahanBaku(
                                        result.id,
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
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "32px",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    !pembelianBahanBakuId
                      ? handleAddPembelianBahanBaku(userInformation.data.id)
                      : handleEditPembelianBahanBaku(userInformation.data.id);
                  }}
                >
                  <Typography>
                    {!pembelianBahanBakuId
                      ? "Tambah Pembelian Bahan"
                      : "Edit Pembelian Bahan"}
                  </Typography>
                </DefaultButton>
                <Button
                  onClick={() => {
                    navigate(-1);
                  }}
                  variant="outlined"
                  color="error"
                  style={{ textTransform: "none", marginLeft: "8px" }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40vw",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "20px" : "2vw",
                }}
              >
                Silahkan pilih ID permohonan Pembelian
              </Typography>
            </div>
          )}
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

export default PembelianBahanBaku;
