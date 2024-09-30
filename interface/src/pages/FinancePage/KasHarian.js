import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../components/AuthContext";
import { useNavigate } from "react-router-dom";
import factoryBackground from "../../assets/factorybackground.png";
import { AppContext } from "../../App";
import dayjs from "dayjs";
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
  TextField,
  Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import DefaultButton from "../../components/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import MySnackbar from "../../components/Snackbar";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MyModal from "../../components/Modal";
import CloseIcon from "@mui/icons-material/Close";
import MySelectTextField from "../../components/SelectTextField";

const NumericFormatCustom = React.forwardRef((props, ref) => {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="Rp."
    />
  );
});

const KasHarian = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();
  const { setSuccessMessage } = useAuth();

  const [dataKasHarian, setdataKasHarian] = useState([
    {
      tanggal: dayjs(),
      uraian: "",
      nomorBp: dayjs().format("YYMM01"),
      pos: "",
      debet: "",
      kredit: "",
      sisa: 0,
    },
  ]);
  const [kasHarianDone, setKasHarianDone] = useState([]);
  const [judulKasHarian, setJudulKasHarian] = useState(
    `Kas Harian ${dayjs().format("MM/DD/YYYY")}`
  );
  const [posPembayaran, setPosPembayaran] = useState([]);
  const [totalDebet, setTotalDebet] = useState(0);
  const [totalKredit, setTotalKredit] = useState(0);
  const [totalSisa, setTotalSisa] = useState(0);

  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalPosPembayaran, setOpenModalPosPembayaran] = useState(false);
  const [selectedKasHarianDone, setSelectedKasHarianDone] = useState({});
  const [refreshPosPembayaran, setRefreshPosPembayaran] = useState(true);

  // const postBiaya = [{value: "A1"}]

  useEffect(() => {
    axios({
      method: "POST",
      url: "http://localhost:3000/finance/checkForDefaultPosPembayaran",
    }).then((result) => {
      if (result.status === 200) {
        setRefreshPosPembayaran(true);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data pos pembayaran");
      }
    });
  }, []);

  useEffect(() => {
    if (refreshPosPembayaran) {
      axios({
        method: "GET",
        url: "http://localhost:3000/finance/getAllPosPembayaran",
      }).then((result) => {
        if (result.status === 200) {
          const tempData = result?.data?.map(({ kode, ...rest }) => ({
            value: kode,
            ...rest,
          }));
          setPosPembayaran(tempData);
        } else {
          setOpenSnackBar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data pos pembayaran");
        }
      });
    }
  }, [refreshPosPembayaran]);

  useEffect(() => {
    let totalKredit = 0;
    let totalDebet = 0;
    let totalSisa = 0;

    dataKasHarian.forEach((result) => {
      totalKredit += parseFloat(result.kredit) || 0;
      totalDebet += parseFloat(result.debet) || 0;
      totalSisa = totalDebet - totalKredit || 0;
    });

    setTotalKredit(totalKredit);
    setTotalDebet(totalDebet);
    setTotalSisa(totalSisa);
  }, [dataKasHarian]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/finance/getDoneKasHarian",
    }).then((result) => {
      if (result.status === 200) {
        setKasHarianDone(result.data);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data kas harian");
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/finance/getOngoingKasHarian",
    }).then((result) => {
      if (result.status === 200) {
        if (result.data !== null) {
          setJudulKasHarian(result.data.judulKasHarian);
          const tempData = result.data.itemKasHarians.map((result) => {
            return {
              ...result,
              tanggal: dayjs(result.tanggal),
            };
          });
          setdataKasHarian(tempData);
        }
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data kas harian");
      }
    });
  }, []);

  const handleTambahPosPembayaran = () => {
    setPosPembayaran((oldArray) => [
      ...oldArray,
      { kode: "", uraian: "", kataKunci: "" },
    ]);
  };

  const handleLihatDataPosPembayaran = () => {
    setOpenModalPosPembayaran(true);
  };

  const handleViewDoneKasHarian = (result) => {
    setSelectedKasHarianDone(result);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseModalPosPembayaran = () => {
    setOpenModalPosPembayaran(false);
  };

  const handleChangeInputPosPembayaran = (event, index, field) => {
    const value = event.target.value;
    setPosPembayaran((oldArray) =>
      oldArray.map((item, i) => {
        if (i === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleChangeInputKasHarian = (event, index, field) => {
    const value = event.target.value;

    setdataKasHarian((oldArray) =>
      oldArray.map((item, i) => {
        if (i === index) {
          if (i !== 0) {
            if (field === "debet") {
              const debetValue = parseFloat(value) || 0;
              const previousSisa = parseFloat(oldArray[i - 1].sisa) || 0;
              return {
                ...item,
                debet: value,
                sisa: previousSisa + debetValue,
              };
            } else if (field === "kredit") {
              const kreditValue = parseFloat(value) || 0;
              const previousSisa = parseFloat(oldArray[i - 1].sisa) || 0;

              return {
                ...item,
                kredit: value,
                sisa: previousSisa - kreditValue,
              };
            } else {
              return { ...item, [field]: value };
            }
          }
          if (field === "debet") {
            const debetValue = parseFloat(value) || 0;
            const kreditValue = parseFloat(item.kredit) || 0;

            return {
              ...item,
              debet: value,
              sisa: debetValue - kreditValue,
            };
          } else if (field === "kredit") {
            const kreditValue = parseFloat(value) || 0;
            const debetValue = parseFloat(item.debet) || 0;

            return {
              ...item,
              kredit: value,
              sisa: debetValue - kreditValue,
            };
          } else {
            return { ...item, [field]: value };
          }
        }
        return item;
      })
    );
  };

  const handleDeleteItemKasHarian = (id, index) => {
    if (!id || id === undefined) {
      setdataKasHarian((oldArray) => oldArray.filter((_, j) => j !== index));
    }
  };

  const handleTambahBaris = () => {
    setdataKasHarian((oldArray) => {
      const previousSaldo =
        oldArray.length > 0 ? oldArray[oldArray.length - 1].sisa : 0;

      const newEntry = {
        tanggal: dayjs(),
        uraian: "",
        nomorBp: dayjs().format(`YYMM${oldArray.length + 1}`),
        pos: "",
        debet: "",
        kredit: "",
        sisa: previousSaldo,
      };

      return [...oldArray, newEntry];
    });
  };

  const checkIfdataKasHarianIsEmpty = () => {
    for (let item of dataKasHarian) {
      if (
        !item.tanggal ||
        !item.uraian ||
        !item.nomorBp ||
        !item.pos ||
        !item.sisa
      ) {
        return false;
      }
      if (!item.debet && !item.kredit) {
        return false;
      }
    }
    return true;
  };

  const handleSavedataKasHarian = () => {
    const checkdataKasHarian = checkIfdataKasHarianIsEmpty();

    if (checkdataKasHarian === false) {
      setOpenSnackBar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Mohon isi semua input");
    } else {
      axios({
        method: "POST",
        url: `http://localhost:3000/finance/addKasHarian/${userInformation?.data?.id}`,
        data: { judulKasHarian: judulKasHarian, dataKasHarian: dataKasHarian },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil meyimpan data kas harian");
          setSnackbarStatus(true);
          // navigate(-1);
        } else {
          setOpenSnackBar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menyimpan  data kas harian");
        }
      });
    }
  };

  const simpanDataPosPembayaran = () => {
    axios({
      method: "PUT",
      url: `http://localhost:3000/finance/savePosPembayaran/${userInformation?.data?.id}`,
      data: { dataPosPembayaran: posPembayaran },
    }).then((result) => {
      if (result.status === 200) {
        handleCloseModalPosPembayaran();
        setRefreshPosPembayaran(true);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menyimpan data pos pembayaran");
      }
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackBar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
              Kas Harian
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <DefaultButton
                onClickFunction={() => {
                  handleLihatDataPosPembayaran();
                }}
              >
                Pos Pembayaran
              </DefaultButton>
              {(userInformation?.data?.role === "Admin" ||
                userInformation?.data?.role === "Super Admin" ||
                userInformation?.data?.role === "Owner") && (
                <div style={{ marginLeft: "8px" }}>
                  <DefaultButton
                    onClickFunction={() => {
                      handleTambahBaris();
                    }}
                  >
                    Tambah Baris
                  </DefaultButton>
                </div>
              )}
            </div>
          </div>
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table
              sx={{
                minWidth: 650,
                tableLayout: "fixed",
                overflowX: "auto",
              }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "25px" }}>No.</TableCell>
                  <TableCell style={{ width: "300px" }}>Tanggal</TableCell>
                  <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                  <TableCell style={{ width: "200px" }}>Nomor BP</TableCell>
                  <TableCell style={{ width: "200px" }}>Pos</TableCell>
                  <TableCell style={{ width: "200px" }}>Kredit</TableCell>
                  <TableCell style={{ width: "200px" }}>Debet</TableCell>
                  <TableCell style={{ width: "200px" }}>Sisa</TableCell>
                  <TableCell style={{ width: "50px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataKasHarian
                  ?.sort((a, b) => a.id - b.id)
                  .map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DateTimePicker"]}>
                                <DemoItem>
                                  <DateTimePicker
                                    //   disablePast
                                    disabled
                                    value={
                                      result.tanggal.isValid()
                                        ? result.tanggal
                                        : null
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        error={params.error || !params.value}
                                        helperText={
                                          params.error
                                            ? "Invalid date format"
                                            : ""
                                        }
                                      />
                                    )}
                                  />
                                </DemoItem>
                              </DemoContainer>
                            </LocalizationProvider>
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.uraian}
                              onChange={(event) => {
                                handleChangeInputKasHarian(
                                  event,
                                  index,
                                  "uraian"
                                );
                              }}
                              type="text"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: isMobile ? "15px" : "3vw",
                                  width: isMobile ? "120px" : "200px",
                                  fontSize: isMobile ? "10px" : "1.5vw",
                                  borderRadius: "10px",
                                  "& fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              disabled
                              type="text"
                              value={result.nomorBp}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: isMobile ? "15px" : "3vw",
                                  width: isMobile ? "120px" : "200px",
                                  fontSize: isMobile ? "10px" : "1.5vw",
                                  borderRadius: "10px",
                                  "& fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <MySelectTextField
                              width="200px"
                              data={posPembayaran}
                              value={result.pos}
                              onChange={(event) => {
                                handleChangeInputKasHarian(event, index, "pos");
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.debet}
                              disabled={Boolean(result.kredit)}
                              onChange={(event) => {
                                handleChangeInputKasHarian(
                                  event,
                                  index,
                                  "debet"
                                );
                              }}
                              type="text"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: isMobile ? "15px" : "3vw",
                                  width: isMobile ? "120px" : "200px",
                                  fontSize: isMobile ? "10px" : "1.5vw",
                                  borderRadius: "10px",
                                  "& fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                },
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.kredit}
                              disabled={Boolean(result.debet)}
                              onChange={(event) => {
                                handleChangeInputKasHarian(
                                  event,
                                  index,
                                  "kredit"
                                );
                              }}
                              type="text"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: isMobile ? "15px" : "3vw",
                                  width: isMobile ? "120px" : "200px",
                                  fontSize: isMobile ? "10px" : "1.5vw",
                                  borderRadius: "10px",
                                  "& fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                },
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.sisa}
                              type="text"
                              disabled
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: isMobile ? "15px" : "3vw",
                                  width: isMobile ? "120px" : "200px",
                                  fontSize: isMobile ? "10px" : "1.5vw",
                                  borderRadius: "10px",
                                  "& fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#0F607D",
                                  },
                                },
                              }}
                              InputProps={{
                                inputComponent: NumericFormatCustom,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                handleDeleteItemKasHarian(result?.id, index);
                              }}
                            >
                              <DeleteIcon style={{ color: "red" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                <TableRow>
                  <TableCell>Saldo</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{`Rp. ${totalDebet
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`}</TableCell>
                  <TableCell>{`Rp. ${totalKredit
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`}</TableCell>
                  <TableCell>{`Rp. ${totalSisa
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {(userInformation?.data?.role === "Admin" ||
              userInformation?.data?.role === "Super Admin" ||
              userInformation?.data?.role === "Owner") && (
              <DefaultButton
                onClickFunction={() => {
                  handleSavedataKasHarian();
                }}
              >
                Simpan Data Kas Harian
              </DefaultButton>
            )}
            <Button
              onClick={() => {
                navigate(-1);
              }}
              variant="outlined"
              color="error"
              style={{ marginLeft: "8px", textTransform: "none" }}
            >
              Cancel
            </Button>
          </div>
          <div style={{ marginTop: "32px" }}>
            <Typography style={{ fontSize: "3vw", color: "#0F607D" }}>
              Sejarah Kas Harian
            </Typography>
          </div>
          <div style={{ width: "40%" }}>
            {kasHarianDone?.length === 0 ? (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                  Belum ada sejarah data kas harian
                </Typography>
              </div>
            ) : (
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>No.</TableCell>
                      <TableCell>Tanggal Selesai</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {kasHarianDone?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>
                              {dayjs(result.updatedAt).format(
                                "MM/DD/YYYY hh:mm A"
                              )}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleViewDoneKasHarian(result);
                                }}
                              >
                                <VisibilityIcon sx={{ color: "#0F607D" }} />
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
        </div>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                {selectedKasHarianDone.judulKasHarian}
              </Typography>
              <IconButton
                onClick={() => {
                  handleCloseModal();
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table
                sx={{
                  minWidth: 650,
                  tableLayout: "fixed",
                  overflowX: "auto",
                }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell style={{ width: "150px" }}>Tanggal</TableCell>
                    <TableCell style={{ width: "150px" }}>uraian</TableCell>
                    <TableCell style={{ width: "150px" }}>Nomor BP</TableCell>
                    <TableCell style={{ width: "150px" }}>Pos</TableCell>
                    <TableCell style={{ width: "150px" }}>Debet</TableCell>
                    <TableCell style={{ width: "150px" }}>Kredit</TableCell>
                    <TableCell style={{ width: "150px" }}>Sisa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedKasHarianDone?.itemKasHarians?.map(
                    (result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>
                              {dayjs(result.tanggal).format(
                                "MM/DD/YYYY hh:mm A"
                              )}
                            </TableCell>
                            <TableCell>{result.uraian}</TableCell>
                            <TableCell>{result.nomorBp}</TableCell>
                            <TableCell>{result.pos}</TableCell>
                            <TableCell>
                              {result.debet
                                ? `Rp. ${result.debet
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`
                                : ""}
                            </TableCell>
                            <TableCell>
                              {result.kredit
                                ? `Rp. ${result.kredit
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`
                                : ""}
                            </TableCell>
                            <TableCell>
                              Rp.
                              {result.sisa
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                              ,-
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    }
                  )}
                  <TableRow>
                    <TableCell>Sisa</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {" "}
                      {`Total Debet: Rp. ${selectedKasHarianDone?.itemKasHarians
                        ?.reduce((acc, result) => {
                          return acc + (parseFloat(result.debet) || 0);
                        }, 0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`}
                    </TableCell>
                    <TableCell>{`Total Kredit: Rp. ${selectedKasHarianDone?.itemKasHarians
                      ?.reduce((acc, result) => {
                        return acc + (parseFloat(result.kredit) || 0);
                      }, 0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`}</TableCell>
                    <TableCell>
                      {`Sisa: Rp. ${(
                        selectedKasHarianDone?.itemKasHarians?.reduce(
                          (acc, result) => {
                            return acc + (parseFloat(result.debet) || 0);
                          },
                          0
                        ) -
                        selectedKasHarianDone?.itemKasHarians?.reduce(
                          (acc, result) => {
                            return acc + (parseFloat(result.kredit) || 0);
                          },
                          0
                        )
                      )
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")},-`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </MyModal>
      )}
      {openModalPosPembayaran === true && (
        <MyModal
          open={openModalPosPembayaran}
          handleClose={handleCloseModalPosPembayaran}
        >
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "50vw",
              maxHeight: "80vh",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                Data Pos Pembayaran
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  handleTambahPosPembayaran();
                }}
              >
                Tambah Item
              </DefaultButton>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell style={{ width: "70px" }}>Kode</TableCell>
                    <TableCell>Uraian</TableCell>
                    <TableCell>Kata Kunci</TableCell>
                    {(userInformation?.data?.role === "Admin" ||
                      userInformation?.data?.role === "Super Admin" ||
                      userInformation?.data?.role === "Owner") && (
                      <TableCell>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posPembayaran?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <TextField
                              onChange={(event) => {
                                handleChangeInputPosPembayaran(
                                  event,
                                  index,
                                  "value"
                                );
                              }}
                              value={result.value}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              onChange={(event) => {
                                handleChangeInputPosPembayaran(
                                  event,
                                  index,
                                  "uraian"
                                );
                              }}
                              value={result.uraian}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              onChange={(event) => {
                                handleChangeInputPosPembayaran(
                                  event,
                                  index,
                                  "kataKunci"
                                );
                              }}
                              value={result.kataKunci}
                            />
                          </TableCell>
                          {(userInformation?.data?.role === "Admin" ||
                            userInformation?.data?.role === "Super Admin" ||
                            userInformation?.data?.role === "Owner") && (
                            <TableCell>
                              <IconButton>
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                padding: "16px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {(userInformation?.data?.role === "Admin" ||
                userInformation?.data?.role === "Super Admin" ||
                userInformation?.data?.role === "Owner") && (
                <DefaultButton
                  onClickFunction={() => {
                    simpanDataPosPembayaran();
                  }}
                >
                  Simpan Data Pos Pembayaran
                </DefaultButton>
              )}
              <Button
                variant="outlined"
                color="error"
                style={{
                  textTransform: "none",
                  marginLeft:
                    userInformation?.data?.role === "Admin" ||
                    userInformation?.data?.role === "Super Admin" ||
                    userInformation?.data?.role === "Owner"
                      ? ""
                      : "8px",
                }}
                onClick={() => {
                  handleCloseModalPosPembayaran();
                }}
              >
                Cancel
              </Button>
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

export default KasHarian;
