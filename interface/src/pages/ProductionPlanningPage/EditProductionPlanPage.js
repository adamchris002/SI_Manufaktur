import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import {
  Button,
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
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../App";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import MySnackbar from "../../components/Snackbar";
import MyModal from "../../components/Modal";
import DefaultButton from "../../components/Button";
import { useAuth } from "../../components/AuthContext";
import MySelectTextField from "../../components/SelectTextField";

dayjs.extend(utc);
dayjs.extend(timezone);

const EditProductionPlanPage = (props) => {
  const { userInformation } = props;
  const location = useLocation();
  const { productionPlanId } = location.state || {};

  const navigate = useNavigate();

  const { isMobile } = useContext(AppContext);

  const [productionPlanWithData, setProductionPlanWithData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [estimasiJadwal, setEstimasiJadwal] = useState([]);
  const [estimasiBahanBaku, setEstimasiBahanBaku] = useState([]);
  console.log(estimasiBahanBaku);

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { setSuccessMessage } = useAuth();

  const [pemesan, setPemesan] = useState("");
  const [tanggalPengiriman, setTanggalPengiriman] = useState(dayjs(""));
  const [alamatPengirimanProduk, setAlamatPengirimanProduk] = useState("");
  const [jenisCetakan, setJenisCetakan] = useState("");
  const [ukuran, setUkuran] = useState("");
  const [ply, setPly] = useState("");
  const [seri, setSeri] = useState("");
  const [kuantitas, setKuantitas] = useState("");
  const [isiPerBox, setIsiPerBox] = useState("");
  const [nomorator, setNomorator] = useState("");
  const [contoh, setContoh] = useState(false);
  const [plate, setPlate] = useState(false);
  const [setting, setSetting] = useState(false);

  const [refreshProductionPlanData, setRefreshProductionPlanData] =
    useState(true);
  const [callSelectedOrder, setCallSelectedOrder] = useState(false);

  const [jenisBahan, setJenisBahan] = useState("");
  const [informasiBahan, setInformasiBahan] = useState("");

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

  const removeJadwal = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/productionPlanning/removeJadwal/${id}`,
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus data jadwal!");
        setRefreshProductionPlanData(true);
      } else {
        setOpenSnackbar(false);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus data jadwal!");
      }
    });
  };

  const deleteJadwal = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/productionPlanning/deleteJadwal/${id}`,
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus bagian jadwal!");
        setRefreshProductionPlanData(true);
      } else {
        setOpenSnackbar(false);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus bagian jadwal!");
      }
    });
  };

  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const groupBahanBakuAkanDigunakans = (data) => {
    return data.map((estimasiBahanBaku) => {
      const groupedData = estimasiBahanBaku.bahanBakuAkanDigunakans.reduce(
        (acc, item) => {
          const { groupIndex } = item;
          if (!acc[groupIndex]) {
            acc[groupIndex] = [];
          }
          acc[groupIndex].push({
            ...item,
            estimasiKebutuhan: separateValueAndUnit(item.estimasiKebutuhan),
            waste: separateValueAndUnit(item.waste),
            jumlahKebutuhan: separateValueAndUnit(item.jumlahKebutuhan),
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
        ...estimasiBahanBaku,
        bahanBakuAkanDigunakans: newBahanBakuAkanDigunakans,
      };
    });
  };

  useEffect(() => {
    if (refreshProductionPlanData) {
      axios({
        method: "GET",
        url: `http://localhost:3000/productionPlanning/getProductionPlanningWithData/${productionPlanId}`,
      }).then((result) => {
        setProductionPlanWithData(result);
        setPemesan(result.data.pemesan);
        setTanggalPengiriman(dayjs(result.data.tanggalPengirimanBarang));
        setAlamatPengirimanProduk(result.data.alamatKirimBarang);
        setJenisCetakan(result.data.jenisCetakan);
        setPly(result.data.ply);
        setUkuran(result.data.ukuran);
        setSeri(result.data.seri);
        setIsiPerBox(result.data.isiPerBox);
        setNomorator(result.data.nomorator);
        setKuantitas(result.data.kuantitas);
        setContoh(result.data.contoh);
        setPlate(result.data.plate);
        setSetting(result.data.contoh);
        setEstimasiBahanBaku(
          groupBahanBakuAkanDigunakans(result.data.estimasiBahanBakus)
        );
        setEstimasiJadwal(result.data.estimasiJadwalProdukses);
        setCallSelectedOrder(true);
        setRefreshProductionPlanData(false);
      });
    }
  }, [refreshProductionPlanData]);

  const handleRemoveDataEstimasiBahanBaku = (index) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/productionPlanning/deleteJenisBahanBaku/${index}`,
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus tabel jenis!");
        setRefreshProductionPlanData(true);
      } else {
        setOpenSnackbar(false);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus tabel jenis!");
      }
    });
  };

  const handleRemoveDataBahanBaku = (estimasiBahanBakuId, groupIndex) => {
    axios({
      method: "DELETE",
      url: "http://localhost:3000/productionPlanning/deleteGroupBahanBaku",
      params: {
        estimasiBahanBakuId: estimasiBahanBakuId,
        groupIndex: groupIndex,
      },
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus kelompok bahan baku!");
        setRefreshProductionPlanData(true);
      } else {
        setOpenSnackbar(false);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus kelompok bahan baku!");
      }
    });
  };

  const handleRemoveJenisDataBahanBaku = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/productionPlanning/deleteBahanBakuId/${id}`,
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus data bahan baku!");
        setRefreshProductionPlanData(true);
      } else {
        setOpenSnackbar(false);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus data bahan baku!");
      }
    });
  };

  const handleCloseAddJenisModal = () => {
    setJenisBahan("");
    setInformasiBahan("");
    setOpenModal(false);
  };

  const handleAddDataJenis = (itemIndex, dataItemIndex) => {
    setEstimasiBahanBaku((oldArray) =>
      oldArray.map((item, i) =>
        i === itemIndex
          ? {
              ...item,
              bahanBakuAkanDigunakans: item.bahanBakuAkanDigunakans.map(
                (dataItem, j) =>
                  j === dataItemIndex
                    ? {
                        ...dataItem,
                        dataJenis: [
                          ...dataItem.dataJenis,
                          {
                            namaJenis: "",
                            dataInformasi: "",
                            warna: "",
                            estimasiKebutuhan: "",
                            waste: "",
                            jumlahKebutuhan: "",
                          },
                        ],
                      }
                    : dataItem
              ),
            }
          : item
      )
    );
  };

  const handleAddJenis = () => {
    if (jenisBahan === "" || informasiBahan === "") {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Please fill in all the fields");
    } else {
      setEstimasiBahanBaku((oldArray) => [
        ...oldArray,
        {
          jenis: jenisBahan,
          informasiBahan: informasiBahan,
          productionPlanningId: productionPlanId,
          bahanBakuAkanDigunakans: [
            {
              dataJenis: [
                {
                  namaJenis: "",
                  dataInformasi: "",
                  warna: "",
                  estimasiKebutuhan: "",
                  waste: "",
                  jumlahKebutuhan: "",
                },
              ],
            },
          ],
        },
      ]);
      setJenisBahan("");
      setInformasiBahan("");
      setOpenModal(false);
    }
  };

  const handleAddData = (index) => {
    setEstimasiBahanBaku((oldArray) =>
      oldArray.map((item, i) =>
        i === index
          ? {
              ...item,
              bahanBakuAkanDigunakans: [
                ...item.bahanBakuAkanDigunakans,
                {
                  dataJenis: [
                    {
                      namaJenis: "",
                      informasiJenis: "",
                      warna: "",
                      estimasiKebutuhan: "",
                      waste: "",
                      jumlahKebutuhan: "",
                    },
                  ],
                },
              ],
            }
          : item
      )
    );
  };

  const isEstimasiBahanBakuComplete = () => {
    for (const item of estimasiBahanBaku) {
      if (item.jenis === "" || item.informasi === "") {
        return false;
      }
      for (const dataItem of item.bahanBakuAkanDigunakans) {
        for (const dataJenisItem of dataItem.dataJenis) {
          if (
            dataJenisItem.estimasiKebutuhan.value === "" ||
            dataJenisItem.estimasiKebutuhan.unit === "" ||
            dataJenisItem.dataInformasi === "" ||
            dataJenisItem.jumlahKebutuhan.value === "" ||
            dataJenisItem.jumlahKebutuhan.unit === "" ||
            dataJenisItem.namaJenis === "" ||
            dataJenisItem.warna === "" ||
            dataJenisItem.waste.value === "" ||
            dataJenisItem.waste.unit === ""
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const isEstimasiJadwalEmpty = () => {
    for (const item of estimasiJadwal) {
      if (item.pekerjaan === "") {
        return false;
      }
      for (const pekerjaanItem of item.rencanaJadwalProdukses) {
        if (
          pekerjaanItem.jenisPekerjaan === "" ||
          pekerjaanItem.tanggalMulai === "" ||
          pekerjaanItem.tanggalSelesai === "" ||
          pekerjaanItem.jumlahHari === ""
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const transformDataForSubmission = (data) => {
    return data.map((item) => {
      return {
        ...item,
        bahanBakuAkanDigunakans: item.bahanBakuAkanDigunakans.map(
          (dataItem) => {
            return {
              ...dataItem,
              dataJenis: dataItem.dataJenis.map((dataJenisItem) => {
                return {
                  ...dataJenisItem,
                  estimasiKebutuhan: `${dataJenisItem.estimasiKebutuhan.value} ${dataJenisItem.estimasiKebutuhan.unit}`,
                  waste: `${dataJenisItem.waste.value} ${dataJenisItem.waste.unit}`,
                  jumlahKebutuhan: `${dataJenisItem.jumlahKebutuhan.value} ${dataJenisItem.jumlahKebutuhan.unit}`,
                };
              }),
            };
          }
        ),
      };
    });
  };

  const handleUpdatePerencanaanProduksi = () => {
    const checkIfEstimasiBahanBakuEmpty = isEstimasiBahanBakuComplete();
    const checkIfEstimasiJadwalEmpty = isEstimasiJadwalEmpty();

    const updatedEstimasiBahanBaku =
      transformDataForSubmission(estimasiBahanBaku);

    const perencanaanProduksiData = {
      pemesan: pemesan,
      tanggalPengirimanBarang: tanggalPengiriman,
      alamatKirimBarang: alamatPengirimanProduk,
      jenisCetakan: jenisCetakan,
      ukuran: ukuran,
      ply: ply,
      seri: seri,
      kuantitas: kuantitas,
      isiPerBox: isiPerBox,
      nomorator: nomorator,
      contoh: contoh,
      plate: plate,
      setting: setting,
      estimasiBahanBaku: updatedEstimasiBahanBaku,
      estimasiJadwal: estimasiJadwal,
      productionPlanId: productionPlanId,
    };
    if (
      pemesan === "" ||
      tanggalPengiriman === "" ||
      alamatPengirimanProduk === "" ||
      jenisCetakan === "" ||
      ukuran === "" ||
      ply === "" ||
      seri === "" ||
      kuantitas === "" ||
      isiPerBox === "" ||
      nomorator === "" ||
      estimasiJadwal.length === 0 ||
      estimasiBahanBaku.length === 0 ||
      checkIfEstimasiBahanBakuEmpty === false ||
      checkIfEstimasiJadwalEmpty === false
    ) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Please fill in all the fields");
    } else {
      axios({
        method: "PUT",
        url: `http://localhost:3000/productionPlanning/updateProductionPlan/${userInformation.data.id}`,
        data: perencanaanProduksiData,
      }).then((result) => {
        if (result.status === 200) {
          setSnackbarStatus(true);
          setSuccessMessage("You have updated a Production Plan!");
          setRefreshProductionPlanData(true);
          // navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Error in creating Production Plan!");
        }
      });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const addPekerjaan = (index) => {
    setEstimasiJadwal((oldArray) =>
      oldArray.map((item, i) =>
        i === index
          ? {
              ...item,
              rencanaJadwalProdukses: [
                ...item.rencanaJadwalProdukses,
                {
                  jenisPekerjaan: "",
                  tanggalMulai: null,
                  tanggalSelesai: null,
                  jumlahHari: "",
                },
              ],
            }
          : item
      )
    );
  };
  const addEstimasiJadwal = () => {
    setEstimasiJadwal((oldArray) => [
      ...oldArray,
      {
        bagian: "",
        productionPlanningId: productionPlanId,
        rencanaJadwalProdukses: [
          {
            jenisPekerjaan: "",
            tanggalMulai: null,
            tanggalSelesai: null,
            jumlahHari: "",
          },
        ],
      },
    ]);
  };

  const handleRemovePekerjaan = (index, pekerjaanIndex) => {
    setEstimasiJadwal((oldArray) => {
      return oldArray.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            rencanaJadwalProdukses: item.rencanaJadwalProdukses.filter(
              (_, j) => j !== pekerjaanIndex
            ),
          };
        }
        return item;
      });
    });
  };

  const handleInputChange = (event, index, pekerjaanIndex, field) => {
    const value = event && event.target ? event.target.value : event;

    setEstimasiJadwal((oldArray) => {
      const newArray = oldArray.map((item, i) => {
        if (i === index) {
          const newItem = { ...item };
          if (field === "bagian") {
            newItem.bagian = value;
          } else {
            const pekerjaanArray = newItem.rencanaJadwalProdukses.map(
              (pekerjaan, j) => {
                if (j === pekerjaanIndex) {
                  const newPekerjaan = { ...pekerjaan, [field]: value };
                  if (field === "tanggalMulai" || field === "tanggalSelesai") {
                    newPekerjaan.jumlahHari = perbedaanHariJam(
                      newPekerjaan.tanggalMulai,
                      newPekerjaan.tanggalSelesai
                    );
                  }
                  return newPekerjaan;
                }
                return pekerjaan;
              }
            );
            newItem.rencanaJadwalProdukses = pekerjaanArray;
          }
          return newItem;
        }
        return item;
      });
      return newArray;
    });
  };

  const handleInputChangeEstimasiBahanBaku = (
    event,
    index,
    dataIndex,
    dataJenisIndex,
    field,
    unit
  ) => {
    const value = event.target.value;

    setEstimasiBahanBaku((oldArray) => {
      const newState = oldArray.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            bahanBakuAkanDigunakans: item.bahanBakuAkanDigunakans.map(
              (dataItem, j) => {
                if (j === dataIndex) {
                  return {
                    ...dataItem,
                    dataJenis: dataItem.dataJenis.map((dataJenisItem, k) => {
                      if (k === dataJenisIndex) {
                        if (unit) {
                          return {
                            ...dataJenisItem,
                            [field]: {
                              value: dataJenisItem[field],
                              unit: value,
                            },
                          };
                        } else {
                          return {
                            ...dataJenisItem,
                            [field]: value,
                          };
                        }
                      }
                      return dataJenisItem;
                    }),
                  };
                }
                return dataItem;
              }
            ),
          };
        }
        return item;
      });
      return newState;
    });
  };

  const perbedaanHariJam = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return "";
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      return "";
    }

    const duration = end.diff(start, "hour", true);
    const days = Math.floor(duration / 24);
    const hours = Math.floor(duration % 24);

    return `${days} Hari ${hours} Jam`;
  };

  useEffect(() => {
    if (callSelectedOrder) {
      axios({
        method: "GET",
        url: "http://localhost:3000/productionPlanning/getOneOrder",
        params: { orderId: productionPlanWithData?.data?.orderId },
      }).then((result) => {
        setSelectedOrder(result);
        setCallSelectedOrder(false);
      });
    }
  }, [callSelectedOrder]);

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
          <Typography style={{ fontSize: "3.5vw", color: "#0F607D" }}>
            Edit Rencana Produksi
          </Typography>
        </div>
        <div
          style={{
            marginTop: "24px",
          }}
        >
          {productionPlanWithData.length !== 0 && (
            <div
              style={{
                width: "100%",
                border: "2px solid #0F607D",
                borderRadius: "10px",
                marginTop: "32px",
              }}
            >
              <div style={{ margin: "24px" }}>
                <Typography style={{ fontSize: "2.5vw", color: "#0F607D" }}>
                  Production Plan
                </Typography>
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#0F607D",
                    margin: " 24px 0px ",
                    borderRadius: "5px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "16px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontSize: isMobile ? "12px" : "1.5vw",
                        marginRight: "8px",
                      }}
                    >
                      Pemesan:
                    </Typography>
                    <TextField
                      type="text"
                      value={pemesan}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "15px" : "3vw",
                          width: isMobile ? "90px" : "12vw",
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
                      onChange={(current) => {
                        setPemesan(current.target.value);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontSize: isMobile ? "12px" : "1.5vw",
                        marginRight: "8px",
                      }}
                    >
                      Tanggal Pengiriman:
                    </Typography>
                    <div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          sx={{ padding: 0 }}
                          components={["DateTimePicker"]}
                        >
                          <DemoItem sx={{ padding: 0 }}>
                            <DateTimePicker
                              value={tanggalPengiriman}
                              disablePast
                              maxDateTime={dayjs(
                                selectedOrder?.data?.orderDueDate
                              )}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                      <Typography>{`Tanggal jatuh tempo: ${dayjs(
                        selectedOrder?.data?.orderDueDate
                      ).format("MM/DD/YYYY hh:mm A")}`}</Typography>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: isMobile ? "12px" : "1.5vw",
                      color: "#0F607D",
                      marginRight: "8px",
                    }}
                  >
                    Alamat Pengiriman Produk:
                  </Typography>
                  <TextField
                    type="text"
                    value={alamatPengirimanProduk}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: isMobile ? "15px" : "3vw",
                        width: isMobile ? "150px" : "25vw",
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
                    onChange={(event) => {
                      setAlamatPengirimanProduk(event.target.value);
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "32px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
                        color: "#0F607D",
                        marginRight: "8px",
                      }}
                    >
                      Jenis Cetakan:
                    </Typography>
                    <TextField
                      type="text"
                      value={jenisCetakan}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "15px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
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
                      onChange={(current) => {
                        setJenisCetakan(current.target.value);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
                        color: "#0F607D",
                        marginRight: "8px",
                      }}
                    >
                      Ply:
                    </Typography>
                    <TextField
                      type="text"
                      value={ply}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "15px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
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
                      onChange={(current) => {
                        setPly(current.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
                        color: "#0F607D",
                        marginRight: "8px",
                      }}
                    >
                      Ukuran:
                    </Typography>
                    <TextField
                      type="text"
                      value={ukuran}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "15px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
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
                      onChange={(current) => {
                        setUkuran(current.target.value);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
                        color: "#0F607D",
                        marginRight: "8px",
                      }}
                    >
                      Seri:
                    </Typography>
                    <TextField
                      type="text"
                      value={seri}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "15px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
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
                      onChange={(current) => {
                        setSeri(current.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
                        color: "#0F607D",
                        marginRight: "8px",
                      }}
                    >
                      Kuantitas:
                    </Typography>
                    <TextField
                      type="text"
                      value={kuantitas}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "15px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
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
                      onChange={(current) => {
                        setKuantitas(current.target.value);
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
                        color: "#0F607D",
                        marginRight: "8px",
                      }}
                    >
                      Nomorator:
                    </Typography>
                    <TextField
                      type="text"
                      value={nomorator}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "15px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
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
                      onChange={(current) => {
                        setNomorator(current.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: isMobile ? "12px" : "1.5vw",
                      color: "#0F607D",
                      marginRight: "8px",
                    }}
                  >
                    Isi Per Box:
                  </Typography>
                  <TextField
                    type="text"
                    value={isiPerBox}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: isMobile ? "15px" : "3vw",
                        width: isMobile ? "90px" : "10vw",
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
                    onChange={(current) => {
                      setIsiPerBox(current.target.value);
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "32px",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
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
                          value={contoh}
                          onChange={() => {
                            setContoh(!contoh);
                          }}
                          name="loading"
                          color="primary"
                        />
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "48%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
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
                          value={setting}
                          onChange={() => {
                            setSetting(!setting);
                          }}
                          name="loading"
                          color="primary"
                        />
                      }
                    />
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    style={{
                      fontSize: isMobile ? "12px" : "1.5vw",
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
                        value={plate}
                        onChange={() => {
                          setPlate(!plate);
                        }}
                        name="loading"
                        color="primary"
                      />
                    }
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#0F607D",
                    margin: " 24px 0px ",
                    borderRadius: "5px",
                  }}
                />
                <div
                  style={{
                    marginTop: "32px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                    Bahan Baku dan Bahan Pembantu
                  </Typography>
                  <IconButton
                    style={{ height: "50%", marginLeft: "8px" }}
                    onClick={() => {
                      setOpenModal(true);
                    }}
                  >
                    <AddIcon style={{ color: "#0F607D" }} />
                  </IconButton>
                </div>
                <div>
                  {estimasiBahanBaku?.map((result, index) => {
                    return (
                      <div key={index} style={{ marginTop: "32px" }}>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow key={index}>
                                <TableCell>No.</TableCell>
                                <TableCell align="left">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {result?.jenis}
                                  </div>
                                </TableCell>
                                <TableCell align="left">
                                  {result?.informasi}
                                </TableCell>
                                <TableCell align="left">Warna</TableCell>
                                <TableCell align="left">
                                  Estimasi Kebutuhan
                                </TableCell>
                                <TableCell align="left">Waste</TableCell>
                                <TableCell align="left">
                                  Jumlah Kebutuhan
                                </TableCell>
                                <TableCell>Actions</TableCell>
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
                                            <TextField
                                              value={dataJenis?.namaJenis}
                                              onChange={(event) => {
                                                handleInputChangeEstimasiBahanBaku(
                                                  event,
                                                  index,
                                                  dataItemIndex,
                                                  dataJenisIndex,
                                                  "namaJenis"
                                                );
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              value={dataJenis.dataInformasi}
                                              onChange={(event) => {
                                                handleInputChangeEstimasiBahanBaku(
                                                  event,
                                                  index,
                                                  dataItemIndex,
                                                  dataJenisIndex,
                                                  "dataInformasi"
                                                );
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <TextField
                                              value={dataJenis.warna}
                                              onChange={(event) => {
                                                handleInputChangeEstimasiBahanBaku(
                                                  event,
                                                  index,
                                                  dataItemIndex,
                                                  dataJenisIndex,
                                                  "warna"
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
                                                value={
                                                  dataJenis.estimasiKebutuhan
                                                    .value
                                                }
                                                onChange={(event) => {
                                                  handleInputChangeEstimasiBahanBaku(
                                                    event,
                                                    index,
                                                    dataItemIndex,
                                                    dataJenisIndex,
                                                    "estimasiKebutuhan"
                                                  );
                                                }}
                                              />
                                              <div
                                                style={{ marginLeft: "8px" }}
                                              >
                                                <MySelectTextField
                                                  type="text"
                                                  width={
                                                    isMobile ? "50px" : "55px"
                                                  }
                                                  height={
                                                    isMobile ? "15px" : "55px"
                                                  }
                                                  borderRadius="10px"
                                                  data={units}
                                                  fontSize={
                                                    isMobile ? "10px" : "0.8vw"
                                                  }
                                                  value={
                                                    dataJenis.estimasiKebutuhan
                                                      .unit
                                                  }
                                                  onChange={(event) => {
                                                    handleInputChangeEstimasiBahanBaku(
                                                      event,
                                                      index,
                                                      dataItemIndex,
                                                      dataJenisIndex,
                                                      "estimasiKebutuhan",
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
                                                value={dataJenis.waste.value}
                                                type="number"
                                                onChange={(event) => {
                                                  handleInputChangeEstimasiBahanBaku(
                                                    event,
                                                    index,
                                                    dataItemIndex,
                                                    dataJenisIndex,
                                                    "waste"
                                                  );
                                                }}
                                              />
                                              <div
                                                style={{ marginLeft: "8px" }}
                                              >
                                                <MySelectTextField
                                                  type="text"
                                                  width={
                                                    isMobile ? "50px" : "55px"
                                                  }
                                                  height={
                                                    isMobile ? "15px" : "55px"
                                                  }
                                                  borderRadius="10px"
                                                  data={units}
                                                  fontSize={
                                                    isMobile ? "10px" : "0.8vw"
                                                  }
                                                  value={dataJenis.waste.unit}
                                                  onChange={(event) => {
                                                    handleInputChangeEstimasiBahanBaku(
                                                      event,
                                                      index,
                                                      dataItemIndex,
                                                      dataJenisIndex,
                                                      "waste",
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
                                                value={
                                                  dataJenis.jumlahKebutuhan
                                                    .value
                                                }
                                                onChange={(event) => {
                                                  handleInputChangeEstimasiBahanBaku(
                                                    event,
                                                    index,
                                                    dataItemIndex,
                                                    dataJenisIndex,
                                                    "jumlahKebutuhan"
                                                  );
                                                }}
                                              />
                                              <div
                                                style={{ marginLeft: "8px" }}
                                              >
                                                <MySelectTextField
                                                  type="text"
                                                  width={
                                                    isMobile ? "50px" : "55px"
                                                  }
                                                  height={
                                                    isMobile ? "15px" : "55px"
                                                  }
                                                  borderRadius="10px"
                                                  data={units}
                                                  fontSize={
                                                    isMobile ? "10px" : "0.8vw"
                                                  }
                                                  value={
                                                    dataJenis.jumlahKebutuhan
                                                      .unit
                                                  }
                                                  onChange={(event) => {
                                                    handleInputChangeEstimasiBahanBaku(
                                                      event,
                                                      index,
                                                      dataItemIndex,
                                                      dataJenisIndex,
                                                      "jumlahKebutuhan",
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
                                              {dataJenisIndex === 0 ? (
                                                <>
                                                  <IconButton
                                                    onClick={() => {
                                                      handleAddDataJenis(
                                                        index,
                                                        dataItemIndex
                                                      );
                                                    }}
                                                    style={{ height: "50%" }}
                                                  >
                                                    <AddIcon
                                                      style={{
                                                        color: "#0F607D",
                                                      }}
                                                    />
                                                  </IconButton>
                                                  <IconButton
                                                    style={{ height: "50%" }}
                                                  >
                                                    <DeleteIcon
                                                      onClick={() => {
                                                        handleRemoveDataBahanBaku(
                                                          dataJenis.estimasiBahanBakuId,
                                                          dataJenis.groupIndex
                                                        );
                                                      }}
                                                      style={{ color: "red" }}
                                                    />
                                                  </IconButton>
                                                </>
                                              ) : (
                                                <IconButton
                                                  onClick={() => {
                                                    handleRemoveJenisDataBahanBaku(
                                                      dataJenis.id
                                                    );
                                                  }}
                                                  style={{ height: "50%" }}
                                                >
                                                  <RemoveIcon
                                                    style={{ color: "red" }}
                                                  />
                                                </IconButton>
                                              )}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </React.Fragment>
                                )
                              )}
                            </TableBody>
                          </Table>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              margin: "16px",
                            }}
                          >
                            <DefaultButton
                              onClickFunction={() => handleAddData(index)}
                            >{`Tambah Kelompok ${result.jenis}`}</DefaultButton>
                            <Button
                              onClick={() => {
                                handleRemoveDataEstimasiBahanBaku(result.id);
                              }}
                              sx={{ marginLeft: "8px", textTransform: "none" }}
                              variant="outlined"
                              color="error"
                            >{`Hapus Tabel ${result.jenis}`}</Button>
                          </div>
                        </TableContainer>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#0F607D",
                    margin: " 24px 0px ",
                    borderRadius: "5px",
                  }}
                />
                <div style={{ marginTop: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontSize: "2vw",
                        marginRight: "8px",
                      }}
                    >
                      Jangka Waktu Produksi
                    </Typography>
                    <IconButton
                      style={{ height: "50%" }}
                      onClick={() => {
                        addEstimasiJadwal();
                      }}
                    >
                      <AddIcon style={{ color: "#0F607D" }} />
                    </IconButton>
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Bagian</TableCell>
                            <TableCell align="left">Jenis Pekerjaan </TableCell>
                            <TableCell align="left">Tanggal Mulai</TableCell>
                            <TableCell align="left">Tanggal Selesai</TableCell>
                            <TableCell align="left">Jumlah Hari</TableCell>
                            <TableCell align="left">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {estimasiJadwal?.map((row, index) => (
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
                                      <TableCell>
                                        <TextField
                                          value={row.bagian}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e,
                                              index,
                                              pekerjaanIndex,
                                              "bagian"
                                            )
                                          }
                                        />
                                      </TableCell>
                                    ) : (
                                      <TableCell></TableCell>
                                    )}
                                    <TableCell align="left">
                                      <TextField
                                        value={pekerjaan.jenisPekerjaan}
                                        onChange={(e) =>
                                          handleInputChange(
                                            e,
                                            index,
                                            pekerjaanIndex,
                                            "jenisPekerjaan"
                                          )
                                        }
                                      />
                                    </TableCell>
                                    <TableCell align="left">
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          sx={{ padding: 0 }}
                                          components={["DateTimePicker"]}
                                        >
                                          <DemoItem sx={{ padding: 0 }}>
                                            <DateTimePicker
                                              value={dayjs(
                                                pekerjaan.tanggalMulai
                                              )}
                                              disablePast
                                              maxDateTime={dayjs(
                                                selectedOrder?.data
                                                  ?.orderDueDate
                                              )}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  dayjs(e),
                                                  index,
                                                  pekerjaanIndex,
                                                  "tanggalMulai"
                                                )
                                              }
                                            />
                                          </DemoItem>
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </TableCell>
                                    <TableCell align="left">
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DateTimePicker"]}
                                          sx={{ padding: 0 }}
                                        >
                                          <DemoItem>
                                            <DateTimePicker
                                              value={dayjs(
                                                pekerjaan.tanggalSelesai
                                              )}
                                              disablePast
                                              minDateTime={
                                                pekerjaan.tanggalMulai !== ""
                                                  ? dayjs(
                                                      pekerjaan.tanggalMulai
                                                    )
                                                  : ""
                                              }
                                              maxDateTime={dayjs(
                                                selectedOrder?.data
                                                  ?.orderDueDate
                                              )}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  dayjs(e),
                                                  index,
                                                  pekerjaanIndex,
                                                  "tanggalSelesai"
                                                )
                                              }
                                            />
                                          </DemoItem>
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </TableCell>
                                    <TableCell align="left">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <TextField
                                          disabled
                                          value={pekerjaan.jumlahHari}
                                        />
                                      </div>
                                    </TableCell>
                                    <TableCell align="left">
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {pekerjaanIndex !== 0 ? (
                                          <IconButton
                                            style={{
                                              marginLeft: "8px",
                                              height: "50%",
                                            }}
                                            onClick={() => {
                                              removeJadwal(pekerjaan.id);
                                            }}
                                          >
                                            <RemoveIcon
                                              style={{ color: "red" }}
                                            />
                                          </IconButton>
                                        ) : (
                                          <>
                                            <IconButton
                                              onClick={() => {
                                                addPekerjaan(index);
                                              }}
                                            >
                                              <AddIcon
                                                style={{ color: "#0F607D" }}
                                              />
                                            </IconButton>
                                            <IconButton
                                              style={{
                                                marginLeft: "8px",
                                                height: "50%",
                                              }}
                                              onClick={() => {
                                                deleteJadwal(row.id);
                                              }}
                                            >
                                              <DeleteIcon
                                                style={{ color: "red" }}
                                              />
                                            </IconButton>
                                          </>
                                        )}
                                      </div>
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
              </div>
            </div>
          )}
          {productionPlanWithData.length !== 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleUpdatePerencanaanProduksi();
                }}
              >
                <Typography style={{ fontSize: "20px" }}>
                  Edit Perencanaan Produksi
                </Typography>
              </DefaultButton>
              <Button
                sx={{ marginLeft: "8px" }}
                variant="outlined"
                color="error"
                onClick={() => {
                  navigate(-1);
                }}
              >
                <Typography>Cancel</Typography>
              </Button>
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
      {openModal === true && (
        <MyModal open={openModal} handleClose={handleCloseModal}>
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "60vw",
              maxHeight: "80vh",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "6vw" : "2vw",
                }}
              >
                Tambah Jenis Bahan Baku dan Bahan Pembantu
              </Typography>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <div style={{ width: "50%" }}>
                <Typography
                  style={{
                    color: "#0F607D",
                    fontSize: isMobile ? "3.5vw" : "1.5vw",
                  }}
                >
                  Jenis Bahan:{" "}
                </Typography>
              </div>
              <div
                style={{
                  width: "50% ",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  onChange={(current) => {
                    setJenisBahan(current.target.value);
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "8px",
              }}
            >
              <div style={{ width: "50%" }}>
                <Typography
                  style={{
                    color: "#0F607D",
                    fontSize: isMobile ? "3.5vw" : "1.5vw",
                  }}
                >
                  {"Informasi (contoh: Gramatur, Ukuran & Dst): "}
                </Typography>
              </div>
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TextField
                  onChange={(current) => {
                    setInformasiBahan(current.target.value);
                  }}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <DefaultButton
                height={isMobile ? "30px" : "3vw"}
                width={isMobile ? "80px" : "10vw"}
                backgroundColor="#0F607D"
                borderRadius="10px"
                fontSize={isMobile ? "10px" : "0.9vw"}
                onClickFunction={() => {
                  handleAddJenis();
                }}
              >
                Add Jenis
              </DefaultButton>
              <Button
                variant="outlined"
                color="error"
                style={{
                  marginLeft: "2vw",
                  height: isMobile ? "30px" : "3vw",
                  width: isMobile ? "80px" : "10vw",
                  borderRadius: "10px",
                  fontSize: isMobile ? "10px" : "0.9vw",
                  textTransform: "none",
                }}
                onClick={() => {
                  handleCloseAddJenisModal();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </MyModal>
      )}
    </div>
  );
};

export default EditProductionPlanPage;
