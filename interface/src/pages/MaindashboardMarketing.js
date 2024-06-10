import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";
import moment from "moment";
import "./MaindashbordMarketing.css";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Typography,
  TextField,
  styled,
  Button,
  Backdrop,
  IconButton,
} from "@mui/material";
import { useAuth } from "../components/AuthContext";
import MySnackbar from "../components/Snackbar";
import MyModal from "../components/Modal";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MySelectTextField from "../components/SelectTextField";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const MaindashboardMarketing = (props) => {
  const navigate = useNavigate();

  const { userInformation } = props;
  const { message, clearMessage } = useAuth();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [orderTitle, setOrderTitle] = useState("");
  const [orderQuantityValue, setOrderQuantityValue] = useState(null);
  const [orderQuantityUnit, setOrderQuantityUnit] = useState("");
  const [orderDocuments, setOrderDocuments] = useState([]);
  const [orderDetails, setOrderDetails] = useState("");
  const [orderCustomerChannel, setOrderCustomerChannel] = useState("");
  const [orderCustomerDetail, setOrderCustomerDetail] = useState("");
  const [updateNotification, setUpdateNofitication] = useState(false);
  const [allOrderList, setAllOrderList] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(null);
  const [imageOption, setImageOption] = useState(true);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/order/getAllOrderInfo",
    }).then((result) => {
      setAllOrderList(result);
      setUpdateNofitication(false);
    });
  }, [updateNotification]);

  const values = [
    {
      value: "USD",
    },
    {
      value: "EUR",
    },
    {
      value: "BTC",
    },
    {
      value: "JPY",
    },
  ];

  const channels = [
    {
      value: "Gmail",
    },
    {
      value: "Phone",
    },
    {
      value: "Social Media",
    },
  ];

  const handleAddNewOrder = () => {
    if (
      orderTitle === "" ||
      orderQuantityValue === "" ||
      orderQuantityUnit === "" ||
      orderDetails === "" ||
      orderCustomerChannel === "" ||
      orderCustomerDetail === ""
    ) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Please fill in all the fields");
    } else {
      const formData = new FormData();
      formData.append("orderTitle", orderTitle);
      formData.append(
        "orderQuantity",
        orderQuantityValue + " " + orderQuantityUnit
      );
      formData.append("orderDetails", orderDetails);
      formData.append("customerChannel", orderCustomerChannel);
      formData.append("customerDetail", orderCustomerDetail);
      formData.append("orderStatus", "Ongoing");

      for (const file of orderDocuments) {
        formData.append("files", file);
      }

      axios({
        method: "POST",
        url: "http://localhost:3000/order/addOrder",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((result) => {
        if (result.status === 200) {
          setOpenModal(false);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("You have added a new order");
          setUpdateNofitication(true);
          setOrderTitle("");
          setOrderQuantityValue(null);
          setOrderQuantityUnit("");
          setOrderDetails("");
          setOrderCustomerChannel("");
          setOrderCustomerDetail("");
          setOrderDocuments([]);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("There was an error in adding the order");
          setOrderTitle("");
          setOrderQuantityValue(null);
          setOrderQuantityUnit("");
          setOrderDetails("");
          setOrderCustomerChannel("");
          setOrderCustomerDetail("");
          setOrderDocuments([]);
        }
      });
    }
  };

  const handleRemoveDocument = (indexToRemove) => {
    setOrderDocuments((prevOrderDocuments) =>
      prevOrderDocuments.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleOpenImage = (index) => {
    setImageIndex(index);
    setOpenImage(!openImage);
  };

  const handleFileInput = (event) => {
    const newFiles = Array.from(event.target.files);
    setOrderDocuments((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleAddSelectCustomerChannel = (event) => {
    setOrderCustomerChannel(event.target.value);
  };

  const handleAddSelectUnit = (event) => {
    setOrderQuantityUnit(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOrderTitle("");
    setOrderQuantityValue(null);
    setOrderQuantityUnit("");
    setOrderDetails("");
    setOrderCustomerChannel("");
    setOrderCustomerDetail("");
    setOrderDocuments([]);
  };

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarStatus(true);
      setOpenSnackbar(true);
      clearMessage();
    }
  }, [message, clearMessage]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
        // paddingBottom: "32px"
      }}
    >
      <div
        className="hideScrollbar"
        style={{
          width: "16.4617vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <div style={{ width: "232px", height: "232px", marginTop: "32px" }}>
          <img
            style={{ height: "inherit", width: "inherit" }}
            src={companyLogo}
            alt="Company Logo"
          />
        </div>
        <div style={{ marginTop: "64px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="16px"
            onClickFunction={() => {
              document
                .getElementById("vieworders")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            View All Orders
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="16px"
            onClickFunction={() => {
              document
                .getElementById("reviewedorders")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Reviewed Orders
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="16px"
            onClickFunction={() => {
              document
                .getElementById("processedorders")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Processed Orders
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="16px"
            onClickFunction={() => {
              document
                .getElementById("deliveredorders")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Delivered Orders
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="16px"
            onClickFunction={() => {
              document
                .getElementById("ordershistory")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Orders History
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="16px"
            onClickFunction={() => {
              document
                .getElementById("ordershistory")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Activity Log
          </DefaultButton>
        </div>
      </div>
      <div
        id="test"
        style={{
          width: "0.2083vw",
          height: "95vh",
          backgroundColor: "#0F607D",
          alignSelf: "center",
        }}
      ></div>
      <div
        className="hideScrollbar"
        style={{ width: "83.1217vw", height: "100vh", overflow: "auto" }}
      >
        <div
          style={{
            marginTop: "72px",
            marginLeft: "32px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AccountCircleIcon
            style={{
              width: "64px",
              height: "auto",
              marginRight: "16px",
              cursor: "pointer",
            }}
          />
          <div style={{ textAlign: "left" }}>
            <Typography style={{ fontSize: "48px", color: "#0F607D" }}>
              Welcome back, {userInformation.data.username}
            </Typography>
            <Typography style={{ fontSize: "24px", color: "#0F607D" }}>
              {userInformation.data.department} Division
            </Typography>
          </div>
        </div>
        <div
          style={{
            marginLeft: "32px",
            marginTop: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "72vw",
          }}
        >
          <Typography
            id="vieworders"
            style={{ color: "#0F607D", fontSize: "36px" }}
          >
            View All Orders
          </Typography>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Typography style={{ marginRight: "8px", color: "#0F607D" }}>
              Sort by:
            </Typography>
            <div
              style={{
                marginRight: "8px",
              }}
            >
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                date
              </DefaultButton>
            </div>
            <div
              style={{
                marginRight: "8px",
              }}
            >
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                amount
              </DefaultButton>
            </div>
            <div>
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                name
              </DefaultButton>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "32px", marginTop: "32px" }}>
          <div
            style={{
              width: "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
            }}
          >
            {allOrderList.data?.length === 0 ? (
              <Typography>There are no orders currently</Typography>
            ) : (
              allOrderList.data?.map((data, index) => (
                <div
                  key={index}
                  className="order-item"
                  onClick={() => {
                    navigate(`/marketingDashboard/orderDetail/${data.id}`);
                  }}
                >
                  {data?.documents?.length === "" || null ? (
                    ""
                  ) : (
                    <div style={{ margin: "16px" }}>
                      {data.documents?.length > 3 ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {data.documents
                            ?.slice(0, 3)
                            .map((document, index) => {
                              return (
                                <div>
                                  <img
                                    style={{
                                      height: "60px",
                                      width: "60px",
                                      marginRight: "4px",
                                    }}
                                    srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                    alt={document.filename}
                                    loading="lazy"
                                  />
                                </div>
                              );
                            })}
                          <Typography
                            style={{ marginLeft: "8px", fontWeight: "bold" }}
                          >
                            + {data.documents?.length - 3}
                          </Typography>
                        </div>
                      ) : (
                        <div style={{ display: "flex" }}>
                          {data.documents?.map((document, index) => {
                            return (
                              <div>
                                <img
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                    marginRight: "4px",
                                  }}
                                  srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                  alt={document.filename}
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
                      marginLeft: "16px",
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
                      }}
                    >
                      {data.orderTitle}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "16px",
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
                      }}
                    >
                      {data.orderDetails}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: 12,
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
                      bottom: "32px",
                      left: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {`Order Status: ${data.orderStatus}`}
                    </Typography>
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ display: "flex", marginTop: "32px" }}>
            <DefaultButton
              height="40px"
              width="232px"
              borderRadius="16px"
              fontSize="24px"
              onClickFunction={() => {
                setOpenModal(true);
              }}
            >
              Add Order
            </DefaultButton>
          </div>
        </div>
        <div
          style={{
            marginLeft: "32px",
            marginTop: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "72vw",
          }}
        >
          <Typography
            id="reviewedorders"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Reviewed Orders
          </Typography>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Typography style={{ marginRight: "8px", color: "#0F607D" }}>
              Sort by:
            </Typography>
            <div
              style={{
                marginRight: "8px",
              }}
            >
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                date
              </DefaultButton>
            </div>
            <div
              style={{
                marginRight: "8px",
              }}
            >
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                amount
              </DefaultButton>
            </div>
            <div>
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                name
              </DefaultButton>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "32px", marginTop: "32px" }}>
          <div
            style={{
              width: "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
            }}
          >
            {allOrderList.data?.length === 0 ||
            allOrderList.data?.orderStatus !== "Reviewed" ? (
              <Typography>There are no reviewed orders currently</Typography>
            ) : (
              allOrderList.data?.map((data, index) => (
                <div key={index} className="order-item">
                  {data?.documents?.length === "" || null ? (
                    ""
                  ) : (
                    <div style={{ margin: "16px" }}>
                      {data.documents?.length > 3 ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {data.documents
                            ?.slice(0, 3)
                            .map((document, index) => {
                              return (
                                <div>
                                  <img
                                    style={{
                                      height: "60px",
                                      width: "60px",
                                      marginRight: "4px",
                                    }}
                                    srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                    alt={document.filename}
                                    loading="lazy"
                                  />
                                </div>
                              );
                            })}
                          <Typography
                            style={{ marginLeft: "8px", fontWeight: "bold" }}
                          >
                            + {data.documents?.length - 3}
                          </Typography>
                        </div>
                      ) : (
                        <div style={{ display: "flex" }}>
                          {data.documents?.map((document, index) => {
                            return (
                              <div>
                                <img
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                    marginRight: "4px",
                                  }}
                                  srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                  alt={document.filename}
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
                      marginLeft: "16px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                      }}
                    >
                      {data.orderTitle}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "16px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Typography>{data.orderDetails}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: 12,
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
                      bottom: "32px",
                      left: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: 12,
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
            marginLeft: "32px",
            marginTop: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "72vw",
          }}
        >
          <Typography
            id="processedorders"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Processed Orders
          </Typography>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Typography style={{ marginRight: "8px", color: "#0F607D" }}>
              Sort by:
            </Typography>
            <div
              style={{
                marginRight: "8px",
              }}
            >
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                date
              </DefaultButton>
            </div>
            <div
              style={{
                marginRight: "8px",
              }}
            >
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                amount
              </DefaultButton>
            </div>
            <div>
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                name
              </DefaultButton>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "32px", marginTop: "32px" }}>
          <div
            style={{
              width: "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
            }}
          >
            {allOrderList.data?.length === 0 ||
            allOrderList.data?.orderStatus !== "Processed" ? (
              <Typography>There are no processed orders currently</Typography>
            ) : (
              allOrderList.data?.map((data, index) => (
                <div key={index} className="order-item">
                  {data?.documents?.length === "" || null ? (
                    ""
                  ) : (
                    <div style={{ margin: "16px" }}>
                      {data.documents?.length > 3 ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {data.documents
                            ?.slice(0, 3)
                            .map((document, index) => {
                              return (
                                <div>
                                  <img
                                    style={{
                                      height: "60px",
                                      width: "60px",
                                      marginRight: "4px",
                                    }}
                                    srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                    alt={document.filename}
                                    loading="lazy"
                                  />
                                </div>
                              );
                            })}
                          <Typography
                            style={{ marginLeft: "8px", fontWeight: "bold" }}
                          >
                            + {data.documents?.length - 3}
                          </Typography>
                        </div>
                      ) : (
                        <div style={{ display: "flex" }}>
                          {data.documents?.map((document, index) => {
                            return (
                              <div>
                                <img
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                    marginRight: "4px",
                                  }}
                                  srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                  alt={document.filename}
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
                      marginLeft: "16px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                      }}
                    >
                      {data.orderTitle}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "16px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Typography>{data.orderDetails}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: 12,
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
                      bottom: "32px",
                      left: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: 12,
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
            marginLeft: "32px",
            marginTop: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "72vw",
          }}
        >
          <Typography
            id="deliveredorders"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Delivered Orders
          </Typography>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Typography style={{ marginRight: "8px", color: "#0F607D" }}>
              Sort by:
            </Typography>
            <div
              style={{
                marginRight: "8px",
              }}
            >
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                date
              </DefaultButton>
            </div>
            <div
              style={{
                marginRight: "8px",
              }}
            >
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                amount
              </DefaultButton>
            </div>
            <div>
              <DefaultButton
                width="64px"
                height="16px"
                backgroundColor="#0F607D"
                fontSize="10px"
                borderRadius="10px"
              >
                name
              </DefaultButton>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "32px", marginTop: "32px" }}>
          <div
            style={{
              width: "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
            }}
          >
            {allOrderList.data?.length === 0 ||
            allOrderList.data?.orderStatus !== "Delivered" ? (
              <Typography>There are no delivered orders currently</Typography>
            ) : (
              allOrderList.data?.map((data, index) => (
                <div key={index} className="order-item">
                  {data?.documents?.length === "" || null ? (
                    ""
                  ) : (
                    <div style={{ margin: "16px" }}>
                      {data.documents?.length > 3 ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {data.documents
                            ?.slice(0, 3)
                            .map((document, index) => {
                              return (
                                <div>
                                  <img
                                    style={{
                                      height: "60px",
                                      width: "60px",
                                      marginRight: "4px",
                                    }}
                                    srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                    src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                    alt={document.filename}
                                    loading="lazy"
                                  />
                                </div>
                              );
                            })}
                          <Typography
                            style={{ marginLeft: "8px", fontWeight: "bold" }}
                          >
                            + {data.documents?.length - 3}
                          </Typography>
                        </div>
                      ) : (
                        <div style={{ display: "flex" }}>
                          {data.documents?.map((document, index) => {
                            return (
                              <div>
                                <img
                                  style={{
                                    height: "60px",
                                    width: "60px",
                                    marginRight: "4px",
                                  }}
                                  srcSet={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                  src={`http://localhost:3000/uploads/${document.filename}?w=248&fit=crop&auto=format`}
                                  alt={document.filename}
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
                      marginLeft: "16px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                      }}
                    >
                      {data.orderTitle}
                    </Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "16px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Typography>{data.orderDetails}</Typography>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      backgroundColor: "transparent",
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: 12,
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
                      bottom: "32px",
                      left: "16px",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontWeight: "bold",
                        fontSize: 12,
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
            marginLeft: "32px",
            marginTop: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "72vw",
          }}
        >
          <Typography
            id="ordershistory"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Orders History
          </Typography>
          <div>
            <DefaultButton>Go to Orders History Page</DefaultButton>
          </div>
        </div>
        <div
          style={{
            marginLeft: "32px",
            marginTop: "64px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "72vw",
          }}
        >
          <Typography
            id="ordershistory"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Orders History
          </Typography>
          <div>
            <DefaultButton>Go to Orders History Page</DefaultButton>
          </div>
        </div>
      </div>
      {openImage && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
          open={openImage}
          onClick={() => {
            setOpenImage(!openImage);
          }}
        >
          <div>
            <img
              style={{ width: "720px", height: "auto" }}
              src={URL.createObjectURL(orderDocuments[imageIndex])}
              alt=""
            />
          </div>
        </Backdrop>
      )}
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
            style={{ margin: "32px", overflow: "auto" }}
          >
            <div style={{ display: "flex", margin: "32px 0px 20px 0px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "48px" }}>
                Add New Order
              </Typography>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "300px", display: "flex" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "28px" }}>
                    Order Title:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "48px",
                      width: "512px",
                      fontSize: "24px",
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
                    setOrderTitle(current.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "300px", display: "flex" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "28px" }}>
                    Order Quantity:
                  </Typography>
                </div>
                <TextField
                  type="number"
                  sx={{
                    marginRight: "32px",
                    "& .MuiOutlinedInput-root": {
                      height: "48px",
                      width: "138px",
                      fontSize: "24px",
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
                    setOrderQuantityValue(current.target.value);
                  }}
                />
                <MySelectTextField
                  type="text"
                  width="138px"
                  height="48px"
                  borderRadius="10px"
                  data={values}
                  onChange={handleAddSelectUnit}
                />
              </div>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "300px", display: "flex" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "28px" }}>
                    Images & Informations:
                  </Typography>
                </div>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    height: "48px",
                    borderRadius: "10px",
                    backgroundColor: "#0F607D",
                  }}
                >
                  Upload file
                  <VisuallyHiddenInput
                    onChange={(event) => {
                      handleFileInput(event);
                    }}
                    type="file"
                    multiple={true}
                  />
                </Button>
                <div style={{ marginLeft: "18px", display: "flex" }}>
                  {Array.from(orderDocuments).map((result, index) => {
                    return (
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          marginLeft: "8px",
                          backgroundColor: "#d9d9d9",
                          position: "relative",
                          cursor: imageOption === true ? "pointer" : "",
                        }}
                        onClick={
                          imageOption === true
                            ? () => {
                                handleOpenImage(index);
                              }
                            : ""
                        }
                      >
                        {imageOption === false && (
                          <IconButton
                            style={{
                              position: "absolute",
                              top: "-12px",
                              right: "-12px",
                              zIndex: 1,
                              height: "24px",
                              width: "24px",
                            }}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleRemoveDocument(index);
                            }}
                          >
                            <CloseIcon
                              style={{
                                height: "16px",
                                width: "16x",
                                color: "black",
                              }}
                            />
                          </IconButton>
                        )}
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                          src={URL.createObjectURL(result)}
                          alt=""
                        />
                      </div>
                    );
                  })}
                  <div>
                    {orderDocuments.length !== 0 ? (
                      <IconButton
                        style={{
                          height: "32px",
                          width: "32px",
                          marginLeft: "8px",
                        }}
                        onClick={() => {
                          setImageOption(!imageOption);
                        }}
                      >
                        {imageOption === true ? (
                          <DeleteIcon />
                        ) : (
                          <RemoveRedEyeIcon />
                        )}
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                }}
              >
                <div style={{ width: "300px", display: "flex" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "28px" }}>
                    Order Details:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  multiline
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      width: "512px",
                      fontSize: "24px",
                      borderRadius: "10px",
                      boxSizing: "border-box",
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
                    setOrderDetails(current.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "300px", display: "flex" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "28px" }}>
                    Customer Channel:
                  </Typography>
                </div>
                <MySelectTextField
                  type="text"
                  width="90px"
                  height="48px"
                  borderRadius="10px"
                  data={channels}
                  onChange={handleAddSelectCustomerChannel}
                />
              </div>
            </div>
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ width: "300px", display: "flex" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "28px" }}>
                    Customer Detail:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "48px",
                      width: "512px",
                      fontSize: "24px",
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
                    setOrderCustomerDetail(current.target.value);
                  }}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "40%",
                  justifyContent: "space-evenly",
                }}
              >
                <DefaultButton
                  height="32px"
                  width="128px"
                  backgroundColor="#0F607D"
                  borderRadius="10px"
                  fontSize="16px"
                  onClickFunction={() => {
                    handleAddNewOrder();
                  }}
                >
                  Add Order
                </DefaultButton>
                <Button
                  variant="outlined"
                  color="error"
                  style={{
                    height: "32px",
                    width: "128px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    textTransform: "none",
                  }}
                  onClick={() => {
                    handleCloseModal();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </MyModal>
      )}
      <Outlet />
    </div>
  );
};

export default MaindashboardMarketing;
