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
import MySelectTextField from "../../components/SelectTextField";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { NumericFormat } from "react-number-format";
import { AppContext } from "../../App";
import DefaultButton from "../../components/Button";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import MyModal from "../../components/Modal";

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

const LaporanSampah = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();
  const { setSuccessMessage } = useAuth();
  const [dataLaporanSampah, setDataLaporanSampah] = useState({
    noOrderProduksi: "",
    tahapProduksi: "",
    laporanLimbahProduksiId: "",
    itemLaporanSampahs: [
      {
        tanggal: dayjs(""),
        pembeli: "",
        uraian: "",
        jumlah: { value: "", unit: "" },
        hargaSatuan: "",
        // { value: "", unit: "" },
        pembayaran: "",
        keterangan: "",
      },
    ],
  });

  const [allDataProduksiSelesai, setAllDataProduksiSelesai] = useState([]);
  const [allNoOrderProduksi, setAllNoOrderProduksi] = useState([]);
  const [allTahapProduksi, setAllTahapProduksi] = useState([]);
  const [selectedKegiatanProduksi, setSelectedKegiatanProduksi] = useState([]);
  const [allLaporanSampah, setAllLaporanSampah] = useState([]);

  const [dataLaporanSampahForEdit, setDataLaporanSampahForEdit] = useState([]);
  console.log(dataLaporanSampahForEdit);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [refreshDataLaporanSampah, setRefreshDataLaporanSampah] =
    useState(true);

  const units = [
    {
      value: "Kg",
    },
    {
      value: "Ton",
    },
    {
      value: "Roll",
    },
    {
      value: "Kaleng",
    },
    {
      value: "Lembar",
    },
    {
      value: "Box",
    },
  ];

  useEffect(() => {
    if (refreshDataLaporanSampah) {
      axios({
        method: "GET",
        url: "http://localhost:3000/production/getLaporanSampah",
      }).then((result) => {
        if (result.status === 200) {
          setAllLaporanSampah(result.data);
          setRefreshDataLaporanSampah(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data laporan sampah");
          setRefreshDataLaporanSampah(false);
        }
      });
    }
  }, [refreshDataLaporanSampah]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/production/getAllLaporanLimbahProduksi",
    }).then((result) => {
      if (result.status === 200) {
        if (result.status === 200) {
          const uniqueData = result.data.reduce((acc, item) => {
            if (
              !acc.some(
                (existingItem) =>
                  existingItem.noOrderProduksi === item.noOrderProduksi
              )
            ) {
              acc.push(item);
            }
            return acc;
          }, []);

          const tempNoOrderProduksiValue = uniqueData.map((item) => ({
            value: item.noOrderProduksi,
          }));

          setAllNoOrderProduksi(tempNoOrderProduksiValue);
          setAllDataProduksiSelesai(result.data);
        }
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data limbah hasil produksi"
        );
      }
    });
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleTambahItem = () => {
    setDataLaporanSampah((oldObject) => ({
      ...oldObject,
      itemLaporanSampahs: [
        ...oldObject.itemLaporanSampahs,
        {
          tanggal: dayjs(""),
          pembeli: "",
          uraian: "",
          jumlah: { value: "", unit: "" },
          hargaSatuan: "",
          //{ value: "", unit: "" },
          pembayaran: "",
          keterangan: "",
        },
      ],
    }));
  };

  const handleDeleteItemLaporanSampah = (id, index) => {
    if (!id || id === undefined) {
      setDataLaporanSampah((oldObject) => ({
        ...oldObject,
        itemLaporanSampahs: oldObject?.itemLaporanSampahs?.filter(
          (_, j) => j !== index
        ),
      }));
    } else {
    }
  };

  const handleOpenModalForEditLaporanSampah = (
    noOrderProduksi,
    tahapProduksi
  ) => {
    const laporanForEdit = allLaporanSampah.filter((result) => {
      return (
        result.noOrderProduksi === noOrderProduksi &&
        result.tahapProduksi === tahapProduksi
      );
    });

    setDataLaporanSampahForEdit(laporanForEdit);
    setOpenModal(true);
  };

  const handleChangeInputLaporanSampah = (event, field, index, unit) => {
    const value = event && event.target ? event.target.value : event;
    setDataLaporanSampah((oldObject) => {
      if (field === "noOrderProduksi") {
        const tempData = allDataProduksiSelesai
          .filter((result) => result.noOrderProduksi === value)
          .map((result) => {
            return {
              value: result.tahapProduksi,
            };
          });
        setAllTahapProduksi(tempData);
        if (oldObject.tahapProduksi !== "") {
          const tempSelectedKegiatanProduksi = allDataProduksiSelesai
            .filter(
              (result) =>
                result.noOrderProduksi === value &&
                result.tahapProduksi === oldObject.tahapProduksi
            )
            .map((result) => {
              return {
                ...result,
              };
            });
          oldObject.tahapProduksi = tempSelectedKegiatanProduksi;
        }
        return {
          ...oldObject,
          [field]: value,
        };
      } else if (field === "tahapProduksi") {
        const tempData = allDataProduksiSelesai
          .filter(
            (result) =>
              result.noOrderProduksi === oldObject.noOrderProduksi &&
              result.tahapProduksi === value
          )
          .map((result) => {
            return {
              ...result,
            };
          });
        setSelectedKegiatanProduksi(tempData);
        return {
          ...oldObject,
          [field]: value,
          laporanLimbahProduksiId: tempData[0].id,
        };
      } else {
        const updatedItems = oldObject.itemLaporanSampahs.map((item, i) => {
          if (i === index) {
            let updatedItem = { ...item };
            if (unit) {
              return {
                ...updatedItem,
                [field]: {
                  value: item[field]?.value || "",
                  unit: value,
                },
              };
            } else {
              if (field === "jumlah") {
                return {
                  ...updatedItem,
                  [field]: {
                    ...updatedItem[field],
                    value: value,
                  },
                };
              } else {
                updatedItem = { ...updatedItem, [field]: value };
              }
            }
            return updatedItem;
          }
          return item;
        });
        return { ...oldObject, itemLaporanSampahs: updatedItems };
      }
    });
  };

  const handleCheckIfLaporanSampahComplete = () => {
    if (
      !dataLaporanSampah.noOrderProduksi ||
      !dataLaporanSampah.tahapProduksi
    ) {
      return false;
    }
    for (const item of dataLaporanSampah.itemLaporanSampahs) {
      if (
        !item.hargaSatuan ||
        !item.keterangan ||
        !item.pembayaran ||
        !item.pembeli ||
        !item.tanggal ||
        !dayjs(item.tanggal, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.uraian ||
        !item.jumlah.value ||
        !item.jumlah.unit
      ) {
        return false;
      }
    }

    return true;
  };

  const handleModifyDataLaporanSampahForSubmission = () => {
    const changedDataLaporanSampah = {
      ...dataLaporanSampah,
      itemLaporanSampahs: dataLaporanSampah.itemLaporanSampahs.map((result) => {
        return {
          ...result,
          jumlah: `${result.jumlah.value} ${result.jumlah.unit}`,
        };
      }),
    };
    return changedDataLaporanSampah;
  };

  const handleAddLaporanSampah = () => {
    const checkIfDataLaporanComplete = handleCheckIfLaporanSampahComplete();
    if (checkIfDataLaporanComplete === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Lengkapi semua input");
    } else {
      const modifiedDataLaporanSampah =
        handleModifyDataLaporanSampahForSubmission();
      axios({
        method: "POST",
        url: `http://localhost:3000/production/addLaporanSampah/${userInformation?.data?.id}`,
        data: { dataLaporanSampah: modifiedDataLaporanSampah },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan laporan sampah");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menambahkan data laporan sampah");
        }
      });
    }
  };

  const handleDeleteLaporanSampah = (id) => {};
  const handleDeleteItemLaporanSampahFromDB = (id) => {};
  const handleEditLaporanSampah = () => {};
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
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Laporan Sampah
          </Typography>
        </div>
        <div style={{ margin: "32px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography style={{ width: "150px" }}>
              No Order Produksi:
            </Typography>
            <MySelectTextField
              data={allNoOrderProduksi}
              value={dataLaporanSampah.noOrderProduksi}
              onChange={(event) => {
                handleChangeInputLaporanSampah(event, "noOrderProduksi");
              }}
              width="150px"
            />
          </div>
          <div
            style={{ display: "flex", alignItems: "center", marginTop: "16px" }}
          >
            <Typography style={{ width: "150px" }}>Tahap Produksi:</Typography>
            <MySelectTextField
              data={allTahapProduksi}
              value={dataLaporanSampah.tahapProduksi}
              onChange={(event) => {
                handleChangeInputLaporanSampah(event, "tahapProduksi");
              }}
              width="150px"
            />
          </div>
        </div>
        <div style={{ margin: "32px" }}>
          {selectedKegiatanProduksi.length !== 0 && (
            <div>
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Data Item Limbah Hasil Produksi
              </Typography>
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table
                  sx={{
                    minWidth: 650,
                    tableLayout: "fixed",
                    overflowX: "auto",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "25px" }}>No.</TableCell>
                      <TableCell>No Order Produksi</TableCell>
                      <TableCell>Nama Barang</TableCell>
                      <TableCell>Jumlah Barang</TableCell>
                      <TableCell>Keterangan</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedKegiatanProduksi[0].itemLaporanLimbahProdukses?.map(
                      (result, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>{index + 1 + "."}</TableCell>
                              <TableCell>{result.noOrderProduksiId}</TableCell>
                              <TableCell>{result.namaBarang}</TableCell>
                              <TableCell>{result.jumlahBarang}</TableCell>
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
          )}
        </div>
        <div style={{ margin: "32px" }}>
          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <DefaultButton
              onClickFunction={() => {
                handleTambahItem();
              }}
            >
              Tambah Item
            </DefaultButton>
          </div>
          <TableContainer component={Paper} style={{ overflowX: "auto" }}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              style={{ tableLayout: "fixed", overflowX: "auto" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "25px" }}>No.</TableCell>
                  <TableCell style={{ width: "300px" }}>Tanggal</TableCell>
                  <TableCell style={{ width: "200px" }}>Pembeli</TableCell>
                  <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                  <TableCell style={{ width: "200px" }}>Jumlah</TableCell>
                  <TableCell style={{ width: "200px" }}>Harga Satuan</TableCell>
                  <TableCell style={{ width: "200px" }}>Pembayaran</TableCell>
                  <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                  <TableCell style={{ width: "50px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLaporanSampah?.itemLaporanSampahs?.map((result, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{index + 1 + "."}</TableCell>
                        <TableCell>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DateTimePicker"]}>
                              <DemoItem>
                                <DateTimePicker
                                  disablePast
                                  value={
                                    result.tanggal.isValid()
                                      ? result.tanggal
                                      : null
                                  }
                                  onChange={(event) => {
                                    handleChangeInputLaporanSampah(
                                      event,
                                      "tanggal",
                                      index
                                    );
                                  }}
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
                            value={result.pembeli}
                            onChange={(event) => {
                              handleChangeInputLaporanSampah(
                                event,
                                "pembeli",
                                index
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={result.uraian}
                            onChange={(event) => {
                              handleChangeInputLaporanSampah(
                                event,
                                "uraian",
                                index
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <TextField
                              type="number"
                              value={result.jumlah.value}
                              onChange={(event) => {
                                handleChangeInputLaporanSampah(
                                  event,
                                  "jumlah",
                                  index
                                );
                              }}
                            />
                            <div style={{ marginLeft: "8px" }}>
                              <MySelectTextField
                                data={units}
                                value={result.jumlah.unit}
                                onChange={(event) => {
                                  handleChangeInputLaporanSampah(
                                    event,
                                    "jumlah",
                                    index,
                                    true
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
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
                            InputProps={{ inputComponent: NumericFormatCustom }}
                            value={result.hargaSatuan}
                            onChange={(event) => {
                              handleChangeInputLaporanSampah(
                                event,
                                "hargaSatuan",
                                index
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="text"
                            sx={{
                              "& .MuiOutlinedInput-root": {
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
                            InputProps={{ inputComponent: NumericFormatCustom }}
                            value={result.pembayaran}
                            onChange={(event) => {
                              handleChangeInputLaporanSampah(
                                event,
                                "pembayaran",
                                index
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            value={result.keterangan}
                            onChange={(event) => {
                              handleChangeInputLaporanSampah(
                                event,
                                "keterangan",
                                index
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => {
                              handleDeleteItemLaporanSampah(result?.id, index);
                            }}
                          >
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
          <div
            style={{
              padding: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DefaultButton
              onClickFunction={() => {
                handleAddLaporanSampah();
              }}
            >
              Tambah Laporan Sampah
            </DefaultButton>
            <Button
              variant="outlined"
              color="error"
              style={{ textTransform: "none", marginLeft: "8px" }}
            >
              Cancel
            </Button>
          </div>
        </div>
        {allLaporanSampah.length !== 0 && (
          <div style={{ padding: "0px 32px 32px 32px" }}>
            <Typography style={{ fontSize: "2vw", color: "#0F607D" }}>
              Data-data laporan sampah
            </Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell>No Order Produksi</TableCell>
                    <TableCell>Tahap Produksi</TableCell>
                    <TableCell style={{ width: "80px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allLaporanSampah?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>{result.noOrderProduksi}</TableCell>
                          <TableCell>{result.tahapProduksi}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                handleOpenModalForEditLaporanSampah(
                                  result.noOrderProduksi,
                                  result.tahapProduksi
                                );
                              }}
                            >
                              <EditIcon style={{ color: "#0F607D" }} />
                            </IconButton>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                Edit Laporan Sampah
              </Typography>
              <DefaultButton>Tambah Item</DefaultButton>
            </div>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table
                aria-label="simple table"
                sx={{ minWidth: 650, tableLayout: "fixed", overflowX: "auto" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell style={{ width: "300px" }}>Tanggal</TableCell>
                    <TableCell style={{ width: "200px" }}>Pembeli</TableCell>
                    <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                    <TableCell style={{ width: "200px" }}>Jumlah</TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Harga Satuan
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>Pembayaran</TableCell>
                    <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                    <TableCell style={{ width: "50px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataLaporanSampahForEdit[0].itemLaporanSampahs.map(
                    (result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1 + "."}</TableCell>
                            <TableCell>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
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
                              <TextField />
                            </TableCell>
                            <TableCell>
                              <TextField />
                            </TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <TextField type="number" />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <TextField
                                type="text"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
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
                                type="text"
                                sx={{
                                  "& .MuiOutlinedInput-root": {
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
                              <TextField />
                            </TableCell>
                            <TableCell>
                              <IconButton>
                                <DeleteIcon style={{ color: "red" }} />
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

export default LaporanSampah;
