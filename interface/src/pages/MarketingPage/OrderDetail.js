import React, { useContext, useEffect, useState } from "react";
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
import { AppContext } from "../../App";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NumericFormat } from "react-number-format";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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

const OrderDetail = (props) => {
  const { isMobile } = useContext(AppContext);

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
  const [orderTotalPrice, setOrderTotalPrice] = useState("");
  const [orderType, setOrderType] = useState("");
  const [orderNoSeries, setOrderNoSeries] = useState("");
  const [orderDueDate, setOrderDueDate] = useState(dayjs(""));
  const [alamatPengiriman, setAlamatPengirimanProduk] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [imageIndex, setImageIndex] = useState(null);
  const [imageOption, setImageOption] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { setSuccessMessage } = useAuth();

  const navigate = useNavigate();

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
      setOrderType(result.data.orderType);
      setOrderNoSeries(result.data.orderNoSeries);
      setOrderTotalPrice(result.data.orderTotalPrice);
      setOrderDueDate(dayjs(result.data.orderDueDate));
      setAlamatPengirimanProduk(result.data.alamatPengiriman);
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
    setOrderType(orderDetailInfo.data.orderType);
    setOrderNoSeries(orderDetailInfo.data.orderNoSeries);
    setOrderTotalPrice(orderDetailInfo.data.orderTotalPrice);
    setOrderDueDate(dayjs(orderDetailInfo.data.orderDueDate));
    setAlamatPengirimanProduk(orderDetailInfo.data.alamatPengiriman);
  };

  const handleUpdateOrder = (orderId) => {
    if (
      orderTitle === "" ||
      orderQuantityValue === "" ||
      orderQuantityUnit === "" ||
      orderDetails === "" ||
      orderCustomerChannel === "" ||
      orderCustomerDetail === "" ||
      orderTotalPrice === "" ||
      orderType === "" ||
      orderNoSeries === "" ||
      alamatPengiriman === "" ||
      orderDueDate === "" ||
      !dayjs(orderDueDate, "MM/DD/YYYY hh:mm A", true).isValid()
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
      formData.append("orderTotalPrice", orderTotalPrice);
      formData.append("orderType", orderType);
      formData.append("orderNoSeries", orderNoSeries);
      formData.append("alamatPengiriman", alamatPengiriman);
      formData.append(
        "orderDueDate",
        dayjs(orderDueDate).format("MM/DD/YYYY hh:mm A")
      );

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
            setOrderTotalPrice("");
            setOrderType("");
            setOrderNoSeries("");
            setOrderDueDate(dayjs(""));
            setAlamatPengirimanProduk("");
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
            setOrderTotalPrice("");
            setOrderType("");
            setOrderNoSeries("");
            setOrderDueDate(dayjs(""));
            setAlamatPengirimanProduk("");
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
      params: { userId: userInformation?.data?.id, orderId: orderId },
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
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              // margin: isMobile ? "32px" : "",
            }}
          >
            <div style={{ marginRight: "8px" }}>
              <IconButton
                style={{
                  padding: "0px",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  navigate(-1);
                }}
              >
                <KeyboardArrowLeftIcon
                  style={{
                    height: isMobile ? "24px" : "3vw",
                    width: isMobile ? "24px" : "3vw",
                  }}
                />
              </IconButton>
            </div>
            <div>
              <Typography
                style={{
                  fontSize: isMobile ? "6vw" : "2.5vw",
                  color: "#0F607D",
                }}
              >
                {orderDetailInfo?.data?.orderTitle.length < 8
                  ? orderDetailInfo?.data?.orderTitle
                  : orderDetailInfo?.data?.orderTitle.slice(0, 8) + "..."}
              </Typography>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {userInformation?.data?.role === "Admin" ||
            userInformation?.data?.role === "Super Admin" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <DefaultButton
                  height={isMobile ? "20px" : "4vw"}
                  width={isMobile ? "100px" : "12vw"}
                  fontSize={isMobile ? "12px" : "1.5vw"}
                  onClickFunction={() => {
                    handleOpenModal(orderDetailInfo);
                  }}
                >
                  Edit Order
                </DefaultButton>

                <Button
                  sx={{
                    textTransform: "none",
                    width: isMobile ? "100px" : "12vw",
                    height: isMobile ? "20px" : "4vw",
                    marginLeft: "8px",
                  }}
                  color="error"
                  variant="outlined"
                  onClick={() => {
                    handleDeleteModal();
                  }}
                >
                  <Typography style={{ fontSize: isMobile ? "12px" : "1.5vw" }}>
                    Delete Order
                  </Typography>
                </Button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div
          style={{
            margin: "32",
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", margin: " 0px 32px" }}>
            <Typography
              style={{ fontSize: isMobile ? "5vw" : "2vw", color: "#0F607D" }}
            >
              Documents:
            </Typography>
          </div>
          {orderDetailInfo?.data?.documents.length === 0 ? (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                overflowX: "auto",
                width: "100%",
                margin: "0px 32px",
              }}
            >
              <Typography
                style={{
                  fontSize: isMobile ? "24px" : "2vw",
                  color: "#0F607D",
                }}
              >
                Tidak ada dokumen untuk pesanan ini
              </Typography>
            </div>
          ) : (
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                overflowX: "auto",
                width: "100%",
              }}
            >
              {orderDetailInfo?.data?.documents?.map((result, index) => {
                return (
                  <div style={{ margin: "0px 32px" }}>
                    {index === orderDetailInfo.data.documents.length - 1 ? (
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
          )}
        </div>
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            flexDirection: "column",
            margin: "32px",
          }}
        >
          <div style={{ display: "flex" }}>
            <Typography
              sx={{ fontSize: isMobile ? "5vw" : "2vw", color: "#0F607D" }}
            >
              Order Details:{" "}
            </Typography>
          </div>
          <div style={{ display: "flex" }}>
            <Typography
              sx={{ fontSize: isMobile ? "3vw" : "1.8vw", color: "#0F607D" }}
            >
              {orderDetailInfo?.data?.orderDetails}
            </Typography>
          </div>
          <div style={{ width: isMobile ? "90%" : "80%", marginTop: "32px" }}>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ width: "50%" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.8vw",
                    color: "#0F607D",
                  }}
                >{`Order Quantity: ${orderDetailInfo?.data?.orderQuantity}`}</Typography>
              </div>
              <div style={{ marginLeft: "16px", width: "50%" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.8vw",
                    color: "#0F607D",
                  }}
                >{`Order Status: ${orderDetailInfo?.data?.orderStatus}`}</Typography>
              </div>
            </div>
            <div style={{ display: "flex", marginTop: "16px" }}>
              <div style={{ width: "50%" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.8vw",
                    color: "#0F607D",
                  }}
                >{`Order Type: ${orderDetailInfo?.data?.orderType}`}</Typography>
              </div>
              <div style={{ marginLeft: "16px", width: "50%" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.8vw",
                    color: "#0F607D",
                  }}
                >{`Order No Series: ${orderDetailInfo?.data?.orderNoSeries}`}</Typography>
              </div>
            </div>
            <div style={{ display: "flex", marginTop: "16px" }}>
              <div style={{ width: "50%" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.8vw",
                    color: "#0F607D",
                  }}
                >{`Order Total Price: ${orderDetailInfo?.data?.orderTotalPrice}`}</Typography>
              </div>
              <div style={{ marginLeft: "16px", width: "50%" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.8vw",
                    color: "#0F607D",
                  }}
                >{`Order Due Date: ${dayjs(
                  orderDetailInfo?.data?.orderDueDate
                ).format("MM/DD/YYYY hh:mm A")}`}</Typography>
              </div>
            </div>
            <div style={{ display: "flex", marginTop: "16px" }}>
              <div style={{ width: "50%" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.8vw",
                    color: "#0F607D",
                  }}
                >{`Customer Channel: ${orderDetailInfo?.data?.customerChannel}`}</Typography>
              </div>
              <div style={{ marginLeft: "16px", width: "50%" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.8vw",
                    color: "#0F607D",
                  }}
                >{`Customer Detail: ${orderDetailInfo?.data?.customerDetail}`}</Typography>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <Typography
                style={{
                  fontSize: isMobile ? "3vw" : "1.8vw",
                  color: "#0F607D",
                }}
              >{`Alamat Pengiriman Produk: ${orderDetailInfo?.data?.alamatPengiriman}`}</Typography>
            </div>
          </div>
        </div>
      </div>
      {openModal === true && (
        <MyModal open={openModal} handleClose={handleCloseModal}>
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
                Edit Order
              </Typography>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    Order Title:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  value={orderTitle}
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
                  onChange={(current) => {
                    setOrderTitle(current.target.value);
                  }}
                />
              </div>
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
                  >
                    Order Quantity:
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <TextField
                    type="number"
                    value={orderQuantityValue}
                    sx={{
                      marginRight: "1.667vw",
                      "& .MuiOutlinedInput-root": {
                        height: isMobile ? "15px" : "3vw",
                        width: isMobile ? "50px" : "7vw",
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
                      setOrderQuantityValue(current.target.value);
                    }}
                  />
                  <MySelectTextField
                    value={orderQuantityUnit}
                    type="text"
                    width={isMobile ? "50px" : "7vw"}
                    height={isMobile ? "15px" : "3vw"}
                    borderRadius="10px"
                    data={units}
                    fontSize={isMobile ? "10px" : "1.5vw"}
                    onChange={handleAddSelectUnit}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    Images & Informations:
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {isMobile ? (
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      sx={{
                        height: "30px",
                        width: "30px",
                        padding: "0px",
                        minWidth: "0px",
                        borderRadius: "20px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CloudUploadIcon sx={{ height: "15px", width: "15px" }} />
                      <VisuallyHiddenInput
                        onChange={(event) => {
                          handleFileInput(event);
                        }}
                        type="file"
                        multiple={true}
                      />
                    </Button>
                  ) : (
                    <Button
                      component="label"
                      role={undefined}
                      variant="contained"
                      tabIndex={-1}
                      startIcon={
                        <CloudUploadIcon
                          style={{ height: "2vw", width: "2vw" }}
                        />
                      }
                      sx={{
                        height: "4vw",
                        width: "15vw",
                        borderRadius: "10px",
                        backgroundColor: "#0F607D",
                        fontSize: "1vw",
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
                  )}
                  {orderDocuments.length !== 0 && (
                    <div
                      style={{
                        marginLeft: "0.938vw",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {orderDocuments.map((result, index) => {
                        return (
                          <div
                            style={{
                              width: "2.96vw",
                              height: "2.96vw",
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
                              height: "1.667vw",
                              width: "1.667vw",
                              marginLeft: "0.417vw",
                              display: "flex",
                              alignItems: "center",
                            }}
                            onClick={() => {
                              setImageOption(!imageOption);
                            }}
                          >
                            {imageOption === true ? (
                              <DeleteIcon
                                style={{
                                  width: isMobile ? "12px" : "",
                                  height: isMobile ? "12px" : "",
                                }}
                              />
                            ) : (
                              <RemoveRedEyeIcon
                                style={{
                                  width: isMobile ? "12px" : "",
                                  height: isMobile ? "12px" : "",
                                }}
                              />
                            )}
                          </IconButton>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw " : "1.5vw",
                    }}
                  >
                    Order Details:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  value={orderDetails}
                  multiline
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      width: isMobile ? "150px" : "25vw",
                      fontSize: isMobile ? "10px" : "1.5vw",
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
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    Jenis Cetakan:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  value={orderType}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: isMobile ? "15px" : "3vw",
                      width: isMobile ? "120px" : "20vw",
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
                    setOrderType(event.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    No Seri:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  value={orderNoSeries}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: isMobile ? "15px" : "3vw",
                      width: isMobile ? "90px" : "15vw",
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
                    setOrderNoSeries(event.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    Jumlah Harga:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  value={orderTotalPrice}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: isMobile ? "15px" : "3vw",
                      width: isMobile ? "120px" : "20vw",
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
                    setOrderTotalPrice(event.target.value);
                  }}
                  InputProps={{
                    inputComponent: NumericFormatCustom,
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    Tanggal Jatuh Tempo:
                  </Typography>
                </div>
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
                        value={orderDueDate}
                        onChange={(event) => setOrderDueDate(event)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    Customer Channel:
                  </Typography>
                </div>
                <MySelectTextField
                  type="text"
                  width={isMobile ? "80px" : "8vw"}
                  height={isMobile ? "15px" : "3vw"}
                  value={orderCustomerChannel}
                  borderRadius="10px"
                  data={channels}
                  onChange={handleAddSelectCustomerChannel}
                />
              </div>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    Customer Detail:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  value={orderCustomerDetail}
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
                  onChange={(current) => {
                    setOrderCustomerDetail(current.target.value);
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: "1.667vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "4vw" : "1.5vw",
                    }}
                  >
                    Alamat Pengiriman:
                  </Typography>
                </div>
                <TextField
                  type="text"
                  value={alamatPengiriman}
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
                  onChange={(current) => {
                    setAlamatPengirimanProduk(current.target.value);
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
                  justifyContent: "space-between",
                }}
              >
                <DefaultButton
                  height={isMobile ? "30px" : "3vw"}
                  width={isMobile ? "80px" : "10vw"}
                  backgroundColor="#0F607D"
                  borderRadius="10px"
                  fontSize={isMobile ? "10px" : "0.9vw"}
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
                    height: isMobile ? "30px" : "3vw",
                    width: isMobile ? "80px" : "10vw",
                    borderRadius: "10px",
                    fontSize: isMobile ? "10px" : "0.9vw",
                    textTransform: "none",
                    marginLeft: "2vw",
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
              width: isMobile ? "80vw" : "50vw",
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <WarningIcon
                  style={{ color: "red", height: "256px", width: "256px" }}
                />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Typography sx={{ fontSize: "24px", color: "black" }}>
                    Are you sure you want to delete the order?
                  </Typography>
                </div>
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
