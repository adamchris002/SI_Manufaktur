import React, { useEffect, useState } from "react";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import MySnackbar from "../components/Snackbar";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const MaindashboardProduction = (props) => {
  const { userInformation } = props;
  const navigate = useNavigate();

  const orderList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [allPenyerahanBarang, setAllPenyerahanBarang] = useState([]);
  // console.log(allPenyerahanBarang);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
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
            fontSize="16px"
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
            Manage Production Reports
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
                .getElementById("wastepickupactivity")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Waste Pickup Activity
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
            fontSize="16px"
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
            {orderList.map((data, index) => {
              return (
                <div
                  key={index}
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
            id="manageproductionreports"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Manage Production Reports
          </Typography>
          <DefaultButton
            height="40px"
            width="232px"
            borderRadius="16px"
            fontSize="16px"
          >
            Add Production Reports
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
                key={index}
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
            id="wastepickupactivity"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Waste Pickup Activity
          </Typography>
          <div>
            <DefaultButton
              height="40px"
              width="232px"
              borderRadius="16px"
              fontSize="16px"
            >
              Add Waste Pickup Activity
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
            {orderList.map((data, index) => {
              return (
                <div
                key={index}
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
