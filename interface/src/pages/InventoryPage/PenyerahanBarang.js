import React, { useEffect } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { Typography } from "@mui/material";
import axios from "axios";

const PenyerahanBarang = () => {

    // const []

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getEstimatedOrders",
    }).then((result) => {

    })
  }, []);
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
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Penyerahan/Pengambilan Barang
          </Typography>
        </div>
        <div style={{ margin: "32px" }}>
          <div>{}</div>
        </div>
      </div>
    </div>
  );
};

export default PenyerahanBarang;
