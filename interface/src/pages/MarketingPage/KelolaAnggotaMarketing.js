import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { useNavigate } from "react-router-dom";
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
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import axios from "axios";
import moment from "moment";
import { AppContext } from "../../App";
import MySelectTextField from "../../components/SelectTextField";
import DefaultButton from "../../components/Button";

const KelolaAnggotaMarketing = (props) => {
  const { isMobile } = useContext(AppContext);
  const { userInformation } = props;

  const [userBaru, setUserBaru] = useState([]);
  const [userLama, setUserLama] = useState([]);

  const [triggerBoth, setTriggerBoth] = useState(true);

  useEffect(() => {
    if (triggerBoth) {
      axios({
        method: "GET",
        url: "http://localhost:3000/order/getUserBaru",
      }).then((result) => {
        if (result.status === 200) {
          setUserBaru(result.data);
          setTriggerBoth(false);
        } else {
          //snackbar
        }
      });
    }
  }, [triggerBoth]);
  useEffect(() => {
    if (triggerBoth) {
      axios({
        method: "GET",
        url: "http://localhost:3000/order/getUserLama",
      }).then((result) => {
        if (result.status === 200) {
          const tempData = result.data.filter(
            (item) => item.id !== userInformation?.data?.id
          );
          setUserLama(tempData);
          setTriggerBoth(false);
        } else {
          //snackbar
        }
      });
    }
  }, [triggerBoth]);

  const lokasi = [
    {
      value: "Jakarta",
    },
    {
      value: "Semarang",
    },
    {
      value: "Purwokerto",
    },
  ];

  const role = [
    {
      value: "Anggota",
    },
    {
      value: "Admin",
    },
  ];

  const roleIfOwner = [
    {
      value: "Anggota",
    },
    {
      value: "Admin",
    },
    {
      value: "Super Admin",
    },
  ];

  const department = [
    {
      value: "Marketing",
    },
  ];

  const handleChangeInputPenggunaBaru = (event, index, field) => {
    const value = event.target.value;
    setUserBaru((oldArray) =>
      oldArray.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleChangeInputPenggunaLama = (event, id, field) => {
    const value = event.target.value;
    setUserLama((oldArray) =>
      oldArray.map((item, i) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleCheckIfDataUserBaruEmpty = () => {
    for (const item of userBaru) {
      if (
        !item.name ||
        !item.username ||
        !item.department ||
        !item.department ||
        !item.role ||
        !item.lokasi
      ) {
        return false;
      }
    }
    return true;
  };

  const handleCheckIfDataUserLamaEmpty = () => {
    for (const item of userLama) {
      if (
        !item.name ||
        !item.username ||
        !item.department ||
        !item.department ||
        !item.role ||
        !item.lokasi
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSavePenggunaBaru = () => {
    // const checkIfDataIsEmpty = handleCheckIfDataUserBaruEmpty();

    // if (checkIfDataIsEmpty === false) {
    //   //snackbar
    // } else {
    axios({
      method: "PUT",
      url: `http://localhost:3000/order/updateUserCredentials/${userInformation?.data?.id}`,
      data: { userData: userBaru },
    }).then((result) => {
      if (result.status === 200) {
        //snackbar
        setTriggerBoth(true);
      } else {
        //snackbar
      }
    });
    // }
  };

  const handleSavePenggunaLama = () => {
    const checkIfDataIsEmpty = handleCheckIfDataUserLamaEmpty();

    if (checkIfDataIsEmpty === false) {
      //snackbar
    } else {
      axios({
        method: "PUT",
        url: `http://localhost:3000/order/updateUserCredentials/${userInformation?.data?.id}`,
        data: { userData: userLama },
      }).then((result) => {
        if (result.status === 200) {
          //snackbar
          setTriggerBoth(true);
        } else {
          //snackbar
        }
      });
    }
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
      <div style={{ width: "100%" }}>
        <div style={{ margin: "32px" }}>
          <Typography
            style={{ fontSize: isMobile ? "6vw" : "3vw", color: "#0F607D" }}
          >
            Kelola Anggota Marketing
          </Typography>

          {userBaru?.length === 0 ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography
                style={{
                  fontSize: isMobile ? "3.5vw" : "1.5vw",
                  color: "#0F607D",
                }}
              >
                Tidak ada data user baru
              </Typography>
            </div>
          ) : (
            <div style={{ marginTop: "32px" }}>
              <Typography
                style={{
                  fontSize: isMobile ? "3.5vw" : "1.5vw",
                  color: "#0F607D",
                }}
              >
                Kelola Anggota Baru
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table" style={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>No.</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>UserName</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Lokasi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userBaru?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>{result.name}</TableCell>
                            <TableCell>{result.username}</TableCell>
                            <TableCell>
                              <MySelectTextField
                                width={"200px"}
                                data={department}
                                value={result.department}
                                onChange={(event) => {
                                  handleChangeInputPenggunaBaru(
                                    event,
                                    index,
                                    "department"
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <MySelectTextField
                                width={"200px"}
                                data={
                                  userInformation?.data?.role === "Owner"
                                    ? roleIfOwner
                                    : role
                                }
                                value={result.role}
                                onChange={(event) => {
                                  handleChangeInputPenggunaBaru(
                                    event,
                                    index,
                                    "role"
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <MySelectTextField
                                width={"200px"}
                                data={lokasi}
                                value={result.lokasi}
                                onChange={(event) => {
                                  handleChangeInputPenggunaBaru(
                                    event,
                                    index,
                                    "lokasi"
                                  );
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    handleSavePenggunaBaru();
                  }}
                >
                  Simpan Data
                </DefaultButton>
                <Button
                  variant="outlined"
                  color="error"
                  style={{ marginLeft: "8px", textTransform: "none" }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <div style={{ marginTop: "32px" }}>
            <Typography style={{ fontSize: isMobile ? "3.5vw" :  "1.5vw", color: "#0F607D" }}>
              Kelola Anggota Lama
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table" style={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>UserName</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Lokasi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userLama.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>{result.name}</TableCell>
                          <TableCell>{result.username}</TableCell>
                          <TableCell>
                            <MySelectTextField
                              width={"200px"}
                              data={department}
                              value={result.department}
                              onChange={(event) => {
                                handleChangeInputPenggunaLama(
                                  event,
                                  result.id,
                                  "department"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <MySelectTextField
                              width={"200px"}
                              data={
                                userInformation?.data?.role === "Owner"
                                  ? roleIfOwner
                                  : role
                              }
                              value={result.role}
                              onChange={(event) => {
                                handleChangeInputPenggunaLama(
                                  event,
                                  result.id,
                                  "role"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <MySelectTextField
                              width={"200px"}
                              data={lokasi}
                              value={result.lokasi}
                              onChange={(event) => {
                                handleChangeInputPenggunaLama(
                                  event,
                                  result.id,
                                  "lokasi"
                                );
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleSavePenggunaLama();
                }}
              >
                Simpan Data Anggota
              </DefaultButton>
              <Button
                variant="outlined"
                color="error"
                style={{ marginLeft: "8px", textTransform: "none" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KelolaAnggotaMarketing;
