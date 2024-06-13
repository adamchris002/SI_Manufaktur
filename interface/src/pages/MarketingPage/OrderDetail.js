import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import factoryBackground from "../../assets/factorybackground.png";
import {
  Backdrop,
  Button,
  IconButton,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import DefaultButton from "../../components/Button";
import MyModal from "../../components/Modal";
import MySelectTextField from "../../components/SelectTextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MySnackbar from "../../components/Snackbar";
import { useAuth } from "../../components/AuthContext";

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

const OrderDetail = (props) => {
  const { orderId } = useParams();
  const { userInformation } = props;
  const [checkUpdate, setCheckUpdate] = useState(false);
  const [orderDetailInfo, setOrderDetailInfo] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [orderTitle, setOrderTitle] = useState("");
  const [orderQuantityValue, setOrderQuantityValue] = useState(null);
  const [orderQuantityUnit, setOrderQuantityUnit] = useState("");
  const [orderDetails, setOrderDetails] = useState("");
  const [orderDocuments, setOrderDocuments] = useState([]);
  const [orderCustomerChannel, setOrderCustomerChannel] = useState("");
  const [orderCustomerDetail, setOrderCustomerDetail] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(null);
  const [imageOption, setImageOption] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { setSuccessMessage } = useAuth();

  const navigate = useNavigate();

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

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3000/order/getOrderInfo/${orderId}`,
    }).then((result) => {
      setOrderDetailInfo(result);
      setOrderTitle(result.data.orderTitle);
      setOrderDetails(result.data.orderDetails);
      setOrderDocuments(result.data.documents);
      setOrderCustomerChannel(result.data.customerChannel);
      setOrderCustomerDetail(result.data.customerDetail);
      setCheckUpdate(false);
    });
  }, [checkUpdate]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setOrderTitle(orderDetailInfo.data.orderTitle);
    setOrderDetails(orderDetailInfo.data.orderDetails);
    setOrderCustomerChannel(orderDetailInfo.data.customerChannel);
    setOrderCustomerDetail(orderDetailInfo.data.customerDetail);
    setOrderDocuments(orderDetailInfo.data.documents);
  };

  const handleUpdateOrder = (orderId) => {
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
      formData.append("orderId", orderId);
      formData.append("orderTitle", orderTitle);
      formData.append(
        "orderQuantity",
        orderQuantityValue + " " + orderQuantityUnit
      );
      formData.append("orderDetails", orderDetails);
      formData.append("customerChannel", orderCustomerChannel);
      formData.append("customerDetail", orderCustomerDetail);

      for (const file of orderDocuments) {
        if (!file.id) {
          formData.append("files", file);
        }
      }

      const documentsToRemove = orderDetailInfo.data.documents
        .filter((doc) => !orderDocuments.some((f) => f.id === doc.id))
        .map((doc) => doc.id);

      formData.append("documentsToRemove", JSON.stringify(documentsToRemove));

      axios({
        method: "PUT",
        url: `http://localhost:3000/order/updateOrder/${userInformation?.data?.id}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((result) => {
          if (result.status === 200) {
            setOpenModal(false);
            setOpenSnackbar(true);
            setSnackbarStatus(true);
            setSnackbarMessage("Order updated successfully");
            setCheckUpdate(true);
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
            setSnackbarMessage("There was an error updating the order");
            // Optionally clear the form fields
            setOrderTitle("");
            setOrderQuantityValue(null);
            setOrderQuantityUnit("");
            setOrderDetails("");
            setOrderCustomerChannel("");
            setOrderCustomerDetail("");
            setOrderDocuments([]);
          }
        })
        .catch((error) => {
          console.error("Error updating order:", error);
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("There was an error updating the order");
        });
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/order/deleteOrder`,
      params: {userId: userInformation?.data?.id, orderId: orderId}
    })
      .then((result, index) => {
        if (result.status === 200) {
          setSuccessMessage(
            `Order of order name ${orderTitle} has been deleted`
          );
          setSnackbarStatus(true);
          navigate("/marketingDashboard");
        }
      })
      .catch((error) => {
        if (error.response) {
          setOpenSnackbar(true);
          setSnackbarMessage(error.response.data.error);
          setSnackbarStatus(false);
        }
      });
  };

  const handleOpenModal = (orderDetailInfo) => {
    setOpenModal(true);

    let tempOrderQuantity = orderDetailInfo.data.orderQuantity;

    const regex = /^(\d+)\s*(.*)$/;
    const matches = tempOrderQuantity.match(regex);

    let quantityNumber = "";
    let quantityUnit = "";

    if (matches) {
      quantityNumber = matches[1]; // The number part
      quantityUnit = matches[2]; // The string part
    }

    setOrderQuantityUnit(quantityUnit);
    setOrderQuantityValue(quantityNumber);
  };

  const handleAddSelectUnit = (event) => {
    setOrderQuantityUnit(event.target.value);
  };

  const handleFileInput = (event) => {
    const newFiles = Array.from(event.target.files);
    setOrderDocuments((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleOpenImage = (index) => {
    setImageIndex(index);
    setOpenImage(!openImage);
  };

  const handleRemoveDocument = (indexToRemove) => {
    setOrderDocuments((prevOrderDocuments) =>
      prevOrderDocuments.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAddSelectCustomerChannel = (event) => {
    setOrderCustomerChannel(event.target.value);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ margin: "32px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "8px" }}>
              <IconButton
                onClick={() => {
                  navigate(-1);
                }}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
            </div>
            <div>
              <Typography style={{ fontSize: "32px", color: "#0F607D" }}>
                {orderDetailInfo?.data?.orderTitle}
              </Typography>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {userInformation?.data?.role === "Admin" ||
            userInformation?.data?.role === "Super Admin" ? (
              <>
                <DefaultButton
                  onClickFunction={() => {
                    handleOpenModal(orderDetailInfo);
                  }}
                >
                  <Typography>Edit Order</Typography>
                </DefaultButton>
                <div style={{ marginLeft: "8px" }}>
                  <Button
                    sx={{ textTransform: "none" }}
                    color="error"
                    variant="outlined"
                    onClick={() => {
                      handleDeleteModal();
                    }}
                  >
                    <Typography>Delete Order</Typography>
                  </Button>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex" }}>
            <Typography style={{ fontSize: "24px", color: "#0F607D" }}>
              Documents:
            </Typography>
          </div>
          <div style={{ marginTop: "16px", display: "flex" }}>
            {orderDetailInfo?.data?.documents?.map((result) => {
              return (
                <div>
                  <img
                    style={{
                      height: "160px",
                      width: "160px",
                      marginRight: "64px",
                    }}
                    srcSet={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format`}
                    alt={result.filename}
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex" }}>
            <Typography sx={{ fontSize: "24px", color: "#0F607D" }}>
              Order Details:{" "}
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography sx={{ fontSize: "20px" }}>
              {orderDetailInfo?.data?.orderDetails}
            </Typography>
          </div>
        </div>
      </div>
      {openModal === true && (
        <MyModal open={openModal} handleClose={handleCloseModal}>
          <div
            className="hideScrollbar"
            style={{ margin: "32px", overflow: "auto" }}
          >
            <div style={{ display: "flex", margin: "32px 0px 20px 0px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "48px" }}>
                Edit Order
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
                  value={orderTitle}
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
                  value={orderQuantityValue}
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
                  value={orderQuantityUnit}
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
                  {orderDocuments.map((result, index) => {
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
                          // srcSet={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          src={
                            result.id !== undefined
                              ? `http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format`
                              : URL.createObjectURL(result)
                          }
                          alt={result.filename}
                          loading="lazy"
                        />
                      </div>
                    );
                  })}
                  <div>
                    {orderDetailInfo.data.documents.length !== 0 ? (
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
                  value={orderDetails}
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
                  value={orderCustomerChannel}
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
                  value={orderCustomerDetail}
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
                    handleUpdateOrder(orderId);
                  }}
                >
                  Edit Order
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
              // srcSet={`http://localhost:3000/uploads/${orderDetailInfo.data.documents[imageIndex].filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={
                orderDocuments[imageIndex].id !== undefined
                  ? `http://localhost:3000/uploads/${orderDocuments[imageIndex].filename}?w=248&fit=crop&auto=format`
                  : URL.createObjectURL(orderDocuments[imageIndex])
              }
              alt={
                orderDocuments[imageIndex].id !== undefined
                  ? orderDetailInfo.data.documents[imageIndex].filename
                  : ""
              }
              loading="lazy"
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
      {openDeleteModal && (
        <MyModal open={openDeleteModal} handleClose={handleCloseDeleteModal}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <div>
              <WarningIcon
                style={{ color: "red", height: "256px", width: "256px" }}
              />
              <div>
                <Typography sx={{ fontSize: "24px", color: "black" }}>
                  Are you sure you want to delete the order?
                </Typography>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      justifyContent: "space-evenly",
                      width: "25vh",
                      bottom: 0,
                      position: "relative",
                    }}
                  >
                    <Button
                      onClick={() => {
                        handleDeleteOrder();
                      }}
                      style={{ textTransform: "none" }}
                      variant="outlined"
                      color="error"
                    >
                      Yes
                    </Button>
                    <DefaultButton
                      onClickFunction={() => {
                        handleCloseDeleteModal();
                      }}
                    >
                      No
                    </DefaultButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MyModal>
      )}
    </div>
  );
};

export default OrderDetail;
