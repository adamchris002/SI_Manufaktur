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

const OrderDetail = () => {
  const { orderId } = useParams();
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
    });
  }, []);

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

  const handleEditOrder = () => {};

  const handleDeleteOrder = () => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/order/deleteOrder/${orderId}`,
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
              >
                <Typography>Delete Order</Typography>
              </Button>
            </div>
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
                  value={orderDetailInfo.data.orderTitle}
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
                  {orderDetailInfo.data.documents.map((result, index) => {
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
                          srcSet={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          src={`http://localhost:3000/uploads/${result.filename}?w=248&fit=crop&auto=format`}
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
                  value={orderDetailInfo.data.orderDetails}
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
                  value={orderDetailInfo.data.customerChannel}
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
                  value={orderDetailInfo.data.customerDetail}
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
                    handleEditOrder();
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
              srcSet={`http://localhost:3000/uploads/${orderDetailInfo.data.documents[imageIndex].filename}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`http://localhost:3000/uploads/${orderDetailInfo.data.documents[imageIndex].filename}?w=248&fit=crop&auto=format`}
              alt={orderDetailInfo.data.documents[imageIndex].filename}
              loading="lazy"
            />
          </div>
        </Backdrop>
      )}
    </div>
  );
};

export default OrderDetail;
