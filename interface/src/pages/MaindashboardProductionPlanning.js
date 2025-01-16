import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MaindashboardProductionPlanning.css";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AppContext } from "../App";
import moment from "moment";
import CustomChip from "../components/Chip";
import dayjs from "dayjs";
import { useAuth } from "../components/AuthContext";
import MySnackbar from "../components/Snackbar";
import MySelectTextField from "../components/SelectTextField";

const MaindashboardProductionPlanning = (props) => {
  const { userInformation, setUserCredentials } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();

  const { message, clearMessage, setSuccessMessage } = useAuth();

  const [unreviewedOrders, setUnreviewedOrders] = useState([]);
  const [estimatedOrders, setEstimatedOrders] = useState([]);
  const [allProductionPlan, setAllProductionPlan] = useState([]);
  const [refreshProductionPlanData, setRefreshProductionPlanData] =
    useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);

  const handleChangeDivisiOwner = (event) => {
    axios({
      method: "PUT",
      url: `http://localhost:5000/finance/updateDivisiOwner/${event.target.value}`,
    }).then((result) => {
      if (result.status === 200) {
        setUserCredentials((oldObject) => {
          return {
            ...oldObject,
            data: {
              ...oldObject.data,
              department: event.target.value,
            },
          };
        });
        switch (event.target.value) {
          case "Marketing":
            navigate("/marketingDashboard");
            break;
          case "Inventory":
            navigate("/inventoryDashboard");
            break;
          case "Production":
            navigate("/productionDashboard");
            break;
          case "Finance":
            navigate("/financeDashboard");
            break;
          default:
          //snackbar
        }
      } else {
        //snackbar
      }
    });
  };

  const handleChangeLocationOwner = (event) => {
    axios({
      method: "PUT",
      url: `http://localhost:5000/finance/updateLocationOwner/${event.target.value}`,
    }).then((result) => {
      if (result.status === 200) {
        setUserCredentials((oldObject) => {
          return {
            ...oldObject,
            data: {
              ...oldObject.data,
              lokasi: event.target.value,
            },
          };
        });
        setRefreshProductionPlanData(true);
      } else {
        //snackbar
      }
    });
  };

  const lokasi = [
    { value: "Jakarta" },
    { value: "Semarang" },
    { value: "Purwokerto" },
  ];

  const department = [
    { value: "Marketing" },
    { value: "Production Planning" },
    { value: "Inventory" },
    { value: "Production" },
    { value: "Finance" },
  ];

  useEffect(() => {
    if (refreshProductionPlanData) {
      axios({
        method: "GET",
        url: `http://localhost:5000/productionPlanning/getUnreviewedOrders/${userInformation?.data?.id}`,
      }).then((result) => {
        try {
          setUnreviewedOrders(result);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }, [refreshProductionPlanData]);

  useEffect(() => {
    if (refreshProductionPlanData) {
      axios({
        method: "GET",
        url: `http://localhost:5000/productionPlanning/getEstimatedOrders/${userInformation?.data?.id}`,
      }).then((result) => {
        try {
          setEstimatedOrders(result);
        } catch (error) {
          console.log(error);
        }
      });
    }
  }, [refreshProductionPlanData]);

  useEffect(() => {
    if (refreshProductionPlanData) {
      axios({
        method: "GET",
        url: `http://localhost:5000/productionPlanning/getAllProductionPlanning/${userInformation?.data?.id}`,
      }).then((result) => {
        try {
          setAllProductionPlan(result);
          setRefreshProductionPlanData(false);
        } catch (error) {
          console.log(error);
          setRefreshProductionPlanData(false);
        }
      });
    }
  }, [refreshProductionPlanData]);

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarStatus(true);
      setOpenSnackbar(true);
      clearMessage();
    }
  }, [message, clearMessage]);

  const handleDeleteProductionPlan = (productionPlanId) => {
    axios({
      method: "DELETE",
      url: `http://localhost:5000/productionPlanning/deleteProductionPlan/${productionPlanId}`,
      params: {
        userId: userInformation.data.id,
        productionPlanId: productionPlanId,
      },
    }).then(() => {
      try {
        setRefreshProductionPlanData(true);
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus rencana produksi");
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleMoveToEditPage = (productionPlanId) => {
    navigate("/productionPlanningDashboard/editProductionPlan", {
      state: {
        productionPlanId: productionPlanId,
      },
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

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
                  .getElementById("manageestimationorders")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Kelola Rencana Produksi
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
                  .getElementById("unreviewedorders")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pesanan Belum Diestimasi
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
                  .getElementById("estimatedorders")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pesanan Sudah Diestimasi
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
                  .getElementById("estimationordershistory")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              History Estimasi Pesanan
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
              Catatan Aktivitas
            </DefaultButton>
          </div>
          {(userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Owner") && (
            <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
              <DefaultButton
                width="15vw"
                height="2.08vw"
                backgroundColor="#0F607D"
                borderRadius="0.83vw"
                fontSize="1vw"
                onClickFunction={() => {
                  document
                    .getElementById("kelolaanggota")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                Kelola Anggota
              </DefaultButton>
            </div>
          )}
          {!isMobile && (
            <div style={{ bottom: 0, position: "fixed", marginBottom: "15px" }}>
              <DefaultButton
                onClickFunction={() => {
                  setUserCredentials({})
                  navigate("/");
                }}
              >
                Logout
              </DefaultButton>
            </div>
          )}
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
              width: isMobile ? "32px" : "64px",
              height: isMobile ? "32px" : "64px",
              marginRight: "16px",
            }}
          />
          <div style={{ textAlign: "left" }}>
            <Typography
              style={{ fontSize: isMobile ? "5vw" : "4vw", color: "#0F607D" }}
            >
              Welcome back, {userInformation.data.username}
            </Typography>
            <div
              style={{
                display: isMobile ? "flex" : "",
                alignItems: isMobile ? "center" : "",
              }}
            >
            <Typography
              style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
            >
              {userInformation.data.department} Division
            </Typography>
            {isMobile && (
                <div style={{ marginLeft: "8px" }}>
                  <DefaultButton
                    onClickFunction={() => {
                      setUserCredentials({})
                      navigate("/");
                    }}
                  >
                    Logout
                  </DefaultButton>
                </div>
              )}
            </div>
          </div>
        </div>
        {userInformation?.data?.role === "Owner" && (
          <div style={{ margin: "32px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{
                  width: "150px",
                  color: "#0F607D",
                  fontSize: isMobile ? "5vw" : "1.5vw",
                }}
              >
                Ubah Divisi
              </Typography>
              <MySelectTextField
                value={userInformation?.data?.department}
                onChange={(event) => {
                  handleChangeDivisiOwner(event);
                }}
                data={department}
                width="150px"
              />
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
                  width: "150px",
                  color: "#0F607D",
                  fontSize: isMobile ? "5vw" : "1.5vw",
                }}
              >
                Ubah Lokasi
              </Typography>
              <MySelectTextField
                value={userInformation?.data?.lokasi}
                onChange={(event) => {
                  handleChangeLocationOwner(event);
                }}
                data={lokasi}
                width="150px"
              />
            </div>
          </div>
        )}
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
            id="manageestimationorders"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Kelola Rencana Produksi
          </Typography>
          {userInformation?.data?.role === "Admin" ||
          userInformation?.data?.role === "Super Admin" ||
          userInformation?.data?.role === "Owner" ? (
            <DefaultButton
              height={isMobile ? "" : "2.08vw"}
              width={isMobile ? "" : "15vw"}
              borderRadius="0.83vw"
              fontSize={isMobile ? "10px" : "1vw"}
              onClickFunction={() => {
                navigate("/productionPlanningDashboard/estimationOrder");
              }}
            >
              Tambah Rencana Produksi
            </DefaultButton>
          ) : (
            ""
          )}
        </div>
        {allProductionPlan?.data?.length === 0 ||
        allProductionPlan?.data?.every(
          (data) => data.statusProductionPlanning === "Done"
        ) ? (
          <div
            style={{
              margin: isMobile ? "0px 32px 0px 32px" : "1.667vw",
              width: isMobile ? "" : "72vw",
            }}
          >
            <Typography>Belum ada data rencana produksi</Typography>
          </div>
        ) : (
          <div
            style={{
              margin: isMobile ? "0px 32px 0px 32px" : "1.667vw",
              width: isMobile ? "" : "72vw",
            }}
          >
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "auto" }}>
                      ID Rencana Produksi
                    </TableCell>
                    <TableCell align="left">Pemesan</TableCell>
                    <TableCell align="left">Alamat Pengiriman Produk</TableCell>
                    <TableCell align="left">
                      Tanggal Pengiriman Produk
                    </TableCell>
                    {(userInformation?.data?.role === "Admin" ||
                      userInformation?.data?.role === "Super Admin" ||
                      userInformation?.data?.role === "Owner") && (
                      <TableCell align="left">Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allProductionPlan?.data
                    ?.filter((item) => item.statusProductionPlanning !== "Done")
                    .map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.id}</TableCell>
                        <TableCell>{result.pemesan}</TableCell>
                        <TableCell>{result.alamatKirimBarang}</TableCell>
                        <TableCell>
                          {dayjs(result.tanggalPengirimanBarang).format(
                            "MM/DD/YYYY hh:mm A"
                          )}
                        </TableCell>
                        {(userInformation?.data?.role === "Admin" ||
                          userInformation?.data?.role === "Super Admin" ||
                          userInformation?.data?.role === "Owner") && (
                          <TableCell>
                            <div>
                              <IconButton
                                onClick={() => {
                                  handleMoveToEditPage(result.id);
                                }}
                              >
                                <EditIcon style={{ color: "#0F607D" }} />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  handleDeleteProductionPlan(result.id);
                                }}
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
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
            id="unreviewedorders"
            style={{ color: "#0F607D", fontSize: isMobile ? "4vw" : "2vw" }}
          >
            Pesanan Belum Diestimasi
          </Typography>
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
              <Typography>
                Tidak ada data pesanan yang belum diestimasi
              </Typography>
            ) : (
              unreviewedOrders?.data?.map((data, index, array) => (
                <div
                  key={index}
                  className="order-item"
                  style={{
                    minWidth: isMobile ? "148px" : "13.33vw",
                    minHeight: isMobile ? "148px" : "13.33vw",
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
                                <div key={index}>
                                  <img
                                    style={{
                                      height: isMobile ? "30px" : "3.125vw",
                                      width: isMobile ? "30px" : "3.125vw",
                                      marginRight: "4px",
                                    }}
                                    srcSet={`http://localhost:5000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`http://localhost:5000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
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
                              <div key={index}>
                                <img
                                  style={{
                                    height: isMobile ? "30px" : "3.125vw",
                                    width: isMobile ? "30px" : "3.125vw",
                                    marginRight: "4px",
                                  }}
                                  srcSet={`http://localhost:5000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:5000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
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
                    >
                      {isMobile
                        ? `Tanggal Pembuatan: ${moment(data.createdAt).format(
                            "DD/MM/YYYY"
                          )}`
                        : `Tanggal Pembuatan Pesanan: ${moment(
                            data.createdAt
                          ).format("DD/MM/YYYY")}`}
                    </Typography>
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
                      {`Status Pesanan: ${data.orderStatus}`}
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
            id="estimatedorders"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Pesanan Sudah Diestimasi
          </Typography>
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
                Tidak ada data pesanan yang sudah diestimasi
              </Typography>
            ) : (
              estimatedOrders?.data?.map((data, index, array) => (
                <div
                  key={index}
                  className="order-item"
                  style={{
                    minWidth: isMobile ? "148px" : "13.33vw",
                    minHeight: isMobile ? "148px" : "13.33vw",
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
                                <div key={index}>
                                  <img
                                    style={{
                                      height: isMobile ? "30px" : "3.125vw",
                                      width: isMobile ? "30px" : "3.125vw",
                                      marginRight: "4px",
                                    }}
                                    srcSet={`http://localhost:5000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`http://localhost:5000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
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
                              <div key={index}>
                                <img
                                  style={{
                                    height: isMobile ? "30px" : "3.125vw",
                                    width: isMobile ? "30px" : "3.125vw",
                                    marginRight: "4px",
                                  }}
                                  srcSet={`http://localhost:5000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:5000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
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
                    >
                      {isMobile
                        ? `Tanggal Pembuatan: ${moment(data.createdAt).format(
                            "DD/MM/YYYY"
                          )}`
                        : `Tanggal Pembuatan Pesanan: ${moment(
                            data.createdAt
                          ).format("DD/MM/YYYY")}`}
                    </Typography>
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
                      {`Status Pesanan: ${data.orderStatus}`}
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
            id="estimationordershistory"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            History Estimasi Pesanan
          </Typography>
          <div>
            <DefaultButton
              onClickFunction={() => {
                navigate(
                  "/productionPlanningDashboard/productionPlanningHistoryPage"
                );
              }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                Pergi ke Halaman History Estimasi Pesanan
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
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Catatan Aktivitas
          </Typography>
          <div>
            <DefaultButton
              onClickFunction={() => {
                navigate("/productionPlanningDashboard/activityLog");
              }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                Pergi ke Halaman Catatan Aktivitas
              </Typography>
            </DefaultButton>
          </div>
        </div>
        {(userInformation?.data?.role === "Super Admin" ||
          userInformation?.data?.role === "Owner") && (
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
              id="kelolaanggota"
              style={{
                fontSize: isMobile ? "4vw" : "2vw",
                color: "#0F607D",
              }}
            >
              Kelola Anggota
            </Typography>
            <div>
              <DefaultButton
                onClickFunction={() => {
                  navigate("/productionPlanningDashboard/kelolaAnggota");
                }}
              >
                <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                  Pergi ke Halaman Kelola Anggota
                </Typography>
              </DefaultButton>
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

export default MaindashboardProductionPlanning;
