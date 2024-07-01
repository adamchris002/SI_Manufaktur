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

const MaindashboardProductionPlanning = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();

  const [unreviewedOrders, setUnreviewedOrders] = useState([]);
  const [estimatedOrders, setEstimatedOrders] = useState([]);
  const [allProductionPlan, setAllProductionPlan] = useState([]);
  // console.log(allProductionPlan);
  const [refreshProductionPlanData, setRefreshProductionPlanData] =
    useState(true);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getUnreviewedOrders",
    }).then((result) => {
      try {
        setUnreviewedOrders(result);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getEstimatedOrders",
    }).then((result) => {
      try {
        setEstimatedOrders(result);
      } catch (error) {
        console.log(error);
      }
    });
  }, []);

  useEffect(() => {
    if (refreshProductionPlanData) {
      axios({
        method: "GET",
        url: "http://localhost:3000/productionPlanning/getAllProductionPlanning",
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

  const handleDeleteProductionPlan = (productionPlanId) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/productionPlanning/deleteProductionPlan/${productionPlanId}`,
    }).then(() => {
      try {
        setRefreshProductionPlanData(true);
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
              Manage Production Plan
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
              Unreviewed Orders
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
              Estimated Orders
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
              Estimation Orders History
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
            id="manageestimationorders"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Manage Production Plan
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
              Add Production Plan
            </DefaultButton>
          ) : (
            ""
          )}
        </div>
        {allProductionPlan?.data?.length === 0 ? (
          <div
            style={{
              margin: isMobile ? "0px 32px 0px 32px" : "1.667vw",
              width: isMobile ? "" : "72vw",
            }}
          >
            <Typography>Belum ada rencana produksi</Typography>
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
                    <TableCell align="left">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allProductionPlan?.data?.map((result, index) => (
                    <TableRow>
                      <TableCell>{result.id}</TableCell>
                      <TableCell>{result.pemesan}</TableCell>
                      <TableCell>{result.alamatKirimBarang}</TableCell>
                      <TableCell>{dayjs(result.tanggalPengirimanBarang).format("MM/DD/YYYY hh:mm A")}</TableCell>
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
            Unreviewed Orders
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
            <div style={{ display: "flex", alignContent: "center" }}>
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
            {unreviewedOrders?.data?.length === 0 ||
            unreviewedOrders?.data === undefined ? (
              <Typography>There are no unreviewed orders available</Typography>
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
            id="estimatedorders"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Estimated Orders
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
              <Typography>There are no Estimated orders available</Typography>
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
            id="estimationordershistory"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Estimation Orders History
          </Typography>
          <div>
            <DefaultButton onClickFunction={() => {}}>
              <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                Go to Estimation Orders History Page
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
    </div>
  );
};

export default MaindashboardProductionPlanning;
