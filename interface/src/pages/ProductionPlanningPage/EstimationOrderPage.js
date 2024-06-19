import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { Typography } from "@mui/material";
import MySelectTextField from "../../components/SelectTextField";
import axios from "axios";
import { AppContext } from "../../App";

const EstimationOrderPage = () => {
  const { isMobile } = useContext(AppContext);

  const [allOrderID, setAllOrderID] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  console.log(selectedOrder);

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
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        // display: "flex",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ margin: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              width: "48%",
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
                      style={{ display: "flex", justifyContent: "flex-start", marginTop: "8px" }}
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
              width: "48%",
              border: "2px solid #0F607D",
              borderRadius: "10px",
            }}
          >
            <div style={{ margin: "24px" }}>
              <Typography style={{ fontSize: "1.5vw", color: "#0F607D" }}>
                Estimation Order
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationOrderPage;
