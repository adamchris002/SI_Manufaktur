import React from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { Typography } from "@mui/material";

const LaporanAktual = () => {
  return (
    <div
      className="hideScrollbar"
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
        overflow: "auto",
      }}
    >
      <div style={{ width: "100%", height: "100vh" }}>
        <div style={{ margin: "32px" }}>
          <div>
            <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>Laporan Aktual</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanAktual;
