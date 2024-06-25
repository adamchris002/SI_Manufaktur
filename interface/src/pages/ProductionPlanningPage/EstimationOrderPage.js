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

dayjs.extend(utc);
dayjs.extend(timezone);

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

  const [pemesan, setPemesan] = useState("");
  const [tanggalPengiriman, setTanggalPengiriman] = useState("");
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

  const [jenisBahan, setJenisBahan] = useState("");
  const [informasiBahan, setInformasiBahan] = useState("");

  // console.log(estimasiJadwal);

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
            !dataJenisItem.estimasiKebutuhan ||
            !dataJenisItem.informasiJenis ||
            !dataJenisItem.jumlahKebutuhan ||
            !dataJenisItem.namaJenis ||
            !dataJenisItem.warna ||
            !dataJenisItem.waste
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

  const handleAddPerencanaanProduksi = () => {
    const checkIfEstimasiBahanBakuEmpty = isEstimasiBahanBakuComplete();
    const checkIfEstimasiJadwalEmpty = isEstimasiJadwalEmpty();

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
      estimasiBahanBaku: estimasiBahanBaku,
      estimasiJadwal: estimasiJadwal,
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
        method: "POST",
        url: `http://localhost:3000/productionPlanning/addProductionPlanning/${userInformation.data.id}`,
        data: perencanaanProduksiData,
      }).then((result) => {
        // navigate(-1);
        
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

  const handleInputChangeEstimasiBahanBaku = (
    event,
    index,
    dataIndex,
    dataJenisIndex,
    field
  ) => {
    const value = event.target.value;

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
                      return {
                        ...dataJenisItem,
                        [field]: value,
                      };
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
      url: "http://localhost:3000/productionPlanning/getOneOrder",
      params: { orderId: orderId.target.value },
    }).then((result) => {
      setSelectedOrder(result);
      setPemesan(result?.data?.customerDetail);
      setTanggalPengiriman(result?.data?.orderDueDate);
      setAlamatPengirimanProduk(result?.data?.alamatPengiriman);
    });
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getUnreviewedOrders",
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
            Add Estimation Order
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography style={{ fontSize: "1.5vw", color: "#0F607D" }}>
              Select Order ID
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
                <Typography style={{ fontSize: "2.5vw", color: "#0F607D" }}>
                  Order Information
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
                        <div style={{ width: "30%  " }}>
                          <Typography
                            style={{ fontSize: "1.5vw", color: "#0F607D" }}
                          >{`Order ID: ${selectedOrder?.data?.id}`}</Typography>
                        </div>
                        <div style={{ width: "70%  " }}>
                          <Typography
                            style={{ fontSize: "1.5vw", color: "#0F607D" }}
                          >{`Order Name: ${
                            selectedOrder?.data?.orderTitle.length < 16
                              ? selectedOrder?.data?.orderTitle
                              : selectedOrder?.data?.orderTitle.slice(0, 16) +
                                "..."
                          }`}</Typography>
                        </div>
                      </div>
                      <div style={{ marginTop: "8px" }}>
                        <Typography
                          style={{ fontSize: "1.5vw", color: "#0F607D" }}
                        >
                          Documents:
                        </Typography>
                      </div>
                      <div style={{ display: "flex", overflowX: "auto" }}>
                        {selectedOrder?.data?.documents.map((result, index) => {
                          return (
                            <div>
                              {index ===
                              selectedOrder.data.documents.length - 1 ? (
                                <img
                                  style={{
                                    height: isMobile ? "100px" : "9vw",
                                    width: isMobile ? "100px" : "9vw",
                                  }}
                                  srcSet={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format`}
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
                                  srcSet={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format`}
                                  alt={result.filename}
                                  loading="lazy"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ marginTop: "32px" }}>
                        <Typography
                          style={{ fontSize: "1.5vw", color: "#0F607D" }}
                        >
                          Order Details:
                        </Typography>
                        <div
                          style={{ width: "100%", overflowWrap: "break-word" }}
                        >
                          <Typography
                            style={{
                              overflowWrap: "break-word",
                              fontSize: "1.5vw",
                              color: "#0F607D",
                            }}
                          >
                            {selectedOrder?.data?.orderDetails}
                          </Typography>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          marginTop: "32px",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <Typography
                            style={{ fontSize: "1.5vw", color: "#0F607D" }}
                          >{`Order Quantity: ${selectedOrder?.data?.orderQuantity}`}</Typography>
                        </div>
                        <div style={{ width: "50%" }}>
                          <Typography
                            style={{ fontSize: "1.5vw", color: "#0F607D" }}
                          >{`Order Status: ${selectedOrder?.data?.orderStatus}`}</Typography>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          marginTop: "8px",
                        }}
                      >
                        <div style={{ width: "50%" }}>
                          <Typography
                            style={{ fontSize: "1.5vw", color: "#0F607D" }}
                          >{`Customer Channel: ${selectedOrder?.data?.customerChannel}`}</Typography>
                        </div>
                        <div style={{ width: "50%" }}>
                          <Typography
                            style={{ fontSize: "1.5vw", color: "#0F607D" }}
                          >{`Customer Detail: ${selectedOrder?.data?.customerDetail}`}</Typography>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            ""
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
                <Typography style={{ fontSize: "2.5vw", color: "#0F607D" }}>
                  Estimation Order
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
                    <TextField
                      type="text"
                      value={tanggalPengiriman}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          height: isMobile ? "15px" : "3vw",
                          width: isMobile ? "130px" : "17vw",
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
                        setTanggalPengiriman(current.target.value);
                      }}
                    />
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
                  {estimasiBahanBaku.map((result, index) => {
                    return (
                      <div style={{ marginTop: "32px" }}>
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
                                    {result.jenis}
                                  </div>
                                </TableCell>
                                <TableCell align="left">
                                  {result.informasiBahan}
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
                                          <TextField
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
                                          />
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
                                          <TextField
                                            value={dataJenis.estimasiKebutuhan}
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
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            value={dataJenis.waste}
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
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            value={dataJenis.jumlahKebutuhan}
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
                                        </TableCell>
                                        <TableCell>
                                          <div
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
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
                                            {dataJenisIndex === 0 ? (
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
                            <TableCell align="left">
                              Jenis Pekerjaan{" "}
                              {estimasiJadwal.length !== 0 && (
                                <IconButton
                                  onClick={() => {
                                    const lastIndex = estimasiJadwal.length - 1;
                                    if (lastIndex >= 0) {
                                      addPekerjaan(lastIndex);
                                    }
                                  }}
                                >
                                  <AddIcon style={{ color: "#0F607D" }} />
                                </IconButton>
                              )}
                            </TableCell>
                            <TableCell align="left">Tanggal Mulai</TableCell>
                            <TableCell align="left">Tanggal Selesai</TableCell>
                            <TableCell align="left">Jumlah Hari</TableCell>
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
                                        )}
                                      </div>
                                    </TableCell>
                                    {pekerjaanIndex === 0 && (
                                      <TableCell
                                        align="right"
                                        rowSpan={row.pekerjaan.length}
                                      ></TableCell>
                                    )}
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
