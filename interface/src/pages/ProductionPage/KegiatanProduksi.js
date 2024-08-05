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
  const { laporanProduksiId } = location.state || "";

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
      jenisBahanKertas: "",
      jenisKodeRollBahanKertas: "",
      beratBahanKertas: { value: "", unit: "'" },
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

  const [showError, setShowError] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
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
      axios({
        method: "GET",
        url: `http://localhost:3000/production/getOneProductionData/${laporanProduksiId}`,
      }).then((result) => {
        if (result.status === 200) {
          setPersonil(result.data.personils);
          setDataProduksi({
            tanggalProduksi: dayjs(result.data.tanggalProduksi),
            noOrderProduksi: result.data.noOrderProduksi,
            jenisCetakan: result.data.jenisCetakan,
            mesin: result.data.mesin,
            dibuatOleh: result.data.dibuatOleh,
            tahapProduksi: result.data.tahapProduksi || "Produksi Pracetak",
            bahanProduksis: result.data.bahanLaporanProdukses.map((item) => ({
              jenis: item.jenis,
              kode: item.kode,
              beratAwal: separateValueAndUnit(item.beratAwal),
              beratAkhir: separateValueAndUnit(item.beratAkhir),
              keterangan: item.keterangan,
            })),
          });
          const data = result.data.jadwalProdukses.map((item) => {
            return {
              jamAwalProduksi: dayjs(item.jamAwalProduksi),
              jamAkhirProduksi: dayjs(item.jamAkhirProduksi),
              noOrderProduksi: item.noOrderProduksi,
              jenisCetakan: item.jenisCetakan,
              perolehanCetakan: separateValueAndUnit(item.perolehanCetak),
              waste: separateValueAndUnit(item.waste),
              keterangan: item.keterangan,
            };
          });
          setJadwalProduksiPracetak(data);
        } else {
          setOpenSnackbar(true);
          setSnackbarMessage(
            `Tidak berhasil memanggil data kegiatan produksi dengan id ${laporanProduksiId}`
          );
          setSnackbarStatus(false);
        }
      });
    }
  }, []);

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
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    handleAddKegiatanProduksi();
                  }}
                >
                  Tambah Kegiatan Produksi Pracetak
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
                        Jenis Bahan Kertas
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Kode Roll Bahan Kertas
                      </TableCell>
                      <TableCell style={{ width: "200px" }}>
                        Berat Bahan Kertas
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
                              <MySelectTextField width="200px" />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={result.jenisKodeRollBahanKertas}
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
                                  value={result.beratBahanKertas.value}
                                  onChange={(event) => {
                                    handleChangeJadwalProduksiCetak(
                                      event,
                                      index,
                                      "beratBahanKertas"
                                    );
                                  }}
                                />
                                <div style={{ marginLeft: "8px" }}>
                                  <MySelectTextField
                                    data={units}
                                    value={result.beratBahanKertas.unit}
                                    onChange={(event) => {
                                      handleChangeJadwalProduksiCetak(
                                        event,
                                        index,
                                        "beratBahanKertas",
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
                                    value={result.waste.value}
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
