import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import MySnackbar from "../components/Snackbar";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckIcon from "@mui/icons-material/Check";
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
import { AppContext } from "../App";
import MySelectTextField from "../components/SelectTextField";

const MaindashboardProduction = (props) => {
  const { userInformation, setUserCredentials } = props;
  const navigate = useNavigate();
  const { isMobile } = useContext(AppContext);

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

  const handleChangeDivisiOwner = (event) => {
    axios({
      method: "PUT",
      url: `http://localhost:3000/finance/updateDivisiOwner/${event.target.value}`,
    }).then((result) => {
      if (result.status === 200) {
        setUserCredentials((oldObject) => {
          return {
            ...oldObject,
            data: {
              ...oldObject.data,
              department: event.target.value,
            },
          };
        });
        switch (event.target.value) {
          case "Marketing":
            navigate("/marketingDashboard");
            break;
          case "Production Planning":
            navigate("/productionPlanningDashboard");
            break;
          case "Inventory":
            navigate("/inventoryDashboard");
            break;
          case "Finance":
            navigate("/financeDashboard");
            break;
          default:
          //snackbar
        }
      } else {
        //snackbar
      }
    });
  };

  const handleChangeLocationOwner = (event) => {
    axios({
      method: "PUT",
      url: `http://localhost:3000/finance/updateLocationOwner/${event.target.value}`,
    }).then((result) => {
      if (result.status === 200) {
        setUserCredentials((oldObject) => {
          return {
            ...oldObject,
            data: {
              ...oldObject.data,
              lokasi: event.target.value,
            },
          };
        });
        setRefreshDataKegiatanProduksi(true);
        setRefreshDataLaporanLimbahProduksi(true);
      } else {
        //snackbar
      }
    });
  };

  const lokasi = [
    { value: "Jakarta" },
    { value: "Semarang" },
    { value: "Purwokerto" },
  ];

  const department = [
    { value: "Marketing" },
    { value: "Production Planning" },
    { value: "Inventory" },
    { value: "Production" },
    { value: "Finance" },
  ];

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
        url: `http://localhost:3000/production/getAllLaporanLimbahProduksi/${userInformation?.data?.id}`,
      }).then((result) => {
        if (result.status === 200) {
          setAllDataLaporanLimbahProduksi(result?.data);
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
    if (refreshDataKegiatanProduksi) {
      axios({
        method: "GET",
        url: `http://localhost:3000/production/penyerahanBarangSiap/${userInformation?.data?.id}`,
      }).then((result) => {
        if (result.status === 200) {
          setAllPenyerahanBarang(result.data);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak dapat memanggil data penyerahan barang");
        }
      });
    }
  }, [refreshDataKegiatanProduksi]);

  useEffect(() => {
    if (refreshDataKegiatanProduksi) {
      axios({
        method: "GET",
        url: `http://localhost:3000/production/getProductionData/${userInformation?.data?.id}`,
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

  const handleSelesaiKegiatanProduksi = (id) => {
    axios({
      method: "PUT",
      url: `http://localhost:3000/production/kegiatanProduksiSelesai/${id}`,
      params: { userId: userInformation?.data?.id },
    }).then((result) => {
      if (result.status === 200) {
        setRefreshDataKegiatanProduksi(true);
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage(`Kegiatan produksi dengan id ${id} selesai`);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil mengupdate kegiatan produksi");
      }
    });
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
      params: { userId: userInformation?.data?.id },
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
      params: {
        tahapProduksi: tahapProduksi,
        noOrderProduksi: noOrderProduksi,
        userId: userInformation?.data?.id,
      },
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
      {isMobile ? (
        ""
      ) : (
        <div
          style={{
            width: "16.4617vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "15vw", height: "15vw", marginTop: "1.667vw" }}>
            <img
              style={{ height: "inherit", width: "inherit" }}
              src={companyLogo}
              alt="Company Logo"
            />
          </div>
          <div style={{ marginTop: "3.3vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("itemstopickup")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Barang Untuk Diambil
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("productionactivity")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Kegiatan Produksi
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("manageproductionreports")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Kelola Laporan Produksi
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="0.9vw"
              onClickFunction={() => {
                document
                  .getElementById("wastepickupactivity")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Kelola Item Limbah Produksi
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("actualreportshistory")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Actual Reports History
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("activitylog")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Catatan Aktivitas
            </DefaultButton>
          </div>
          {(userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Onwer") && (
            <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
              <DefaultButton
                width="15vw"
                height="2.08vw"
                backgroundColor="#0F607D"
                borderRadius="0.83vw"
                fontSize="1vw"
                onClickFunction={() => {
                  document
                    .getElementById("kelolaanggota")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                Kelola Anggota
              </DefaultButton>
            </div>
          )}
        </div>
      )}
      {isMobile ? (
        ""
      ) : (
        <div
          id="test"
          style={{
            width: "0.2083vw",
            height: "95vh",
            backgroundColor: "#0F607D",
            alignSelf: "95v",
          }}
        />
      )}
      <div
        style={{
          width: isMobile ? "100vh" : "83.1217vw",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AccountCircleIcon
            style={{
              width: isMobile ? "32px" : "64px",
              height: isMobile ? "32px" : "64px",
              marginRight: "16px",
            }}
          />
          <div style={{ textAlign: "left" }}>
            <Typography
              style={{ fontSize: isMobile ? "5vw" : "4vw", color: "#0F607D" }}
            >
              Welcome back, {userInformation.data.username}
            </Typography>
            <Typography
              style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
            >
              {userInformation.data.department} Division
            </Typography>
          </div>
        </div>
        {userInformation?.data?.role === "Owner" && (
          <div style={{ margin: "32px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{
                  width: "150px",
                  color: "#0F607D",
                  fontSize: isMobile ? "5vw" : "1.5vw",
                }}
              >
                Ubah Divisi
              </Typography>
              <MySelectTextField
                value={userInformation?.data?.department}
                onChange={(event) => {
                  handleChangeDivisiOwner(event);
                }}
                data={department}
                width="150px"
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <Typography
                style={{
                  width: "150px",
                  color: "#0F607D",
                  fontSize: isMobile ? "5vw" : "1.5vw",
                }}
              >
                Ubah Lokasi
              </Typography>
              <MySelectTextField
                value={userInformation?.data?.lokasi}
                onChange={(event) => {
                  handleChangeLocationOwner(event);
                }}
                data={lokasi}
                width="150px"
              />
            </div>
          </div>
        )}
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="itemstopickup"
            style={{ color: "#0F607D", fontSize: isMobile ? "4vw" : "2vw" }}
          >
            Barang Untuk Diambil
          </Typography>
        </div>
        <div style={{ margin: "32px", marginTop: "32px" }}>
          <div
            style={{
              // margin: isMobile ? "0px 32px 0px 0px" : "1.667vw",
              width: isMobile ? "" : "72vw",
            }}
          >
            {allPenyerahanBarang.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  style={{
                    fontSize: isMobile ? "3vw" : "1.5vw",
                    color: "#0F607D",
                  }}
                >
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
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="productionactivity"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Kegiatan Produksi
          </Typography>
          {(userInformation?.data?.role === "Admin" ||
            userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Owner") && (
            <div>
              <DefaultButton
                height={isMobile ? "" : "2.08vw"}
                width={isMobile ? "" : "15vw"}
                borderRadius="0.83vw"
                fontSize={isMobile ? "10px" : "1vw"}
                onClickFunction={() => {
                  navigate("/productionDashboard/kegiatanProduksi");
                }}
              >
                Tambah Kegiatan Produksi
              </DefaultButton>
            </div>
          )}
        </div>
        <div style={{ margin: "32px", marginTop: "32px" }}>
          <div
            style={{
              width: isMobile ? " " : "72vw",
              // overflowX: "auto",
              // whiteSpace: "nowrap",
            }}
          >
            {dataKegiatanProduksi.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  style={{
                    color: "#0F607D",
                    fontSize: isMobile ? "3vw" : "1.5vw",
                  }}
                >
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
                      {(userInformation?.data?.role === "Admin" ||
                        userInformation?.data?.role === "Super Admin" ||
                        userInformation?.data?.role === "Owner") && (
                        <TableCell>Actions</TableCell>
                      )}
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
                              {(userInformation?.data?.role === "Admin" ||
                                userInformation?.data?.role === "Super Admin" ||
                                userInformation?.data?.role === "Owner") && (
                                <TableCell>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {/* <IconButton
                                      onClick={() => {
                                        handleGoToEditKegiatanProduksi(
                                          result.id
                                        );
                                      }}
                                    >
                                      <EditIcon style={{ color: "#0F607D" }} />
                                    </IconButton> */}
                                    {result.tahapProduksi !==
                                      "Produksi Pracetak" && (
                                      <IconButton
                                        onClick={() => {
                                          handleSelesaiKegiatanProduksi(
                                            result.id
                                          );
                                        }}
                                      >
                                        <CheckIcon style={{color: "#0F607D"}} />
                                      </IconButton>
                                    )}
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
                              )}
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
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="manageproductionreports"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Kelola Laporan Produksi
          </Typography>
          <DefaultButton
            height={isMobile ? "" : "2.08vw"}
            width={isMobile ? "" : "15vw"}
            borderRadius="0.83vw"
            fontSize={isMobile ? "10px" : "0.8vw"}
            onClickFunction={() => {
              navigate("/productionDashboard/laporanProduksi");
            }}
          >
            Pergi ke halaman laporan produksi
          </DefaultButton>
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="wastepickupactivity"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Kelola Item Limbah Produksi
          </Typography>
          {(userInformation?.data?.role === "Admin" ||
            userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Owner") && (
            <div>
              <DefaultButton
                height={isMobile ? "" : "2.08vw"}
                width={isMobile ? "" : "15vw"}
                borderRadius="0.83vw"
                fontSize={isMobile ? "10px" : "0.7vw"}
                onClickFunction={() => {
                  navigate("/productionDashboard/laporanLimbahProduksi");
                }}
              >
                Kelola item laporan limbah produksi
              </DefaultButton>
            </div>
          )}
        </div>
        <div
          style={{ marginLeft: "32px", marginTop: "32px", marginRight: "32px" }}
        >
          {allDataLaporanLimbahProduksi?.length === 0 ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "3vw" : "1.5vw",
                }}
              >
                Tidak ada data laporan limbah produksi
              </Typography>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>No Order Produksi</TableCell>
                    <TableCell>Tahap Produksi</TableCell>
                    <TableCell>Dibuat Oleh</TableCell>
                    <TableCell>Tanggal Pembuatan</TableCell>
                    {(userInformation?.data?.role === "Admin" ||
                      userInformation?.data?.role === "Super Admin" ||
                      userInformation?.data?.role === "Owner") && (
                      <TableCell>Actions</TableCell>
                    )}
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
                          {(userInformation?.data?.role === "Admin" ||
                            userInformation?.data?.role === "Super Admin" ||
                            userInformation?.data?.role === "Owner") && (
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() => {
                                    handleGoToEditLaporanLimbahProduksi(
                                      result.id
                                    );
                                  }}
                                >
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
                          )}
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
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="actualreportshistory"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Actual Reports History
          </Typography>
          <div>
            <DefaultButton
              onClickFunction={() => {
                navigate("/productionDashboard/laporanAktual");
              }}
            >
              Go to Actual Reports History Page
            </DefaultButton>
          </div>
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="activitylog"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Catatan Aktivitas
          </Typography>
          <div>
            <DefaultButton
              height={isMobile ? "" : "2.08vw"}
              width={isMobile ? "" : "15vw"}
              borderRadius="0.83vw"
              fontSize={isMobile ? "10px" : "0.8vw"}
              onClickFunction={() => {
                navigate("/productionDashboard/activitylog");
              }}
            >
              Pergi ke Halaman Catatan Aktivitas
            </DefaultButton>
          </div>
        </div>
        {(userInformation?.data?.role === "Super Admin" ||
          userInformation?.data?.role === "Owner") && (
          <div
            style={{
              margin: isMobile
                ? "32px 32px 12px 32px"
                : "1.25vw 1.667vw 0vw 1.667vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: isMobile ? "" : "72vw",
            }}
          >
            <Typography
              id="kelolaanggota"
              style={{
                fontSize: isMobile ? "4vw" : "2vw",
                color: "#0F607D",
              }}
            >
              Kelola Anggota
            </Typography>
            <div>
              <DefaultButton
                height={isMobile ? "" : "2.08vw"}
                width={isMobile ? "" : "15vw"}
                borderRadius="0.83vw"
                fontSize={isMobile ? "10px" : "0.8vw"}
                onClickFunction={() => {
                  navigate("/productionDashboard/kelolaAnggota");
                }}
              >
                Pergi ke Halaman Kelola Anggota
              </DefaultButton>
            </div>
          </div>
        )}
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
