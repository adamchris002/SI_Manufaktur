import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import {
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
import { NumericFormat } from "react-number-format";
import { AppContext } from "../../App";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";

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

const Pajak = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);

  const [allDataProductionPlanning, setAllDataProductionPlanning] = useState(
    []
  );
  console.log(allDataProductionPlanning);
  const [allDataPembelianBahanBaku, setAllDataPembelianBahanBaku] = useState(
    []
  );
  const [selectedProductionPlanning, setSelectedProductionPlanning] =
    useState("");
  const [selectedPembelianBahanBaku, setSelectedPembelianBahanBaku] =
    useState("");
  const [selectedJenisPajak, setSelectedJenisPajak] = useState("");
  const [dataPajakMasukan, setDataPajakMasukan] = useState([
    {
      tanggal: dayjs(""),
      leveransir: "",
      noTanggalOrder: "",
      jenisBarang: "",
      kuantitas: { value: "", unit: "" },
      hargaSatuan: "",
      jumlahHarga: "",
      noInvoiceKwitansiSj: "",
      noSeriTglFakturPajak: "",
      dpp: "",
      ppn: "",
      keterangan: "",
    },
  ]);

  const [dataPajakKeluaran, setDataPajakKeluaran] = useState([
    {
      tanggal: dayjs(""),
      pemberiPekerjaan: "",
      jenisBarang: "",
      kuantitas: { value: "", unit: "" },
      hargaSatuan: "",
      jumlahHarga: "",
      noTglSpk: "",
      noSeriTglFakturPajak: "",
      dpp: "",
      ppn: "",
      pphPs22: "",
      keterangan: "",
    },
  ]);

  const jenisPajak = [{ value: "Pajak Masukan" }, { value: "Pajak Keluaran" }];

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

  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getAllProductionPlanning",
    }).then((result) => {
      if (result.status === 200) {
        const tempData = result?.data?.map((result) => {
          return {
            ...result,
            value: result.id,
          };
        });
        setAllDataProductionPlanning(tempData);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data perencanaan produksi"
        );
      }
    });
  }, []);

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

  const handleCloseSnackbar = () => {
    setOpenSnackBar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleChangeInputPajakMasukan = (event, field, index) => {
    const value = event && event.target ? event.target.value : event;
    setDataPajakMasukan((oldArray) => {
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
  const handleChangeInputPajakKeluaran = (event, field, index) => {
    const value = event && event.target ? event.target.value : event;
    setDataPajakKeluaran((oldArray) => {
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

  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const handleChangeSelectedProductionPlanning = (event) => {
    const selectedItem = allDataProductionPlanning.find(
      (item) => item.id === event.target.value
    );
  
    setSelectedProductionPlanning(selectedItem.id);
  
    if (selectedItem) {
      const newItems = selectedItem.rincianCetakans.map((result) => {
        const tempQuantity = separateValueAndUnit(result.kuantitas);
        return {
          tanggal: dayjs(selectedItem.createdAt),
          pemberiPekerjaan: selectedItem.pemesan,
          jenisBarang: result.namaCetakan,
          kuantitas: tempQuantity, // Use tempQuantity here
          hargaSatuan: selectedItem.perincians.find(
            (item) => item.jenisCetakan === result.namaCetakan
          ).harga,
          jumlahHarga: parseFloat(
            selectedItem.perincians.find(
              (item) => item.jenisCetakan === result.namaCetakan
            ).harga
          ) * tempQuantity.value,
          noTglSpk: "",
          noSeriTglFakturPajak: "",
          dpp: "",
          ppn: "",
          pphPs22: "",
          keterangan: "",
        };
      });
      setDataPajakKeluaran(newItems);
    }
  };
  

  const handleChangeSelectedPembelianBahanBaku = (event) => {
    const selectedItem = allDataPembelianBahanBaku.find(
      (item) => item.id === event.target.value
    );

    setSelectedPembelianBahanBaku(selectedItem.id);

    if (selectedItem) {
      const newItems = selectedItem.itemPembelianBahanBakus.map((result) => ({
        tanggal: dayjs(result.tanggal),
        leveransir: selectedItem.leveransir,
        noTanggalOrder: result.noOrder,
        jenisBarang: result.jenisBarang,
        kuantitas: separateValueAndUnit(result.jumlahOrder),
        hargaSatuan: result.hargaSatuan,
        jumlahHarga: result.jumlahHarga,
        noInvoiceKwitansiSj: "",
        noSeriTglFakturPajak: "",
        dpp: "",
        ppn: "",
        keterangan: "",
      }));

      setDataPajakMasukan(newItems);
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
              Pajak
            </Typography>
            <MySelectTextField
              value={selectedJenisPajak}
              onChange={(event) => {
                setSelectedJenisPajak(event.target.value);
              }}
              data={jenisPajak}
              width="200px"
            />
          </div>
          <div style={{ marginTop: "32px" }}>
            {selectedJenisPajak === "" ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                  Silahkan pilih jenis pajak
                </Typography>
              </div>
            ) : (
              <div>
                {selectedJenisPajak === "Pajak Masukan" && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                        Pajak Masukan
                      </Typography>
                      <div style={{ marginLeft: "8px" }}>
                        <MySelectTextField
                          value={selectedPembelianBahanBaku}
                          data={allDataPembelianBahanBaku}
                          onChange={(event) => {
                            handleChangeSelectedPembelianBahanBaku(event);
                          }}
                          width="100px"
                        />
                      </div>
                    </div>
                    <TableContainer
                      component={Paper}
                      sx={{ overflowX: "auto" }}
                    >
                      <Table
                        aria-label="simple table"
                        sx={{
                          tableLayout: "fixed",
                          overflowX: "auto",
                          minWidth: 650,
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: "25px" }}>No.</TableCell>
                            <TableCell style={{ width: "300px" }}>
                              Tanggal
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Leveransir
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              No./ Tgl Order
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Jenis Barang
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Kuantitas
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Harga Satuan
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Jumlah Harga
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              No Invoice/Kwitansi/SJ
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              No. Seri/Tgl. Faktur Pajak
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              DPP
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              PPN
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Keterangan
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataPajakMasukan?.map((result, index) => {
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
                                      value={result.leveransir}
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={result.noTanggalOrder}
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={result.jenisBarang}
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <TextField
                                        type="number"
                                        disabled
                                        value={result.kuantitas.value}
                                      />
                                      <div style={{ marginLeft: "8px" }}>
                                        <MySelectTextField
                                          data={units}
                                          disabled
                                          value={result.kuantitas.unit}
                                        />
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={result.hargaSatuan}
                                      disabled
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
                                      value={result.jumlahHarga}
                                      disabled
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
                                      onChange={(event) => {
                                        handleChangeInputPajakMasukan(
                                          event,
                                          "noInvoiceKwitansiSj",
                                          index
                                        );
                                      }}
                                      value={result.noInvoiceKwitansiSj}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      onChange={(event) => {
                                        handleChangeInputPajakMasukan(
                                          event,
                                          "noSeriTglFakturPajak",
                                          index
                                        );
                                      }}
                                      value={result.noSeriTglFakturPajak}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      onChange={(event) => {
                                        handleChangeInputPajakMasukan(
                                          event,
                                          "dpp",
                                          index
                                        );
                                      }}
                                      value={result.dpp}
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
                                      onChange={(event) => {
                                        handleChangeInputPajakMasukan(
                                          event,
                                          "ppn",
                                          index
                                        );
                                      }}
                                      value={result.ppn}
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
                                      onChange={(event) => {
                                        handleChangeInputPajakMasukan(
                                          event,
                                          "keterangan",
                                          index
                                        );
                                      }}
                                      value={result.keterangan}
                                    />
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

                {selectedJenisPajak === "Pajak Keluaran" && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                        Pajak Keluaran
                      </Typography>
                      <div style={{ marginLeft: "8px" }}>
                        <MySelectTextField
                          value={selectedProductionPlanning}
                          onChange={(event) => {
                            handleChangeSelectedProductionPlanning(event);
                          }}
                          data={allDataProductionPlanning}
                          width="100px"
                        />
                      </div>
                    </div>
                    <TableContainer
                      component={Paper}
                      sx={{ overflowX: "auto" }}
                    >
                      <Table
                        aria-label="simple table"
                        sx={{
                          tableLayout: "fixed",
                          overflowX: "auto",
                          minWidth: 650,
                        }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: "25px" }}>No.</TableCell>
                            <TableCell style={{ width: "300px" }}>
                              Tanggal
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Pemberi Pekerjaan
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Jenis Barang
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Kuantitas
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Harga Satuan
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Jumlah Harga
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              No./Tgl SPK
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              No.Seri/Tgl.Faktur Pajak
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              DPP
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              PPN
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              PPh ps.22
                            </TableCell>
                            <TableCell style={{ width: "200px" }}>
                              Keterangan
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataPajakKeluaran?.map((result, index) => {
                            return (
                              <React.Fragment key={index}>
                                <TableRow>
                                  <TableCell>
                                    {index === 0 ? `${index + 1 + "."}` : ""}
                                  </TableCell>
                                  <TableCell>
                                    {index === 0 ? (
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DateTimePicker"]}
                                        >
                                          <DemoItem>
                                            <DateTimePicker
                                              value={
                                                result.tanggal.isValid()
                                                  ? result.tanggal
                                                  : null
                                              }
                                              disabled
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  error={
                                                    params.error ||
                                                    !params.value
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
                                    ) : (
                                      ""
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {index === 0 ? (
                                      <TextField
                                        disabled
                                        value={result.pemberiPekerjaan}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      disabled
                                      value={result.jenisBarang}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <TextField
                                        type="number"
                                        disabled
                                        value={result.kuantitas.value}
                                      />
                                      <div style={{ marginLeft: "8px" }}>
                                        <MySelectTextField
                                          data={units}
                                          disabled
                                          value={result.kuantitas.unit}
                                        />
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      value={result.hargaSatuan}
                                      disabled
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
                                      value={result.jumlahHarga}
                                      disabled
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
                                      onChange={(event) => {
                                        handleChangeInputPajakKeluaran(
                                          event,
                                          "noTglSpk",
                                          index
                                        );
                                      }}
                                      value={result.noTglSpk}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      onChange={(event) => {
                                        handleChangeInputPajakKeluaran(
                                          event,
                                          "noSeriTglFakturPajak",
                                          index
                                        );
                                      }}
                                      value={result.noSeriTglFakturPajak}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      onChange={(event) => {
                                        handleChangeInputPajakKeluaran(
                                          event,
                                          "dpp",
                                          index
                                        );
                                      }}
                                      value={result.dpp}
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
                                      onChange={(event) => {
                                        handleChangeInputPajakKeluaran(
                                          event,
                                          "ppn",
                                          index
                                        );
                                      }}
                                      value={result.ppn}
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
                                      value={result.pphPs22}
                                      onChange={(event) => {
                                        handleChangeInputPajakKeluaran(
                                          event,
                                          "pphPs22",
                                          index
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
                                      value={result.keterangan}
                                      onChange={(event) => {
                                        handleChangeInputPajakKeluaran(
                                          event,
                                          "keterangan",
                                          index
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
                  </div>
                )}
              </div>
            )}
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

export default Pajak;
