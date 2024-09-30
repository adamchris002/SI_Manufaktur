import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Outlet } from "react-router-dom";
import moment from "moment";
import "./MaindashbordMarketing.css";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import { NumericFormat } from "react-number-format";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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
import { AppContext } from "../App";
import CustomChip from "../components/Chip";
import dayjs from "dayjs";

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

const MaindashboardMarketing = (props) => {
  const navigate = useNavigate();

  const { isMobile } = useContext(AppContext);

  const { userInformation, setUserCredentials } = props;
  const { message, clearMessage, setSuccessMessage } = useAuth();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [orderTitle, setOrderTitle] = useState("");
  const [orderQuantityValue, setOrderQuantityValue] = useState(null);
  const [orderQuantityUnit, setOrderQuantityUnit] = useState("");
  const [orderDocuments, setOrderDocuments] = useState([]);
  const [orderDetails, setOrderDetails] = useState("");
  const [orderTotalPrice, setOrderTotalPrice] = useState("");
  const [orderType, setOrderType] = useState("");
  const [orderNoSeries, setOrderNoSeries] = useState("");
  const [orderDueDate, setOrderDueDate] = useState(dayjs(""));
  const [alamatPengiriman, setAlamatPengirimanProduk] = useState("");
  const [orderCustomerChannel, setOrderCustomerChannel] = useState("");
  const [orderCustomerDetail, setOrderCustomerDetail] = useState("");
  const [updateNotification, setUpdateNotification] = useState(false);
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
      setUpdateNotification(false);
    });
  }, [updateNotification]);

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

  const handleChangeDivisiOwner = (event) => {
    axios({
      method: "PUT",
      url: `http://localhost:3000/finance/updateDivisiOwner/${event.target.value}`,
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
          case "Production Planning":
            navigate("/productionPlanningDashboard");
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

  const lokasi = [
    { value: "Jakarta" },
    { value: "Semarang" },
    { value: "Purwokerto" },
  ];

  const department = [
    { value: "Production Planning" },
    { value: "Inventory" },
    { value: "Production" },
    { value: "Finance" },
  ];

  const handleAddNewOrder = () => {
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
      orderDueDate === "" ||
      !dayjs(orderDueDate, "MM/DD/YYYY hh:mm A", true).isValid()
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
      formData.append("orderTotalPrice", orderTotalPrice);
      formData.append("orderType", orderType);
      formData.append("orderNoSeries", orderNoSeries);
      formData.append("orderDueDate", orderDueDate);
      formData.append("alamatPengiriman", alamatPengiriman);
      formData.append("orderStatus", "Ongoing");

      for (const file of orderDocuments) {
        formData.append("files", file);
      }

      axios({
        method: "POST",
        url: `http://localhost:3000/order/addOrder/${userInformation.data.id}`,
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
          setUpdateNotification(true);
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
          setSnackbarMessage("There was an error in adding the order");
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
    setOrderTotalPrice("");
    setOrderType("");
    setOrderNoSeries("");
    setOrderDueDate(dayjs(""));
    setAlamatPengirimanProduk("");
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
            overflow: "auto",
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
                  .getElementById("vieworders")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Kelola Pesanan
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
                  .getElementById("reviewedorders")
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
                  .getElementById("processedorders")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pesanan Diproduksi
            </DefaultButton>
          </div>
          {/* <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("deliveredorders")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Delivered Orders
            </DefaultButton>
          </div> */}
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("ordershistory")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              History Pesanan
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
                  .getElementById("ordershistory")
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
              {userInformation.data.department} Division
            </Typography>
          </div>
        </div>
        {userInformation?.data?.role === "Owner" && (
          <div style={{ margin: "32px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{ width: "150px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Ubah Divisi
              </Typography>
              <MySelectTextField
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
                style={{ width: "150px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Ubah Lokasi
              </Typography>
              <MySelectTextField
                onChange={(event) => {}}
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
            id="vieworders"
            style={{ color: "#0F607D", fontSize: isMobile ? "4.5vw" : "2vw" }}
          >
            Kelola Pesanan
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
            {allOrderList?.data?.length === 0 ||
            allOrderList?.data === undefined ? (
              <Typography style={{ fontSize: isMobile ? "12px" : "1.25vw" }}>
                Belum ada data pesanan
              </Typography>
            ) : (
              allOrderList?.data?.map((data, index, array) => (
                <div
                  key={index}
                  className="order-item"
                  style={{
                    minWidth: isMobile ? "132px" : "13.33vw",
                    minHeight: isMobile ? "132px" : "13.33vw",
                    marginRight: index === array.length - 1 ? "0" : "32px",
                  }}
                  onClick={() => {
                    navigate(`/marketingDashboard/orderDetail/${data.id}`);
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
                              <div key={index}>
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
                    >{`Tanggal Pembuatan Pesanan: ${moment(
                      data.createdAt
                    ).format("DD/MM/YYYY")}`}</Typography>
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
          <div style={{ display: "flex", marginTop: "1.667vw" }}>
            {userInformation?.data?.role === "Admin" ||
            userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Owner" ? (
              <DefaultButton
                height={isMobile ? "" : "2.08vw"}
                width={isMobile ? "" : "15vw"}
                borderRadius="0.83vw"
                fontSize={isMobile ? "12px" : "1.5vw"}
                onClickFunction={() => {
                  setOpenModal(true);
                }}
              >
                Tambah Pesanan
              </DefaultButton>
            ) : (
              ""
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
            id="reviewedorders"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
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
            {allOrderList?.data?.length === 0 ||
            allOrderList?.data === undefined ||
            !allOrderList?.data?.some(
              (order) => order.orderStatus === "Estimated"
            ) ? (
              <Typography style={{ fontSize: isMobile ? "12px" : "1.25vw" }}>
                Belum ada pesanan yang sudah diestimasi
              </Typography>
            ) : (
              allOrderList?.data
                ?.filter((order) => order.orderStatus === "Estimated")
                .map((data, index, filteredArray) => (
                  <div
                    key={index}
                    className="order-item"
                    style={{
                      minWidth: isMobile ? "132px" : "13.33vw",
                      minHeight: isMobile ? "132px" : "13.33vw",
                      marginRight:
                        index === filteredArray.length - 1 ? "0" : "32px",
                    }}
                  >
                    {data?.documents?.length === "" || null || undefined ? (
                      ""
                    ) : (
                      <div style={{ margin: isMobile ? "12px" : "0.83vw" }}>
                        {data?.documents?.length > 3 ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {data?.documents
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
                                <div key={index}>
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
                      >{`Tanggal Pembuatan Pesanan: ${moment(
                        data.createdAt
                      ).format("DD/MM/YYYY")}`}</Typography>
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
            id="processedorders"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Pesanan Diproduksi
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
            {allOrderList?.data?.length === 0 ||
            allOrderList?.data === undefined ||
            !allOrderList?.data?.some(
              (order) => order.orderStatus === "Processed"
            ) ? (
              <Typography style={{ fontSize: isMobile ? "12px" : "1.25vw" }}>
                Belum ada data pesanan yang sedang diproduksi
              </Typography>
            ) : (
              allOrderList?.data
                ?.filter((order) => order.orderStatus === "Processed")
                .map((data, index, filteredArray) => (
                  <div
                    key={index}
                    className="order-item"
                    style={{
                      minWidth: isMobile ? "132px" : "13.33vw",
                      minHeight: isMobile ? "132px" : "13.33vw",
                      marginRight:
                        index === filteredArray.length - 1 ? "0" : "32px",
                    }}
                  >
                    {data?.documents?.length === "" || null ? (
                      ""
                    ) : (
                      <div style={{ margin: isMobile ? "12px" : "0.83vw" }}>
                        {data?.documents?.length > 3 ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {data?.documents
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
                              + {data.documents?.length - 3}
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
                      >{`Tanggal Pembuatan Pesanan: ${moment(
                        data.createdAt
                      ).format("DD/MM/YYYY")}`}</Typography>
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
        {/* <div
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
            id="deliveredorders"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Delivered Orders
          </Typography>
        </div>
        <div style={{ margin: isMobile ? "0px 0px 0px 32px" : "1.667vw" }}>
          <div
            style={{
              width: isMobile ? "100%" : "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
              display: "flex",
            }}
          >
            {allOrderList?.data?.length === 0 ||
            allOrderList?.data === undefined ||
            !allOrderList?.data?.some(
              (order) => order.orderStatus === "Delivered"
            ) ? (
              <Typography style={{ fontSize: isMobile ? "12px" : "1.25vw" }}>
                There are no delivered orders currently
              </Typography>
            ) : (
              allOrderList?.data
                ?.filter((order) => order.orderStatus === "Delivered")
                .map((data, index, filteredArray) => (
                  <div
                    key={index}
                    className="order-item"
                    style={{
                      minWidth: isMobile ? "132px" : "13.33vw",
                      minHeight: isMobile ? "132px" : "13.33vw",
                      marginRight:
                        index === filteredArray.length - 1 ? "0" : "32px",
                    }}
                  >
                    {data?.documents?.length === "" || null ? (
                      ""
                    ) : (
                      <div style={{ margin: isMobile ? "12px" : "0.83vw" }}>
                        {data?.documents?.length > 3 ? (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {data?.documents
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
                                <div key={index}>
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
        </div> */}
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
            id="ordershistory"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            History Pesanan
          </Typography>
          <div>
            <DefaultButton
              onClickFunction={() => {
                navigate("/marketingDashboard/orderHistoryPage");
              }}
              style={{ width: "4.375vw", height: "2.083vw" }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                Pergi ke Halaman History Pesanan
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
            Catatan Aktivitas
          </Typography>
          <div>
            <DefaultButton
              onClickFunction={() => {
                navigate("/marketingDashboard/activityLog");
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
                fontSize: isMobile ? "4.5vw" : "2vw",
                color: "#0F607D",
              }}
            >
              Kelola Anggota
            </Typography>
            <div>
              <DefaultButton
                onClickFunction={() => {
                  navigate("/marketingDashboard/kelolaAnggota");
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
              style={{ width: "37.5vw", height: "auto" }}
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
                Tambah Pesanan
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
                  >
                    Judul Pesanan:
                  </Typography>
                </div>
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
                    Jumlah Pesanan:
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <TextField
                    type="number"
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
                    type="text"
                    width={isMobile ? "50px" : "7vw"}
                    height={isMobile ? "15px" : "3vw"}
                    borderRadius="10px"
                    data={units}
                    value={orderQuantityUnit}
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
                    Images & Informations:
                  </Typography>
                </div>
                <div style={{ display: "flex" }}>
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
                      {Array.from(orderDocuments).map((result, index) => {
                        return (
                          <div
                            key={index}
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
                                  height: "1.25vw",
                                  width: "1.25vw",
                                }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleRemoveDocument(index);
                                }}
                              >
                                <CloseIcon
                                  style={{
                                    height: "0.83vw",
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
                    Detail Pesanan:
                  </Typography>
                </div>
                <TextField
                  type="text"
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
                    No Seri Pesanan:
                  </Typography>
                </div>
                <TextField
                  type="text"
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
                <div>
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
                        onChange={(event) =>
                          setOrderDueDate(
                            dayjs(event).format("MM/DD/YYYY hh:mm A")
                          )
                        }
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
                  value={orderCustomerChannel}
                  width={isMobile ? "80px" : "8vw"}
                  height={isMobile ? "15px" : "3vw"}
                  borderRadius="10px"
                  data={channels}
                  fontSize={isMobile ? "10px" : "1.5vw"}
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
                  justifyContent: "space-evenly",
                }}
              >
                {userInformation ? (
                  <DefaultButton
                    height={isMobile ? "30px" : "3vw"}
                    width={isMobile ? "80px" : "10vw"}
                    backgroundColor="#0F607D"
                    borderRadius="10px"
                    fontSize={isMobile ? "10px" : "0.9vw"}
                    onClickFunction={() => {
                      handleAddNewOrder();
                    }}
                  >
                    Add Order
                  </DefaultButton>
                ) : (
                  ""
                )}
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
