import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import {
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
import axios from "axios";
import { AppContext } from "../../App";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const EstimationOrderPage = () => {
  const { isMobile } = useContext(AppContext);

  const [allOrderID, setAllOrderID] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [estimasiJadwal, setEstimasiJadwal] = useState([]);

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
                    Alamat Kirim Barang:
                  </Typography>
                  <TextField
                    type="text"
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
                <div style={{ marginTop: "32px" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                    Bahan Baku
                  </Typography>
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
        </div>
      </div>
    </div>
  );
};

export default EstimationOrderPage;
