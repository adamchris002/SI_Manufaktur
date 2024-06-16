import React, { useState } from "react";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Typography } from "@mui/material";

const MaindashboardProductionPlanning = (props) => {

  const { userInformation } = props;

  const orderList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
      <div
        style={{
          width: "16.4617vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ width: "15vw", height: "15vw", marginTop: "32px" }}>
          <img
            style={{ height: "inherit", width: "inherit" }}
            src={companyLogo}
            alt="Company Logo"
          />
        </div>
        <div style={{ marginTop: "64px", fontSize: "24px" }}>
          <DefaultButton
            width="15vw"
            height="2.08vw"
            backgroundColor="#0F607D"
            borderRadius="16px"
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
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
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
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="15vw"
            height="2.08vw"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="1vw"
            onClickFunction={() => {
              document
                .getElementById("manageestimationorders")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Manage Estimation Orders
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="15vw"
            height="2.08vw"
            backgroundColor="#0F607D"
            borderRadius="16px"
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
            style={{ width: "3.33vw", height: "3.33vw", marginRight: "16px" }}
          />
          <div style={{ textAlign: "left" }}>
            <Typography style={{ fontSize: "4vw", color: "#0F607D" }}>
              Welcome back, {userInformation.data.username}
            </Typography>
            <Typography style={{ fontSize: "2vw", color: "#0F607D" }}>
              {userInformation.data.department}
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
            id="unreviewedorders"
            style={{ color: "#0F607D", fontSize: "2vw" }}
          >
            Unreviewed Orders
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
                    height: "13.33vw",
                    width: "13.33vw",
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
            id="estimatedorders"
            style={{ fontSize: "2vw", color: "#0F607D" }}
          >
            Estimated Orders
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
                    height: "13.33vw",
                    width: "13.33vw",
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
            id="manageestimationorders"
            style={{ fontSize: "2vw", color: "#0F607D" }}
          >
            Manage Estimation Orders
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
                    height: "13.33vw",
                    width: "13.33vw",
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
            id="estimationordershistory"
            style={{ fontSize: "2vw", color: "#0F607D" }}
          >
            Estimation Orders History
          </Typography>
          <div>
            <DefaultButton>Go to Estimation Orders History Page</DefaultButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaindashboardProductionPlanning;
