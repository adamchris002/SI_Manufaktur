import React, { useEffect, useState } from "react";
import axios from "axios";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Typography, TextField, styled, Button } from "@mui/material";
import { useAuth } from "../components/AuthContext";
import MySnackbar from "../components/Snackbar";
import MyModal from "../components/Modal";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MySelectTextField from "../components/SelectTextField";

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

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/order/getAllOrderInfo",
    }).then((result) => {
      setAllOrderList(result);
      setUpdateNofitication(false);
    });
  }, [updateNotification]);

  const orderList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
    const addNewOrderData = {
      orderTitle: orderTitle,
      orderQuantity: orderQuantityValue + " " + orderQuantityUnit,
      orderDetails: orderDetails,
      customerChannel: orderCustomerChannel,
      customerDetail: orderCustomerChannel,
    };
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
      setSnackbarMessage("Please in all the fields");
    } else {
      axios({
        method: "POST",
        url: "http://localhost:3000/order/addOrder",
        data: addNewOrderData,
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
        }
      });
    }
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
      }}
    >
      <div
        style={{
          width: "16.4617vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
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
            fontSize="24px"
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
            fontSize="24px"
            onClickFunction={() => {
              document
                .getElementById("manageorders")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Manage Orders
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
      <div style={{ width: "83.1217vw", height: "100vh", overflow: "auto" }}>
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
                  key={index} // Make sure to include a unique key for each item
                  style={{
                    height: "256px",
                    width: "256px",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "20px",
                    display: "inline-block",
                    marginRight:
                      index === allOrderList.data.length - 1 ? "" : "32px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#a0a0a0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#d9d9d9")
                  }
                >
                  {/* Content of each order item */}
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
            width: "72vw",
          }}
        >
          <Typography
            id="manageorders"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Manage Orders
          </Typography>
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
        <div style={{ marginLeft: "32px", marginTop: "32px" }}>
          <div
            style={{
              width: "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {orderList.map((data, index) => {
              return (
                <div
                  style={{
                    height: "256px",
                    width: "256px",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "20px",
                    display: "inline-block",
                    marginRight: index === orderList.length - 1 ? "" : "32px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#a0a0a0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#d9d9d9")
                  }
                >
                  {/* <img src="" alt=""/> */}
                </div>
              );
            })}
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
            }}
          >
            {orderList.map((data, index) => {
              return (
                <div
                  style={{
                    height: "256px",
                    width: "256px",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "20px",
                    display: "inline-block",
                    marginRight: index === orderList.length - 1 ? "" : "32px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#a0a0a0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#d9d9d9")
                  }
                >
                  {/* <img src="" alt=""/> */}
                </div>
              );
            })}
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
            }}
          >
            {orderList.map((data, index) => {
              return (
                <div
                  style={{
                    height: "256px",
                    width: "256px",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "20px",
                    display: "inline-block",
                    marginRight: index === orderList.length - 1 ? "" : "32px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#a0a0a0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#d9d9d9")
                  }
                >
                  {/* <img src="" alt=""/> */}
                </div>
              );
            })}
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
            }}
          >
            {orderList.map((data, index) => {
              return (
                <div
                  style={{
                    height: "256px",
                    width: "256px",
                    backgroundColor: "#d9d9d9",
                    borderRadius: "20px",
                    display: "inline-block",
                    marginRight: index === orderList.length - 1 ? "" : "32px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#a0a0a0")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#d9d9d9")
                  }
                >
                  {/* <img src="" alt=""/> */}
                </div>
              );
            })}
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
          <div style={{ margin: "32px" }}>
            <div style={{ display: "flex", margin: "32px 0px 20px 32px" }}>
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "48px",
                      width: "512px",
                      fontSize: "24px",
                      borderRadius: "10px",
                      "& fieldset": {
                        borderColor: "#0F607D", // Change the border color here
                      },
                      "&:hover fieldset": {
                        borderColor: "#0F607D", // Change the border color on hover here
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0F607D", // Change the border color when focused here
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
                        borderColor: "#0F607D", // Change the border color here
                      },
                      "&:hover fieldset": {
                        borderColor: "#0F607D", // Change the border color on hover here
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0F607D", // Change the border color when focused here
                      },
                    },
                  }}
                  onChange={(current) => {
                    setOrderQuantityValue(current.target.value);
                  }}
                />
                <MySelectTextField
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
                  <VisuallyHiddenInput type="file" />
                </Button>
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      width: "512px",
                      height: "160px",
                      fontSize: "24px",
                      borderRadius: "10px",
                      boxSizing: "border-box",
                      "& fieldset": {
                        borderColor: "#0F607D", // Change the border color here
                      },
                      "&:hover fieldset": {
                        borderColor: "#0F607D", // Change the border color on hover here
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0F607D", // Change the border color when focused here
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "48px",
                      width: "512px",
                      fontSize: "24px",
                      borderRadius: "10px",
                      "& fieldset": {
                        borderColor: "#0F607D", // Change the border color here
                      },
                      "&:hover fieldset": {
                        borderColor: "#0F607D", // Change the border color on hover here
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#0F607D", // Change the border color when focused here
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
                    setOpenModal(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </MyModal>
      )}
    </div>
  );
};

export default MaindashboardMarketing;
