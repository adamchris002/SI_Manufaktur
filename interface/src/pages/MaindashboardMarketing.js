import React, { useEffect, useState } from "react";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Typography } from "@mui/material";
import { useAuth } from "../components/AuthContext";
import MySnackbar from "../components/Snackbar";

const MaindashboardMarketing = () => {
  const [username, setUsername] = useState("Ricky_Sutar22");
  const [division, setDivision] = useState("Marketing Division");
  const { message, clearMessage } = useAuth();
  const [ snackbarMessage, setSnackbarMessage ] = useState("");
  const [ snackbarStatus, setSnackbarStatus ] = useState(false);
  const [ openSnackbar, setOpenSnackbar ] = useState(false);

  const orderList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  useEffect(() => {
    if (message) {
      console.log(message)
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
              Welcome back, {username}
            </Typography>
            <Typography style={{ fontSize: "24px", color: "#0F607D" }}>
              {division}
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
    </div>
  );
};

export default MaindashboardMarketing;