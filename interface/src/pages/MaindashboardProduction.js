import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import MySnackbar from "../components/Snackbar";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../components/AuthContext";

const MaindashboardProduction = (props) => {
  const { userInformation } = props;
  const navigate = useNavigate();

  const [allPenyerahanBarang, setAllPenyerahanBarang] = useState([]);
  const [dataKegiatanProduksi, setDataKegiatanProduksi] = useState([]);
  const [allDataLaporanLimbahProduksi, setAllDataLaporanLimbahProduksi] =
    useState([]);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [refreshDataKegiatanProduksi, setRefreshDataKegiatanProduksi] =
    useState(true);
  const [
    refreshDataLaporanLimbahProduksi,
    setRefreshDataLaporanLimbahProduksi,
  ] = useState(true);

  const { message, clearMessage, setSuccessMessage } = useAuth();

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarStatus(true);
      setOpenSnackbar(true);
      clearMessage();
    }
  }, [message, clearMessage]);

  useEffect(() => {
    if (refreshDataLaporanLimbahProduksi) {
      axios({
        method: "GET",
        url: "http://localhost:3000/production/getAllLaporanLimbahProduksi",
      }).then((result) => {
        if (result.status === 200) {
          setAllDataLaporanLimbahProduksi(result.data);
          setRefreshDataLaporanLimbahProduksi(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data limbah produksi");
        }
      });
    }
  }, [refreshDataLaporanLimbahProduksi]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/production/penyerahanBarangSiap",
    }).then((result) => {
      if (result.status === 200) {
        setAllPenyerahanBarang(result.data);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak dapat memanggil data penyerahan barang");
      }
    });
  }, []);

  useEffect(() => {
    if (refreshDataKegiatanProduksi) {
      axios({
        method: "GET",
        url: "http://localhost:3000/production/getProductionData",
      }).then((result) => {
        if (result.status === 200) {
          const data = result.data;

          const filteredData = data?.filter(
            (item) => item?.statusLaporan !== "Done"
          );

          filteredData.sort((a, b) => {
            if (a.noOrderProduksi === b.noOrderProduksi) {
              return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
            return a.noOrderProduksi - b.noOrderProduksi;
          });

          const latestDataMap = new Map();
          filteredData.forEach((item) => {
            if (!latestDataMap.has(item.noOrderProduksi)) {
              latestDataMap.set(item.noOrderProduksi, item);
            }
          });

          const latestData = Array.from(latestDataMap.values());
          setDataKegiatanProduksi(latestData);
          setRefreshDataKegiatanProduksi(false);
        } else {
          setRefreshDataKegiatanProduksi(false);
        }
      });
    }
  }, [refreshDataKegiatanProduksi]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleChangeTahapProduksi = (id) => {
    navigate("/productionDashboard/kegiatanProduksi", {
      state: { isNewTahapProduksi: { id: id, status: true } },
    });
  };

  const handleGoToEditKegiatanProduksi = (id) => {
    navigate("/productionDashboard/kegiatanProduksi", {
      state: { laporanProduksiId: id },
    });
  };

  const handleGoToEditLaporanLimbahProduksi = (id) => {
    navigate("/productionDashboard/laporanLimbahProduksi", {
      state: { laporanLimbahProduksiId: id },
    });
  };

  const handleDeleteKegiatanProduksi = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/production/deleteKegiatanProduksi/${id}`,
    }).then((result) => {
      if (result.status === 200) {
        setRefreshDataKegiatanProduksi(true);
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus data kegiatan produksi");
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus data kegiatan produksi");
      }
    });
  };

  const handleDeleteLaporanLimbahProduksi = (
    id,
    tahapProduksi,
    noOrderProduksi
  ) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/production/deleteItemLimbahProduksi/${id}`,
      params: { tahapProduksi: tahapProduksi, noOrderProduksi },
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus data laporan limbah produksi");
        setRefreshDataLaporanLimbahProduksi(true);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil menghapus data laporan limbah produksi"
        );
      }
    });
  };

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
            fontSize="12px"
            onClickFunction={() => {
              document
                .getElementById("itemstopickup")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Barang Untuk Diambil
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="12px"
            onClickFunction={() => {
              document
                .getElementById("productionactivity")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Kegiatan Produksi
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="12px"
            onClickFunction={() => {
              document
                .getElementById("manageproductionreports")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Kelola Laporan Produksi
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="12px"
            onClickFunction={() => {
              document
                .getElementById("wastepickupactivity")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Kelola Item Limbah Produksi
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="12px"
            onClickFunction={() => {
              document
                .getElementById("productionreportshistory")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Production Reports History
          </DefaultButton>
        </div>
        <div style={{ marginTop: "32px", fontSize: "24px" }}>
          <DefaultButton
            width="232px"
            height="40px"
            backgroundColor="#0F607D"
            borderRadius="16px"
            fontSize="12px"
            onClickFunction={() => {
              document
                .getElementById("actualreportshistory")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Actual Reports History
          </DefaultButton>
        </div>
      </div>
      <div
        id="test"
        style={{
          width: "0.2083vw",
          height: "95vh",
          backgroundColor: "#0F607D",
          alignSelf: "95v",
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
            style={{ width: "64px", height: "64px", marginRight: "16px" }}
          />
          <div style={{ textAlign: "left" }}>
            <Typography style={{ fontSize: "48px", color: "#0F607D" }}>
              Welcome back, {userInformation.data.username}
            </Typography>
            <Typography style={{ fontSize: "24px", color: "#0F607D" }}>
              {userInformation.data.department} Division
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
            id="itemstopickup"
            style={{ color: "#0F607D", fontSize: "36px" }}
          >
            Barang Untuk Diambil
          </Typography>
        </div>
        <div style={{ marginLeft: "32px", marginTop: "32px" }}>
          <div
            style={{
              width: "72vw",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {allPenyerahanBarang.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography style={{ fontSize: "1.5vw", color: "#0F607D" }}>
                  Belum ada bahan baku yang dapat diambil
                </Typography>
              </div>
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>No.</TableCell>
                      <TableCell>Id Pesanan</TableCell>
                      <TableCell>Id Perencanaan Produksi</TableCell>
                      <TableCell>Status Pengambilan</TableCell>
                      <TableCell>Tanggal Pengambilan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allPenyerahanBarang?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>{result.orderId}</TableCell>
                            <TableCell>{result.productionPlanningId}</TableCell>
                            <TableCell>{result.statusPenyerahan}</TableCell>
                            <TableCell>
                              {dayjs(result.tanggalPenyerahan).format(
                                "MM/DD/YYYY hh:mm A"
                              )}
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
            id="productionactivity"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Kegiatan Produksi
          </Typography>
          <div>
            <DefaultButton
              height="40px"
              width="232px"
              borderRadius="16px"
              fontSize="16px"
              onClickFunction={() => {
                navigate("/productionDashboard/kegiatanProduksi");
              }}
            >
              Tambah Kegiatan Produksi
            </DefaultButton>
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
            {dataKegiatanProduksi.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                  Tidak ada data Kegiatan Produksi
                </Typography>
              </div>
            ) : (
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table
                  sx={{
                    minWidth: 650,
                    overflowX: "auto",
                    tableLayout: "fixed",
                  }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Tanggal Produksi</TableCell>
                      <TableCell>Tahap Produksi</TableCell>
                      <TableCell>No Order Produksi</TableCell>
                      <TableCell>Jenis Cetakan</TableCell>
                      <TableCell>Dibuat Oleh</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataKegiatanProduksi
                      ?.filter((result) => result.statusLaporan !== "Done")
                      ?.map((result, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>
                                {dayjs(result.tanggalProduksi).format(
                                  "MM/DD/YYYY hh:mm A"
                                )}
                              </TableCell>
                              <TableCell>{result.tahapProduksi}</TableCell>
                              <TableCell>{result.noOrderProduksi}</TableCell>
                              <TableCell>{result.jenisCetakan}</TableCell>
                              <TableCell>{result.dibuatOleh}</TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => {
                                      handleGoToEditKegiatanProduksi(result.id);
                                    }}
                                  >
                                    <EditIcon style={{ color: "#0F607D" }} />
                                  </IconButton>
                                  {result.tahapProduksi !==
                                    "Produksi Fitur" && (
                                    <IconButton
                                      onClick={() => {
                                        handleChangeTahapProduksi(result.id);
                                      }}
                                    >
                                      <ArrowForwardIcon
                                        style={{ color: "#0F607D" }}
                                      />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteKegiatanProduksi(result.id);
                                    }}
                                  >
                                    <DeleteIcon style={{ color: "red" }} />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
            id="manageproductionreports"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Kelola Laporan Produksi
          </Typography>
          <DefaultButton
            height="40px"
            width="320px"
            borderRadius="16px"
            fontSize="16px"
            onClickFunction={() => {
              navigate("/productionDashboard/laporanProduksi");
            }}
          >
            Pergi ke halaman laporan produksi
          </DefaultButton>
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
            id="wastepickupactivity"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Kelola Item Limbah Produksi
          </Typography>
          <div>
            <DefaultButton
              height="40px"
              width="320px"
              borderRadius="16px"
              fontSize="16px"
              onClickFunction={() => {
                navigate("/productionDashboard/laporanLimbahProduksi");
              }}
            >
              Kelola item laporan limbah produksi
            </DefaultButton>
          </div>
        </div>
        <div style={{ marginLeft: "32px", marginTop: "32px" }}>
          {allDataLaporanLimbahProduksi.length === 0 ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                Tidak ada data laporan limbah produksi
              </Typography>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>No Order Produksi</TableCell>
                    <TableCell>Tahap Produksi</TableCell>
                    <TableCell>Dibuat Oleh</TableCell>
                    <TableCell>Tanggal Pembuatan</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allDataLaporanLimbahProduksi?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>{result.noOrderProduksi}</TableCell>
                          <TableCell>{result.tahapProduksi}</TableCell>
                          <TableCell>{result.dibuatOleh}</TableCell>
                          <TableCell>
                            {dayjs(result.tanggalPembuatan).format(
                              "MM/DD/YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <IconButton onClick={() => {
                                handleGoToEditLaporanLimbahProduksi(result.id)
                              }}>
                                <EditIcon style={{ color: "#0F607D" }} />
                              </IconButton>
                              <IconButton
                                onClick={() => {
                                  handleDeleteLaporanLimbahProduksi(
                                    result.id,
                                    result.tahapProduksi,
                                    result.noOrderProduksi
                                  );
                                }}
                                style={{ marginLeft: "8px" }}
                              >
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
            id="productionreportshistory"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Production Reports History
          </Typography>
          <div>
            <DefaultButton>Go to Production Reports History Page</DefaultButton>
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
            id="actualreportshistory"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Actual Reports History
          </Typography>
          <div>
            <DefaultButton>Go to Actual Reports History Page</DefaultButton>
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

export default MaindashboardProduction;
