import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import { AppContext } from "../../App";
import {
  Backdrop,
  Button,
  CircularProgress,
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
import DefaultButton from "../../components/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MySelectTextField from "../../components/SelectTextField";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import dayjs from "dayjs";
import MySnackbar from "../../components/Snackbar";
import { useAuth } from "../../components/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const StokOpnam = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);
  const location = useLocation();
  const { setSuccessMessage } = useAuth();
  const navigate = useNavigate();
  const { stokOpnamId } = location.state || "";

  const [dataStokOpnam, setDataStokOpnam] = useState({
    judulStokOpnam: "",
    tanggalStokOpnam: dayjs(""),
    tanggalAkhirStokOpnam: dayjs(""),
    itemStokOpnams: [
      {
        idBarang: "",
        suratPesanan: "",
        tanggalMasuk: dayjs(""),
        tanggalPengembalian: dayjs(""),
        jenisBarang: "",
        kodeBarang: "",
        lokasiPenyimpanan: "",
        stokOpnamAwal: "",
        stokOpnamAkhir: "",
        stokFisik: "",
        stokSelisih: "",
        keterangan: "",
      },
    ],
  });

  console.log(dataStokOpnam);

  const [allInventoryName, setAllInventoryName] = useState([]);
  const [allPermohonanPembelianId, setAllPermohonanPembelianId] = useState([]);
  const [refreshPermohonanPembelian, setRefreshPermohonanPembelian] =
    useState(true);
  const [refreshStokOpnams, setRefreshStokOpnam] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);

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

  const lokasi = [
    { value: "Jakarta" },
    { value: "Semarang" },
    { value: "Purwokerto" },
  ];

  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const transformDataStokOpnam = (data) => {
    const newData = [data];
    return newData.map((item) => {
      const daftarStokOpnam = item.itemStokOpnams.map((stokOpnam) => {
        const {
          stokOpnamAwal,
          stokOpnamAkhir,
          stokFisik,
          stokSelisih,
          ...rest
        } = stokOpnam;
        return {
          ...rest,
          stokOpnamAwal: separateValueAndUnit(stokOpnamAwal),
          stokOpnamAkhir: separateValueAndUnit(stokOpnamAkhir),
          stokFisik: separateValueAndUnit(stokFisik),
          stokSelisih: separateValueAndUnit(stokSelisih),
          tanggalMasuk: dayjs(stokOpnam.tanggalMasuk),
          tanggalPengembalian: dayjs(stokOpnam.tanggalPengembalian),
        };
      });
      return {
        id: item.id,
        judulStokOpnam: item.judulStokOpnam,
        tanggalStokOpnam: dayjs(item.tanggalStokOpnam),
        tanggalAkhirStokOpnam: dayjs(item.tanggalAkhirStokOpnam),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        itemStokOpnams: daftarStokOpnam,
        statusStokOpnam: item.statusStokOpnam,
      };
    });
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllInventoryItem",
    }).then((result) => {
      if (result.status === 200) {
        const tempName = result.data.map((data) => ({
          value: data.namaItem,
          ...data,
        }));
        setAllInventoryName(tempName);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data bahan baku");
      }
    });
  }, []);

  useEffect(() => {
    if (stokOpnamId !== undefined) {
      if (refreshStokOpnams) {
        axios({
          method: "GET",
          url: `http://localhost:3000/inventory/getStokOpnam/${stokOpnamId}`,
        }).then((result) => {
          if (result.status === 200) {
            const modifiedData = transformDataStokOpnam(result.data);
            setDataStokOpnam(modifiedData[0]);
            setRefreshStokOpnam(false);
            setIsLoading(false);
          } else {
            setOpenSnackbar(true);
            setSnackbarStatus(false);
            setSnackbarMessage("Tidak dapat memanggil data stok opnam");
            setIsLoading(false);
          }
        });
      }
    }
  }, [refreshStokOpnams]);

  useEffect(() => {
    if (refreshPermohonanPembelian) {
      axios({
        method: "GET",
        url: "http://localhost:3000/inventory/getAllPermohonanPembelian",
      }).then((result) => {
        if (result.status === 200) {
          const newPermohonanPembelianIds = result.data.map((data) => ({
            value: data.id,
          }));
          setAllPermohonanPembelianId(newPermohonanPembelianIds);
          setRefreshPermohonanPembelian(false);
        } else {
        }
      });
    }
  }, [refreshPermohonanPembelian]);

  const handleChangeInputStokOpnam = (field, event, index, unit) => {
    const value = event && event.target ? event.target.value : event;

    setDataStokOpnam((oldObject) => {
      if (
        field === "judulStokOpnam" ||
        field === "tanggalStokOpnam" ||
        field === "tanggalAkhirStokOpnam"
      ) {
        if (field === "tanggalStokOpnam") {
          return {
            ...oldObject,
            tanggalStokOpnam: value,
            tanggalAkhirStokOpnam: dayjs(value).add(1, "year"),
          };
        }
        return { ...oldObject, [field]: value };
      } else {
        const updatedItems = oldObject.itemStokOpnams.map((item, i) => {
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
              if (
                field === "stokOpnamAwal" ||
                field === "stokOpnamAkhir" ||
                field === "stokFisik" ||
                field === "stokSelisih"
              ) {
                return {
                  ...updatedItem,
                  [field]: {
                    ...updatedItem[field],
                    value: value,
                  },
                };
              }
              if (field === "jenisBarang") {
                updatedItem = { ...updatedItem, [field]: value };
                const kodeBarang = getSelectedInventoryItem(
                  updatedItem.jenisBarang,
                  "kodeBarang"
                );
                const lokasiPenyimpanan = getSelectedInventoryItem(
                  updatedItem.jenisBarang,
                  "lokasi"
                );
                const idBarang = getSelectedInventoryItem(
                  updatedItem.jenisBarang,
                  "id"
                );
                const inventoryHistory = getSelectedInventoryItem(
                  updatedItem.jenisBarang,
                  "inventoryHistorys"
                );
                if (inventoryHistory?.length !== 0) {
                  const mostRecentItem = inventoryHistory?.reduce(
                    (latest, item) => {
                      return new Date(item.createdAt) >
                        new Date(latest.createdAt)
                        ? item
                        : latest;
                    }
                  );

                  const tempvalue = separateValueAndUnit(
                    mostRecentItem.stokOpnamAkhir
                  );
                  updatedItem.stokOpnamAwal = {
                    id: mostRecentItem.id,
                    value: tempvalue.value,
                    unit: tempvalue.unit,
                  };
                } else {
                  updatedItem.stokOpnamAwal = { value: "", unit: "" };
                }
                updatedItem.kodeBarang = kodeBarang;
                updatedItem.lokasiPenyimpanan = lokasiPenyimpanan;
                updatedItem.idBarang = idBarang;
              } else {
                updatedItem = { ...updatedItem, [field]: value };
              }
            }
            return updatedItem;
          }
          return item;
        });

        return { ...oldObject, itemStokOpnams: updatedItems };
      }
    });
  };

  const checkStokOpnamIsEmpty = () => {
    if (
      dataStokOpnam.judulStokOpnam === "" ||
      dataStokOpnam.tanggalStokOpnam === "" ||
      !dayjs(
        dataStokOpnam.tanggalStokOpnam,
        "MM/DD/YYYY hh:mm A",
        true
      ).isValid() ||
      dataStokOpnam.tanggalAkhirStokOpnam === "" ||
      !dayjs(
        dataStokOpnam.tanggalAkhirStokOpnam,
        "MM/DD/YYYY hh:mm A",
        true
      ).isValid()
    ) {
      return false;
    }

    for (const item of dataStokOpnam.itemStokOpnams) {
      if (
        !item.suratPesanan ||
        !item.tanggalMasuk ||
        !dayjs(item.tanggalMasuk, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.tanggalPengembalian ||
        !dayjs(
          item.tanggalPengembalian,
          "MM/DD/YYYY hh:mm A",
          true
        ).isValid() ||
        !item.jenisBarang ||
        !item.kodeBarang ||
        !item.lokasiPenyimpanan ||
        !item.stokOpnamAwal?.value ||
        !item.stokOpnamAwal?.unit ||
        !item.stokOpnamAkhir?.value ||
        !item.stokOpnamAkhir?.unit ||
        !item.stokFisik?.value ||
        !item.stokFisik?.unit ||
        !item.stokSelisih?.value ||
        !item.stokSelisih?.unit
      ) {
        return false;
      }
    }

    return true;
  };

  const modifyStokOpnam = () => {
    const changedStokOpnam = {
      ...dataStokOpnam,
      itemStokOpnams: dataStokOpnam.itemStokOpnams.map((result) => {
        return {
          ...result,
          stokOpnamAwal: `${result.stokOpnamAwal.value} ${result.stokOpnamAwal.unit}`,
          stokOpnamAkhir: `${result.stokOpnamAkhir.value} ${result.stokOpnamAkhir.unit}`,
          stokFisik: `${result.stokFisik.value} ${result.stokFisik.unit}`,
          stokSelisih: `${result.stokSelisih.value} ${result.stokSelisih.unit}`,
        };
      }),
    };
    return changedStokOpnam;
  };

  const handleDeleteItemStokOpnam = (index, id) => {
    if (!id || id === undefined) {
      setDataStokOpnam((oldObject) => {
        return {
          ...oldObject,
          itemStokOpnams: oldObject.itemStokOpnams.filter(
            (_, j) => j !== index
          ),
        };
      });
    } else {
      axios({
        method: "DELETE",
        url: `http://localhost:3000/inventory/deleteItemStokOpnam/${id}`,
        params: { userId: userInformation?.data?.id, stokOpnamId: stokOpnamId },
      }).then((result) => {
        if (result.status === 200) {
          setRefreshStokOpnam(true);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("Berhasil menghapus data stok opnam");
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menghapus data stok opnam");
        }
      });
    }
  };

  const handleEditStokOpnam = () => {
    const checkIfEmpty = checkStokOpnamIsEmpty();
    if (checkIfEmpty === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input");
    } else {
      const modifiedData = modifyStokOpnam();
      axios({
        method: "PUT",
        url: `http://localhost:3000/inventory/editStokOpnam/${userInformation?.data?.id}`,
        data: { dataStokOpnam: modifiedData },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil mengedit stok opnam");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil mengedit stok opnam");
        }
      });
    }
  };

  const handleAddStokOpnam = () => {
    const checkIfEmpty = checkStokOpnamIsEmpty();
    if (checkIfEmpty === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input");
    } else {
      const modifiedData = modifyStokOpnam();
      axios({
        method: "POST",
        url: `http://localhost:3000/inventory/addStokOpnam/${userInformation?.data?.id}`,
        data: { dataStokOpnam: modifiedData },
      }).then((result) => {
        if (result.status === 200) {
          setSnackbarStatus(true);
          setSuccessMessage("Berhasil menambahkan data stok opnam");
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menambahkan data stok opnam");
        }
      });
    }
  };

  const handleAddRow = () => {
    setDataStokOpnam((oldArray) => {
      return {
        ...oldArray,
        itemStokOpnams: [
          ...oldArray.itemStokOpnams,
          {
            suratPesanan: "",
            tanggalMasuk: dayjs(""),
            tanggalPengembalian: dayjs(""),
            jenisBarang: "",
            kodeBarang: "",
            lokasiPenyimpanan: "",
            stokOpnamAwal: "",
            stokOpnamAkhir: "",
            tanggalKeluar: dayjs(""),
            jumlahPengambilan: "",
            diambilOleh: "",
            untukPekerjaan: "",
            stokFisik: "",
            stokSelisih: "",
            keterangan: "",
          },
        ],
      };
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const getSelectedInventoryItem = (value, field) => {
    const selectedItem = allInventoryName?.find(
      (result) => value === result.value
    );
    return selectedItem ? selectedItem[field] : null;
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
      {isLoading !== false && stokOpnamId ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div style={{ height: "100%", width: "100%" }}>
          {dataStokOpnam?.statusStokOpnam === "Done" ? (
            <div
              style={{
                display: isMobile ? "" : "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "32px",
              }}
            >
              <Typography>Data tidak dapat diedit lagi</Typography>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "32px",
              }}
            >
              <Typography
                style={{
                  fontSize: isMobile ? "24px" : "3vw",
                  color: "#0F607D",
                }}
              >
                {stokOpnamId !== undefined
                  ? "Edit Stok Opnam"
                  : "Tambah Stok Opnam"}
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  handleAddRow();
                }}
              >
                Tambah Item
              </DefaultButton>
            </div>
          )}
          {dataStokOpnam?.statusStokOpnam === "Done" ? (
            ""
          ) : (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "16px 32px",
                }}
              >
                <Typography>Judul Stok Opnam: </Typography>
                <div style={{ marginLeft: "8px" }}>
                  <TextField
                    value={dataStokOpnam.judulStokOpnam}
                    onChange={(event) => {
                      handleChangeInputStokOpnam("judulStokOpnam", event);
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "16px 32px",
                }}
              >
                <Typography>Tanggal Stok Opnam: </Typography>
                <div style={{ marginLeft: "8px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DemoItem>
                        <DateTimePicker
                          disablePast
                          value={
                            dataStokOpnam.tanggalStokOpnam.isValid()
                              ? dataStokOpnam.tanggalStokOpnam
                              : null
                          }
                          onChange={(event) => {
                            handleChangeInputStokOpnam(
                              "tanggalStokOpnam",
                              event
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={params.error || !params.value}
                              helperText={
                                params.error ? "Invalid date format" : ""
                              }
                            />
                          )}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "16px 32px",
                }}
              >
                <Typography>Tanggal Akhir Stok Opnam: </Typography>
                <div style={{ marginLeft: "8px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DemoItem>
                        <DateTimePicker
                          disablePast
                          value={
                            dataStokOpnam.tanggalAkhirStokOpnam.isValid()
                              ? dataStokOpnam.tanggalAkhirStokOpnam
                              : null
                          }
                          onChange={(event) => {
                            handleChangeInputStokOpnam(
                              "tanggalAkhirStokOpnam",
                              event
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={params.error || !params.value}
                              helperText={
                                params.error ? "Invalid date format" : ""
                              }
                            />
                          )}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
            </div>
          )}
          {dataStokOpnam?.statusStokOpnam === "Done" ? (
            ""
          ) : (
            <div style={{ width: "100%" }}>
              <div style={{ margin: "32px" }}>
                <TableContainer component={Paper} style={{ overflowX: "auto" }}>
                  <Table
                    sx={{ minWidth: 650 }}
                    aria-label="simple table"
                    style={{ tableLayout: "fixed", overflowX: "auto" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: 50 }}>No.</TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Surat Pesanan
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Tanggal Masuk
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Tanggal Pengembalian
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Jenis Barang
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Kode Barang
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Lokasi Penyimpanan
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Stok Opnam Awal
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Stok Opnam Akhir
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Stok Fisik
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Stok Selisih
                        </TableCell>
                        <TableCell align="left" style={{ width: "200px" }}>
                          Keterangan
                        </TableCell>
                        <TableCell style={{ width: 50 }} align="left">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataStokOpnam.itemStokOpnams.map((result, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>{index + 1 + "."}</TableCell>
                              <TableCell>
                                <MySelectTextField
                                  width={"200px"}
                                  data={allPermohonanPembelianId}
                                  value={result.suratPesanan}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      "suratPesanan",
                                      event,
                                      index
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      value={
                                        result?.tanggalMasuk?.isValid()
                                          ? result.tanggalMasuk
                                          : null
                                      }
                                      onChange={(event) => {
                                        handleChangeInputStokOpnam(
                                          "tanggalMasuk",
                                          event,
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
                                </LocalizationProvider>
                              </TableCell>
                              <TableCell>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      value={
                                        result.tanggalPengembalian.isValid()
                                          ? result?.tanggalPengembalian
                                          : null
                                      }
                                      onChange={(event) => {
                                        handleChangeInputStokOpnam(
                                          "tanggalPengembalian",
                                          event,
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
                                </LocalizationProvider>
                              </TableCell>
                              <TableCell>
                                <MySelectTextField
                                  value={result.jenisBarang}
                                  data={allInventoryName}
                                  width={200}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      "jenisBarang",
                                      event,
                                      index
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  disabled
                                  value={getSelectedInventoryItem(
                                    result.jenisBarang,
                                    "kodeBarang"
                                  )}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      "kodeBarang",
                                      event,
                                      index
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <MySelectTextField
                                  disabled
                                  width="200px"
                                  data={lokasi}
                                  value={getSelectedInventoryItem(
                                    result.jenisBarang,
                                    "lokasi"
                                  )}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      "lokasiPenyimpanan",
                                      event,
                                      index
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <TextField
                                    disabled={result.id ? true : false}
                                    sx={{ width: "130px" }}
                                    type="number"
                                    value={result.stokOpnamAwal.value}
                                    onChange={(event) => {
                                      handleChangeInputStokOpnam(
                                        "stokOpnamAwal",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <div style={{ marginLeft: "8px" }}>
                                    <MySelectTextField
                                      key={"unit"}
                                      disabled={result.id ? true : false}
                                      width={isMobile ? "75px" : "100px"}
                                      height={"55px"}
                                      data={units}
                                      value={result.stokOpnamAwal.unit}
                                      onChange={(event) => {
                                        handleChangeInputStokOpnam(
                                          "stokOpnamAwal",
                                          event,
                                          index,
                                          true
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "130px" }}
                                    type="number"
                                    value={result.stokOpnamAkhir?.value}
                                    onChange={(event) => {
                                      handleChangeInputStokOpnam(
                                        "stokOpnamAkhir",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <div style={{ marginLeft: "8px" }}>
                                    <MySelectTextField
                                      type="text"
                                      width={isMobile ? "75px" : "100px"}
                                      height={"55px"}
                                      data={units}
                                      value={result.stokOpnamAkhir?.unit}
                                      onChange={(event) => {
                                        handleChangeInputStokOpnam(
                                          "stokOpnamAkhir",
                                          event,
                                          index,
                                          true
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "130px" }}
                                    type="number"
                                    value={result.stokFisik?.value}
                                    onChange={(event) => {
                                      handleChangeInputStokOpnam(
                                        "stokFisik",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <div style={{ marginLeft: "8px" }}>
                                    <MySelectTextField
                                      type="text"
                                      width={isMobile ? "75px" : "100px"}
                                      height={"55px"}
                                      data={units}
                                      value={result.stokFisik?.unit}
                                      onChange={(event) => {
                                        handleChangeInputStokOpnam(
                                          "stokFisik",
                                          event,
                                          index,
                                          true
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "130px" }}
                                    type="number"
                                    value={result.stokSelisih?.value}
                                    onChange={(event) => {
                                      handleChangeInputStokOpnam(
                                        "stokSelisih",
                                        event,
                                        index
                                      );
                                    }}
                                  />
                                  <div style={{ marginLeft: "8px" }}>
                                    <MySelectTextField
                                      type="text"
                                      width={isMobile ? "75px" : "100px"}
                                      height={"55px"}
                                      data={units}
                                      value={result.stokSelisih?.unit}
                                      onChange={(event) => {
                                        handleChangeInputStokOpnam(
                                          "stokSelisih",
                                          event,
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
                                  value={result.keterangan}
                                  onChange={(event) => {
                                    handleChangeInputStokOpnam(
                                      "keterangan",
                                      event,
                                      index
                                    );
                                  }}
                                  multiline
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => {
                                    handleDeleteItemStokOpnam(index, result.id);
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
              </div>
              <div
                style={{
                  display: "flex",
                  margin: "32px",
                  justifyContent: "center",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    stokOpnamId !== undefined
                      ? handleEditStokOpnam()
                      : handleAddStokOpnam();
                  }}
                >
                  {stokOpnamId !== undefined
                    ? "Edit Stok Opnam"
                    : "Tambah Stok Opnam"}
                </DefaultButton>
                <Button
                  onClick={() => {
                    navigate(-1);
                  }}
                  color="error"
                  variant="outlined"
                  style={{ textTransform: "none", marginLeft: "8px" }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
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

export default StokOpnam;
