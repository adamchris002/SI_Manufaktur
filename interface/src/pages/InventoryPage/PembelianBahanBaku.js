import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import factoryBackground from "../../assets/factorybackground.png";
import { Typography } from "@mui/material";
import MySelectTextField from "../../components/SelectTextField";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";

const PembelianBahanBaku = (props) => {
  const { userInformation } = props;

  const [
    allAcceptedPermohonanPembelianId,
    setAllAcceptedPermohonanPembelianId,
  ] = useState([]);
  const [permohonanPembelian, setPermohonanPembelian] = useState([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { isMobile } = useContext(AppContext);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllAcceptedPermohonanPembelian",
    }).then((result) => {
      if (result.status === 200) {
        const allIds = result.data.map((data) => ({
          value: data.id,
        }));
        setAllAcceptedPermohonanPembelianId(allIds);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak dapat memanggil data permohonan pembelian yang sudah diacc"
        );
      }
    });
  }, []);

  const handleSelectId = (idPermohonanPembelian) => {
    axios({
        method: "GET",
        url: `http://localhost:3000/inventory/getPermohonanPembelian/${idPermohonanPembelian.target.value}`
    }).then((result) => {
        setPermohonanPembelian(result)
    })
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
      <div style={{ margin: "32px", height: "100%", width: "100%" }}>
        <div
          style={{
            display: isMobile ? "" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            style={{ fontSize: isMobile ? "18px" : "2vw", color: "#0F607D" }}
          >
            Tambah Pembelian Bahan Baku/Bahan Pembantu
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: isMobile ? "16px" : "0px",
            }}
          >
            <Typography
              style={{
                fontSize: isMobile ? "12px" : "1.5vw",
                color: "#0F607D",
              }}
            >
              Pilih Id Permohonan Pembelian
            </Typography>
            <div style={{ marginLeft: "8px" }}>
              <MySelectTextField
                width={isMobile ? "60px" : "80px"}
                height={"30px"}
                value={permohonanPembelian?.data?.id}
                data={allAcceptedPermohonanPembelianId}
                type="text"
                onChange={handleSelectId}
              />
            </div>
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

export default PembelianBahanBaku;
