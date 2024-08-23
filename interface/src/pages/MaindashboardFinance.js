import React, { useEffect, useState } from "react";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import axios from "axios";
import MySnackbar from "../components/Snackbar";

const MaindashboardFinance = (props) => {
  const { userInformation } = props;

  const orderList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [
    allDataPermohonanPembelianRequested,
    setAllDataPermohonanPembelianRequested,
  ] = useState([]);
  const [refreshDataPermohonanPembelian, setRefreshDataPermohonanPembelian] =
    useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (refreshDataPermohonanPembelian) {
      axios({
        method: "GET",
        url: "http://localhost:3000/inventory/getAllPermohonanPembelianRequested",
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
                .getElementById("managewastereports")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Manage Waste Reports
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
                .getElementById("wastereportshistory")
                .scrollIntoView({ behavior: "smooth" });
            }}
          >
            Waste Reports History
          </DefaultButton>
        </div>
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
            <TableContainer component={Paper} sx={{ overflowX: "auto", width: 650 }}>
              <Table
                sx={{ overflowX: "auto", tableLayout: "fixed", width: 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Nomor</TableCell>
                    <TableCell>Perihal</TableCell>
                    <TableCell style={{width: "150px"}}>Status Permohonan</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allDataPermohonanPembelianRequested?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableCell>{index + 1 + "."}</TableCell>
                        <TableCell>{result.nomor}</TableCell>
                        <TableCell>{result.perihal}</TableCell>
                        <TableCell>{result.statusPermohonan}</TableCell>
                        <TableCell>
                          <IconButton>
                            <VisibilityIcon style={{ color: "#0F607D" }} />
                          </IconButton>
                        </TableCell>
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
            id="managewastereports"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Manage Waste Reports
          </Typography>
          <DefaultButton
            height="40px"
            width="232px"
            borderRadius="16px"
            fontSize="16px"
          >
            Add Waste Reports
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
            id="wastereportshistory"
            style={{ fontSize: "36px", color: "#0F607D" }}
          >
            Waste Reports History
          </Typography>
          <div>
            <DefaultButton>Go to Waste Reports History Page</DefaultButton>
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

export default MaindashboardFinance;
