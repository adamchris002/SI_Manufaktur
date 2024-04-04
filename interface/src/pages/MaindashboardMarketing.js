import React from "react";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";

const MaindashboardMarketing = () => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
      }}
    >
      <div style={{ width: "16.4617vw" }}>
        <div>
          <img style={{height: "auto", width: "128px"}} src={companyLogo} alt="Company Logo" />
        </div>
      </div>
      <div
        style={{
          width: "0.2083vw",
          backgroundColor: "#0F607D",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      ></div>
      <div style={{ width: "83.1217vw" }}></div>
    </div>
  );
};

export default MaindashboardMarketing;
