import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import factoryBackground from "../../assets/factorybackground.png";
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
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";
import { AppContext } from "../../App";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DefaultButton from "../../components/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import MyModal from "../../components/Modal";
import MySnackbar from "../../components/Snackbar";
import MySelectTextField from "../../components/SelectTextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../components/AuthContext";

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

const BukuBank = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();
  const { setSuccessMessage } = useAuth();

  const [dataBukuBank, setDataBukuBank] = useState([
    {
      tanggal: dayjs(),
      uraian: "",
      debet: "",
      kredit: "",
      saldo: 0,
      keterangan: "",
    },
  ]);
  const [namaBank, setNamaBank] = useState("");
  const [daftarBank, setDaftarBank] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBukuBankDone, setSelectedBukuBankDone] = useState([]);
  const [bukuBankDone, setBukuBankDone] = useState([]);

  const [openModalBukuBankDone, setOpenModalBukuBankDone] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [refreshNamaBank, setRefreshNamaBank] = useState(true);

  const [totalDebetDone, setTotalDebetDone] = useState(0);
  const [totalKreditDone, setTotalKreditDone] = useState(0);
  const [totalSaldoDone, setTotalSaldoDone] = useState(0);

  const handleDeleteItemBukuBank = (id, index) => {
    if (!id || id === undefined) {
      setDataBukuBank((oldArray) => oldArray.filter((_, j) => j !== index));
    }
  };

  const handleCloseModalBukuBankDone = () => {
    setOpenModalBukuBankDone(false);
  };

  const handleViewBukuBankDone = (id) => {
    const selectedItem = bukuBankDone.find((item) => item.id === id);
    setSelectedBukuBankDone(selectedItem);
    const totalDebet = selectedItem.itemBukuBanks.reduce((acc, result) => {
      const debetValue = parseFloat(result.debet) || 0;
      return acc + debetValue;
    }, 0);
    setTotalDebetDone(totalDebet);
    const totalKredit = selectedItem.itemBukuBanks.reduce((acc, result) => {
      const kreditValue = parseFloat(result.kredit) || 0;
      return acc + kreditValue;
    }, 0);
    setTotalKreditDone(totalKredit);
    const saldoSekarang =
      selectedItem.itemBukuBanks.length > 0
        ? selectedItem.itemBukuBanks[selectedItem.itemBukuBanks.length - 1]
            .saldo
        : 0;
    setTotalSaldoDone(saldoSekarang);
    setOpenModalBukuBankDone(true);
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/finance/getDoneBukuBank",
    }).then((result) => {
      if (result.status === 200) {
        setBukuBankDone(result.data);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data bank");
      }
    });
  }, []);
  useEffect(() => {
    if (refreshNamaBank) {
      axios({
        method: "GET",
        url: "http://localhost:3000/finance/getOngoingBukuBank",
      }).then((result) => {
        if (result.status === 200) {
          const tempData = result?.data?.map((result) => ({
            value: result.namaBank,
            ...result,
          }));
          setDaftarBank(tempData);
          setRefreshNamaBank(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data bank");
          setRefreshNamaBank(false);
        }
      });
    }
  }, [refreshNamaBank]);

  const handleTambahBaris = () => {
    setDataBukuBank((oldArray) => {
      const previousSaldo =
        oldArray.length > 0 ? oldArray[oldArray.length - 1].saldo : 0;

      const newEntry = {
        tanggal: dayjs(),
        uraian: "",
        debet: "",
        kredit: "",
        saldo: previousSaldo,
        keterangan: "",
      };

      return [...oldArray, newEntry];
    });
  };

  const handleChangeInput = (event, index, field) => {
    const value = event.target.value;

    setDataBukuBank((oldArray) =>
      oldArray.map((item, i) => {
        if (i === index) {
          if (i !== 0) {
            if (field === "debet") {
              const debetValue = parseFloat(value) || 0;
              const previousSaldo = parseFloat(oldArray[i - 1].saldo) || 0;

              return {
                ...item,
                debet: value,
                saldo: previousSaldo + debetValue,
              };
            } else if (field === "kredit") {
              const kreditValue = parseFloat(value) || 0;
              const previousSaldo = parseFloat(oldArray[i - 1].saldo) || 0;

              return {
                ...item,
                kredit: value,
                saldo: previousSaldo - kreditValue,
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
              saldo: debetValue - kreditValue,
            };
          } else if (field === "kredit") {
            const kreditValue = parseFloat(value) || 0;
            const debetValue = parseFloat(item.debet) || 0;

            return {
              ...item,
              kredit: value,
              saldo: debetValue - kreditValue,
            };
          } else {
            return { ...item, [field]: value };
          }
        }
        return item;
      })
    );
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const hanleAddNamaBank = () => {
    axios({
      method: "POST",
      url: `http://localhost:3000/finance/addNamaBank/${userInformation?.data?.id}`,
      data: { namaBank: namaBank },
    }).then((result) => {
      if (result.status === 200) {
        handleCloseModal();
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menambahkan bank");
        setRefreshNamaBank(true);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menambahkan bank");
      }
    });
  };

  const handleChangeNamaBank = (event) => {
    const value = event.target.value;
    setSelectedBank(value);

    const matchedResult = daftarBank.find((item) => item.value === value);

    axios({
      method: "GET",
      url: `http://localhost:3000/finance/checkIfNamaBankAvailable/${value}`,
    }).then((result) => {
      if (result.status === 200) {
        let isAvailable = result.data.available;

        if (isAvailable === false) {
          if (matchedResult.itemBukuBanks.length === 0) {
            axios({
              method: "GET",
              url: `http://localhost:3000/finance/getPreviousSaldoAkhir/${value}`,
            }).then((result) => {
              if (result.status === 200) {
                const latestItem =
                  result.data[0].itemBukuBanks[
                    result.data[0].itemBukuBanks.length - 1
                  ];

                const formattedItem = [
                  {
                    tanggal: dayjs(latestItem.tanggal),
                    uraian: latestItem.uraian,
                    debet: latestItem.debet,
                    kredit: latestItem.kredit,
                    saldo: latestItem.saldo,
                    keterangan: latestItem.keterangan,
                  },
                ];

                setDataBukuBank(formattedItem);
              } else {
                setOpenSnackbar(true);
                setSnackbarStatus(false);
                setSnackbarMessage(
                  "Tidak berhasil memanggil data bank sebelumnya"
                );
              }
            });
          }
        }
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil pengecheckan data bank sebelumnya");
      }
    });

    const tempData = matchedResult.itemBukuBanks.map((result) => {
      return {
        ...result,
        tanggal: dayjs(result.tanggal),
      };
    });
    setDataBukuBank(tempData);
  };

  const checkIfDataBukuBankIsEmpty = () => {
    if (selectedBank === "") {
      return false;
    }

    for (const item of dataBukuBank) {
      if (!item.uraian || !item.saldo || !item.keterangan) {
        return false;
      }
      if (!item.debet && !item.kredit) {
        return false;
      }
    }

    return true;
  };

  const handleAddItemBukuBank = () => {
    const checkDataBukuBank = checkIfDataBukuBankIsEmpty();
    if (checkDataBukuBank === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Mohon isi semua input");
    } else {
      axios({
        method: "POST",
        url: `http://localhost:3000/finance/addItemBukuBank/${userInformation?.data?.id}`,
        data: { namaBank: selectedBank, dataBukuBank: dataBukuBank },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan data buku bank");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menambahkan data buku bank");
        }
      });
    }
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
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
              Daftar Nama Bank
            </Typography>
            {userInformation?.data?.role === "Admin" && (
              <DefaultButton
                onClickFunction={() => {
                  setOpenModal(true);
                }}
              >
                Tambah Bank
              </DefaultButton>
            )}
          </div>
        </div>
        <div style={{ margin: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                Buku Bank Aktif
              </Typography>
              <div style={{ marginLeft: "16px" }}>
                <MySelectTextField
                  width="150px"
                  onChange={(event) => {
                    handleChangeNamaBank(event);
                  }}
                  data={daftarBank}
                  value={selectedBank}
                />
              </div>
            </div>
            {selectedBank !== "" ||
              (userInformation?.data?.role === "Admin" && (
                <DefaultButton
                  onClickFunction={() => {
                    handleTambahBaris();
                  }}
                >
                  Tambah Baris
                </DefaultButton>
              ))}
          </div>
          {selectedBank !== "" && (
            <div>
              {dataBukuBank.length === 0 ? (
                <div
                  style={{
                    margin: "32px 0px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                    Silahkan tambah baris
                  </Typography>
                </div>
              ) : (
                <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                  <Table
                    sx={{
                      tableLayout: "fixed",
                      overflowX: "auto",
                    }}
                    aria-label="simple table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "25px" }}>No.</TableCell>
                        <TableCell style={{ width: "300px" }}>
                          Tanggal
                        </TableCell>
                        <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                        <TableCell style={{ width: "200px" }}>Kredit</TableCell>
                        <TableCell style={{ width: "200px" }}>Debet</TableCell>
                        <TableCell style={{ width: "200px" }}>Saldo</TableCell>
                        <TableCell style={{ width: "200px" }}>
                          Keterangan
                        </TableCell>
                        {userInformation?.data?.role === "Admin" && (
                          <TableCell style={{ width: "50px" }}>
                            Actions
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataBukuBank
                        ?.sort((a, b) => a.id - b.id)
                        .map((result, index) => {
                          return (
                            <React.Fragment key={index}>
                              <TableRow>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      components={["DateTimePicker"]}
                                    >
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
                                              error={
                                                params.error || !params.value
                                              }
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
                                      handleChangeInput(event, index, "uraian");
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
                                    value={result.debet}
                                    disabled={Boolean(result.kredit)}
                                    onChange={(event) => {
                                      handleChangeInput(event, index, "debet");
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
                                      handleChangeInput(event, index, "kredit");
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
                                    disabled
                                    value={result.saldo}
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
                                    value={result.keterangan}
                                    onChange={(event) => {
                                      handleChangeInput(
                                        event,
                                        index,
                                        "keterangan"
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
                                {userInformation?.data?.role === "Admin" && (
                                  <TableCell>
                                    <IconButton
                                      onClick={() => {
                                        handleDeleteItemBukuBank(
                                          result.id,
                                          index
                                        );
                                      }}
                                    >
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
              )}
            </div>
          )}
          {(selectedBank !== "" && dataBukuBank.length !== 0) ||
            (userInformation?.data?.role === "Admin" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "32px",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    handleAddItemBukuBank();
                  }}
                >
                  Simpan Data Buku Bank
                </DefaultButton>
                <Button
                  variant="outlined"
                  color="error"
                  style={{ textTransform: "none", marginLeft: "8px" }}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ))}
          <div style={{ padding: "8px 0px", width: "40%" }}>
            <Typography style={{ fontSize: "3vw", color: "#0F607D" }}>
              Sejarah Buku Bank
            </Typography>
            {bukuBankDone.length === 0 ? (
              <div>
                <Typography style={{ fontSize: "2vw", color: "#0F607D" }}>
                  Belum ada sejarah buku bank
                </Typography>
              </div>
            ) : (
              <TableContainer component={Paper}>
                <TableHead aria-label="simple table">
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell style={{ width: "200px" }}>Tanggal</TableCell>
                    <TableCell style={{ width: "200px" }}>Nama Bank</TableCell>
                    <TableCell style={{ width: "50px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bukuBankDone?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            {dayjs(result.updatedAt).format(
                              "MM/DD/YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>{result.namaBank}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                handleViewBukuBankDone(result.id);
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
              </TableContainer>
            )}
          </div>
        </div>
      </div>
      {openModalBukuBankDone === true && (
        <MyModal
          open={openModalBukuBankDone}
          handleClose={handleCloseModalBukuBankDone}
        >
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "60vw",
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
                Buku Bank {selectedBukuBankDone.namaBank}
              </Typography>
              <IconButton
                onClick={() => {
                  handleCloseModalBukuBankDone();
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <div>
              <Typography
                style={{
                  fontSize: "1.5vw",
                  color: "#0F607D",
                  marginTop: "16px",
                }}
              >
                Total Debet: Rp.{" "}
                {totalDebetDone
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                ,-
              </Typography>
              <Typography
                style={{
                  fontSize: "1.5vw",
                  color: "#0F607D",
                  marginTop: "16px",
                }}
              >
                Total Kredit: Rp.{" "}
                {totalKreditDone
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                ,-
              </Typography>
              <Typography
                style={{
                  fontSize: "1.5vw",
                  color: "#0F607D",
                  marginTop: "16px",
                }}
              >
                Saldo Akhir: Rp.{" "}
                {totalSaldoDone
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                ,-
              </Typography>
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
                    <TableCell style={{ width: "150px" }}>Uraian</TableCell>
                    <TableCell style={{ width: "150px" }}>Debet</TableCell>
                    <TableCell style={{ width: "150px" }}>Kredit</TableCell>
                    <TableCell style={{ width: "150px" }}>Saldo</TableCell>
                    <TableCell style={{ width: "150px" }}>Keterangan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBukuBankDone.itemBukuBanks.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            {dayjs(result.tanggal).format("MM/DD/YYYY hh:mm A")}
                          </TableCell>
                          <TableCell>{result.uraian}</TableCell>
                          <TableCell>{result.debet}</TableCell>
                          <TableCell>{result.kredit}</TableCell>
                          <TableCell>{result.saldo}</TableCell>
                          <TableCell>{result.keterangan}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </MyModal>
      )}
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
                Daftar Nama Bank
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "1.5vw" }}>
                Nama Bank:
              </Typography>
              <TextField
                value={namaBank}
                onChange={(event) => {
                  setNamaBank(event.target.value);
                }}
                style={{ marginLeft: "8px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "16px",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  hanleAddNamaBank();
                }}
              >
                Tambah Bank
              </DefaultButton>
              <Button
                color="error"
                variant="outlined"
                style={{ marginLeft: "8px", textTransform: "none" }}
                onClick={() => {
                  handleCloseModal();
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

export default BukuBank;
