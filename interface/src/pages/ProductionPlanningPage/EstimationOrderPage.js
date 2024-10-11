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
import MySelectTextField from "../../components/SelectTextField";
import { useNavigate } from "react-router-dom";
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
import { NumericFormat } from "react-number-format";

dayjs.extend(utc);
dayjs.extend(timezone);

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

const EstimationOrderPage = (props) => {
  const { userInformation } = props;

  const navigate = useNavigate();

  const { isMobile } = useContext(AppContext);

  const [allOrderID, setAllOrderID] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [estimasiJadwal, setEstimasiJadwal] = useState([]);
  const [estimasiBahanBaku, setEstimasiBahanBaku] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { setSuccessMessage } = useAuth();

  const [allInventoryItem, setAllInventoryItem] = useState([]);

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

  const [rincianCetakan, setRincianCetakan] = useState([
    {
      namaCetakan: "",
      ukuran: "",
      jenisKertas: "",
      beratKertas: "",
      warna: "",
      kuantitas: { value: "", unit: "" },
      ply: "",
      isi: { value: "", unit: "" },
      nomorator: "",
      keterangan: "",
    },
  ]);

  const [dataPerincian, setDataPerincian] = useState([
    {
      namaRekanan: "",
      keterangan: "",
      jenisCetakan: "",
      isi: { value: "", unit: "" },
      harga: "",
    },
  ]);

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

  const transformDataForSubmissionPerincian = (data) => {
    return data.map((item) => {
      return {
        ...item,
        isi: `${item.isi.value} ${item.isi.unit}`,
      };
    });
  };

  const transformDataForSubmissionRincianCetakan = (data) => {
    return data.map((item) => {
      return {
        ...item,
        isi: `${item.isi.value} ${item.isi.unit}`,
        kuantitas: `${item.kuantitas.value} ${item.kuantitas.unit}`,
      };
    });
  };

  const transformDataForSubmission = (data) => {
    return data.map((item) => {
      return {
        ...item,
        data: item.data.map((dataItem) => {
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
        }),
      };
    });
  };

  const handleRemoveDataEstimasiBahanBaku = (index) => {
    setEstimasiBahanBaku((oldArray) => oldArray.filter((_, i) => i !== index));
  };

  const handleRemoveDataBahanBaku = (index, dataItemIndex) => {
    setEstimasiBahanBaku((oldArray) =>
      oldArray.map((result, i) =>
        i === index
          ? {
              ...result,
              data: result.data.filter((data, j) => j !== dataItemIndex),
            }
          : result
      )
    );
  };

  const handleRemoveJenisDataBahanBaku = (
    resultIndex,
    dataItemIndex,
    dataJenisIndex
  ) => {
    setEstimasiBahanBaku((oldArray) =>
      oldArray.map((result, i) =>
        i === resultIndex
          ? {
              ...result,
              data: result.data.map((dataItem, j) =>
                j === dataItemIndex
                  ? {
                      ...dataItem,
                      dataJenis: dataItem.dataJenis.filter(
                        (dataJenis, k) => k !== dataJenisIndex
                      ),
                    }
                  : dataItem
              ),
            }
          : result
      )
    );
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
              data: item.data.map((dataItem, j) =>
                j === dataItemIndex
                  ? {
                      ...dataItem,
                      dataJenis: [
                        ...dataItem.dataJenis,
                        {
                          namaJenis: "",
                          informasiJenis: "",
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
          data: [
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
        },
      ]);
      setJenisBahan("");
      setInformasiBahan("");
      setOpenModal(false);
    }
  };

  const handleTambahPerincian = () => {
    setDataPerincian((oldArray) => [
      ...oldArray,
      {
        namaRekanan: "",
        keterangan: "",
        jenisCetakan: "",
        isi: { value: "", unit: "" },
        harga: "",
      },
    ]);
  };

  const handleTambahRincianCetakan = () => {
    setRincianCetakan((oldArray) => [
      ...oldArray,
      {
        namaCetakan: "",
        ukuran: "",
        jenisKertas: "",
        beratKertas: "",
        warna: "",
        kuantitas: { value: "", unit: "" },
        ply: "",
        isi: { value: "", unit: "" },
        nomorator: "",
        keterangan: "",
      },
    ]);
    setDataPerincian((oldArray) => [
      ...oldArray,
      {
        namaRekanan: "",
        keterangan: "",
        jenisCetakan: "",
        isi: { value: "", unit: "" },
        harga: "",
      },
    ]);
  };

  const handleAddData = (index) => {
    setEstimasiBahanBaku((oldArray) =>
      oldArray.map((item, i) =>
        i === index
          ? {
              ...item,
              data: [
                ...item.data,
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
      if (!item.jenis || !item.informasiBahan) {
        return false;
      }
      for (const dataItem of item.data) {
        for (const dataJenisItem of dataItem.dataJenis) {
          if (
            !dataJenisItem.estimasiKebutuhan.value ||
            !dataJenisItem.estimasiKebutuhan.unit ||
            !dataJenisItem.informasiJenis ||
            !dataJenisItem.jumlahKebutuhan.value ||
            !dataJenisItem.jumlahKebutuhan.unit ||
            !dataJenisItem.namaJenis ||
            !dataJenisItem.warna ||
            !dataJenisItem.waste.value ||
            !dataJenisItem.waste.unit
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const isRincianCetakanEmpty = () => {
    for (const item of rincianCetakan) {
      if (
        !item.namaCetakan ||
        !item.ukuran ||
        !item.jenisKertas ||
        !item.beratKertas ||
        !item.warna ||
        !item.kuantitas.value ||
        !item.kuantitas.unit ||
        !item.ply ||
        !item.isi.value ||
        !item.isi.unit ||
        !item.nomorator ||
        !item.keterangan
      ) {
        return false;
      }
    }
    return true;
  };

  const isEstimasiJadwalEmpty = () => {
    for (const item of estimasiJadwal) {
      if (!item.pekerjaan) {
        return false;
      }
      for (const pekerjaanItem of item.pekerjaan) {
        if (
          !pekerjaanItem.jenisPekerjaan ||
          !pekerjaanItem.tanggalMulai ||
          !pekerjaanItem.tanggalSelesai ||
          !pekerjaanItem.jumlahHari
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const isPerincianEmpty = () => {
    for (const item of dataPerincian) {
      if (
        !item.namaRekanan ||
        !item.keterangan ||
        !item.jenisCetakan ||
        !item.isi.value ||
        !item.isi.unit ||
        !item.harga
      ) {
        return false;
      }
    }
    return true;
  };

  const handleDeleteItemRincianCetakan = (index) => {
    setRincianCetakan((oldArray) => oldArray.filter((_, j) => j !== index));
    setDataPerincian((oldArray) => oldArray.filter((_, j) => j !== index));
  };

  const handleDeleteItemPerincian = (index) => {
    setDataPerincian((oldArray) => oldArray.filter((_, j) => j !== index));
  };

  const handleAddPerencanaanProduksi = () => {
    const checkIfEstimasiBahanBakuEmpty = isEstimasiBahanBakuComplete();
    const checkIfEstimasiJadwalEmpty = isEstimasiJadwalEmpty();
    const checkIfRincianCetakanEmpty = isRincianCetakanEmpty();
    const checkIfPerincianEmpty = isPerincianEmpty();

    const newEstimasiBahanBaku = transformDataForSubmission(estimasiBahanBaku);
    const newRincianCetakan =
      transformDataForSubmissionRincianCetakan(rincianCetakan);
    const newPerincian = transformDataForSubmissionPerincian(dataPerincian);

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
      orderId: selectedOrder.data.id,
      setting: setting,
      estimasiBahanBaku: newEstimasiBahanBaku,
      estimasiJadwal: estimasiJadwal,
      rincianCetakan: newRincianCetakan,
      perincian: newPerincian,
      selectedOrderId: selectedOrder.data.id,
    };

    if (
      pemesan === "" ||
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
      checkIfEstimasiJadwalEmpty === false ||
      checkIfRincianCetakanEmpty === false ||
      checkIfPerincianEmpty === false ||
      tanggalPengiriman === "" ||
      !dayjs(tanggalPengiriman, "MM/DD/YYYY hh:mm A", true).isValid()
    ) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Please fill in all the fields");
    } else {
      axios({
        method: "POST",
        url: `http://localhost:5000/productionPlanning/addProductionPlanning/${userInformation.data.id}`,
        data: perencanaanProduksiData,
      }).then((result) => {
        if (result.status === 200) {
          setSnackbarStatus(true);
          setSuccessMessage("You have created a Production Plan!");
          navigate(-1);
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
              pekerjaan: [
                ...item.pekerjaan,
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
        pekerjaan: [
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
            pekerjaan: item.pekerjaan.filter((_, j) => j !== pekerjaanIndex),
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
            const pekerjaanArray = newItem.pekerjaan.map((pekerjaan, j) => {
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
            });
            newItem.pekerjaan = pekerjaanArray;
          }
          return newItem;
        }
        return item;
      });
      return newArray;
    });
  };

  const handleChangeInputPerincian = (event, index, field, unit) => {
    const value = event && event.target ? event.target.value : event;
    setDataPerincian((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        let updatedItem = { ...item };
        if (i === index) {
          if (unit) {
            updatedItem = {
              ...updatedItem,
              [field]: {
                value: item[field]?.value || "",
                unit: value,
              },
            };
          } else {
            if (field === "isi") {
              updatedItem = {
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
      return updatedItems;
    });
  };

  const handleInputChangeRincianCetakan = (event, index, field, unit) => {
    const value = event && event.target ? event.target.value : event;
    setRincianCetakan((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        let updatedItem = { ...item };
        if (i === index) {
          if (unit) {
            updatedItem = {
              ...updatedItem,
              [field]: {
                value: item[field]?.value || "",
                unit: value,
              },
            };
            if (field === "isi") {
              setDataPerincian((oldArray) => {
                const newArray = [...oldArray];
                newArray[index] = {
                  ...newArray[index],
                  isi: {
                    ...newArray[index].isi,
                    unit: value,
                  },
                };
                return newArray;
              });
            }
          } else {
            if (field === "kuantitas" || field === "isi") {
              if (field === "isi") {
                setDataPerincian((oldArray) => {
                  const newArray = [...oldArray];
                  newArray[index] = {
                    ...newArray[index],
                    isi: {
                      ...newArray[index].isi,
                      value: value,
                    },
                  };
                  return newArray;
                });
              }
              updatedItem = {
                ...updatedItem,
                [field]: {
                  ...updatedItem[field],
                  value: value,
                },
              };
            } else {
              if (field === "namaCetakan") {
                setDataPerincian((oldArray) => {
                  const newArray = [...oldArray];
                  newArray[index] = {
                    ...newArray[index],
                    jenisCetakan: value,
                  };
                  return newArray;
                });
              }
              updatedItem = { ...updatedItem, [field]: value };
            }
          }
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
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
    const value = event && event.target ? event.target.value : event;

    setEstimasiBahanBaku((oldArray) => {
      const newState = oldArray.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            data: item.data.map((dataItem, j) => {
              if (j === dataIndex) {
                return {
                  ...dataItem,
                  dataJenis: dataItem.dataJenis.map((dataJenisItem, k) => {
                    if (k === dataJenisIndex) {
                      if (unit) {
                        return {
                          ...dataJenisItem,
                          [field]: {
                            value: dataJenisItem[field]?.value || "",
                            unit: value,
                          },
                        };
                      } else {
                        if (
                          field === "estimasiKebutuhan" ||
                          field === "waste" ||
                          field === "jumlahKebutuhan"
                        ) {
                          return {
                            ...dataJenisItem,
                            [field]: {
                              ...dataJenisItem[field],
                              value: value,
                            },
                          };
                        } else {
                          return {
                            ...dataJenisItem,
                            [field]: value,
                          };
                        }
                      }
                    }
                    return dataJenisItem;
                  }),
                };
              }
              return dataItem;
            }),
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

  const handleSelectId = (orderId) => {
    axios({
      method: "GET",
      url: "http://localhost:5000/productionPlanning/getOneOrder",
      params: {
        orderId: orderId.target.value,
        userId: userInformation?.data?.id,
      },
    }).then((result) => {
      setSelectedOrder(result);
      setPemesan(result?.data?.customerDetail);
      setAlamatPengirimanProduk(result?.data?.alamatPengiriman);
    });
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:5000/inventory/getAllInventoryItem/${userInformation?.data?.id}`,
    }).then((result) => {
      if (result.status === 200) {
        const tempData = result.data.map((result) => ({
          value: result.namaItem,
        }));

        setAllInventoryItem(tempData);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data item dari gudang");
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:5000/productionPlanning/getUnreviewedOrders/${userInformation?.data?.id}`,
    }).then((result) => {
      try {
        const allOrderIDs = result.data.map((data) => ({
          value: data.id,
        }));
        setAllOrderID(allOrderIDs);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ margin: "32px", height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            style={{ fontSize: isMobile ? "18px" : "3.5vw", color: "#0F607D" }}
          >
            Tambah Perencanaan Produksi
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                fontSize: isMobile ? "12px" : "1.5vw",
                color: "#0F607D",
              }}
            >
              Pilih ID Pesanan
            </Typography>
            <div style={{ marginLeft: "8px" }}>
              <MySelectTextField
                width={"80px"}
                height={"30px"}
                data={allOrderID}
                type="text"
                onChange={handleSelectId}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: "24px",
          }}
        >
          {selectedOrder.length !== 0 ? (
            <div
              style={{
                width: "100%",
                border: "2px solid #0F607D",
                borderRadius: "10px",
              }}
            >
              <div style={{ margin: "24px" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "5vw" : "2.5vw",
                    color: "#0F607D",
                  }}
                >
                  Informasi Order
                </Typography>

                <div
                  style={{
                    marginTop: "16px",
                  }}
                >
                  {selectedOrder.length !== 0 && (
                    <div
                      style={{
                        padding: "16px",
                        border: "2px solid #0F607D",
                        borderRadius: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <div style={{ width: "38%" }}>
                          <Typography
                            style={{
                              fontSize: isMobile ? "14px" : "1.5vw",
                              color: "#0F607D",
                            }}
                          >{`ID Pesanan: ${selectedOrder?.data?.id}`}</Typography>
                        </div>
                        <div style={{ width: "68%" }}>
                          <Typography
                            style={{
                              fontSize: isMobile ? "14px" : "1.5vw",
                              color: "#0F607D",
                            }}
                          >{`Judul Pesanan: ${
                            selectedOrder?.data?.orderTitle.length < 16
                              ? selectedOrder?.data?.orderTitle
                              : selectedOrder?.data?.orderTitle.slice(0, 16) +
                                "..."
                          }`}</Typography>
                        </div>
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <Typography
                          style={{
                            fontSize: isMobile ? "4vw" : "1.5vw",
                            color: "#0F607D",
                          }}
                        >
                          Dokumen:
                        </Typography>
                      </div>
                      {selectedOrder?.data?.documents.length === 0 ? (
                        <Typography
                          style={{
                            color: "#0F607D",
                            fontSize: isMobile ? "14px" : "16px",
                            marginTop: "8px",
                          }}
                        >
                          Tidak ada data dokumen dari pesanan ini
                        </Typography>
                      ) : (
                        <div style={{ display: "flex", overflowX: "auto" }}>
                          {selectedOrder?.data?.documents.map(
                            (result, index) => {
                              return (
                                <div key={index}>
                                  {index ===
                                  selectedOrder.data.documents.length - 1 ? (
                                    <img
                                      style={{
                                        height: isMobile ? "100px" : "9vw",
                                        width: isMobile ? "100px" : "9vw",
                                      }}
                                      srcSet={`http://localhost:5000/uploads/${result.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                      src={`http://localhost:5000/uploads/${result.filename}?w=248&fit=crop&auto=format`}
                                      alt={result.filename}
                                      loading="lazy"
                                    />
                                  ) : (
                                    <img
                                      style={{
                                        height: isMobile ? "100px" : "9vw",
                                        width: isMobile ? "100px" : "9vw",
                                        marginRight: isMobile ? "" : "32px",
                                      }}
                                      srcSet={`http://localhost:5000/uploads/${result.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                      src={`http://localhost:5000/uploads/${result.filename}?w=248&fit=crop&auto=format`}
                                      alt={result.filename}
                                      loading="lazy"
                                    />
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                      <div style={{ marginTop: "32px" }}>
                        <Typography
                          style={{
                            fontSize: isMobile ? "4vw" : "1.5vw",
                            color: "#0F607D",
                          }}
                        >
                          Detail Pesanan:
                        </Typography>
                        <div
                          style={{ width: "100%", overflowWrap: "break-word" }}
                        >
                          <Typography
                            style={{
                              overflowWrap: "break-word",
                              fontSize: isMobile ? "14px" : "1.5vw",
                              color: "#0F607D",
                            }}
                          >
                            {selectedOrder?.data?.orderDetails}
                          </Typography>
                        </div>
                      </div>
                      <div
                        style={{
                          display: isMobile ? " " : "flex",
                          justifyContent: "flex-start",
                          marginTop: "32px",
                        }}
                      >
                        <div style={{ width: isMobile ? " " : "50%" }}>
                          <Typography
                            style={{
                              fontSize: isMobile ? "14px" : "1.5vw",
                              color: "#0F607D",
                            }}
                          >{`Jumlah Pesanan: ${selectedOrder?.data?.orderQuantity}`}</Typography>
                        </div>
                        <div
                          style={{
                            width: isMobile ? " " : "50%",
                            marginTop: isMobile ? "8px" : "",
                          }}
                        >
                          <Typography
                            style={{
                              fontSize: isMobile ? "14px" : "1.5vw",
                              color: "#0F607D",
                            }}
                          >{`Status Pesanan: ${selectedOrder?.data?.orderStatus}`}</Typography>
                        </div>
                      </div>
                      <div
                        style={{
                          display: isMobile ? " " : "flex",
                          justifyContent: "flex-start",
                          marginTop: "8px",
                        }}
                      >
                        <div style={{ width: isMobile ? " " : "50%" }}>
                          <Typography
                            style={{
                              fontSize: isMobile ? "14px" : "1.5vw",
                              color: "#0F607D",
                            }}
                          >{`Customer Channel: ${selectedOrder?.data?.customerChannel}`}</Typography>
                        </div>
                        <div
                          style={{
                            width: isMobile ? " " : "50%",
                            marginTop: isMobile ? "8px" : "",
                          }}
                        >
                          <Typography
                            style={{
                              fontSize: isMobile ? "14px" : "1.5vw",
                              color: "#0F607D",
                            }}
                          >{`Customer Detail: ${selectedOrder?.data?.customerDetail}`}</Typography>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "128px",
              }}
            >
              <Typography
                style={{
                  fontSize: isMobile ? "24px" : "2vw",
                  color: "#0F607D",
                }}
              >
                Pilih salah satu pesanan
              </Typography>
            </div>
          )}
          {selectedOrder.length !== 0 && (
            <div
              style={{
                width: "100%",
                border: "2px solid #0F607D",
                borderRadius: "10px",
                marginTop: "32px",
              }}
            >
              <div style={{ margin: "24px" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "5vw" : "2.5vw",
                    color: "#0F607D",
                  }}
                >
                  Perencanaan Produksi
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
                    justifyContent: isMobile ? "" : "space-between",
                    marginTop: "16px",
                    width: "100%",
                    flexDirection: isMobile ? "column" : "",
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
                          height: isMobile ? "30px" : "3vw",
                          width: isMobile ? "90px" : "12vw",
                          fontSize: isMobile ? "12px" : "1.5vw",
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
                    <div style={{ marginTop: isMobile ? "16px" : "" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          sx={{ overflow: isMobile ? "hidden" : "" }}
                          components={["DateTimePicker"]}
                        >
                          <DemoItem>
                            <DateTimePicker
                              sx={{
                                width: isMobile ? "200px" : "300px",
                                height: isMobile ? "30px" : "50px",
                                ".MuiInputBase-root": {
                                  height: isMobile ? "30px" : "50px",
                                  width: isMobile ? "200px" : "300px",
                                  fontSize: isMobile ? "12px" : "",
                                  minWidth: "",
                                },
                              }}
                              disablePast
                              maxDate={dayjs(selectedOrder?.data?.orderDueDate)}
                              onChange={(event) => setTanggalPengiriman(event)}
                            />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                      <Typography
                        style={{ fontSize: isMobile ? "12px" : "" }}
                      >{`Tanggal jatuh tempo: ${dayjs(
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
                        height: isMobile ? "30px" : "3vw",
                        width: isMobile ? "150px" : "25vw",
                        fontSize: isMobile ? "12px" : "1.5vw",
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
                      width: "46%",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "12px" : "1.5vw",
                        color: "#0F607D",
                        marginRight: isMobile ? "0px" : "8px",
                      }}
                    >
                      Jenis Cetakan:
                    </Typography>
                    <TextField
                      type="text"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "30px" : "3vw",
                          width: isMobile ? "80px" : "10vw",
                          fontSize: isMobile ? "12px" : "1.5vw",
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "30px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
                          fontSize: isMobile ? "12px" : "1.5vw",
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "30px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
                          fontSize: isMobile ? "12px" : "1.5vw",
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "30px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
                          fontSize: isMobile ? "12px" : "1.5vw",
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "30px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
                          fontSize: isMobile ? "12px" : "1.5vw",
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "30px" : "3vw",
                          width: isMobile ? "90px" : "10vw",
                          fontSize: isMobile ? "12px" : "1.5vw",
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: isMobile ? "30px" : "3vw",
                        width: isMobile ? "90px" : "10vw",
                        fontSize: isMobile ? "12px" : "1.5vw",
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
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "2vw",
                    }}
                  >
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
                  {estimasiBahanBaku.map((result, index) => {
                    return (
                      <div key={index} style={{ marginTop: "32px" }}>
                        <TableContainer
                          sx={{ overflowX: "auto" }}
                          component={Paper}
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
                              <TableRow key={index}>
                                <TableCell style={{ width: "25px" }}>
                                  No.
                                </TableCell>
                                <TableCell
                                  style={{ width: "200px" }}
                                  align="left"
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {result.jenis}
                                  </div>
                                </TableCell>
                                <TableCell
                                  style={{ width: "200px" }}
                                  align="left"
                                >
                                  {result.informasiBahan}
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
                                <TableCell style={{ width: "50px" }}>
                                  Actions
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {result.data.map((dataItem, dataItemIndex) => (
                                <React.Fragment
                                  key={`${dataItemIndex}-${dataItemIndex}`}
                                >
                                  {dataItem.dataJenis.map(
                                    (dataJenis, dataJenisIndex) => (
                                      <TableRow
                                        key={`${dataItemIndex}-${dataItemIndex}-${dataJenisIndex}`}
                                      >
                                        {dataJenisIndex === 0 ? (
                                          <TableCell>
                                            {dataItemIndex + 1}
                                          </TableCell>
                                        ) : (
                                          <TableCell></TableCell>
                                        )}
                                        <TableCell>
                                          <MySelectTextField
                                          value={dataJenis.namaJenis}
                                            onChange={(event) => {
                                              handleInputChangeEstimasiBahanBaku(
                                                event,
                                                index,
                                                dataItemIndex,
                                                dataJenisIndex,
                                                "namaJenis"
                                              );
                                            }}
                                            data={allInventoryItem}
                                            width={"200px"}
                                          />
                                          {/* <TextField
                                            value={dataJenis.namaJenis}
                                            onChange={(event) => {
                                              handleInputChangeEstimasiBahanBaku(
                                                event,
                                                index,
                                                dataItemIndex,
                                                dataJenisIndex,
                                                "namaJenis"
                                              );
                                            }}
                                          /> */}
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            value={dataJenis.informasiJenis}
                                            onChange={(event) => {
                                              handleInputChangeEstimasiBahanBaku(
                                                event,
                                                index,
                                                dataItemIndex,
                                                dataJenisIndex,
                                                "informasiJenis"
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
                                              value={
                                                dataJenis.estimasiKebutuhan
                                                  .value
                                              }
                                              type="number"
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
                                            <div style={{ marginLeft: "8px" }}>
                                              <MySelectTextField
                                                type="text"
                                                width={
                                                  isMobile ? "75px" : "100px"
                                                }
                                                height={"55px"}
                                                borderRadius="10px"
                                                data={units}
                                                fontSize={
                                                  isMobile ? "15px" : "0.8vw"
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
                                            <div style={{ marginLeft: "8px" }}>
                                              <MySelectTextField
                                                type="text"
                                                width={
                                                  isMobile ? "75px" : "100px"
                                                }
                                                height={"55px"}
                                                borderRadius="10px"
                                                data={units}
                                                fontSize={
                                                  isMobile ? "15px" : "0.8vw"
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
                                                dataJenis.jumlahKebutuhan.value
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
                                            <div style={{ marginLeft: "8px" }}>
                                              <MySelectTextField
                                                type="text"
                                                width={
                                                  isMobile ? "75px" : "100px"
                                                }
                                                height={"55px"}
                                                borderRadius="10px"
                                                data={units}
                                                fontSize={
                                                  isMobile ? "15px" : "0.8vw"
                                                }
                                                value={
                                                  dataJenis.jumlahKebutuhan.unit
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
                                                    style={{ color: "#0F607D" }}
                                                  />
                                                </IconButton>
                                                <IconButton
                                                  style={{ height: "50%" }}
                                                >
                                                  <DeleteIcon
                                                    onClick={() => {
                                                      handleRemoveDataBahanBaku(
                                                        index,
                                                        dataItemIndex
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
                                                    index,
                                                    dataItemIndex,
                                                    dataJenisIndex
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
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
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
                              handleRemoveDataEstimasiBahanBaku(index);
                            }}
                            sx={{ marginLeft: "8px", textTransform: "none" }}
                            variant="outlined"
                            color="error"
                          >{`Hapus Tabel ${result.jenis}`}</Button>
                        </div>
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
                        fontSize: isMobile ? "4vw" : "2vw",
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
                    <TableContainer
                      component={Paper}
                      sx={{ overflowX: "auto" }}
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
                            <TableCell style={{ width: "200px" }}>
                              Bagian
                            </TableCell>
                            <TableCell style={{ width: "200px" }} align="left">
                              Jenis Pekerjaan
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
                            <TableCell style={{ width: "50px" }} align="left">
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {estimasiJadwal.map((row, index) => (
                            <React.Fragment key={index}>
                              {row.pekerjaan.map(
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
                                              disablePast
                                              maxDateTime={
                                                tanggalPengiriman === "" ||
                                                !dayjs(
                                                  tanggalPengiriman,
                                                  "MM/DD/YYYY hh:mm A",
                                                  true
                                                ).isValid()
                                                  ? dayjs(
                                                      selectedOrder?.data
                                                        ?.orderDueDate
                                                    )
                                                  : dayjs(tanggalPengiriman)
                                              }
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
                                              disablePast
                                              minDateTime={
                                                pekerjaan.tanggalMulai !== ""
                                                  ? dayjs(
                                                      pekerjaan.tanggalMulai
                                                    )
                                                  : ""
                                              }
                                              maxDateTime={
                                                tanggalPengiriman === "" ||
                                                !dayjs(
                                                  tanggalPengiriman,
                                                  "MM/DD/YYYY hh:mm A",
                                                  true
                                                ).isValid()
                                                  ? dayjs(
                                                      selectedOrder?.data
                                                        ?.orderDueDate
                                                    )
                                                  : dayjs(tanggalPengiriman)
                                              }
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
                                              handleRemovePekerjaan(
                                                index,
                                                pekerjaanIndex
                                              );
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
                                                setEstimasiJadwal((oldArray) =>
                                                  oldArray.filter(
                                                    (_, i) => i !== index
                                                  )
                                                );
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
                        fontSize: isMobile ? "4vw" : "2vw",
                        marginRight: "8px",
                      }}
                    >
                      Rincian Cetakan
                    </Typography>
                    <IconButton
                      style={{ height: "50%" }}
                      onClick={() => {
                        handleTambahRincianCetakan();
                      }}
                    >
                      <AddIcon style={{ color: "#0F607D" }} />
                    </IconButton>
                  </div>
                  <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                    <Table
                      aria-label="simple table"
                      sx={{
                        minWidth: 650,
                        tableLayout: "fixed",
                        overflowX: "auto",
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "25px" }}>No.</TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Nama Cetakan
                          </TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Ukuran
                          </TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Jenis Kertas
                          </TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Berat Kertas (Gram)
                          </TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Warna
                          </TableCell>
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
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rincianCetakan?.map((result, index) => {
                          return (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell>
                                  <TextField
                                    value={result.namaCetakan}
                                    onChange={(event) => {
                                      handleInputChangeRincianCetakan(
                                        event,
                                        index,
                                        "namaCetakan"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={result.ukuran}
                                    onChange={(event) => {
                                      handleInputChangeRincianCetakan(
                                        event,
                                        index,
                                        "ukuran"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={result.jenisKertas}
                                    onChange={(event) => {
                                      handleInputChangeRincianCetakan(
                                        event,
                                        index,
                                        "jenisKertas"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    value={result.beratKertas}
                                    onChange={(event) => {
                                      handleInputChangeRincianCetakan(
                                        event,
                                        index,
                                        "beratKertas"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={result.warna}
                                    onChange={(event) => {
                                      handleInputChangeRincianCetakan(
                                        event,
                                        index,
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
                                      value={result.kuantitas.value}
                                      onChange={(event) => {
                                        handleInputChangeRincianCetakan(
                                          event,
                                          index,
                                          "kuantitas"
                                        );
                                      }}
                                    />
                                    <div style={{ marginLeft: "8px" }}>
                                      <MySelectTextField
                                        width="50px"
                                        data={units}
                                        value={result.kuantitas.unit}
                                        onChange={(event) => {
                                          handleInputChangeRincianCetakan(
                                            event,
                                            index,
                                            "kuantitas",
                                            true
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    width="100px"
                                    type="number"
                                    value={result.ply}
                                    onChange={(event) => {
                                      handleInputChangeRincianCetakan(
                                        event,
                                        index,
                                        "ply"
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
                                      value={result.isi.value}
                                      onChange={(event) => {
                                        handleInputChangeRincianCetakan(
                                          event,
                                          index,
                                          "isi"
                                        );
                                      }}
                                    />
                                    <div style={{ marginLeft: "8px" }}>
                                      <MySelectTextField
                                        width="50px"
                                        data={units}
                                        value={result.isi.unit}
                                        onChange={(event) => {
                                          handleInputChangeRincianCetakan(
                                            event,
                                            index,
                                            "isi",
                                            true
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={result.nomorator}
                                    onChange={(event) => {
                                      handleInputChangeRincianCetakan(
                                        event,
                                        index,
                                        "nomorator"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={result.keterangan}
                                    onChange={(event) => {
                                      handleInputChangeRincianCetakan(
                                        event,
                                        index,
                                        "keterangan"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteItemRincianCetakan(index);
                                    }}
                                  >
                                    <DeleteIcon sx={{ color: "red" }} />
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
                        fontSize: isMobile ? "4vw" : "2vw",
                        marginRight: "8px",
                      }}
                    >
                      Perincian
                    </Typography>
                  </div>
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
                            <Typography
                              style={{ fontSize: isMobile ? "3.5vw" : "1.5vw" }}
                            >
                              Perincian Rekanan
                            </Typography>
                          </TableCell>
                          <TableCell colSpan={5} style={{ width: "50%" }}>
                            <Typography
                              style={{ fontSize: isMobile ? "3.5vw" : "1.5vw" }}
                            >
                              Perincian Harga Cetak
                            </Typography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ width: "50px" }}>No.</TableCell>{" "}
                          {/* Adjusted width for No. */}
                          <TableCell style={{ width: "200px" }}>
                            Nama Rekanan
                          </TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Keterangan
                          </TableCell>
                          <TableCell style={{ width: "50px" }}>No.</TableCell>{" "}
                          {/* Adjusted width for No. */}
                          <TableCell style={{ width: "200px" }}>
                            Jenis Cetakan
                          </TableCell>
                          <TableCell style={{ width: "350px" }}>Isi</TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Harga
                          </TableCell>
                          {/* <TableCell>Actions</TableCell> */}
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {dataPerincian.map((result, index) => {
                          return (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell>
                                  <TextField
                                    sx={{ width: "200px" }}
                                    value={result.namaRekanan}
                                    onChange={(event) => {
                                      handleChangeInputPerincian(
                                        event,
                                        index,
                                        "namaRekanan"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    sx={{ width: "200px" }}
                                    value={result.keterangan}
                                    onChange={(event) => {
                                      handleChangeInputPerincian(
                                        event,
                                        index,
                                        "keterangan"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell>
                                  <TextField
                                    disabled
                                    sx={{ width: "200px" }}
                                    value={result.jenisCetakan}
                                    // onChange={(event) => {
                                    //   handleChangeInputPerincian(
                                    //     event,
                                    //     index,
                                    //     "jenisCetakan"
                                    //   );
                                    // }}
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
                                      disabled
                                      value={result.isi.value}
                                      sx={{
                                        width: isMobile ? "100px" : "auto",
                                      }}
                                      // onChange={(event) => {
                                      //   handleChangeInputPerincian(
                                      //     event,
                                      //     index,
                                      //     "isi"
                                      //   );
                                      // }}
                                    />
                                    <div style={{ marginLeft: "8px" }}>
                                      <MySelectTextField
                                        data={units}
                                        value={result.isi.unit}
                                        disabled
                                        // onChange={(event) => {
                                        //   handleChangeInputPerincian(
                                        //     event,
                                        //     index,
                                        //     "isi",
                                        //     true
                                        //   );
                                        // }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={result.harga}
                                    onChange={(event) => {
                                      handleChangeInputPerincian(
                                        event,
                                        index,
                                        "harga"
                                      );
                                    }}
                                    type="text"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        height: isMobile ? "50px" : "4vw",
                                        width: isMobile ? "120px" : "200px",
                                        fontSize: isMobile ? "12px" : "1.5vw",
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
                                {/* <TableCell>
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteItemPerincian(index);
                                    }}
                                  >
                                    <DeleteIcon sx={{ color: "red" }} />
                                  </IconButton>
                                </TableCell> */}
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
          )}
          {selectedOrder.length !== 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleAddPerencanaanProduksi();
                }}
              >
                <Typography style={{ fontSize: "20px" }}>
                  Tambah Perencanaan Produksi
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

export default EstimationOrderPage;
