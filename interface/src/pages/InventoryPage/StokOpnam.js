import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { AppContext } from "../../App";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DefaultButton from "../../components/Button";

const StokOpnam = () => {
  const { isMobile } = useContext(AppContext);
  const [dataStokOpnam, setDataStokOpnam] = useState([]);
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
      <div style={{ height: "100%", width: "100%" }}>
        <div
          style={{
            display: isMobile ? "" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "32px",
          }}
        >
          <Typography
            style={{ fontSize: isMobile ? "" : "3vw", color: "#0F607D" }}
          >
            Stok Opnam
          </Typography>
          <DefaultButton
          // onClickFunction={() => {
          //   setOpenModal(true);
          // }}
          >
            Tambah Item
          </DefaultButton>
        </div>
        <div style={{ width: "100%" }}>
          <div style={{margin: "32px"}}>
            <TableContainer component={Paper} style={{ overflowX: "auto" }}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                style={{ tableLayout: "fixed", overflowX: "auto" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: 50 }}>No.</TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Surat Pesanan
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Tanggal Masuk
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Tanggal Pengembalian
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Jenis Barang
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Kode Barang
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Lokasi Penyimpanan
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Stok Opnam Awal
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Stok Opnam Akhir
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Tanggal Keluar
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Jumlah Pengambilan
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Diambil Oleh
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Untuk Pekerjaan
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Stok Fisik
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Stok Selisih
                    </TableCell>
                    <TableCell align="left" style={{ width: 100 }}>
                      Keterangan
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StokOpnam;
