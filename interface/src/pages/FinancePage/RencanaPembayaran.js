import React, { useContext, useEffect, useState } from "react";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MySelectTextField from "../../components/SelectTextField";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";
import { AppContext } from "../../App";
import { NumericFormat } from "react-number-format";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import DefaultButton from "../../components/Button";
import MyModal from "../../components/Modal";
import CloseIcon from "@mui/icons-material/Close";

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

const RencanaPembayaran = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();

  const [dataHutang, setDataHutang] = useState([
    {
      tanggal: dayjs(""),
      supplier: "",
      jenisBarang: "",
      noInvoiceKwitansiSj: "",
      jumlahHarga: "",
      tanggalJatuhTempo: dayjs(""),
      pembayaran: "",
      keterangan: "",
    },
  ]);

  const [historyRencanaPembayaran, setRencanaPembayaran] = useState([]);
  const [allDataPembelianBahanBaku, setAllDataPembelianBahanBaku] = useState(
    []
  );
  const [allDataRencanaPembayaran, setAllDataRencanaPembayaran] = useState([]);
  const [selectedPembelianBahanBakuId, setSelectedPembelianBahanBakuId] =
    useState("");

  const [viewDataHutang, setViewDataHutang] = useState([]);
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [refreshRencanaPembayaran, setRefreshRencanaPembayaran] =
    useState(true);
  const [triggerCheckRencanaPembayaran, setTriggerCheckRencanaPembayaran] =
    useState(false);
  const [openModalView, setOpenModalView] = useState(false);

  const keterangan = [{ value: "Lunas" }, { value: "Belum Lunas" }];
  const pembayaran = [{ value: "Hutang" }, { value: "Piutang" }];

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/finance/getDoneRencanaPembayaran",
    }).then((result) => {
      if (result.status === 200) {
        setRencanaPembayaran(result.data);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil history rencana pembayaran sebelumnya"
        );
      }
    });
  }, []);

  useEffect(() => {
    if (refreshRencanaPembayaran) {
      axios({
        method: "GET",
        url: "http://localhost:3000/finance/getAllOngoingRencanaPembayaran",
      }).then((result) => {
        if (result.status === 200) {
          setAllDataRencanaPembayaran(result.data);
          setRefreshRencanaPembayaran(false);
          setTriggerCheckRencanaPembayaran(true);
        } else {
          setRefreshRencanaPembayaran(false);
        }
      });
    }
  }, [refreshRencanaPembayaran]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllPembelianBahanBaku",
    }).then((result) => {
      if (result.status === 200) {
        const tempData = result?.data?.map((result) => {
          return {
            ...result,
            value: result.id,
          };
        });
        setAllDataPembelianBahanBaku(tempData);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data pembelian bahan baku"
        );
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/finance/checkIfRencanaPembayaranExists",
    }).then((result) => {
      if (result.status === 200) {
        setRefreshRencanaPembayaran(true);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data rencana pembayaran");
      }
    });
  });

  useEffect(() => {
    if (triggerCheckRencanaPembayaran && dataHutang.length > 0) {
      const earliestDataCreatedAt = allDataRencanaPembayaran?.reduce(
        (minDate, current) => {
          const currentDate = dayjs(current?.createdAt);
          return currentDate.isBefore(minDate) ? currentDate : minDate;
        },
        dayjs(allDataRencanaPembayaran[0]?.createdAt)
      );

      if (
        earliestDataCreatedAt &&
        dayjs().isAfter(dayjs(earliestDataCreatedAt).add(1, "month"))
      ) {
        axios({
          method: "PUT",
          url: `http://localhost:3000/finance/updateDoneRencanaPembayaran/${userInformation?.data?.id}`,
        }).then((result) => {
          if (result.status === 200) {
            setRefreshRencanaPembayaran(true);
            setTriggerCheckRencanaPembayaran(false);
          } else {
            setOpenSnackBar(true);
            setSnackbarStatus(false);
            setSnackbarMessage(
              "Tidak berhasil mengupdate data rencana pembayaran setelah satu bulan"
            );
          }
        });
      }
    }
  }, [triggerCheckRencanaPembayaran, dataHutang]);

  const handleChangeSelectedPembelianBahanBaku = (event) => {
    const selectedItem = allDataPembelianBahanBaku.find(
      (item) => item.id === event.target.value
    );
    setSelectedPembelianBahanBakuId(selectedItem.id);

    const newItems = selectedItem.itemPembelianBahanBakus.map((result) => ({
      tanggal: dayjs(result.tanggal),
      supplier: selectedItem.leveransir,
      jenisBarang: result.jenisBarang,
      noInvoiceKwitansiSj: result.fakturPajak,
      jumlahHarga: result.jumlahHarga,
      tanggalJatuhTempo: dayjs(result.tanggalJatuhTempo),
      pembayaran: "",
      keterangan: "",
      id: selectedItem.id,
      itemId: result.id,
    }));

    setDataHutang(newItems);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackBar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleChangeInputDataHutang = (event, index, field) => {
    const value = event.target.value;
    setDataHutang((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        let updatedItem = { ...item };
        if (i === index) {
          updatedItem = { ...updatedItem, [field]: value };
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleCheckIfDataHutangIsEmpty = () => {
    for (const item of dataHutang) {
      if (
        (!item.tanggal ||
          !dayjs(item.tanggal, "MM/DD/YYYY hh:mm A", true).isValid(),
        !item.jenisBarang ||
          !item.supplier ||
          !item.noInvoiceKwitansiSj ||
          !item.jumlahHarga ||
          !item.tanggalJatuhTempo ||
          !dayjs(
            item.tanggalJatuhTempo,
            "MM/DD/YYYY hh:mm A",
            true
          ).isValid() ||
          !item.pembayaran ||
          !item.keterangan)
      ) {
        return false;
      }
    }
    return true;
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseModalView = () => {
    setOpenModalView(false);
  };

  const handleViewHutang = (id) => {
    let itemRencanaPembayaran = allDataRencanaPembayaran
      .map((item) => {
        return item.itemRencanaPembayarans.find((data) => data.id === id);
      })
      .filter(Boolean);

    setOpenModalView(true);
    setViewDataHutang(itemRencanaPembayaran[0].hutangs);
  };

  const handleAddHutang = () => {
    const checkIfDataHutangEmpty = handleCheckIfDataHutangIsEmpty();

    if (checkIfDataHutangEmpty === false) {
      setOpenSnackBar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Mohon isi semua input");
    } else {
      axios({
        method: "POST",
        url: `http://localhost:3000/finance/addHutang/${userInformation?.data?.id}`,
        data: { dataHutang: dataHutang },
      }).then((result) => {
        if (result.status === 200) {
          handleCloseModal();
          setRefreshRencanaPembayaran(true);
          setSelectedPembelianBahanBakuId("");
        } else {
          setOpenSnackBar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menambahkan data hutang");
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
              marginBottom: "16px",
              justifyContent: "space-between",
            }}
          >
            <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
              Rencana Pembayaran
            </Typography>
            <DefaultButton
              onClickFunction={() => {
                setOpenModal(true);
              }}
            >
              Tambah Hutang
            </DefaultButton>
          </div>
          {allDataRencanaPembayaran[0]?.itemRencanaPembayarans?.length === 0 ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Belum ada data rencana pembayaran
              </Typography>
            </div>
          ) : (
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table
                aria-label="simple table"
                sx={{ overflowX: "auto", tableLayout: "fixed", minWidth: 650 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell>Uraian</TableCell>
                    <TableCell>Tanggal Jatuh Tempo</TableCell>
                    <TableCell>Nominal</TableCell>
                    <TableCell>Keterangan</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allDataRencanaPembayaran[0]?.itemRencanaPembayarans?.map(
                    (result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>{result.uraian}</TableCell>
                            <TableCell>
                              {dayjs(result.tanggalJatuhTempo).format(
                                "MM/DD/YYYY hh:mm A"
                              )}
                            </TableCell>
                            <TableCell>{`Rp. ${result.nominal
                              .toString()
                              .replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                "."
                              )},-`}</TableCell>
                            <TableCell>{result.keterangan}</TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleViewHutang(result.id);
                                }}
                              >
                                <VisibilityIcon sx={{ color: "#0F607D" }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
              padding: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
                justifyContent: "space-between",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                Hutang
              </Typography>
              <MySelectTextField
                onChange={(event) => {
                  handleChangeSelectedPembelianBahanBaku(event);
                }}
                value={selectedPembelianBahanBakuId}
                width="100px"
                data={allDataPembelianBahanBaku}
              />
            </div>
            {selectedPembelianBahanBakuId === "" ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                  Silahkan pilih ID data pembelian bahan baku
                </Typography>
              </div>
            ) : (
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table
                  aria-label="simple table"
                  sx={{
                    minWidth: 650,
                    tableLayout: "fixed",
                    overflowX: "auto",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "25px" }}>No.</TableCell>
                      <TableCell style={{ width: "300px" }}>Tanggal</TableCell>
                      <TableCell style={{ width: "200px" }}>Supplier</TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Jenis Barang
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        No Invoice/ Kwitansi/ SJ
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Jumlah Harga
                      </TableCell>
                      <TableCell style={{ width: "300px" }}>
                        Tanggal Jatuh Tempo
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Pembayaran
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Keterangan
                      </TableCell>
                      <TableCell style={{ width: "50px" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataHutang.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
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
                              <TextField value={result.supplier} disabled />
                            </TableCell>
                            <TableCell>
                              <TextField value={result.jenisBarang} disabled />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.noInvoiceKwitansiSj}
                                disabled
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                disabled
                                value={result.jumlahHarga}
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disabled
                                      value={
                                        result.tanggalJatuhTempo.isValid()
                                          ? result.tanggalJatuhTempo
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
                              <MySelectTextField
                                width="200px"
                                data={pembayaran}
                                value={result.pembayaran}
                                onChange={(event) => {
                                  handleChangeInputDataHutang(
                                    event,
                                    index,
                                    "pembayaran"
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <MySelectTextField
                                width="200px"
                                data={keterangan}
                                value={result.keterangan}
                                onChange={(event) => {
                                  handleChangeInputDataHutang(
                                    event,
                                    index,
                                    "keterangan"
                                  );
                                }}
                              />
                            </TableCell>
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
            )}
            <div
              style={{
                paddingTop: "32px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {selectedPembelianBahanBakuId !== "" && (
                <DefaultButton
                  onClickFunction={() => {
                    handleAddHutang();
                  }}
                >
                  Tambah Hutang
                </DefaultButton>
              )}
              <Button
                onClick={() => {
                  navigate(-1);
                }}
                variant="outlined"
                color="error"
                sx={{ textTransform: "none", marginLeft: "8px" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </MyModal>
      )}
      {openModalView === true && (
        <MyModal open={openModalView} handleClose={handleCloseModalView}>
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "50vw",
              maxHeight: "80vh",
              padding: "32px",
            }}
          >
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: "3vw",
                  marginBottom: "16px",
                }}
              >
                Data Hutang
              </Typography>
              <IconButton
                onClick={() => {
                  handleCloseModalView();
                }}
              >
                <CloseIcon />
              </IconButton>
            </div>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table
                aria-label="simple table"
                sx={{
                  minWidth: 650,
                  tableLayout: "fixed",
                  overflowX: "auto",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell style={{ width: "200px" }}>Tanggal</TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Jenis Barang
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>
                      No Invoice/ Kwitansi/ SJ
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Tanggal Jatuh Tempo
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>Pembayaran</TableCell>
                    <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewDataHutang.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            {dayjs(result.tanggal).format("MM/DD/YYYY hh:mm A")}
                          </TableCell>
                          <TableCell>{result.jenisBarang}</TableCell>
                          <TableCell>{result.noInvoiceKwitansiJs}</TableCell>
                          <TableCell>
                            {dayjs(result.tanggalJatuhTempo).format(
                              "MM/DD/YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>{result.pembayaran}</TableCell>
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

export default RencanaPembayaran;
