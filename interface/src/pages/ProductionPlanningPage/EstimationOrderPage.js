import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import {
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MySelectTextField from "../../components/SelectTextField";
import axios from "axios";
import { AppContext } from "../../App";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const ProSpan = styled("span")({
  display: "inline-block",
  height: "1em",
  width: "1em",
  verticalAlign: "middle",
  marginLeft: "0.3em",
  marginBottom: "0.08em",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundImage: "url(https://mui.com/static/x/pro.svg)",
});

function Label({ componentName, valueType, isProOnly }) {
  const content = (
    <span>
      <strong>{componentName}</strong> for {valueType} editing
    </span>
  );
  if (isProOnly) {
    return (
      <Stack direction="row" spacing={0.5} component="span">
        <Tooltip title="Included on Pro package">
          <a
            href="https://mui.com/x/introduction/licensing/#pro-plan"
            aria-label="Included on Pro package"
          >
            <ProSpan />
          </a>
        </Tooltip>
        {content}
      </Stack>
    );
  }

  return content;
}
const EstimationOrderPage = () => {
  const { isMobile } = useContext(AppContext);

  const [allOrderID, setAllOrderID] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [estimasiJadwal, setEstimasiJadwal] = useState([]);
  console.log(estimasiJadwal);

  const addPekerjaan = (index) => {
    setEstimasiJadwal((oldArray) =>
      oldArray.map((item, i) =>
        i === index
          ? {
              ...item,
              pekerjaan: [
                ...item.pekerjaan,
                {
                  tanggalMulai: "",
                  tanggalSelesai: "",
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
            tanggalMulai: "",
            tanggalSelesai: "",
            jumlahHari: "",
          },
        ],
      },
    ]);
  };

  const handleInputChange = (event, index, pekerjaanIndex, field) => {
    const { value } = event.target;
    setEstimasiJadwal((oldArray) =>
      oldArray.map((item, i) =>
        i === index
          ? {
              ...item,
              pekerjaan: item.pekerjaan.map((pekerjaan, j) =>
                j === pekerjaanIndex
                  ? { ...pekerjaan, [field]: value }
                  : pekerjaan
              ),
            }
          : item
      )
    );
  };

  const handleSelectId = (orderId) => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getOneOrder",
      params: { orderId: orderId.target.value },
    }).then((result) => {
      setSelectedOrder(result);
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
        // display: "flex",
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
            // display: "flex",
            // justifyContent: "space-between",
            marginTop: "24px",
          }}
        >
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
                      style={{ display: "flex", justifyContent: "flex-start" }}
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
                    onChange={(current) => {}}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: isMobile ? "15px" : "3vw",
                        width: isMobile ? "90px" : "8vw",
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
                    onChange={(current) => {}}
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
                  onChange={(event) => {}}
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
                    onChange={(current) => {}}
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
                    onChange={(current) => {}}
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
                    onChange={(current) => {}}
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
                    onChange={(current) => {}}
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
                    onChange={(current) => {}}
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
                    onChange={(current) => {}}
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
                  onChange={(current) => {}}
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
                        // checked={loading}
                        onChange={() => {}}
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
                        // checked={loading}
                        onChange={() => {}}
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
                      // checked={loading}
                      onChange={() => {}}
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
                <div style={{ display: "flex" }}>
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
                    onClick={() => {
                      addEstimasiJadwal();
                    }}
                  >
                    <AddIcon style={{ color: "#0F607D" }} />
                  </IconButton>
                </div>
                <div>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Bagian</TableCell>
                          <TableCell align="left">
                            Jenis Pekerjaan{" "}
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
                          </TableCell>
                          <TableCell align="left">Tanggal Mulai</TableCell>
                          <TableCell align="left">Tanggal Selesai</TableCell>
                          <TableCell align="left">Jumlah Hari</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {estimasiJadwal.map((row, index) => (
                          <React.Fragment key={index}>
                            {row.pekerjaan.map((pekerjaan, pekerjaanIndex) => (
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
                                      components={["DateTimePicker"]}
                                    >
                                      <DemoItem
                                        label={
                                          <Label
                                            componentName="DateTimePicker"
                                            valueType="date time"
                                          />
                                        }
                                      >
                                        <DateTimePicker
                                          disablePast
                                          value={pekerjaan.tanggalMulai}
                                          onChange={(e) =>
                                            handleInputChange(
                                              e,
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
                                  <TextField
                                    value={pekerjaan.tanggalSelesai}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        index,
                                        pekerjaanIndex,
                                        "tanggalSelesai"
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell align="left">
                                  <TextField
                                    value={pekerjaan.jumlahHari}
                                    onChange={(e) =>
                                      handleInputChange(
                                        e,
                                        index,
                                        pekerjaanIndex,
                                        "jumlahHari"
                                      )
                                    }
                                  />
                                </TableCell>
                                {pekerjaanIndex === 0 && (
                                  <TableCell
                                    align="right"
                                    rowSpan={row.pekerjaan.length}
                                  >
                                    <IconButton
                                      style={{
                                        marginLeft: "8px",
                                        height: "50%",
                                      }}
                                      onClick={() => {
                                        setEstimasiJadwal((oldArray) =>
                                          oldArray.filter((_, i) => i !== index)
                                        );
                                      }}
                                    >
                                      <DeleteIcon style={{ color: "red" }} />
                                    </IconButton>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationOrderPage;
