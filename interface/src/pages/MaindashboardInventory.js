import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "./MaindashboardInventory.css";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { AppContext } from "../App";
import moment from "moment";
import CustomChip from "../components/Chip";
import dayjs from "dayjs";
import MyModal from "../components/Modal";
import MySelectTextField from "../components/SelectTextField";
import MySnackbar from "../components/Snackbar";

const MaindashboardInventory = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [unreviewedOrders, setUnreviewedOrders] = useState([]);
  const [estimatedOrders, setEstimatedOrders] = useState([]);
  const [allProductionPlan, setAllProductionPlan] = useState([]);
  const [permohonanPembelian, setPermohonanPembelian] = useState([]);
  const [pembelianBahanBaku, setPembelianBahanBaku] = useState([]);
  console.log(permohonanPembelian)

  const [refreshProductionPlanData, setRefreshProductionPlanData] =
    useState(true);

  const [openModalPermohonanPembelian, setOpenModalPermohonanPembelian] =
    useState(false);
  const [openModalPembelianBahanBaku, setOpenModalPembelianBahanBaku] =
    useState(false);

  const handleCloseModalPermohonanPembelian = () => {
    setPermohonanPembelian([]);
    setOpenModalPermohonanPembelian(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleCloseModalPembelianBahanBaku = () => {
    setOpenModalPembelianBahanBaku(false);
  };

  const isPermohonanPembelianEmpty = () => {
    for (const item of permohonanPembelian) {
      if (!item.nomor || !item.perihal) {
        return false;
      }
      for (const dataPermohonan of item.daftarPermohonanPembelian) {
        if (
          !dataPermohonan.jenisBarang ||
          !dataPermohonan.keterangan ||
          !dataPermohonan.jumlah.value ||
          !dataPermohonan.jumlah.value ||
          !dataPermohonan.untukPekerjaan ||
          !dataPermohonan.stok.unit ||
          !dataPermohonan.stok.value
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleChangeInputPermohonanPembelian = (
    event,
    index,
    indexPermohonan,
    field,
    unit
  ) => {
    const value = event.target.value;

    setPermohonanPembelian((oldArray) => {
      const newState = oldArray.map((item, i) => {
        if (i === index) {
          if (field === "nomor" || field === "perihal") {
            return {
              ...item,
              [field]: value,
            };
          }
          return {
            ...item,
            daftarPermohonanPembelian: item.daftarPermohonanPembelian.map(
              (daftarPermohonan, j) => {
                if (j === indexPermohonan) {
                  if (unit) {
                    return {
                      ...daftarPermohonan,
                      [field]: {
                        value: daftarPermohonan[field],
                        unit: value,
                      },
                    };
                  } else {
                    return {
                      ...daftarPermohonan,
                      [field]: value,
                    };
                  }
                }
                return daftarPermohonan;
              }
            ),
          };
        }
        return item;
      });
      return newState;
    });
  };
  
  const transformDataPermohonanPembelian = (data) => {
    return data.map((item) => {
      return {
        ...item,
        daftarPermohonanPembelian: item.daftarPermohonanPembelian.map((dataPb) => {
          return {
            ...dataPb,
            jumlah: `${dataPb.jumlah.value} ${dataPb.jumlah.unit}`,
            stok: `${dataPb.stok.value} ${dataPb.stok.unit}`
          }
        })
      }
    })
  }

  const handleAddPermohonanPembelian = () => {
    const checkIfPermohonanPembelianEmpty = isPermohonanPembelianEmpty();
    const transformedPermohonanPembelian = transformDataPermohonanPembelian(permohonanPembelian)
    console.log(transformedPermohonanPembelian)

    if (checkIfPermohonanPembelianEmpty === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input!");
    } else {
      axios({
        method: "POST",
        url: `http://localhost:3000/inventory/addPermohonanPembelian/${userInformation.data.id}`,
        data: {permohonanPembelian: transformedPermohonanPembelian},
      }).then((result) => {
        try {
          if (result.status === 200) {
            setOpenSnackbar(true);
            setSnackbarStatus(true);
            setSnackbarMessage(`Berhasil menambahkan Permohonan Pembelian`);
          } else {
            setOpenSnackbar(true);
            setSnackbarStatus(false);
            setSnackbarMessage(`error: ${result.message}`);
          }
        } catch (error) {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(`error: ${error}`);
        }
      });
    }
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
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
        flexDirection: "row",
      }}
    >
      {isMobile ? (
        ""
      ) : (
        <div
          className="hideScrollbar"
          style={{
            width: "16.4617vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "15vw", height: "15vw", marginTop: "1.667vw" }}>
            <img
              style={{ height: "inherit", width: "inherit" }}
              src={companyLogo}
              alt="Company Logo"
            />
          </div>
          <div style={{ marginTop: "3.33vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("managestocks")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Kelola Bahan Baku
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("permohonanpembelian")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Permohonan Pembelian
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="16px"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("pembelianbahanbaku")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pembelian Bahan Baku
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("pengambilanbarang")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pengambilan Barang
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("penyerahanbarang")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Penyerahan Barang
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("activitylog")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Activity Log
            </DefaultButton>
          </div>
        </div>
      )}
      {isMobile ? (
        ""
      ) : (
        <div
          id="test"
          style={{
            width: "0.2083vw",
            height: "95vh",
            backgroundColor: "#0F607D",
            alignSelf: "center",
          }}
        />
      )}
      <div
        className="hideScrollbar"
        style={{
          width: isMobile ? "100vw" : "83.1217vw",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AccountCircleIcon
            style={{
              width: isMobile ? "10vw" : "3.33vw",
              height: "auto",
              marginRight: "0.83vw",
              cursor: "pointer",
            }}
          />
          <div style={{ textAlign: "left" }}>
            <Typography
              style={{ fontSize: isMobile ? "5vw" : "4vw", color: "#0F607D" }}
            >
              Welcome back, {userInformation.data.username}
            </Typography>
            <Typography
              style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
            >
              {userInformation.data.department}
            </Typography>
          </div>
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="managestocks"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Kelola Bahan Baku
          </Typography>
          {userInformation?.data?.role === "Admin" ||
          userInformation?.data?.role === "Super Admin" ? (
            <DefaultButton
              height={isMobile ? "" : "2.08vw"}
              width={isMobile ? "" : "15vw"}
              borderRadius="0.83vw"
              fontSize={isMobile ? "10px" : "1vw"}
              onClickFunction={() => {
                navigate("/productionPlanningDashboard/estimationOrder");
              }}
            >
              Pergi ke halaman stok
            </DefaultButton>
          ) : (
            ""
          )}
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="permohonanpembelian"
            style={{ color: "#0F607D", fontSize: isMobile ? "4vw" : "2vw" }}
          >
            Permohonan Pembelian
          </Typography>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <DefaultButton
              onClickFunction={() => {
                setOpenModalPermohonanPembelian(true);
              }}
            >
              <Typography>Tambah Permohonan Pembelian</Typography>
            </DefaultButton>
          </div>
        </div>
        <div style={{ margin: isMobile ? "0px 32px 0px 32px" : "1.667vw" }}>
          <div
            style={{
              width: isMobile ? "100%" : "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
            }}
          >
            {unreviewedOrders?.data?.length === 0 ||
            unreviewedOrders?.data === undefined ? (
              <Typography>Tidak ada Permohonan Pembelian</Typography>
            ) : (
              unreviewedOrders?.data?.map((data, index, array) => (
                <div
                  key={index}
                  className="order-item"
                  style={{
                    minWidth: isMobile ? "132px" : "13.33vw",
                    minHeight: isMobile ? "132px" : "13.33vw",
                    marginRight: index === array.length - 1 ? "0" : "32px",
                  }}
                >
                  {data?.documents?.length === "" || null || undefined ? (
                    ""
                  ) : (
                    <div style={{ margin: isMobile ? "12px" : "0.83vw" }}>
                      {data?.documents?.length > 3 ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {data?.documents
                            ?.slice(0, 3)
                            .map((document, index) => {
                              return (
                                <div>
                                  <img
                                    style={{
                                      height: isMobile ? "30px" : "3.125vw",
                                      width: isMobile ? "30px" : "3.125vw",
                                      marginRight: "4px",
                                    }}
                                    srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                    alt=""
                                    loading="lazy"
                                  />
                                </div>
                              );
                            })}
                          <Typography
                            style={{
                              marginLeft: "0.417vw",
                              fontWeight: "bold",
                              fontSize: isMobile ? "10px" : "1.042vw",
                            }}
                          >
                            + {data?.documents?.length - 3}
                          </Typography>
                        </div>
                      ) : (
                        <div style={{ display: "flex" }}>
                          {data?.documents?.map((document, index) => {
                            return (
                              <div>
                                <img
                                  style={{
                                    height: isMobile ? "30px" : "3.125vw",
                                    width: isMobile ? "30px" : "3.125vw",
                                    marginRight: "4px",
                                  }}
                                  srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                  alt=""
                                  loading="lazy"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      margin: isMobile
                        ? "0px 12px 0px 12px"
                        : "0vw 0.83vw 0vw 0.83vw",
                      backgroundColor: "transparent",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: isMobile ? "12px" : "1.25vw",
                      }}
                    >
                      {data.orderTitle.length < 15
                        ? data.orderTitle
                        : data.orderTitle.slice(0, 15) + "..."}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      margin: isMobile
                        ? "0px 12px 0px 12px"
                        : "0vw 0.83vw 0vw 0.83vw",
                      backgroundColor: "transparent",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: isMobile ? "10px" : "0.833vw",
                      }}
                    >
                      {data.orderDetails.length < 25
                        ? data.orderDetails
                        : data.orderDetails.slice(0, 25) + "..."}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: isMobile ? "8px" : "0.625vw",
                      }}
                    >{`Date Added: ${moment(data.createdAt).format(
                      "DD/MM/YYYY"
                    )}`}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      position: "absolute",
                      bottom: isMobile ? 24 : 28,
                      left: 12,
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: isMobile ? "8px" : "0.625vw",
                      }}
                    >
                      {`Order Status: ${data.orderStatus}`}
                    </Typography>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="pembelianbahanbaku"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Pembelian Bahan Baku
          </Typography>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Typography
              style={{
                marginRight: isMobile ? "4px" : "0.417vw",
                color: "#0F607D",
                fontSize: isMobile ? "2.5vw" : "1vw",
              }}
            >
              Sort by:
            </Typography>
            <div
              style={{
                marginRight: "0.417vw",
                display: "flex",
                alignContent: "center",
              }}
            >
              <CustomChip
                fontSize={isMobile ? "8px" : ""}
                width="auto"
                height="15px"
                text="date"
              />
            </div>
            <div
              style={{
                marginRight: "0.417vw",
                display: "flex",
                alignContent: "center",
              }}
            >
              <CustomChip
                fontSize={isMobile ? "8px" : ""}
                width="auto"
                height="15px"
                text="amount"
              />
            </div>
            <div
              style={{
                display: "flex",
                alignContent: "center",
              }}
            >
              <CustomChip
                fontSize={isMobile ? "8px" : ""}
                width="auto"
                height="15px"
                text="name"
              />
            </div>
          </div>
        </div>
        <div style={{ margin: isMobile ? "0px 32px 0px 32px" : "1.667vw" }}>
          <div
            style={{
              width: isMobile ? "100%" : "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
            }}
          >
            {estimatedOrders?.data?.length === 0 ||
            estimatedOrders?.data === undefined ? (
              <Typography>
                There are no Pembelian Bahan Baku available
              </Typography>
            ) : (
              estimatedOrders?.data?.map((data, index, array) => (
                <div
                  key={index}
                  className="order-item"
                  style={{
                    minWidth: isMobile ? "132px" : "13.33vw",
                    minHeight: isMobile ? "132px" : "13.33vw",
                    marginRight: index === array.length - 1 ? "0" : "32px",
                  }}
                >
                  {data?.documents?.length === "" || null || undefined ? (
                    ""
                  ) : (
                    <div style={{ margin: isMobile ? "12px" : "0.83vw" }}>
                      {data?.documents?.length > 3 ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {data.documents
                            ?.slice(0, 3)
                            .map((document, index) => {
                              return (
                                <div>
                                  <img
                                    style={{
                                      height: isMobile ? "30px" : "3.125vw",
                                      width: isMobile ? "30px" : "3.125vw",
                                      marginRight: "4px",
                                    }}
                                    srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                    alt=""
                                    loading="lazy"
                                  />
                                </div>
                              );
                            })}
                          <Typography
                            style={{
                              marginLeft: "0.417vw",
                              fontWeight: "bold",
                              fontSize: isMobile ? "10px" : "1.042vw",
                            }}
                          >
                            + {data?.documents?.length - 3}
                          </Typography>
                        </div>
                      ) : (
                        <div style={{ display: "flex" }}>
                          {data.documents?.map((document, index) => {
                            return (
                              <div>
                                <img
                                  style={{
                                    height: isMobile ? "30px" : "3.125vw",
                                    width: isMobile ? "30px" : "3.125vw",
                                    marginRight: "4px",
                                  }}
                                  srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                  alt=""
                                  loading="lazy"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      margin: isMobile
                        ? "0px 12px 0px 12px"
                        : "0vw 0.83vw 0vw 0.83vw",
                      backgroundColor: "transparent",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: isMobile ? "12px" : "1.25vw",
                      }}
                    >
                      {data.orderTitle.length < 15
                        ? data.orderTitle
                        : data.orderTitle.slice(0, 15) + "..."}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      margin: isMobile
                        ? "0px 12px 0px 12px"
                        : "0vw 0.83vw 0vw 0.83vw",
                      backgroundColor: "transparent",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Typography
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: isMobile ? "10px" : "0.833vw",
                      }}
                    >
                      {data.orderDetails.length < 25
                        ? data.orderDetails
                        : data.orderDetails.slice(0, 25) + "..."}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: isMobile ? "8px" : "0.625vw",
                      }}
                    >{`Date Added: ${moment(data.createdAt).format(
                      "DD/MM/YYYY"
                    )}`}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      position: "absolute",
                      bottom: isMobile ? 24 : 28,
                      left: 12,
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: isMobile ? "8px" : "0.625vw",
                      }}
                    >
                      {`Order Status: ${data.orderStatus}`}
                    </Typography>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="pengambilangbarang"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Pengambilan Barang
          </Typography>
          <div>
            <DefaultButton onClickFunction={() => {}}>
              <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                Go to Pengambilan Barang Page
              </Typography>
            </DefaultButton>
          </div>
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="activitylog"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Activity Log
          </Typography>
          <div>
            <DefaultButton
              onClickFunction={() => {
                navigate("/productionPlanningDashboard/activityLog");
              }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                Go to Activity Logs
              </Typography>
            </DefaultButton>
          </div>
        </div>
      </div>
      {openModalPermohonanPembelian === true && (
        <MyModal
          open={openModalPermohonanPembelian}
          handleClose={handleCloseModalPermohonanPembelian}
        >
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "80vw",
              maxHeight: "80vh",
            }}
          >
            <div
              style={{
                display: "flex",
                margin: "1.667vw 0px 1.042vw 0px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "7vw" : "2.5vw",
                }}
              >
                Tambah Permohonan Pembelian
              </Typography>
              {permohonanPembelian.length !== 0 ? (
                ""
              ) : (
                <IconButton
                  onClick={() => {
                    setPermohonanPembelian((oldArray) => [
                      ...oldArray,
                      {
                        nomor: "",
                        perihal: "",
                        daftarPermohonanPembelian: [
                          {
                            jenisBarang: "",
                            jumlah: { value: "", unit: "" },
                            untukPekerjaan: "",
                            stok: { value: "", unit: "" },
                            keterangan: "",
                          },
                        ],
                      },
                    ]);
                  }}
                  style={{ height: "50%", width: "auto" }}
                >
                  <AddIcon style={{ color: "#0F607D" }} />
                </IconButton>
              )}
            </div>
            <div>
              {permohonanPembelian.length !== 0 && (
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      style={{
                        fontSize: isMobile ? "" : "1.5vw",
                        color: "#0F607D",
                      }}
                    >
                      Nomor:{" "}
                    </Typography>
                    <div style={{ marginLeft: "8px" }}>
                      <TextField
                        type="text"
                        value={permohonanPembelian[0].nomor}
                        onChange={(event) => {
                          handleChangeInputPermohonanPembelian(
                            event,
                            0,
                            "",
                            "nomor"
                          );
                        }}
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
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "16px",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "" : "1.5vw",
                        color: "#0F607D",
                      }}
                    >
                      Perihal:{" "}
                    </Typography>
                    <div style={{ marginLeft: "8px" }}>
                      <TextField
                        type="text"
                        value={permohonanPembelian[0].perihal}
                        onChange={(event) => {
                          handleChangeInputPermohonanPembelian(
                            event,
                            0,
                            "",
                            "perihal"
                          );
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: isMobile ? "15px" : "3vw",
                            width: isMobile ? "90px" : "40vw",
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
                </>
              )}
              {permohonanPembelian.length !== 0 && (
                <div
                  style={{
                    display: "flex",
                    marginTop: "16px",
                    justifyContent: "flex-end",
                  }}
                >
                  <DefaultButton
                    onClickFunction={() => {
                      setPermohonanPembelian((oldArray) =>
                        oldArray.map((result) => ({
                          ...result,
                          daftarPermohonanPembelian: [
                            ...result.daftarPermohonanPembelian,
                            {
                              jenisBarang: "",
                              jumlah: { value: "", unit: "" },
                              untukPekerjaan: "",
                              stok: { value: "", unit: "" },
                              keterangan: "",
                            },
                          ],
                        }))
                      );
                    }}
                  >
                    <Typography>Tambah Barang</Typography>
                  </DefaultButton>
                </div>
              )}
              {permohonanPembelian.length !== 0 ? (
                <TableContainer style={{ marginTop: "16px" }} component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell align="left">Jenis Barang</TableCell>
                        <TableCell align="left">Jumlah</TableCell>
                        <TableCell align="left">Untuk Pekerjaan</TableCell>
                        <TableCell align="left">Stok</TableCell>
                        <TableCell align="left">Keterangan</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {permohonanPembelian.map((result, index) => (
                        <React.Fragment key={index}>
                          {result.daftarPermohonanPembelian.map(
                            (dataPermohonan, indexPermohonan) => (
                              <TableRow key={`data of index ${index}`}>
                                <TableCell>
                                  <Typography>
                                    {indexPermohonan + 1 + "."}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    type="text"
                                    value={dataPermohonan.jenisBarang}
                                    onChange={(event) => {
                                      handleChangeInputPermohonanPembelian(
                                        event,
                                        index,
                                        indexPermohonan,
                                        "jenisBarang"
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
                                      value={dataPermohonan.jumlah.value}
                                      onChange={(event) => {
                                        handleChangeInputPermohonanPembelian(
                                          event,
                                          index,
                                          indexPermohonan,
                                          "jumlah"
                                        );
                                      }}
                                    />
                                    <div style={{ marginLeft: "8px" }}>
                                      <MySelectTextField
                                        type="text"
                                        width={isMobile ? "50px" : "55px"}
                                        height={isMobile ? "15px" : "55px"}
                                        borderRadius="10px"
                                        data={units}
                                        fontSize={isMobile ? "10px" : "0.8vw"}
                                        value={dataPermohonan.jumlah.unit}
                                        onChange={(event) => {
                                          handleChangeInputPermohonanPembelian(
                                            event,
                                            index,
                                            indexPermohonan,
                                            "jumlah",
                                            true
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    value={dataPermohonan.untukPekerjaan}
                                    type="text"
                                    onChange={(event) => {
                                      handleChangeInputPermohonanPembelian(
                                        event,
                                        index,
                                        indexPermohonan,
                                        "untukPekerjaan"
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
                                      value={dataPermohonan.stok.value}
                                      type="number"
                                      onChange={(event) => {
                                        handleChangeInputPermohonanPembelian(
                                          event,
                                          index,
                                          indexPermohonan,
                                          "stok"
                                        );
                                      }}
                                    />
                                    <div style={{ marginLeft: "8px" }}>
                                      <MySelectTextField
                                        type="text"
                                        onChange={(event) => {
                                          handleChangeInputPermohonanPembelian(
                                            event,
                                            index,
                                            indexPermohonan,
                                            "stok",
                                            true
                                          );
                                        }}
                                        width={isMobile ? "50px" : "55px"}
                                        height={isMobile ? "15px" : "55px"}
                                        borderRadius="10px"
                                        data={units}
                                        fontSize={isMobile ? "10px" : "0.8vw"}
                                        value={dataPermohonan.stok.unit}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    type="text"
                                    value={dataPermohonan.keterangan}
                                    onChange={(event) => {
                                      handleChangeInputPermohonanPembelian(
                                        event,
                                        index,
                                        indexPermohonan,
                                        "keterangan"
                                      );
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "#0F607D",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "32px",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontSize: isMobile ? " " : "2vw",
                      }}
                    >
                      Silahkan tambah item permohonan pembelian
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </div>
          {permohonanPembelian.length !== 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "32px",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleAddPermohonanPembelian();
                }}
              >
                Tambah
              </DefaultButton>
              <Button
                variant="outlined"
                color="error"
                style={{ marginLeft: "8px", textTransform: "none" }}
                onClick={() => {
                  handleCloseModalPermohonanPembelian();
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </MyModal>
      )}
      {openModalPembelianBahanBaku === true && (
        <MyModal
          open={openModalPembelianBahanBaku}
          handleClose={handleCloseModalPermohonanPembelian}
        >
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "50vw",
              maxHeight: "80vh",
            }}
          >
            <div style={{ display: "flex", margin: "1.667vw 0px 1.042vw 0px" }}>
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "7vw" : "2.5vw",
                }}
              >
                Tambah Pembelian Bahan Baku
              </Typography>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  ></Typography>
                </div>
              </div>
            </div>
          </div>
        </MyModal>
      )}
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

export default MaindashboardInventory;
