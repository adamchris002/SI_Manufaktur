import React, { useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import {
  Button,
  FormControlLabel,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MySelectTextField from "../../components/SelectTextField";
import DefaultButton from "../../components/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";
import dayjs from "dayjs";
import { useAuth } from "../../components/AuthContext";

const KegiatanProduksi = (props) => {
  const { userInformation } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const { setSuccessMessage } = useAuth();
  const { laporanProduksiId, isNewTahapProduksi } = location.state || "";

  const [personil, setPersonil] = useState([
    {
      nama: "",
    },
  ]);

  const [allProductionPlan, setAllProductionPlan] = useState([]);
  const [allInventoryItem, setAllInventoryItem] = useState([]);
  const [dataProduksi, setDataProduksi] = useState({
    tanggalProduksi: dayjs(""),
    noOrderProduksi: "",
    jenisCetakan: "",
    mesin: "",
    dibuatOleh: "",
    tahapProduksi: "Produksi Pracetak",
    bahanProduksis: [
      {
        jenis: "",
        kode: "",
        beratAwal: { value: "", unit: "" },
        beratAkhir: { value: "", unit: "" },
        keterangan: "",
      },
    ],
  });

  const [jadwalProduksiPracetak, setJadwalProduksiPracetak] = useState([
    {
      jamAwalProduksi: dayjs(""),
      jamAkhirProduksi: dayjs(""),
      noOrderProduksi: "",
      jenisCetakan: "",
      perolehanCetakan: { value: "", unit: "" },
      waste: { value: "", unit: "" },
      keterangan: "",
    },
  ]);
  const [jadwalProduksiFitur, setJadwalProduksiFitur] = useState([
    {
      jamAwalProduksi: dayjs(""),
      jamAkhirProduksi: dayjs(""),
      noOrderProduksi: "",
      jenisCetakan: "",
      nomoratorAwal: "",
      nomoratorAkhir: "",
      perolehanCetakan: { value: "", unit: "" },
      waste: { value: "", unit: "" },
      keterangan: "",
    },
  ]);
  const [jadwalProduksiCetak, setJadwalProduksiCetak] = useState([
    {
      jamAwalProduksi: dayjs(""),
      jamAkhirProduksi: dayjs(""),
      noOrderProduksi: "",
      jenisCetakan: "",
      perolehanCetakan: { value: "", unit: "" },
      sobek: { value: "", unit: "" },
      kulit: { value: "", unit: "" },
      gelondong: { value: "", unit: "" },
      sampah: { value: "", unit: "" },
      rollHabis: false,
      rollSisa: false,
      keterangan: "",
    },
  ]);

  const [tanggalPengiriman, setTanggalPengiriman] = useState(dayjs(""));

  const [showError, setShowError] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [refreshDataKegiatanProduksi, setRefreshDataKegiatanProduksi] =
    useState(true);

  useEffect(() => {
    if (isNewTahapProduksi) {
      axios({
        method: "GET",
        url: `http://localhost:3000/production/getOneProductionData/${isNewTahapProduksi.id}`,
      }).then((result) => {
        if (result.status === 200) {
          if (result.data.tahapProduksi === "Produksi Pracetak") {
            setDataProduksi((oldObject) => {
              return {
                ...oldObject,
                noOrderProduksi: result.data.noOrderProduksi,
                jenisCetakan: result.data.jenisCetakan,

                tahapProduksi: "Produksi Cetak",
              };
            });
          }
          if (result.data.tahapProduksi === "Produksi Cetak") {
            setDataProduksi((oldObject) => {
              return {
                ...oldObject,
                noOrderProduksi: result.data.noOrderProduksi,
                jenisCetakan: result.data.jenisCetakan,

                tahapProduksi: "Produksi Fitur",
              };
            });
          }
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data kegiatan produksi");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (laporanProduksiId === undefined && isNewTahapProduksi === undefined) {
      axios({
        method: "GET",
        url: "http://localhost:3000/productionPlanning/getAllProductionPlanStatusEstimated",
      }).then((result) => {
        if (result.status === 200) {
          const tempData = result.data.map((data) => ({
            value: data.orderId,
            ...data,
          }));
          setAllProductionPlan(tempData);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data pesanan");
        }
      });
    } else {
      axios({
        method: "GET",
        url: "http://localhost:3000/productionPlanning/getAllProductionPlanning",
      }).then((result) => {
        if (result.status === 200) {
          const tempData = result.data.map((data) => ({
            value: data.orderId,
            ...data,
          }));
          setAllProductionPlan(tempData);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data pesanan");
        }
      });
    }
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllInventoryItem",
    }).then((result) => {
      if (result.status === 200) {
        const tempValue = result.data.map((data) => ({
          value: data.namaItem,
          ...data,
        }));
        setAllInventoryItem(tempValue);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil item bahan baku");
      }
    });
  }, []);

  useEffect(() => {
    if (
      dataProduksi.noOrderProduksi !== "" ||
      dataProduksi.jenisCetakan !== ""
    ) {
      setJadwalProduksiPracetak((oldArray) => {
        let updatedItems = oldArray.map((result) => {
          return {
            ...result,
            jenisCetakan: dataProduksi.jenisCetakan,
            noOrderProduksi: dataProduksi.noOrderProduksi,
          };
        });
        return updatedItems;
      });
    }
  }, [dataProduksi.jenisCetakan, dataProduksi.noOrderProduksi]);

  useEffect(() => {
    if (
      dataProduksi.noOrderProduksi !== "" ||
      dataProduksi.jenisCetakan !== ""
    ) {
      setJadwalProduksiCetak((oldArray) => {
        let updatedItems = oldArray.map((result) => {
          return {
            ...result,
            jenisCetakan: dataProduksi.jenisCetakan,
            noOrderProduksi: dataProduksi.noOrderProduksi,
          };
        });
        return updatedItems;
      });
    }
  }, [dataProduksi.jenisCetakan, dataProduksi.noOrderProduksi]);

  useEffect(() => {
    if (
      dataProduksi.noOrderProduksi !== "" ||
      dataProduksi.jenisCetakan !== ""
    ) {
      setJadwalProduksiFitur((oldArray) => {
        let updatedItems = oldArray.map((result) => {
          return {
            ...result,
            jenisCetakan: dataProduksi.jenisCetakan,
            noOrderProduksi: dataProduksi.noOrderProduksi,
          };
        });
        return updatedItems;
      });
    }
  }, [dataProduksi.jenisCetakan, dataProduksi.noOrderProduksi]);

  useEffect(() => {
    if (laporanProduksiId) {
      if (refreshDataKegiatanProduksi) {
        axios({
          method: "GET",
          url: `http://localhost:3000/production/getOneProductionData/${laporanProduksiId}`,
        }).then((result) => {
          if (result.status === 200) {
            setPersonil(result.data.personils);
            setDataProduksi({
              id: result.data.id,
              tanggalProduksi: dayjs(result.data.tanggalProduksi),
              noOrderProduksi: result.data.noOrderProduksi,
              jenisCetakan: result.data.jenisCetakan,
              mesin: result.data.mesin,
              dibuatOleh: result.data.dibuatOleh,
              tahapProduksi: result.data.tahapProduksi || "Produksi Pracetak",
              bahanProduksis: result.data.bahanLaporanProdukses.map((item) => ({
                ...item,
                beratAwal: separateValueAndUnit(item.beratAwal),
                beratAkhir: separateValueAndUnit(item.beratAkhir),
              })),
            });
            if (result.data.tahapProduksi === "Produksi Pracetak") {
              const data = result.data.jadwalProdukses.map((item) => {
                return {
                  ...item,
                  jamAwalProduksi: dayjs(item.jamAwalProduksi),
                  jamAkhirProduksi: dayjs(item.jamAkhirProduksi),
                  perolehanCetakan: separateValueAndUnit(item.perolehanCetak),
                  waste: separateValueAndUnit(item.waste),
                };
              });
              setJadwalProduksiPracetak(data);
            }
            if (result.data.tahapProduksi === "Produksi Cetak") {
              const data = result.data.jadwalProdukses.map((item) => {
                return {
                  ...item,
                  jamAwalProduksi: dayjs(item.jamAwalProduksi),
                  jamAkhirProduksi: dayjs(item.jamAkhirProduksi),
                  perolehanCetakan: separateValueAndUnit(item.perolehanCetak),
                  sobek: separateValueAndUnit(item.perolehanCetak),
                  kulit: separateValueAndUnit(item.kulit),
                  gelondong: separateValueAndUnit(item.gelondong),
                  sampah: separateValueAndUnit(item.sampah),
                };
              });
              setJadwalProduksiCetak(data);
            }
            if (result.data.tahapProduksi === "Produksi Fitur") {
              const data = result.data.jadwalProdukses.map((item) => {
                return {
                  ...item,
                  jamAwalProduksi: dayjs(item.jamAwalProduksi),
                  jamAkhirProduksi: dayjs(item.jamAkhirProduksi),
                  perolehanCetakan: separateValueAndUnit(item.perolehanCetak),
                  waste: separateValueAndUnit(item.waste),
                };
              });
              setJadwalProduksiFitur(data);
            }
            setRefreshDataKegiatanProduksi(false);
          } else {
            setOpenSnackbar(true);
            setSnackbarMessage(
              `Tidak berhasil memanggil data kegiatan produksi dengan id ${laporanProduksiId}`
            );
            setSnackbarStatus(false);
          }
        });
      }
    }
  }, [refreshDataKegiatanProduksi]);

  const handleChangeJadwalProduksiCetak = (event, index, field, unit) => {
    const value = event && event.target ? event.target.value : event;
    setJadwalProduksiCetak((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        let updatedItem = { ...item };
        if (i === index) {
          if (unit) {
            updatedItem = {
              ...updatedItem,
              [field]: {
                value: item[field]?.value || "",
                unit: value,
              },
            };
          } else {
            if (
              field === "beratBahanKertas" ||
              field === "perolehanCetakan" ||
              field === "sobek" ||
              field === "kulit" ||
              field === "gelondong" ||
              field === "sampah"
            ) {
              updatedItem = {
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
      return updatedItems;
    });
  };
  const handleChangeJadwalProduksiFitur = (event, index, field, unit) => {
    const value = event && event.target ? event.target.value : event;
    setJadwalProduksiFitur((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        if (i === index) {
          let updatedItem = { ...item };
          if (unit) {
            updatedItem = {
              ...updatedItem,
              [field]: {
                value: item[field]?.value || "",
                unit: value,
              },
            };
          } else {
            if (field === "perolehanCetakan" || field === "waste") {
              updatedItem = {
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
      return updatedItems;
    });
  };

  const handleChangeJadwalProduksiPracetak = (event, index, field, unit) => {
    const value = event && event.target ? event.target.value : event;
    setJadwalProduksiPracetak((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        if (i === index) {
          let updatedItem = { ...item };
          if (unit) {
            updatedItem = {
              ...updatedItem,
              [field]: {
                value: item[field]?.value || "",
                unit: value,
              },
            };
          } else {
            if (field === "perolehanCetakan" || field === "waste") {
              updatedItem = {
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
      return updatedItems;
    });
  };

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

  const getSelectedOrder = (value, field) => {
    const selectedOrder = allProductionPlan?.find(
      (result) => value === result.value
    );
    return selectedOrder ? selectedOrder[field] : null;
  };

  const getSelectedInventoryItem = (value, field) => {
    const selectedItem = allInventoryItem?.find(
      (result) => value === result.value
    );
    return selectedItem ? selectedItem[field] : null;
  };
  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const handleChangeDataProduksi = (event, field, index, unit) => {
    const value = event && event.target ? event.target.value : event;
    setDataProduksi((oldObject) => {
      if (
        field === "tanggalProduksi" ||
        field === "noOrderProduksi" ||
        field === "jenisCetakan" ||
        field === "mesin" ||
        field === "dibuatOleh" ||
        field === "tahapProduksi"
      ) {
        if (field === "noOrderProduksi") {
          setTanggalPengiriman(
            dayjs(getSelectedOrder(value, "tanggalPengirimanBarang"))
          );
          return {
            ...oldObject,
            noOrderProduksi: value,
            jenisCetakan: getSelectedOrder(value, "jenisCetakan"),
          };
        }
        return { ...oldObject, [field]: value };
      } else {
        const updatedItems = oldObject.bahanProduksis.map((item, i) => {
          if (i === index) {
            let updatedItem = { ...item };
            let hasError = false;

            if (unit) {
              if (
                value === updatedItem.beratAwal.unit ||
                (value === "Kg" && updatedItem.beratAwal.unit === "Ton")
              ) {
                updatedItem = {
                  ...updatedItem,
                  [field]: {
                    value: item[field].value || "", // Preserve existing value or set empty string
                    unit: value,
                  },
                };
              } else {
                hasError = true;
                setOpenSnackbar(true);
                setSnackbarStatus(false);
                setSnackbarMessage(
                  "Satuan barang yang diinput tidak sesuai dengan satuan barang pada berat awal"
                );
              }
            } else {
              if (field === "beratAkhir") {
                if (
                  updatedItem.beratAkhir.unit === updatedItem.beratAwal.unit
                ) {
                  const parsedBeratAwal = parseFloat(
                    updatedItem.beratAwal.value
                  );
                  if (value <= parsedBeratAwal && value >= 0) {
                    updatedItem = {
                      ...updatedItem,
                      [field]: {
                        ...updatedItem[field],
                        value: value,
                      },
                    };
                  } else {
                    hasError = true;
                    setOpenSnackbar(true);
                    setSnackbarStatus(false);
                    setSnackbarMessage(
                      "Jumlah yang anda masukkan tidak melebihi berat awal atau kurang dari nol"
                    );
                  }
                } else if (
                  updatedItem.beratAkhir.unit === "Kg" &&
                  updatedItem.beratAwal.unit === "Ton"
                ) {
                  const beratAwalDalamKg = updatedItem.beratAwal.value * 1000;
                  if (value <= beratAwalDalamKg && value >= 0) {
                    updatedItem = {
                      ...updatedItem,
                      [field]: {
                        ...updatedItem[field],
                        value: value,
                      },
                    };
                  } else {
                    hasError = true;
                    setOpenSnackbar(true);
                    setSnackbarStatus(false);
                    setSnackbarMessage(
                      "Jumlah yang anda masukkan tidak melebihi berat awal dalam Kg atau kurang dari nol"
                    );
                  }
                } else {
                  hasError = true;
                  setOpenSnackbar(true);
                  setSnackbarStatus(false);
                  setSnackbarMessage(
                    "Jumlah yang anda masukkan tidak melebihi atau kurang dari nol"
                  );
                }
              } else {
                updatedItem = { ...updatedItem, [field]: value };

                if (field === "jenis") {
                  const kodeBarang = getSelectedInventoryItem(
                    updatedItem.jenis,
                    "kodeBarang"
                  );
                  const inventoryHistorys = getSelectedInventoryItem(
                    updatedItem.jenis,
                    "inventoryHistorys"
                  );
                  const beratAwal = separateValueAndUnit(
                    getSelectedInventoryItem(updatedItem.jenis, "jumlahItem")
                  );
                  if (inventoryHistorys.length === 0) {
                    updatedItem.beratAwal = {
                      value: beratAwal.value,
                      unit: beratAwal.unit,
                    };
                  } else {
                    const mostRecentItem = inventoryHistorys.reduce(
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
                    updatedItem.beratAwal = {
                      value: tempvalue.value,
                      unit: tempvalue.unit,
                    };
                  }
                  updatedItem.kode = kodeBarang;
                }
              }
            }

            const updatedErrorStates = [...showError];
            updatedErrorStates[index] = hasError;
            setShowError(updatedErrorStates);
            return updatedItem;
          }
          return item;
        });

        return { ...oldObject, bahanProduksis: updatedItems };
      }
    });
  };

  const handleSelesaiKegiatanProduksi = (id) => {
    axios({
      method: "PUT",
      url: `http://localhost:3000/production/kegiatanProduksiSelesai/${id}`,
    }).then((result) => {
      if (result.status === 200) {
        setSuccessMessage("Kegiatan produksi selesai");
        setSnackbarStatus(true);
        navigate(-1);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil mengupdate kegiatan produksi");
      }
    });
  };

  const handleAddJawalProduksiPracetak = () => {
    setJadwalProduksiPracetak((oldArray) => {
      return [
        ...oldArray,
        {
          jamAwalProduksi: dayjs(""),
          jamAkhirProduksi: dayjs(""),
          noOrderProduksi: dataProduksi.noOrderProduksi,
          jenisCetakan: dataProduksi.jenisCetakan,
          perolehanCetakan: { value: "", unit: "" },
          waste: { value: "", unit: "" },
          ketarangan: "",
        },
      ];
    });
  };
  const handleAddJadwalProduksiCetak = () => {
    setJadwalProduksiCetak((oldArray) => {
      return [
        ...oldArray,
        {
          jamAwalProduksi: dayjs(""),
          jamAkhirProduksi: dayjs(""),
          noOrderProduksi: dataProduksi.noOrderProduksi,
          jenisCetakan: dataProduksi.jenisCetakan,
          jenisBahanKertas: "",
          jenisKodeRollBahanKertas: "",
          beratBahanKertas: { value: "", unit: "'" },
          perolehanCetakan: { value: "", unit: "" },
          sobek: { value: "", unit: "" },
          kulit: { value: "", unit: "" },
          gelondong: { value: "", unit: "" },
          sampah: { value: "", unit: "" },
          rollHabis: "",
          rollSisa: "",
          ketarangan: "",
        },
      ];
    });
  };
  const handleAddJadwalProduksiFitur = () => {
    setJadwalProduksiFitur((oldArray) => {
      return [
        ...oldArray,
        {
          jamAwalProduksi: dayjs(""),
          jamAkhirProduksi: dayjs(""),
          noOrderProduksi: dataProduksi.noOrderProduksi,
          jenisCetakan: dataProduksi.jenisCetakan,
          nomoratorAwal: "",
          nomoratorAkhir: "",
          perolehanCetakan: { value: "", unit: "" },
          waste: { value: "", unit: "" },
          ketarangan: "",
        },
      ];
    });
  };

  const handleDeleteDataJadwalProduksiPracetak = (id, index) => {
    if (!id || id === undefined) {
      setJadwalProduksiPracetak((oldArray) =>
        oldArray.filter((_, j) => j !== index)
      );
    } else {
      axios({
        method: "DELETE",
        url: `http://localhost:3000/production/deleteJadwalProduksiPracetak/${id}`,
      }).then((result) => {
        if (result.status === 200) {
          setRefreshDataKegiatanProduksi(true);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage(
            "Berhasil Menghapus data jadwal produksi pracetak"
          );
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menghapus data jadwal produksi pracetak"
          );
        }
      });
    }
  };
  const handleDeleteDataJadwalProduksiCetak = (id, index) => {
    if (!id || id === undefined) {
      setJadwalProduksiCetak((oldArray) =>
        oldArray.filter((_, j) => j !== index)
      );
    }
  };
  const handleDeleteDataJadwalProduksiFitur = (id, index) => {
    if (!id || id === undefined) {
      setJadwalProduksiFitur((oldArray) =>
        oldArray.filter((_, j) => j !== index)
      );
    }
  };

  const handleChangeInputPersonil = (event, index) => {
    setPersonil((oldArray) => {
      return oldArray.map((result, count) => {
        if (index === count) {
          return {
            ...result,
            nama: event.target.value,
          };
        }
        return result;
      });
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const handleAddPersonil = () => {
    setPersonil((oldArray) => {
      return [...oldArray, { nama: "" }];
    });
  };

  const handleAddBahan = () => {
    setDataProduksi((oldObject) => {
      return {
        ...oldObject,
        bahanProduksis: [
          ...oldObject.bahanProduksis,
          {
            jenis: "",
            kode: "",
            beratAwal: { value: "", unit: "" },
            beratAkhir: { value: "", unit: "" },
            keterangan: "",
          },
        ],
      };
    });
  };

  const handleDeletePersonil = (id, index) => {
    if (!id || id === undefined) {
      setPersonil((oldArray) => oldArray.filter((_, j) => j !== index));
    } else {
      axios({
        method: "DELETE",
        url: `http://localhost:3000/production/deletePersonils/${id}`,
      }).then((result) => {
        if (result.status === 200) {
          setRefreshDataKegiatanProduksi(true);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("Berhasil Menghapus data personil");
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menghapus data personil");
        }
      });
    }
  };

  const handleDeleteBahan = (id, index) => {
    if (!id || id === undefined) {
      setDataProduksi((oldObject) => {
        return {
          ...oldObject,
          bahanProduksis: oldObject.bahanProduksis.filter(
            (_, j) => j !== index
          ),
        };
      });
    } else {
      axios({
        method: "DELETE",
        url: `http://localhost:3000/production/deleteBahanProduksiPracetak/${id}`,
      }).then((result) => {
        if (result.status === 200) {
          setRefreshDataKegiatanProduksi(true);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("Berhasil Menghapus data bahan produksi pracetak");
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menghapus data bahan produksi pracetak"
          );
        }
      });
    }
  };

  const checkPersonilIsEmpty = () => {
    for (const item of personil) {
      if (!item.nama) {
        return false;
      }
    }
    return true;
  };

  const checkJadwalFiturIsEmpty = () => {
    for (const item of jadwalProduksiFitur) {
      if (
        !item.jamAwalProduksi ||
        !dayjs(item.jamAwalProduksi, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.jamAkhirProduksi ||
        !dayjs(item.jamAkhirProduksi, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.noOrderProduksi ||
        !item.jenisCetakan ||
        !item.nomoratorAwal ||
        !item.nomoratorAkhir ||
        !item.perolehanCetakan.value ||
        !item.perolehanCetakan.unit ||
        !item.waste.value ||
        !item.waste.unit ||
        !item.keterangan
      ) {
        return false;
      }
    }
    return true;
  };

  const checkjadwalCetakIsEmpty = () => {
    for (const item of jadwalProduksiCetak) {
      if (
        !item.jamAwalProduksi ||
        !dayjs(item.jamAwalProduksi, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.jamAkhirProduksi ||
        !dayjs(item.jamAkhirProduksi, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.noOrderProduksi ||
        !item.jenisCetakan ||
        !item.perolehanCetakan.value ||
        !item.perolehanCetakan.unit ||
        !item.gelondong.value ||
        !item.gelondong.unit ||
        !item.sampah.value ||
        !item.sampah.unit ||
        !item.keterangan
      ) {
        return false;
      }
    }
    return true;
  };

  const checkJadwalPracetakIsEmpty = () => {
    for (const item of jadwalProduksiPracetak) {
      if (
        !item.jamAwalProduksi ||
        !dayjs(item.jamAwalProduksi, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.jamAkhirProduksi ||
        !dayjs(item.jamAkhirProduksi, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.noOrderProduksi ||
        !item.jenisCetakan ||
        !item.perolehanCetakan.value ||
        !item.perolehanCetakan.unit ||
        !item.waste.value ||
        !item.waste.unit ||
        !item.keterangan
      ) {
        return false;
      }
    }
    return true;
  };

  const checkDataProduksiIsEmpty = () => {
    if (
      !dataProduksi.tanggalProduksi ||
      !dayjs(
        dataProduksi.tanggalProduksi,
        "MM/DD/YYYY hh:mm A",
        true
      ).isValid() ||
      !dataProduksi.jenisCetakan ||
      !dataProduksi.noOrderProduksi ||
      !dataProduksi.mesin ||
      !dataProduksi.dibuatOleh ||
      !dataProduksi.tahapProduksi
    ) {
      return false;
    }
    for (const item of dataProduksi.bahanProduksis) {
      if (
        !item.jenis ||
        !item.kode ||
        !item.beratAwal.value ||
        !item.beratAwal.unit ||
        !item.beratAkhir.value ||
        !item.beratAkhir.unit ||
        !item.keterangan
      ) {
        return false;
      }
    }
    return true;
  };

  const handleModifyDataProduksi = () => {
    const changedDataProduksi = {
      ...dataProduksi,
      bahanProduksis: dataProduksi.bahanProduksis.map((result) => {
        return {
          ...result,
          beratAwal: `${result.beratAwal.value} ${result.beratAwal.unit}`,
          beratAkhir: `${result.beratAkhir.value} ${result.beratAkhir.unit}`,
        };
      }),
    };
    return changedDataProduksi;
  };

  const handleModifyJadwalPracetak = () => {
    const changedJadwalPracetak = jadwalProduksiPracetak.map((result) => {
      return {
        ...result,
        perolehanCetakan: `${result.perolehanCetakan.value} ${result.perolehanCetakan.unit}`,
        waste: `${result.waste.value} ${result.waste.unit}`,
      };
    });
    return changedJadwalPracetak;
  };

  const handleModifyJadwalFitur = () => {
    const changedJadwalFitur = jadwalProduksiFitur.map((result) => {
      return {
        ...result,
        perolehanCetakan: `${result.perolehanCetakan.value} ${result.perolehanCetakan.unit}`,
        waste: `${result.waste.value} ${result.waste.unit}`,
      };
    });
    return changedJadwalFitur;
  };

  const handleModifyJadwalCetak = () => {
    const changedJadwalCetak = jadwalProduksiCetak.map((result) => {
      return {
        ...result,
        perolehanCetakan: `${result.perolehanCetakan.value} ${result.perolehanCetakan.unit}`,
        sobek: `${result.sobek.value} ${result.sobek.unit}`,
        kulit: `${result.kulit.value} ${result.kulit.unit}`,
        gelondong: `${result.gelondong.value} ${result.gelondong.unit}`,
        sampah: `${result.sampah.value} ${result.sampah.unit}`,
      };
    });
    return changedJadwalCetak;
  };

  const handleEditKegiatanProduksiFitur = () => {
    const checkPersonil = checkPersonilIsEmpty();
    const checkDataProduksi = checkDataProduksiIsEmpty();
    const checkJadwalFitur = checkJadwalFiturIsEmpty();
    if (
      checkPersonil === false ||
      checkDataProduksi === false ||
      checkJadwalFitur === false
    ) {
      setOpenSnackbar(true);
      setSnackbarMessage("Tolong lengkapi semua input");
      setSnackbarStatus(false);
    } else {
      const modifiedDataProduksis = handleModifyDataProduksi();
      const modifiedJadwalFitur = handleModifyJadwalFitur();
      axios({
        method: "PUT",
        url: `http://localhost:3000/production/updateKegiatanProduksiFitur/${userInformation?.data?.id}`,
        data: {
          personil: personil,
          dataProduksi: modifiedDataProduksis,
          jadwalFitur: modifiedJadwalFitur,
        },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil mengedit kegiatan produksi fitur");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil mengedit kegiatan produksi fitur");
        }
      });
    }
  };

  const handleEditKegiatanProduksi = () => {
    const checkPersonil = checkPersonilIsEmpty();
    const checkDataProduksi = checkDataProduksiIsEmpty();
    const checkJadwalPracetak = checkJadwalPracetakIsEmpty();
    if (
      checkPersonil === false ||
      checkDataProduksi === false ||
      checkJadwalPracetak === false
    ) {
      setOpenSnackbar(true);
      setSnackbarMessage("Tolong lengkapi semua input");
      setSnackbarStatus(false);
    } else {
      const modifiedDataProduksis = handleModifyDataProduksi();
      const modifiedJadwalPracetak = handleModifyJadwalPracetak();
      axios({
        method: "PUT",
        url: `http://localhost:3000/production/updateKegiatanProduksiPracetak/${userInformation?.data?.id}`,
        data: {
          dataProduksi: modifiedDataProduksis,
          jadwalPracetak: modifiedJadwalPracetak,
          personil: personil,
        },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil mengedit kegiatan produksi Pracetak");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil mengedit kegiatan produksi pracetak"
          );
        }
      });
    }
  };

  const handleEditKegiatanProduksiCetak = () => {
    if (dataProduksi.tahapProduksi === "Produksi Cetak") {
      const checkPersonil = checkPersonilIsEmpty();
      const checkDataProduksi = checkDataProduksiIsEmpty();
      const checkJadwalCetak = checkjadwalCetakIsEmpty();
      if (
        checkPersonil === false ||
        (checkDataProduksi === false) | (checkJadwalCetak === false)
      ) {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tolong lengkapi semua input");
      } else {
        const modifiedDataProduksis = handleModifyDataProduksi();
        const modifiedJadwalCetak = handleModifyJadwalCetak();
        axios({
          method: "PUT",
          url: `http://localhost:3000/production/updateKegiatanProduksiCetak/${userInformation?.data?.id}`,
          data: {
            personil: personil,
            dataProduksi: modifiedDataProduksis,
            jadwalCetak: modifiedJadwalCetak,
          },
        }).then((result) => {
          if (result.status === 200) {
            setSuccessMessage("Berhasil mengedit kegiatan produksi cetak");
            setSnackbarStatus(true);
            navigate(-1);
          } else {
            setOpenSnackbar(true);
            setSnackbarStatus(false);
            setSnackbarMessage(
              "Tidak berhasil mengedit kegiatan produksi cetak"
            );
          }
        });
      }
    } else {
      return false;
    }
  };

  const handleAddKegiatanProduksiFitur = () => {
    const checkPersonil = checkPersonilIsEmpty();
    const checkDataProduksi = checkDataProduksiIsEmpty();
    const checkJadwalFitur = checkJadwalFiturIsEmpty();
    if (
      checkPersonil === false ||
      checkDataProduksi === false ||
      checkJadwalFitur === false
    ) {
      setOpenSnackbar(true);
      setSnackbarMessage("Tolong lengkapi semua input");
      setSnackbarStatus(false);
    } else {
      const modifiedDataProduksis = handleModifyDataProduksi();
      const modifiedJadwalFitur = handleModifyJadwalFitur();
      axios({
        method: "POST",
        url: `http://localhost:3000/production/addKegiatanProduksiFitur/${userInformation?.data?.id}`,
        data: {
          personil: personil,
          dataProduksi: modifiedDataProduksis,
          jadwalFitur: modifiedJadwalFitur,
        },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan kegiatan produksi fitur");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarMessage("Tidak berhasil membuat kegiatan produksi fitur");
          setSnackbarStatus(false);
        }
      });
    }
  };

  const handleAddKegiatanProduksiCetak = () => {
    const checkPersonil = checkPersonilIsEmpty();
    const checkDataProduksi = checkDataProduksiIsEmpty();
    const checkjadwalCetak = checkjadwalCetakIsEmpty();
    if (
      checkPersonil === false ||
      checkDataProduksi === false ||
      checkjadwalCetak === false
    ) {
      setOpenSnackbar(true);
      setSnackbarMessage("Tolong lengkapi semua input");
      setSnackbarStatus(false);
    } else {
      const modifiedDataProduksis = handleModifyDataProduksi();
      const modifiedJadwalCetak = handleModifyJadwalCetak();
      axios({
        method: "POST",
        url: `http://localhost:3000/production/addKegiatanProduksiCetak/${userInformation?.data?.id}`,
        data: {
          personil: personil,
          dataProduksi: modifiedDataProduksis,
          jadwalCetak: modifiedJadwalCetak,
        },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan kegiatan produksi cetak");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menambahkan kegiatan produksi cetak"
          );
        }
      });
    }
  };

  const handleAddKegiatanProduksi = () => {
    const checkPersonil = checkPersonilIsEmpty();
    const checkDataProduksi = checkDataProduksiIsEmpty();
    const checkJadwalPracetak = checkJadwalPracetakIsEmpty();
    if (
      checkPersonil === false ||
      checkDataProduksi === false ||
      checkJadwalPracetak === false
    ) {
      setOpenSnackbar(true);
      setSnackbarMessage("Tolong lengkapi semua input");
      setSnackbarStatus(false);
    } else {
      const modifiedDataProduksis = handleModifyDataProduksi();
      const modifiedJadwalPracetak = handleModifyJadwalPracetak();
      axios({
        method: "POST",
        url: `http://localhost:3000/production/addKegiatanProduksi/${userInformation?.data?.id}`,
        data: {
          dataProduksi: modifiedDataProduksis,
          jadwalPracetak: modifiedJadwalPracetak,
          personil: personil,
        },
      }).then((result) => {
        if (result.status === 200) {
          setSuccessMessage("Berhasil menambahkan kegiatan produksi Pracetak");
          setSnackbarStatus(true);
          navigate(-1);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menambahkan kegiatan produksi pracetak"
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
      <div style={{ height: "100%", width: "100%" }}>
        <div style={{ margin: "32px" }}>
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Kegiatan Produksi
          </Typography>
        </div>
        <div
          style={{
            margin: "32px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "50%" }}>
            <Typography
              style={{
                color: "#0F607D",
                fontSize: "2vw",
                marginBottom: "16px",
              }}
            >
              Informasi Kegiatan Produksi
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{ width: "15vw", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Tanggal Produksi:
              </Typography>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DemoItem>
                      <DateTimePicker
                        disablePast
                        value={
                          dataProduksi.tanggalProduksi.isValid()
                            ? dataProduksi.tanggalProduksi
                            : null
                        }
                        maxDateTime={
                          tanggalPengiriman.isValid()
                            ? dayjs(tanggalPengiriman)
                            : undefined
                        }
                        onChange={(event) => {
                          handleChangeDataProduksi(event, "tanggalProduksi");
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
                {tanggalPengiriman.isValid() && (
                  <Typography style={{ marginTop: "8px" }}>
                    Tanggal pengiriman:
                    {dayjs(tanggalPengiriman).format("MM/DD/YYYY hh:mm A")}
                  </Typography>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "15vw", color: "#0F607D", fontSize: "1.5vw" }}
              >
                No Order Produksi:
              </Typography>
              <div>
                <MySelectTextField
                  value={dataProduksi.noOrderProduksi}
                  onChange={(event) => {
                    handleChangeDataProduksi(event, "noOrderProduksi");
                  }}
                  data={allProductionPlan}
                  width={"200px"}
                  disabled={isNewTahapProduksi?.status}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "15vw", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Jenis Cetakan:{" "}
              </Typography>
              <div>
                <TextField value={dataProduksi.jenisCetakan} disabled={true} />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "15vw", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Mesin:{" "}
              </Typography>
              <div>
                <TextField
                  value={dataProduksi.mesin}
                  onChange={(event) => {
                    handleChangeDataProduksi(event, "mesin");
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "16px 0px",
              }}
            >
              <Typography
                style={{ width: "15vw", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Dibuat Oleh:{" "}
              </Typography>
              <div>
                <TextField
                  value={dataProduksi.dibuatOleh}
                  onChange={(event) => {
                    handleChangeDataProduksi(event, "dibuatOleh");
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: "2vw",
                }}
              >
                Personil
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  handleAddPersonil();
                }}
              >
                Tambah Personil
              </DefaultButton>
            </div>
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table
                sx={{ minWidth: 650, overflowX: "auto", tableLayout: "fixed" }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell style={{ width: "25px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personil?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <TextField
                              value={result.nama}
                              onChange={(event) => {
                                handleChangeInputPersonil(event, index);
                              }}
                              style={{ width: "100%" }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                handleDeletePersonil(result?.id, index);
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
        </div>
        <div style={{ padding: "0px 32px 64px 32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
              Bahan
            </Typography>
            <DefaultButton
              onClickFunction={() => {
                handleAddBahan();
              }}
            >
              Tambah Bahan
            </DefaultButton>
          </div>
          <div>
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
                    <TableCell style={{ width: "200px" }}>Jenis</TableCell>
                    <TableCell style={{ width: "200px" }}>Kode</TableCell>
                    <TableCell style={{ width: "200px" }}>Berat Awal</TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Berat Akhir
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                    <TableCell style={{ width: "50px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataProduksi?.bahanProduksis?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <MySelectTextField
                              data={allInventoryItem}
                              value={result.jenis}
                              onChange={(event) => {
                                handleChangeDataProduksi(event, "jenis", index);
                              }}
                              width={"200px"}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField value={result.kode} disabled />
                          </TableCell>
                          <TableCell>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                value={result.beratAwal.value}
                                disabled
                                type="number"
                              />
                              <div style={{ marginLeft: "8px" }}>
                                <MySelectTextField
                                  disabled
                                  value={result.beratAwal.unit}
                                  data={units}
                                />
                              </div>
                            </div>
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
                                error={showError[index] || false}
                                value={result.beratAkhir.value}
                                onChange={(event) => {
                                  handleChangeDataProduksi(
                                    event,
                                    "beratAkhir",
                                    index
                                  );
                                }}
                              />
                              <div style={{ marginLeft: "8px" }}>
                                <MySelectTextField
                                  value={result.beratAkhir.unit}
                                  data={units}
                                  error={showError[index] || false}
                                  onChange={(event) => {
                                    handleChangeDataProduksi(
                                      event,
                                      "beratAkhir",
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
                                handleChangeDataProduksi(
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
                                handleDeleteBahan(result?.id, index);
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
        </div>
        {dataProduksi.tahapProduksi === "Produksi Pracetak" && (
          <div style={{ padding: "0px 32px 64px 32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Jadwal Produksi Pracetak
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  handleAddJawalProduksiPracetak();
                }}
              >
                Tambah Jadwal Produksi
              </DefaultButton>
            </div>
            <div>
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
                      <TableCell style={{ width: "300px" }}>
                        Jam Produksi Awal
                      </TableCell>
                      <TableCell style={{ width: "300px" }}>
                        Jam Produksi Akhir
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
                      <TableCell style={{ width: "200px" }}>Waste</TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Keterangan
                      </TableCell>
                      <TableCell style={{ width: "50px" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jadwalProduksiPracetak?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      maxDateTime={
                                        tanggalPengiriman.isValid()
                                          ? dayjs(tanggalPengiriman)
                                          : undefined
                                      }
                                      value={
                                        result?.jamAwalProduksi?.isValid()
                                          ? result.jamAwalProduksi
                                          : null
                                      }
                                      onChange={(event) => {
                                        handleChangeJadwalProduksiPracetak(
                                          event,
                                          index,
                                          "jamAwalProduksi"
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      maxDateTime={
                                        tanggalPengiriman.isValid()
                                          ? dayjs(tanggalPengiriman)
                                          : undefined
                                      }
                                      value={
                                        result.jamAkhirProduksi.isValid()
                                          ? result.jamAkhirProduksi
                                          : null
                                      }
                                      onChange={(event) => {
                                        handleChangeJadwalProduksiPracetak(
                                          event,
                                          index,
                                          "jamAkhirProduksi"
                                        );
                                      }}
                                      minDate={
                                        !result.jamAwalProduksi.isValid()
                                          ? undefined
                                          : result.jamAwalProduksi
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
                                disabled
                                data={allProductionPlan}
                                value={result.noOrderProduksi}
                                width="200px"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField value={result.jenisCetakan} disabled />
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
                                  value={result.perolehanCetakan.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiPracetak(
                                      event,
                                      index,
                                      "perolehanCetakan"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    value={result.perolehanCetakan.unit}
                                    data={units}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiPracetak(
                                        event,
                                        index,
                                        "perolehanCetakan",
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
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  type="number"
                                  value={result.waste.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiPracetak(
                                      event,
                                      index,
                                      "waste"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    key={"unit"}
                                    width={"60px"}
                                    value={result.waste.unit}
                                    data={units}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiPracetak(
                                        event,
                                        index,
                                        "waste",
                                        true
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <TextField
                                onChange={(event) => {
                                  handleChangeJadwalProduksiPracetak(
                                    event,
                                    index,
                                    "keterangan"
                                  );
                                }}
                                value={result.keterangan}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleDeleteDataJadwalProduksiPracetak(
                                    result?.id,
                                    index
                                  );
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
                  marginTop: "16px",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    laporanProduksiId !== undefined
                      ? handleEditKegiatanProduksi()
                      : handleAddKegiatanProduksi();
                  }}
                >
                  {laporanProduksiId !== undefined
                    ? "Edit Kegiatan Produksi Pracetak"
                    : "Tambah Kegiatan Produksi Pracetak"}
                </DefaultButton>
                <Button
                  color="error"
                  variant="outlined"
                  style={{ textTransform: "none", marginLeft: "8px" }}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        {dataProduksi.tahapProduksi === "Produksi Cetak" && (
          <div style={{ padding: "0px 32px 64px 32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Jadwal Produksi Cetak
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  handleAddJadwalProduksiCetak();
                }}
              >
                Tambah Jadwal Produksi
              </DefaultButton>
            </div>
            <div>
              <TableContainer component={Paper} style={{ overflowX: "auto" }}>
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
                      <TableCell style={{ width: "300px" }}>
                        Jam Produksi Awal
                      </TableCell>
                      <TableCell style={{ width: "300px" }}>
                        Jam Produksi Akhir
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
                        {"Sobek (Kg)"}
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        {"Kulit (Kg)"}
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        {"Gelondong (Kg)"}
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        {"Sampah (Kg)"}
                      </TableCell>
                      <TableCell style={{ width: "50px" }}>
                        Roll Habis
                      </TableCell>
                      <TableCell style={{ width: "50px" }}>Roll Sisa</TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Keterangan
                      </TableCell>
                      <TableCell style={{ width: "50px" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jadwalProduksiCetak?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      value={
                                        result.jamAwalProduksi.isValid()
                                          ? result.jamAwalProduksi
                                          : null
                                      }
                                      onChange={(event) => {
                                        handleChangeJadwalProduksiCetak(
                                          event,
                                          index,
                                          "jamAwalProduksi"
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      value={
                                        result.jamAkhirProduksi.isValid()
                                          ? result.jamAkhirProduksi
                                          : null
                                      }
                                      minDate={
                                        !result.jamAkhirProduksi.isValid()
                                          ? result.jamAwalProduksi
                                          : undefined
                                      }
                                      onChange={(event) => {
                                        handleChangeJadwalProduksiCetak(
                                          event,
                                          index,
                                          "jamAkhirProduksi"
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
                              <MySelectTextField
                                disabled
                                data={allProductionPlan}
                                value={result.noOrderProduksi}
                                width="200px"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField value={result.jenisCetakan} disabled />
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
                                  value={result.perolehanCetakan.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiCetak(
                                      event,
                                      index,
                                      "perolehanCetakan"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.perolehanCetakan.unit}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiCetak(
                                        event,
                                        index,
                                        "perolehanCetakan",
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
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  type="number"
                                  value={result.sobek.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiCetak(
                                      event,
                                      index,
                                      "sobek"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.sobek.unit}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiCetak(
                                        event,
                                        index,
                                        "sobek",
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
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  type="number"
                                  value={result.kulit.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiCetak(
                                      event,
                                      index,
                                      "kulit"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.kulit.unit}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiCetak(
                                        event,
                                        index,
                                        "kulit",
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
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  type="number"
                                  value={result.gelondong.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiCetak(
                                      event,
                                      index,
                                      "gelondong"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.gelondong.unit}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiCetak(
                                        event,
                                        index,
                                        "gelondong",
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
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  type="number"
                                  value={result.sampah.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiCetak(
                                      event,
                                      index,
                                      "sampah"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.sampah.unit}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiCetak(
                                        event,
                                        index,
                                        "sampah",
                                        true
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                sx={{ display: "block" }}
                                control={
                                  <Switch
                                    checked={result.rollHabis}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiCetak(
                                        event.target.checked,
                                        index,
                                        "rollHabis"
                                      );
                                    }}
                                  />
                                }
                                name="loading"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                sx={{ display: "block" }}
                                control={
                                  <Switch
                                    checked={result.rollSisa}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiCetak(
                                        event.target.checked,
                                        index,
                                        "rollSisa"
                                      );
                                    }}
                                  />
                                }
                                name="loading"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.keterangan}
                                onChange={(event) => {
                                  handleChangeJadwalProduksiCetak(
                                    event,
                                    index,
                                    "keterangan"
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleDeleteDataJadwalProduksiCetak(
                                    result?.id,
                                    index
                                  );
                                }}
                              >
                                <DeleteIcon sx={{ color: "red" }} />
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
                  marginTop: "16px",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                {laporanProduksiId !== undefined && (
                  <DefaultButton
                    onClickFunction={() => {
                      handleSelesaiKegiatanProduksi(dataProduksi?.id);
                    }}
                  >
                    Kegiatan Produksi Selesai
                  </DefaultButton>
                )}
                <div
                  style={{
                    marginLeft: laporanProduksiId !== undefined ? "8px" : "",
                  }}
                >
                  <DefaultButton
                    onClickFunction={() => {
                      laporanProduksiId !== undefined
                        ? handleEditKegiatanProduksiCetak()
                        : handleAddKegiatanProduksiCetak();
                    }}
                  >
                    {laporanProduksiId !== undefined
                      ? "Edit Kegiatan Produksi Cetak"
                      : "Tambah Kegiatan Produksi Cetak"}
                  </DefaultButton>
                </div>
                <Button
                  color="error"
                  variant="outlined"
                  style={{ textTransform: "none", marginLeft: "8px" }}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
        {dataProduksi.tahapProduksi === "Produksi Fitur" && (
          <div style={{ padding: "0px 32px 64px 32px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Jadwal Produksi Fitur
              </Typography>
              <DefaultButton
                onClickFunction={() => {
                  handleAddJadwalProduksiFitur();
                }}
              >
                Tambah Jadwal Produksi
              </DefaultButton>
            </div>
            <div>
              <TableContainer component={Paper} style={{ overflowX: "auto" }}>
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
                      <TableCell style={{ width: "300px" }}>
                        Jam Produksi Awal
                      </TableCell>
                      <TableCell style={{ width: "300px" }}>
                        Jam Produksi Akhir
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
                      <TableCell style={{ width: "200px" }}>Waste</TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Keterangan
                      </TableCell>
                      <TableCell style={{ width: "50px" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jadwalProduksiFitur?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      value={
                                        result.jamAwalProduksi.isValid()
                                          ? result.jamAwalProduksi
                                          : null
                                      }
                                      onChange={(event) => {
                                        handleChangeJadwalProduksiFitur(
                                          event,
                                          index,
                                          "jamAwalProduksi"
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
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DateTimePicker"]}>
                                  <DemoItem>
                                    <DateTimePicker
                                      disablePast
                                      value={
                                        result.jamAkhirProduksi.isValid()
                                          ? result.jamAkhirProduksi
                                          : null
                                      }
                                      minDate={
                                        !result.jamAwalProduksi.isValid()
                                          ? undefined
                                          : result.jamAwalProduksi
                                      }
                                      onChange={(event) => {
                                        handleChangeJadwalProduksiFitur(
                                          event,
                                          index,
                                          "jamAkhirProduksi"
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
                              <MySelectTextField
                                data={allProductionPlan}
                                value={result.noOrderProduksi}
                                disabled
                                width="200px"
                              />
                            </TableCell>
                            <TableCell>
                              <TextField value={result.jenisCetakan} disabled />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.nomoratorAwal}
                                onChange={(event) => {
                                  handleChangeJadwalProduksiFitur(
                                    event,
                                    index,
                                    "nomoratorAwal"
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.nomoratorAkhir}
                                onChange={(event) => {
                                  handleChangeJadwalProduksiFitur(
                                    event,
                                    index,
                                    "nomoratorAkhir"
                                  );
                                }}
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
                                  value={result.perolehanCetakan.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiFitur(
                                      event,
                                      index,
                                      "perolehanCetakan"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.perolehanCetakan.unit}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiFitur(
                                        event,
                                        index,
                                        "perolehanCetakan",
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
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  type="number"
                                  value={result.waste.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiFitur(
                                      event,
                                      index,
                                      "waste"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.waste.unit}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiFitur(
                                        event,
                                        index,
                                        "waste",
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
                                  handleChangeJadwalProduksiFitur(
                                    event,
                                    index,
                                    "keterangan"
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  handleDeleteDataJadwalProduksiFitur(
                                    result?.id,
                                    index
                                  );
                                }}
                              >
                                <DeleteIcon sx={{ color: "red" }} />
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
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                {laporanProduksiId !== undefined && (
                  <DefaultButton
                    onClickFunction={() => {
                      handleSelesaiKegiatanProduksi(dataProduksi?.id);
                    }}
                  >
                    Kegiatan Produksi Selesai
                  </DefaultButton>
                )}
                <DefaultButton
                  onClickFunction={() => {
                    laporanProduksiId !== undefined
                      ? handleEditKegiatanProduksiFitur()
                      : handleAddKegiatanProduksiFitur();
                  }}
                >
                  {laporanProduksiId !== undefined
                    ? "Edit kegiatan produksi fitur"
                    : "Tambah kegiatan produksi fitur"}
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
          </div>
        )}
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

export default KegiatanProduksi;
