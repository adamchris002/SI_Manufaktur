import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../components/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import factoryBackground from "../../assets/factorybackground.png";
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  setRef,
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
import DefaultButton from "../../components/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import MySnackbar from "../../components/Snackbar";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AppContext } from "../../App";

const LaporanLimbahProduksi = (props) => {
  const { isMobile } = useContext(AppContext);
  const { userInformation } = props;
  const { setSuccessMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { laporanLimbahProduksiId } = location.state || "";
  const [dataLimbah, setDataLimbah] = useState({
    noOrderProduksi: "",
    dibuatOleh: "",
    tanggalPembuatan: dayjs(""),
    tahapProduksi: "",
    itemLaporanLimbahProdukses: [
      {
        noOrderProduksi: "",
        namaBarang: "",
        jumlahBarang: { value: "", unit: "" },
        keterangan: "",
      },
    ],
  });

  const [allDataProduksiSelesai, setAllDataProduksiSelesai] = useState([]);
  const [allNoOrderProduksi, setAllNoOrderProduksi] = useState([]);
  const [selectedNoOrderProduksi, setSelectedNoOrderProduksi] = useState("");
  const [allTahapProduksi, setAllTahapProduksi] = useState([]);
  const [selectedTahapProduksi, setSelectedTahapProduksi] = useState("");
  const [selectedKegiatanProduksi, setSelectedKegiatanProduksi] = useState([]);
  const [dataLimbahForSuggestion, setDataLimbahForSuggestion] = useState([]);

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);

  const [refreshDataLimbahProduksi, setRefreshDataLimbahProduksi] =
    useState(true);

  useEffect(() => {
    if (laporanLimbahProduksiId) {
      if (refreshDataLimbahProduksi) {
        axios({
          method: "GET",
          url: `http://localhost:3000/production/getOneLaporanLimbahProduksi/${laporanLimbahProduksiId}`,
          params: { userId: userInformation?.data?.id },
        }).then((result) => {
          if (result.status === 200) {
            setDataLimbah((oldObject) => {
              return {
                ...result.data,
                tanggalPembuatan: dayjs(result.data.tanggalPembuatan),
                itemLaporanLimbahProdukses:
                  result.data.itemLaporanLimbahProdukses.map((data) => {
                    return {
                      ...data,
                      jumlahBarang: separateValueAndUnit(data.jumlahBarang),
                      noOrderProduksi: data.noOrderProduksiId,
                    };
                  }),
              };
            });
            setRefreshDataLimbahProduksi(false);
          } else {
            setOpenSnackbar(true);
            setSnackbarStatus(false);
            setSnackbarMessage("Tidak berhasil memanggil data laporan limbah");
            setRefreshDataLimbahProduksi(false);
          }
        });
      }
    }
  }, [refreshDataLimbahProduksi]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3000/production/getLaporanProduksiForLaporanLimbah/${userInformation?.data?.id}`,
    })
      .then((result) => {
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
        } else {
          console.error("Failed to fetch data:", result.status);
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching data:", error);
      });
  }, []);

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

  const kondisi = [
    {
      value: "Dapat digunakan lagi",
    },
    {
      value: "Untuk dibuang",
    },
  ];

  const handleTambahItem = () => {
    setDataLimbah((oldObject) => ({
      ...oldObject,
      itemLaporanLimbahProdukses: [
        ...oldObject.itemLaporanLimbahProdukses,
        {
          noOrderProduksi:
            laporanLimbahProduksiId !== undefined
              ? oldObject.noOrderProduksi
              : selectedNoOrderProduksi,
          namaBarang: "",
          jumlahBarang: { value: "", unit: "" },
          keterangan: "",
          tahapProduksi: selectedTahapProduksi,
        },
      ],
    }));
  };

  const handleDeleteItemLimbah = (id, index, idLimbahProduksi) => {
    if (!id || id === undefined) {
      setDataLimbah((oldObject) => ({
        ...oldObject,
        itemLaporanLimbahProdukses: oldObject.itemLaporanLimbahProdukses.filter(
          (_, j) => j !== index
        ),
      }));
    } else {
      axios({
        method: "DELETE",
        url: `http://localhost:3000/production/deleteItemLaporanLimbahProduksis/${id}`,
        params: {
          userId: userInformation?.data?.id,
          idLimbahProduksi: idLimbahProduksi,
        },
      }).then((result) => {
        if (result.status === 200) {
          setRefreshDataLimbahProduksi(true);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage(`Berhasil menghapus item limbah dengan di ${id}`);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            `Tidak berhasil menghapus item limbah dengan di ${id}`
          );
        }
      });
    }
  };

  const handleChangeDataLimbah = (event, field, index, unit) => {
    const value = event && event.target ? event.target.value : event;
    setDataLimbah((oldObject) => {
      if (field === "dibuatOleh" || field === "tanggalPembuatan") {
        return {
          ...oldObject,
          [field]: value,
        };
      } else {
        const updatedItems = oldObject.itemLaporanLimbahProdukses.map(
          (item, i) => {
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
                if (field === "jumlahBarang") {
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
          }
        );
        return { ...oldObject, itemLaporanLimbahProdukses: updatedItems };
      }
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleChangeNoOrderProduksi = (event) => {
    const selectedValue = event.target.value;
    setSelectedNoOrderProduksi(selectedValue);
    setDataLimbah((oldObject) => {
      return {
        ...oldObject,
        noOrderProduksi: selectedValue,
        itemLaporanLimbahProdukses: oldObject.itemLaporanLimbahProdukses.map(
          (result) => {
            return {
              ...result,
              noOrderProduksi: selectedValue,
            };
          }
        ),
      };
    });

    const tempData = allDataProduksiSelesai
      .filter((result) => result.noOrderProduksi === selectedValue)
      .map((result) => {
        return {
          value: result.tahapProduksi,
        };
      });
    setAllTahapProduksi(tempData);

    if (selectedTahapProduksi !== "") {
      const tempSelectedKegiatanProduksi = allDataProduksiSelesai
        .filter(
          (result) =>
            result.noOrderProduksi === selectedValue &&
            result.tahapProduksi === selectedTahapProduksi
        )
        .map((result) => {
          return {
            ...result,
          };
        });
      setSelectedKegiatanProduksi(tempSelectedKegiatanProduksi);
      const tempData =
        tempSelectedKegiatanProduksi[0].bahanLaporanProdukses.map((result) => {
          return {
            ...result,
            value: result.jenis,
          };
        });
      setDataLimbahForSuggestion(tempData);
    }
  };

  const handleChangeTahapProduksi = (event) => {
    const selectedValue = event.target.value;
    setSelectedTahapProduksi(selectedValue);

    const tempData = allDataProduksiSelesai
      .filter(
        (result) =>
          result.noOrderProduksi === selectedNoOrderProduksi &&
          result.tahapProduksi === selectedValue
      )
      .map((result) => {
        return {
          ...result,
        };
      });
    setSelectedKegiatanProduksi(tempData);
    const tempDataForSuggestion = tempData[0].bahanLaporanProdukses.map(
      (result) => {
        return {
          ...result,
          value: result.jenis,
        };
      }
    );
    setDataLimbahForSuggestion(tempDataForSuggestion);

    setDataLimbah((oldObject) => {
      return {
        ...oldObject,
        tahapProduksi: selectedValue,
        itemLaporanLimbahProdukses: oldObject.itemLaporanLimbahProdukses.map(
          (result) => {
            return {
              ...result,
              tahapProduksi: selectedValue,
            };
          }
        ),
      };
    });
  };

  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const modifyDataLimbahProduksi = () => {};

  const checkIfDataLimbahProduksiIsEmpty = () => {
    if (
      !dataLimbah.dibuatOleh ||
      !dataLimbah.noOrderProduksi ||
      !dataLimbah.tahapProduksi ||
      !dataLimbah.tanggalPembuatan ||
      !dayjs(dataLimbah.tanggalPembuatan, "MM/DD/YYYY hh:mm A", true).isValid()
    ) {
      return false;
    }
    for (const item of dataLimbah.itemLaporanLimbahProdukses) {
      if (
        !item.noOrderProduksi ||
        !item.namaBarang ||
        !item.jumlahBarang.value ||
        !item.jumlahBarang.unit ||
        !item.keterangan ||
        !item.tahapProduksi
      ) {
        return false;
      }
    }
    return true;
  };
  const transformDataLimbahProduksi = (data) => {
    return {
      ...data,
      itemLaporanLimbahProdukses: data.itemLaporanLimbahProdukses.map(
        (result) => {
          return {
            ...result,
            jumlahBarang: `${result.jumlahBarang.value} ${result.jumlahBarang.unit}`,
            tahapProduksi: `${selectedTahapProduksi}`,
          };
        }
      ),
    };
  };

  const handleEditLaporanLimbahProduksi = () => {
    const checkDataLimbah = checkIfDataLimbahProduksiIsEmpty();
    if (checkDataLimbah === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Mohon isi semua input");
    } else {
      const transformedDataLimbah = transformDataLimbahProduksi(dataLimbah);
      axios({
        method: "PUT",
        url: `http://localhost:3000/production/updateDataLimbahProduksi/${userInformation?.data?.id}`,
        data: { dataLimbah: transformedDataLimbah },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil mengedit laporan limbah hasil produksi");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil mengedit laporan limbah hasil produksi"
          );
        }
      });
    }
  };
  const handleAddLaporanLimbahProduksi = () => {
    const checkDataLimbah = checkIfDataLimbahProduksiIsEmpty();
    if (checkDataLimbah === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Mohon isi semua input");
    } else {
      const transformedDataLimbah = transformDataLimbahProduksi(dataLimbah);
      axios({
        method: "POST",
        url: `http://localhost:3000/production/addLaporanLimbahProduksi/${userInformation?.data?.id}`,
        data: { dataLimbah: transformedDataLimbah },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage(
            "Berhasil menambahkan laporan limbah hasil produksi"
          );
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menambahkan laporan limbah hasil produksi"
          );
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
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ margin: "32px" }}>
          <Typography
            style={{ color: "#0F607D", fontSize: isMobile ? "6vw" : "3vw" }}
          >
            Laporan Limbah Produksi
          </Typography>
        </div>
        {laporanLimbahProduksiId === undefined && (
          <div style={{ margin: "32px" }}>
            <Typography
              style={{ fontSize: isMobile ? "5vw" : "2vw", color: "#0F607D" }}
            >
              Pilih Kegiatan Produksi:
            </Typography>
            <div
              style={{
                display: isMobile ? "" : "flex",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isMobile ? "space-between" : "",
                }}
              >
                <Typography
                  style={{
                    fontSize: isMobile ? "3.5vw" : "1.5vw",
                    color: "#0F607D",
                  }}
                >
                  No Order Produksi:
                </Typography>
                <div style={{ marginLeft: "16px" }}>
                  <MySelectTextField
                    width="200px"
                    value={selectedNoOrderProduksi}
                    onChange={(event) => {
                      handleChangeNoOrderProduksi(event);
                    }}
                    data={allNoOrderProduksi}
                  />
                </div>
              </div>
              <div
                style={{
                  marginLeft: isMobile ? "" : "32px",
                  display: "flex",
                  alignItems: "center",
                  marginTop: isMobile ? "8px" : "",
                  justifyContent: isMobile ? "space-between" : "",
                }}
              >
                <Typography
                  style={{
                    fontSize: isMobile ? "3.5vw" : "1.5vw",
                    color: "#0F607D",
                  }}
                >
                  Tahap Produksi:
                </Typography>
                <div style={{ marginLeft: "16px" }}>
                  <MySelectTextField
                    width="200px"
                    value={selectedTahapProduksi}
                    onChange={(event) => {
                      handleChangeTahapProduksi(event);
                    }}
                    data={allTahapProduksi}
                  />
                </div>
              </div>
            </div>
            {selectedKegiatanProduksi.length !== 0 && (
              <div style={{ marginTop: "32px" }}>
                <div
                  style={{
                    display: isMobile ? "100%" : "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: isMobile ? "" : "50%" }}>
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontSize: isMobile ? "3.5vw" : "3vw",
                      }}
                    >
                      Informasi Kegiatan Produksi
                    </Typography>
                    {selectedKegiatanProduksi?.map((result, index) => {
                      return (
                        <div key={index}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginTop: "16px",
                            }}
                          >
                            <Typography
                              style={{
                                color: "#0F607D",
                                fontSize: isMobile ? "3vw" : "1.5vw",
                                width: isMobile ? "120px" : "300px",
                              }}
                            >{`ID: ${result.id}`}</Typography>
                            <Typography
                              style={{
                                color: "#0F607D",
                                fontSize: isMobile ? "3vw" : "1.5vw",
                              }}
                            >{`Tanggal Produksi: ${dayjs(
                              result.tanggalProduksi
                            ).format("MM/DD/YYYY hh:mm A")}`}</Typography>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginTop: "8px",
                            }}
                          >
                            <Typography
                              style={{
                                color: "#0F607D",
                                fontSize: isMobile ? "3vw" : "1.5vw",
                                width: isMobile ? "120px" : "300px",
                              }}
                            >{`No Order Produksi: ${result.noOrderProduksi}`}</Typography>
                            <Typography
                              style={{
                                color: "#0F607D",
                                fontSize: isMobile ? "3vw" : "1.5vw",
                              }}
                            >{`Mesin: ${result.mesin}`}</Typography>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              marginTop: "8px",
                            }}
                          >
                            <Typography
                              style={{
                                color: "#0F607D",
                                fontSize: isMobile ? "3vw" : "1.5vw",
                                width: isMobile ? "120px" : "300px",
                              }}
                            >{`Dibuat Oleh: ${result.dibuatOleh}`}</Typography>
                            <Typography
                              style={{
                                color: "#0F607D",
                                fontSize: isMobile ? "3vw" : "1.5vw",
                              }}
                            >{`Tahap Produksi: ${result.tahapProduksi}`}</Typography>
                          </div>
                          <div style={{ marginTop: "8px" }}>
                            <Typography
                              style={{
                                color: "#0F607D",
                                fontSize: isMobile ? "3vw" : "1.5vw",
                              }}
                            >{`Jenis Cetakan: ${result.jenisCetakan}`}</Typography>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ width: isMobile ? "100%" : "48%" }}>
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontSize: isMobile ? "3.5vw" : "3vw",
                        marginTop: isMobile ? "16px" : "",
                      }}
                    >
                      Personil
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ width: "25px" }}>No.</TableCell>
                            <TableCell align="left">Nama</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedKegiatanProduksi?.map((result, index) => {
                            return (
                              <React.Fragment key={index}>
                                {result.personils.map((data, dataIndex) => {
                                  return (
                                    <TableRow key={dataIndex}>
                                      <TableCell>{index + 1 + "."}</TableCell>
                                      <TableCell>{data.nama}</TableCell>
                                    </TableRow>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
                <div style={{ marginTop: "32px" }}>
                  <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
                    Bahan Kegiatan Produksi
                  </Typography>
                  <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                    <Table
                      sx={{
                        minWidth: 650,
                        overflowX: "auto",
                        tableLayout: "fixed",
                      }}
                      aria-label="simple table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "25px" }}>No.</TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Jenis
                          </TableCell>
                          <TableCell style={{ width: "200px" }}>Kode</TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Berat Awal
                          </TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Berat Akhir
                          </TableCell>
                          <TableCell style={{ width: "200px" }}>
                            Keterangan
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedKegiatanProduksi?.map((result, index) => {
                          return (
                            <React.Fragment key={index}>
                              {result?.bahanLaporanProdukses?.map(
                                (data, dataIndex) => {
                                  return (
                                    <TableRow key={dataIndex}>
                                      <TableCell>{index + 1 + "."}</TableCell>
                                      <TableCell>{data.jenis}</TableCell>
                                      <TableCell>{data.kode}</TableCell>
                                      <TableCell>{data.beratAwal}</TableCell>
                                      <TableCell>{data.beratAkhir}</TableCell>
                                      <TableCell>{data.keterangan}</TableCell>
                                    </TableRow>
                                  );
                                }
                              )}
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                <div style={{ marginTop: "32px" }}>
                  {selectedKegiatanProduksi?.map((result, index) => {
                    return (
                      <div key={index}>
                        {result.tahapProduksi === "Produksi Pracetak" && (
                          <>
                            <Typography
                              style={{ color: "#0F607D", fontSize: "3vw" }}
                            >
                              Jadwal Produksi Pracetak
                            </Typography>
                            <TableContainer
                              component={Paper}
                              sx={{ overflowX: "auto" }}
                            >
                              <Table
                                sx={{
                                  minWidth: 650,
                                  overflowX: "auto",
                                  tableLayout: "fixed",
                                }}
                                aria-label="simple table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{ width: "25px" }}>
                                      No.
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jam Awal Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jam Akhir Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      No Order Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jenis Cetakan
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Perolehan Cetakan
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Waste
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Keterangan
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {result?.jadwalProdukses?.map(
                                    (data, dataIndex) => {
                                      return (
                                        <React.Fragment key={dataIndex}>
                                          <TableRow>
                                            <TableCell>
                                              {dataIndex + 1 + "."}
                                            </TableCell>
                                            <TableCell>
                                              {dayjs(
                                                data.jamAwalProduksi
                                              ).format("MM/DD/YYYY hh:mm A")}
                                            </TableCell>
                                            <TableCell>
                                              {dayjs(
                                                data.jamAkhirProduksi
                                              ).format("MM/DD/YYYY hh:mm A")}
                                            </TableCell>
                                            <TableCell>
                                              {data.noOrderProduksi}
                                            </TableCell>
                                            <TableCell>
                                              {data.jenisCetakan}
                                            </TableCell>
                                            <TableCell>
                                              {data.perolehanCetak}
                                            </TableCell>
                                            <TableCell>{data.waste}</TableCell>
                                            <TableCell>
                                              {data.keterangan}
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </>
                        )}
                        {result.tahapProduksi === "Produksi Cetak" && (
                          <>
                            <Typography
                              style={{ color: "#0F607D", fontSize: "3vw" }}
                            >
                              Jadwal Produksi Cetak
                            </Typography>
                            <TableContainer
                              component={Paper}
                              sx={{ overflowX: "auto" }}
                            >
                              <Table
                                sx={{
                                  minWidth: 650,
                                  overflowX: "auto",
                                  tableLayout: "fixed",
                                }}
                                aria-label="simple table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{ width: "25px" }}>
                                      No.
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jam Awal Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jam Akhir Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      No Order Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jenis Cetakan
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Perolehan Cetakan
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      {"Waste Sobek (Kg)"}
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      {"Waste Kulit (Kg)"}
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      {"Waste Gelondong (Kg)"}
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      {"Waste Sampah (Kg)"}
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Roll Habis
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Roll Sisa
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Keterangan
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {result?.jadwalProdukses?.map(
                                    (data, dataIndex) => {
                                      return (
                                        <React.Fragment key={dataIndex}>
                                          <TableRow>
                                            <TableCell>
                                              {dataIndex + 1 + "."}
                                            </TableCell>
                                            <TableCell>
                                              {dayjs(
                                                data.jamAwalProduksi
                                              ).format("MM/DD/YYYY hh:mm A")}
                                            </TableCell>
                                            <TableCell>
                                              {dayjs(
                                                data.jamAkhirProduksi
                                              ).format("MM/DD/YYYY hh:mm A")}
                                            </TableCell>
                                            <TableCell>
                                              {data.noOrderProduksi}
                                            </TableCell>
                                            <TableCell>
                                              {data.jenisCetakan}
                                            </TableCell>
                                            <TableCell>
                                              {data.perolehanCetak}
                                            </TableCell>
                                            <TableCell>{data.sobek}</TableCell>
                                            <TableCell>{data.kulit}</TableCell>
                                            <TableCell>
                                              {data.gelondong}
                                            </TableCell>
                                            <TableCell>{data.sampah}</TableCell>
                                            <TableCell>
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={data.rollHabis}
                                                  />
                                                }
                                                disabled
                                              />
                                            </TableCell>
                                            <TableCell>
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={data.rollSisa}
                                                  />
                                                }
                                                disabled
                                              />
                                            </TableCell>
                                            <TableCell>
                                              {data.keterangan}
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </>
                        )}
                        {result.tahapProduksi === "Produksi Fitur" && (
                          <>
                            <Typography
                              style={{ color: "#0F607D", fontSize: "3vw" }}
                            >
                              Jadwal Produksi Fitur
                            </Typography>
                            <TableContainer
                              component={Paper}
                              sx={{ overflowX: "auto" }}
                            >
                              <Table
                                sx={{
                                  minWidth: 650,
                                  overflowX: "auto",
                                  tableLayout: "fixed",
                                }}
                                aria-label="simple table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{ width: "25px" }}>
                                      No.
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jam Awal Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jam Akhir Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      No Order Produksi
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jenis Cetakan
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Nomorator Awal
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Nomorator Akhir
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Perolehan Cetakan
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Waste
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Keterangan
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {result?.jadwalProdukses?.map(
                                    (data, dataIndex) => {
                                      return (
                                        <React.Fragment key={dataIndex}>
                                          <TableRow>
                                            <TableCell>
                                              {dataIndex + 1 + "."}
                                            </TableCell>
                                            <TableCell>
                                              {dayjs(
                                                data.jamAwalProduksi
                                              ).format("MM/DD/YYYY hh:mm A")}
                                            </TableCell>
                                            <TableCell>
                                              {dayjs(
                                                data.jamAkhirProduksi
                                              ).format("MM/DD/YYYY hh:mm A")}
                                            </TableCell>
                                            <TableCell>
                                              {data.noOrderProduksi}
                                            </TableCell>
                                            <TableCell>
                                              {data.jenisCetakan}
                                            </TableCell>
                                            <TableCell>
                                              {data.nomoratorAwal}
                                            </TableCell>
                                            <TableCell>
                                              {data.nomoratorAkhir}
                                            </TableCell>
                                            <TableCell>
                                              {data.perolehanCetak}
                                            </TableCell>
                                            <TableCell>{data.waste}</TableCell>
                                            <TableCell>
                                              {data.keterangan}
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        <div style={{ margin: "32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Typography
              style={{ color: "#0F607D", fontSize: isMobile ? "2.5vw" : "2vw" }}
            >
              Item Limbah Hasil Produksi:
            </Typography>
            <DefaultButton
              onClickFunction={() => {
                handleTambahItem();
              }}
            >
              Tambah Item Limbah
            </DefaultButton>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography style={{ width: "200px", color: "#0F607D" }}>
                Dibuat Oleh:
              </Typography>
              <TextField
                value={dataLimbah.dibuatOleh}
                onChange={(event) => {
                  handleChangeDataLimbah(event, "dibuatOleh");
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography style={{ width: "200px", color: "#0F607D" }}>
                Tanggal Pembuatan:{" "}
              </Typography>
              <div style={{ width: "200px" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    sx={{ overflow: isMobile ? "hidden" : "" }}
                    components={["DateTimePicker"]}
                  >
                    <DemoItem>
                      <DateTimePicker
                        sx={{
                          width: isMobile ? "200px" : "300px",
                          height: isMobile ? "30px" : "50px",
                          ".MuiInputBase-root": {
                            height: isMobile ? "30px" : "50px",
                            width: isMobile ? "200px" : "300px",
                            fontSize: isMobile ? "12px" : "",
                            minWidth: "",
                          },
                        }}
                        value={
                          dataLimbah.tanggalPembuatan.isValid()
                            ? dataLimbah.tanggalPembuatan
                            : null
                        }
                        onChange={(event) => {
                          handleChangeDataLimbah(event, "tanggalPembuatan");
                        }}
                        disablePast
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table
              sx={{ tableLayout: "fixed", overflowX: "auto" }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left" style={{ width: "25px" }}>
                    No.
                  </TableCell>
                  <TableCell align="left" style={{ width: "200px" }}>
                    No Order Produksi
                  </TableCell>
                  <TableCell align="left" style={{ width: "200px" }}>
                    Nama Item/Barang
                  </TableCell>
                  <TableCell align="left" style={{ width: "200px" }}>
                    Jumlah Item/Barang
                  </TableCell>
                  <TableCell align="left" style={{ width: "200px" }}>
                    Keterangan
                  </TableCell>
                  <TableCell align="left" style={{ width: "50px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLimbah?.itemLaporanLimbahProdukses?.map(
                  (result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <TextField
                              disabled
                              value={result.noOrderProduksi}
                              width="200px"
                            />
                          </TableCell>
                          <TableCell>
                            {/* <TextField
                              value={result.namaBarang}
                              onChange={(event) => {
                                handleChangeDataLimbah(
                                  event,
                                  "namaBarang",
                                  index
                                );
                              }}
                            /> */}
                          <MySelectTextField
                            data={dataLimbahForSuggestion}
                            value={result.namaBarang}
                            onChange={(event) => {
                              handleChangeDataLimbah(
                                event,
                                "namaBarang",
                                index
                              );
                            }}
                            width={"200px"}
                          />
                          </TableCell> 
                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <TextField
                                type="number"
                                value={result.jumlahBarang.value}
                                onChange={(event) => {
                                  handleChangeDataLimbah(
                                    event,
                                    "jumlahBarang",
                                    index
                                  );
                                }}
                              />
                              <div style={{ marginLeft: "8px" }}>
                                <MySelectTextField
                                  value={result.jumlahBarang.unit}
                                  onChange={(event) => {
                                    handleChangeDataLimbah(
                                      event,
                                      "jumlahBarang",
                                      index,
                                      true
                                    );
                                  }}
                                  data={units}
                                  width="80px"
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <MySelectTextField
                              value={result.keterangan}
                              onChange={(event) => {
                                handleChangeDataLimbah(
                                  event,
                                  "keterangan",
                                  index
                                );
                              }}
                              width="200px"
                              data={kondisi}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                handleDeleteItemLimbah(
                                  result?.id,
                                  index,
                                  dataLimbah.id
                                );
                              }}
                            >
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
        <div
          style={{
            padding: " 0px 32px 32px 32px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <DefaultButton
            onClickFunction={() => {
              laporanLimbahProduksiId !== undefined
                ? handleEditLaporanLimbahProduksi()
                : handleAddLaporanLimbahProduksi();
            }}
          >
            {laporanLimbahProduksiId !== undefined
              ? "Edit Laporan Limbah Produksi"
              : "Tambah Laporan Limbah Produksi"}
          </DefaultButton>
          <Button
            style={{ marginLeft: "8px", textTransform: "none" }}
            variant="outlined"
            color="error"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
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

export default LaporanLimbahProduksi;
