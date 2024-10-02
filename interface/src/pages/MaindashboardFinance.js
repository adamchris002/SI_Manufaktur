import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
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
import DeleteIcon from "@mui/icons-material/Delete";
import MySnackbar from "../components/Snackbar";
import MyModal from "../components/Modal";
import dayjs from "dayjs";
import { useAuth } from "../components/AuthContext";
import MySelectTextField from "../components/SelectTextField";

const MaindashboardFinance = (props) => {
  const { userInformation, setUserCredentials } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();
  const { message, clearMessage, setSuccessMessage } = useAuth();

  const [
    allDataPermohonanPembelianRequested,
    setAllDataPermohonanPembelianRequested,
  ] = useState([]);
  const [refreshDataPermohonanPembelian, setRefreshDataPermohonanPembelian] =
    useState(true);
  const [selectedPermohonanPembelian, setSelectedPermohonanPembelian] =
    useState([]);
  const [daftarBank, setDaftarBank] = useState([]);
  const [kasHarian, setKasHarian] = useState([]);
  const [daftarTagihanSatuTahun, setDaftarTagihanSatuTahun] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [refreshNamaBank, setRefreshNamaBank] = useState(true);
  const [refreshKasHarian, setRefreshKasHarian] = useState(true);
  const [triggerStatusBukuBank, setTriggerStatusBukuBank] = useState(false);
  const [triggerStatusKasHarian, setTriggerStatusKasHarian] = useState(false);

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
          case "Production":
            navigate("/productionDashboard");
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
        setRefreshDataPermohonanPembelian(true);
        setRefreshKasHarian(true);
        setRefreshNamaBank(true);
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
  ];

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarStatus(true);
      setOpenSnackbar(true);
      clearMessage();
    }
  }, [message, clearMessage]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3000/finance/getActiveRencanaPembayaranOneYear/${userInformation?.data?.id}`,
    }).then((result) => {
      if (result.status === 200) {
        setDaftarTagihanSatuTahun(result.data);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data daftar tagihan 1 tahun"
        );
      }
    });
  }, []);

  useEffect(() => {
    if (refreshDataPermohonanPembelian) {
      axios({
        method: "GET",
        url: `http://localhost:3000/inventory/getAllPermohonanPembelianRequested/${userInformation?.data?.id}`,
      }).then((result) => {
        if (result.status === 200) {
          setAllDataPermohonanPembelianRequested(result.data);
          setRefreshDataPermohonanPembelian(false);
        } else {
          setRefreshDataPermohonanPembelian(false);
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil memanggil data permohonan pembelian"
          );
        }
      });
    }
  }, [refreshDataPermohonanPembelian]);

  useEffect(() => {
    if (refreshNamaBank) {
      axios({
        method: "GET",
        url: `http://localhost:3000/finance/getOngoingBukuBank/${userInformation?.data?.id}`,
      }).then((result) => {
        if (result.status === 200) {
          setDaftarBank(result.data);
          setRefreshNamaBank(true);
          setTriggerStatusBukuBank(true);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data bank");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (refreshKasHarian) {
      axios({
        method: "GET",
        url: `http://localhost:3000/finance/getOngoingKasHarian/${userInformation?.data?.id}`,
      }).then((result) => {
        if (result.status === 200) {
          setKasHarian(result.data);
          setRefreshKasHarian(false);
          setTriggerStatusKasHarian(true);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data kas harian");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (triggerStatusBukuBank) {
      if (
        Array.isArray(daftarBank) &&
        daftarBank.some(
          (dataBank) =>
            dataBank.createdAt &&
            dayjs().isAfter(dayjs(dataBank.createdAt).add(1, "month"))
        )
      ) {
        daftarBank.forEach((result) => {
          if (result.statusBukuBank !== "Done") {
            if (dayjs().isAfter(dayjs(result.createdAt).add(1, "month"))) {
              axios({
                method: "PUT",
                url: `http://localhost:3000/finance/updateStatusDone/${result.id}`,
              }).then((response) => {
                if (response.status === 200) {
                  setTriggerStatusBukuBank(false);
                  setRefreshNamaBank(true);
                } else {
                  setOpenSnackbar(true);
                  setSnackbarStatus(false);
                  setSnackbarMessage("Tidak dapat mengupdate data buku bank");
                }
              });
            }
          }
        });
      }
    }
  }, [triggerStatusBukuBank]);

  useEffect(() => {
    if (triggerStatusKasHarian) {
      if (
        kasHarian?.createdAt &&
        dayjs().isAfter(dayjs(kasHarian?.createdAt).add(1, "month"))
      ) {
        if (kasHarian?.statusKasHarian !== "Done") {
          axios({
            method: "PUT",
            url: `http://localhost:3000/finance/updateStatusKasHarianDone/${kasHarian.id}`,
          }).then((response) => {
            if (response.status === 200) {
              setTriggerStatusKasHarian(false);
              setRefreshKasHarian(true);
            } else {
              setOpenSnackbar(true);
              setSnackbarStatus(false);
              setSnackbarMessage("Tidak dapat mengupdate data kas harian");
            }
          });
        }
      }
    }
  }, [triggerStatusKasHarian]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleOpenModalForConfirmationPermohonanPembelian = (data) => {
    setOpenModal(true);
    setSelectedPermohonanPembelian(data);
  };

  const handleDenyPermohonanPembelian = (id) => {
    axios({
      method: "PUT",
      url: `http://localhost:3000/inventory/denyPermohonanPembelian/${id}`,
      params: { userId: userInformation?.data?.id },
    }).then((result) => {
      if (result.status === 200) {
        handleCloseModal();
        setRefreshDataPermohonanPembelian(true);
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menolak permohonan pembelian");
      } else {
        handleCloseModal();
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menolak permohonan pembelian");
      }
    });
  };

  const handleAcceptPermohonanPembelian = (id) => {
    axios({
      method: "PUT",
      url: `http://localhost:3000/inventory/acceptPermohonanPembelian/${id}`,
      params: { userId: userInformation?.data?.id },
    }).then((result) => {
      if (result.status === 200) {
        handleCloseModal();
        setRefreshDataPermohonanPembelian(true);
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menerima permohonan pembelian");
      } else {
        handleCloseModal();
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil acc permohonan pembelian");
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
            fontSize="16px"
            onClickFunction={() => {
              document
                .getElementById("permohonanpembelian")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Permohonan Pembelian
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
                .getElementById("bukubank")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Buku Bank
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
                .getElementById("kasharian")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Kas Harian
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
                .getElementById("pajak")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Pajak
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
                .getElementById("rencanaPembayaran")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Rencana Pembayaran
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
                .getElementById("activitylog")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Catatan Aktivitas
          </DefaultButton>
        </div>
        {(userInformation?.data?.role === "Super Admin" ||
          userInformation?.data?.role === "Owner") && (
          <div style={{ marginTop: "32px", fontSize: "24px" }}>
            <DefaultButton
              width="232px"
              height="40px"
              backgroundColor="#0F607D"
              borderRadius="16px"
              fontSize="16px"
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
      <div
        id="test"
        style={{
          width: "0.2083vw",
          height: "95vh",
          display: "flex",
          alignSelf: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#0F607D",
            width: "inherit",
            height: "inherit",
          }}
        />
      </div>
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
              Welcome back, {userInformation?.data?.username}
            </Typography>
            <Typography style={{ fontSize: "24px", color: "#0F607D" }}>
              {userInformation.data.department} Division
            </Typography>
          </div>
        </div>
        {userInformation?.data?.role === "Owner" && (
          <div style={{ margin: "32px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{ width: "150px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Ubah Divisi
              </Typography>
              <MySelectTextField
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
                style={{ width: "150px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Ubah Lokasi
              </Typography>
              <MySelectTextField
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
            margin: "32px",
            marginTop: "64px",
            // display: "flex",
            // justifyContent: "space-between",
            // alignItems: "center",
            width: "72vw",
          }}
        >
          <Typography
            id="permohonanpembelian"
            style={{ color: "#0F607D", fontSize: "36px" }}
          >
            Daftar Permohonan Pembelian
          </Typography>
          {allDataPermohonanPembelianRequested.length === 0 ? (
            <div>
              <Typography>Tidak ada data permohonan pembelian</Typography>
            </div>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ overflowX: "auto", width: 650 }}
            >
              <Table
                sx={{ overflowX: "auto", tableLayout: "fixed", width: 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Nomor</TableCell>
                    <TableCell>Perihal</TableCell>
                    <TableCell style={{ width: "150px" }}>
                      Status Permohonan
                    </TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allDataPermohonanPembelianRequested?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>{result.nomor}</TableCell>
                          <TableCell>{result.perihal}</TableCell>
                          <TableCell>{result.statusPermohonan}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                handleOpenModalForConfirmationPermohonanPembelian(
                                  result
                                );
                              }}
                            >
                              <VisibilityIcon style={{ color: "#0F607D" }} />
                            </IconButton>
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
            id="bukubank"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Buku Bank
          </Typography>
          <DefaultButton
            height="40px"
            width="232px"
            borderRadius="16px"
            fontSize="14px"
            onClickFunction={() => {
              navigate("/financeDashboard/bukuBank");
            }}
          >
            Pergi ke Halaman Buku Bank
          </DefaultButton>
        </div>
        <div style={{ margin: "32px", width: "50%" }}>
          {/* {daftarBank?.length === 0 ? (
            <div>
              <Typography>Tidak ada data buku bank</Typography>
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Tanggal</TableCell>
                    <TableCell>Nama Bank</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {daftarBank.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            {dayjs(result.createdAt).format(
                              "MM/DD/YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>{result.namaBank}</TableCell>
                          <TableCell>
                            <IconButton>
                              <DeleteIcon style={{ color: "red" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )} */}
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
            id="kasharian"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Kas Harian
          </Typography>
          <DefaultButton
            height="40px"
            width="232px"
            borderRadius="16px"
            fontSize="14px"
            onClickFunction={() => {
              navigate("/financeDashboard/kasHarian");
            }}
          >
            Pergi ke Halaman Kas Harian
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
          <Typography id="pajak" style={{ fontSize: "36px", color: "#0F607D" }}>
            Pajak
          </Typography>
          {(userInformation?.data?.role === "Admin" ||
            userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Owner") && (
            <div>
              <DefaultButton
                height="40px"
                width="232px"
                borderRadius="16px"
                fontSize="14px"
                onClickFunction={() => {
                  navigate("/financeDashboard/pajak");
                }}
              >
                Pergi ke Halaman Pajak
              </DefaultButton>
            </div>
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
            id="rencanaPembayaran"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Rencana Pembayaran
          </Typography>
          <div>
            <DefaultButton
              height="40px"
              width="300px"
              borderRadius="16px"
              fontSize="14px"
              onClickFunction={() => {
                navigate("/financeDashboard/rencanaPembayaran");
              }}
            >
              Pergi ke Halaman Rencana Pembayaran
            </DefaultButton>
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
            id="daftartagihansatutahun"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Daftar Tagihan 1 Tahun
          </Typography>
          {/* <div>
            <DefaultButton
              height="40px"
              width="312px"
              borderRadius="16px"
              fontSize="14px"
              onClickFunction={() => {
                navigate("/financeDashboard/rencanaPembayaran");
              }}
            >
              Pergi ke halaman daftar tagihan 1 tahun
            </DefaultButton>
          </div> */}
        </div>
        <div style={{ width: "60%" }}>
          <TableContainer
            component={Paper}
            sx={{ overflowX: "auto", margin: "32px" }}
          >
            <Table
              aria-label="simple table"
              sx={{ tableLayout: "fixed", minWidth: 650, overflowX: "auto" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "25px" }}>No.</TableCell>
                  <TableCell style={{ width: "200px" }}>
                    Rencana Pembayaran
                  </TableCell>
                  <TableCell style={{ width: "200px" }}>
                    Status Rencana Pembayaran
                  </TableCell>
                  {/* <TableCell style={{ width: "50px" }}>Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {daftarTagihanSatuTahun.map((result, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{index + 1 + "."}</TableCell>
                        <TableCell>{result.judulRencanaPembayaran}</TableCell>
                        <TableCell>{result.statusRencanaPembayaran}</TableCell>
                        {/* <TableCell>
                          <IconButton>
                            <VisibilityIcon style={{ color: "#0F607D" }} />
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
            id="activitylog"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Catatan Aktivitas
          </Typography>
          <div>
            <DefaultButton
              height="40px"
              width="300px"
              borderRadius="16px"
              fontSize="14px"
              onClickFunction={() => {
                navigate("/financeDashboard/activitylog");
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
                : "3.33vw 1.667vw 0vw 1.667vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: isMobile ? "" : "72vw",
            }}
          >
            <Typography
              id="kelolaanggota"
              style={{
                fontSize: isMobile ? "4.5vw" : "2vw",
                color: "#0F607D",
              }}
            >
              Kelola Anggota
            </Typography>
            <div>
              <DefaultButton
                onClickFunction={() => {
                  navigate("/financeDashboard/kelolaAnggota");
                }}
              >
                <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                  Pergi ke Halaman Kelola Anggota
                </Typography>
              </DefaultButton>
            </div>
          </div>
        )}
      </div>

      {openModal === true && (
        <MyModal open={openModal} handleClose={handleCloseModal}>
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "50vw",
              maxHeight: "80vh",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "7vw" : "2.5vw",
                }}
              >
                Permohonan Pembelian
              </Typography>
              <IconButton style={{ height: "50%" }} onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
            </div>
            <div>
              <div>
                <Typography
                  style={{
                    fontSize: isMobile ? "" : "1.5vw",
                    color: "#0F607D",
                  }}
                >
                  Nomor: {selectedPermohonanPembelian.nomor}
                </Typography>
                <Typography
                  style={{
                    marginTop: "16px",
                    fontSize: isMobile ? "" : "1.5vw",
                    color: "#0F607D",
                  }}
                >
                  Perihal: {selectedPermohonanPembelian.perihal}
                </Typography>
              </div>
              <div>
                <TableContainer style={{ marginTop: "16px" }} component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell align="left">Jenis Barang</TableCell>
                        <TableCell align="left">Jumlah</TableCell>
                        <TableCell align="left">Untuk Pekerjaan</TableCell>
                        <TableCell align="left">Stok</TableCell>
                        <TableCell align="left">Keterangan</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedPermohonanPembelian.itemPermohonanPembelians.map(
                        (result, index) => {
                          return (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell>{result.jenisBarang}</TableCell>
                                <TableCell>{result.jumlah}</TableCell>
                                <TableCell>{result.untukPekerjaan}</TableCell>
                                <TableCell>{result.stok}</TableCell>
                                <TableCell>{result.keterangan}</TableCell>
                              </TableRow>
                            </React.Fragment>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "16px",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    handleAcceptPermohonanPembelian(
                      selectedPermohonanPembelian.id
                    );
                  }}
                >
                  Accept
                </DefaultButton>

                <Button
                  onClick={() => {
                    handleDenyPermohonanPembelian(
                      selectedPermohonanPembelian.id
                    );
                  }}
                  style={{ marginLeft: "8px", textTransform: "none" }}
                  variant="outlined"
                  color="error"
                >
                  Deny
                </Button>
              </div>
            </div>
          </div>
        </MyModal>
      )}
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

export default MaindashboardFinance;
