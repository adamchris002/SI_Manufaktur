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

  const [dataPembayaranLainLain, setDataPembayaranLainLain] = useState([
    {
      tanggal: dayjs(""),
      uraian: "",
      noInvoiceKwitansiSj: "",
      jumlahHarga: "",
      tanggalJatuhTempo: dayjs(""),
      pembayaran: "",
      keterangan: "",
    },
  ]);

  const [dataInfoPembayaran, setDataInfoPembayaran] = useState({});
  const [historyRencanaPembayaran, setRencanaPembayaran] = useState([]);
  const [allDataPembelianBahanBaku, setAllDataPembelianBahanBaku] = useState(
    []
  );
  const [allDataRencanaPembayaran, setAllDataRencanaPembayaran] = useState([]);
  const [selectedPembelianBahanBakuId, setSelectedPembelianBahanBakuId] =
    useState("");
  const [ongoingHutangsAndCicilans, setOngoingHutangsAndCicilans] = useState(
    []
  );
  const [ongoingPembayaranLainLain, setongoingPembayaranLainLain] = useState(
    []
  );
  const [listBank, setListBank] = useState([]);
  const [viewDataHutang, setViewDataHutang] = useState([]);
  const [viewDataPembayaranLain, setViewDataPembayaranLain] = useState([]);
  const [openSnackbar, setOpenSnackBar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalPembayaranLainLain, setOpenModalPembayaranLainLain] =
    useState(false);
  const [refreshRencanaPembayaran, setRefreshRencanaPembayaran] =
    useState(true);
  const [triggerCheckRencanaPembayaran, setTriggerCheckRencanaPembayaran] =
    useState(false);
  const [openModalView, setOpenModalView] = useState(false);
  const [openModalViewPembelianlain, setOpenModalViewPembelianlain] =
    useState(false);

  const keterangan = [{ value: "Lunas" }, { value: "Belum Lunas" }];
  const pembayaran = [{ value: "Hutang" }, { value: "Piutang" }];
  const kaliPembayaran = [
    { value: 2 },
    { value: 4 },
    { value: 8 },
    { value: 12 },
  ];
  const tanggal = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: 10 },
    { value: 11 },
    { value: 12 },
    { value: 13 },
    { value: 14 },
    { value: 15 },
    { value: 16 },
    { value: 17 },
    { value: 18 },
    { value: 19 },
    { value: 20 },
    { value: 21 },
    { value: 22 },
    { value: 23 },
    { value: 24 },
    { value: 25 },
    { value: 26 },
    { value: 27 },
    { value: 28 },
    { value: 29 },
    { value: 30 },
    { value: 31 },
  ];

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3000/finance/getDoneRencanaPembayaran/${userInformation?.data?.id}`,
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
    if (refreshRencanaPembayaran === true) {
      axios({
        method: "GET",
        url: `http://localhost:3000/finance/getAllOngoingRencanaPembayaran/${userInformation?.data?.id}`,
      }).then((result) => {
        if (result.status === 200) {
          setAllDataRencanaPembayaran(result.data);
          setRefreshRencanaPembayaran(false);
          setTriggerCheckRencanaPembayaran(true);
        } else {
          setOpenSnackBar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil memanggil data rencana pembayaran"
          );
        }
      });
    }
  }, [refreshRencanaPembayaran]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3000/finance/findPrevOngoingHutangs/${userInformation?.data?.id}`,
    }).then((result) => {
      if (result.status === 200) {
        // const resultIds = result.data.map((item) => item.id);
        const existingIds =
          allDataRencanaPembayaran[0]?.itemRencanaPembayarans?.map(
            (item) => item.id
          ) || [];

        const itemsToAdd = result.data.filter(
          (item) => !existingIds.includes(item.id)
        );

        setOngoingHutangsAndCicilans(itemsToAdd);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data pembayaran lain-lain dari bulan sebelumnya"
        );
      }
    });
  }, [allDataRencanaPembayaran]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3000/finance/findPrevOngoingPembayaranLainLain/${userInformation?.data?.id}`,
    }).then((result) => {
      if (result.status === 200) {
        const existingIds =
          allDataRencanaPembayaran[0]?.itemRencanaPembayarans.map(
            (item) => item.id
          ) || [];

        const itemsToAdd = result.data.filter(
          (item) => !existingIds.includes(item.id)
        );

        setongoingPembayaranLainLain(itemsToAdd);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data hutang dari bulan sebelumnya"
        );
      }
    });
  }, [allDataRencanaPembayaran]);

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3000/finance/getPembelianBahanbakuForHutang/${userInformation?.data?.id}`,
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
      url: `http://localhost:3000/finance/checkIfRencanaPembayaranExists/${userInformation?.data?.id}`,
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

  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:3000/finance/getOngoingBukuBank/${userInformation?.data?.id}`,
    }).then((result) => {
      if (result.status === 200) {
        const tempData = result.data.map((result) => {
          return { ...result, value: result.namaBank };
        });
        setListBank(tempData);
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          "Tidak berhasil memanggil data buku bank untuk pembayaran"
        );
      }
    });
  }, []);

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

  const handleEditCicilan = () => {
    setRefreshRencanaPembayaran(false);
    axios({
      method: "PUT",
      url: `http://localhost:3000/finance/updateCicilan/${userInformation?.data?.id}`,
      data: { dataCicilan: viewDataHutang },
    }).then((result) => {
      if (result.status === 200) {
        handleCloseModalView();
        setRefreshRencanaPembayaran(true);
        setOpenSnackBar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil mengedit cicilan");
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil mengedit cicilan");
      }
    });
  };

  const handleEditCicilanPemLains = () => {
    setRefreshRencanaPembayaran(false);
    axios({
      method: "PUT",
      url: `http://localhost:3000/finance/updateCicilanPemLains/${userInformation?.data?.id}`,
      data: {
        dataCicilanPemLains: viewDataPembayaranLain,
      },
    }).then((result) => {
      if (result.status === 200) {
        handleCloseModalViewPembayaranLainLain();
        setRefreshRencanaPembayaran(true);
        setOpenSnackBar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil mengedit cicilan");
      } else {
        setOpenSnackBar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil mengedit cicilan");
      }
    });
  };

  const handleChangeDataInformasiPembayaran = (event) => {
    const value = event.target.value;

    const selectedBukuBank = listBank.find((item) => item.namaBank === value);

    setDataInfoPembayaran(selectedBukuBank);
  };

  const handleChangeInputCicilan = (event, index, indexCicilan) => {
    const value = event.target.value;

    setViewDataHutang((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        if (i === index) {
          const updatedCicilans = item.cicilans.map((data, cicilanIndex) => {
            if (cicilanIndex === indexCicilan) {
              return { ...data, statusCicilan: value };
            }
            return data;
          });

          return { ...item, cicilans: updatedCicilans };
        }
        return item;
      });

      return updatedItems;
    });
  };

  const handleChangeInputCicilanPembayaranLains = (
    event,
    index,
    indexCicilan
  ) => {
    const value = event.target.value;

    setViewDataPembayaranLain((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        if (i === index) {
          const updatedCicilans = item.cicilanPemLains.map(
            (data, cicilanIndex) => {
              if (cicilanIndex === indexCicilan) {
                if (!data.statusCicilan) {
                  return { ...data, statusCi: value };
                } else {
                  return { ...data, statusCicilan: value };
                }
              }
              return data;
            }
          );
          return { ...item, cicilanPemLains: updatedCicilans };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleChangeInputDataPembelianLainLain = (event, index, field) => {
    const value = event && event.target ? event.target.value : event;
    setDataPembayaranLainLain((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        let updatedItem = { ...item };
        if (i === index) {
          updatedItem = { ...updatedItem, [field]: value };
          if (field === "kaliPembayaran") {
            if (
              updatedItem?.tanggalJatuhTempoPembayaran === "" ||
              !updatedItem.tanggalJatuhTempoPembayaran
            ) {
              setOpenSnackBar(true);
              setSnackbarStatus(false);
              setSnackbarMessage(
                "Mohon isi tanggal jatuh tempo pembayaran terlebih dahulu"
              );
              return item;
            } else if (
              updatedItem.jumlahHarga === "" ||
              !updatedItem.jumlahHarga
            ) {
              setOpenSnackBar(true);
              setSnackbarStatus(false);
              setSnackbarMessage("Mohon isi jumlah harga terlebih dahulu");
              return item;
            } else {
              let dataCicilan = [];
              const jumlahPerBulan =
                parseFloat(updatedItem.jumlahHarga) / value;
              const tanggalAwal = dayjs(updatedItem.createdAt);
              const month = tanggalAwal.month();
              const year = tanggalAwal.year();

              const startDate = dayjs(
                `${month}/${updatedItem.tanggalJatuhTempoPembayaran}/${year}`
              );
              for (let i = 0; i < value; i++) {
                let newDataCicilan = {
                  jumlah: jumlahPerBulan,
                  tanggal: dayjs(startDate).add(i, "month"),
                };
                dataCicilan = [...dataCicilan, newDataCicilan];
              }
              updatedItem = { ...updatedItem, cicilan: dataCicilan };
            }
          }
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleChangeInputDataHutang = (event, index, field) => {
    const value = event.target.value;
    setDataHutang((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        let updatedItem = { ...item };
        if (i === index) {
          updatedItem = { ...updatedItem, [field]: value };
          if (field === "kaliPembayaran") {
            if (
              updatedItem?.tanggalJatuhTempoPembayaran === "" ||
              !updatedItem.tanggalJatuhTempoPembayaran
            ) {
              setOpenSnackBar(true);
              setSnackbarStatus(false);
              setSnackbarMessage(
                "Mohon isi tanggal jatuh tempo pembayaran terlebih dahulu"
              );
              return item;
            } else {
              let dataCicilan = [];
              const jumlahPerBulan =
                parseFloat(updatedItem.jumlahHarga) / value;
              const tanggalAwal = dayjs(updatedItem.createdAt);
              const month = tanggalAwal.month();
              const year = tanggalAwal.year();

              const startDate = dayjs(
                `${month}/${updatedItem.tanggalJatuhTempoPembayaran}/${year}`
              );
              for (let i = 0; i < value; i++) {
                let newDataCicilan = {
                  jumlah: jumlahPerBulan,
                  tanggal: dayjs(startDate).add(i, "month"),
                };
                dataCicilan = [...dataCicilan, newDataCicilan];
              }
              updatedItem = { ...updatedItem, cicilan: dataCicilan };
            }
          }
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleCheckIfNamaBankIsEmpty = () => {
    if (
      Object.keys(dataInfoPembayaran).length === 0 &&
      dataInfoPembayaran.constructor === Object
    ) {
      return false;
    }
    return true;
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

  const handleCloseModalPembayaranLainLain = () => {
    setOpenModalPembayaranLainLain(false);
  };

  const handleCloseModalViewPembayaranLainLain = () => {
    setOpenModalViewPembelianlain(false);
  };

  const handleViewHutangPrev = (id) => {
    let prevItemRencanaPembayaran = ongoingHutangsAndCicilans.find(
      (item) => item.id === id
    );
    setViewDataHutang(prevItemRencanaPembayaran.hutangs);
    setOpenModalView(true);
  };

  const handleViewPembayaranLainsPrev = (id) => {
    let prevItemPembayaranLainLain = ongoingPembayaranLainLain.find(
      (item) => item.id === id
    );
    setViewDataPembayaranLain(prevItemPembayaranLainLain.pembayaranLains);
    setOpenModalViewPembelianlain(true);
  };

  const handleViewHutang = (id) => {
    let itemRencanaPembayaran = allDataRencanaPembayaran
      ?.map((item) => {
        return item?.itemRencanaPembayarans?.find((data) => data.id === id);
      })
      .filter(Boolean);

    setOpenModalView(true);
    setViewDataHutang(itemRencanaPembayaran[0].hutangs);
  };

  const handleViewPembayaranLainLain = (id) => {
    let itemRencanaPembayaran = allDataRencanaPembayaran
      ?.map((item) => {
        return item?.itemRencanaPembayarans?.find((data) => data.id === id);
      })
      .filter(Boolean);

    setOpenModalViewPembelianlain(true);
    setViewDataPembayaranLain(itemRencanaPembayaran[0].pembayaranLains);
  };

  const handleCheckifDataPembayaranLainLainIsEmpty = () => {
    for (const item of dataPembayaranLainLain) {
      if (
        !item.tanggal ||
        !dayjs(item.tanggal, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.uraian ||
        !item.noInvoiceKwitansiSj ||
        !item.jumlahHarga ||
        !item.tanggalJatuhTempo ||
        !dayjs(item.tanggalJatuhTempo, "MM/DD/YYYY hh:mm A", true).isValid() ||
        !item.pembayaran ||
        !item.keterangan
      ) {
        return false;
      }
    }
    return true;
  };

  const handleAddPembayaranLainLain = () => {
    setRefreshRencanaPembayaran(false);
    const checkIfDataPembayaranLainLainEmpty =
      handleCheckifDataPembayaranLainLainIsEmpty();
    const checkIfDataBankIsEmpty = handleCheckIfNamaBankIsEmpty();

    if (
      checkIfDataPembayaranLainLainEmpty === false ||
      checkIfDataBankIsEmpty === false
    ) {
      setOpenSnackBar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Mohon isi semua input");
    } else {
      axios({
        method: "POST",
        url: `http://localhost:3000/finance/addPembayaranLainLain/${userInformation?.data?.id}`,
        data: {
          dataPembayaranLainLain: dataPembayaranLainLain,
          dataBank: dataInfoPembayaran,
        },
      }).then((result) => {
        if (result.status === 200) {
          handleCloseModalPembayaranLainLain();
          setRefreshRencanaPembayaran(true);
          setDataInfoPembayaran({});
        } else {
          setOpenSnackBar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil menambahkan data pembayaran lain-lain"
          );
        }
      });
    }
  };

  const handleAddHutang = () => {
    setRefreshRencanaPembayaran(false);
    const checkIfDataHutangEmpty = handleCheckIfDataHutangIsEmpty();
    const checkIfDataBankIsEmpty = handleCheckIfNamaBankIsEmpty();

    if (checkIfDataHutangEmpty === false || checkIfDataBankIsEmpty === false) {
      setOpenSnackBar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Mohon isi semua input");
    } else {
      axios({
        method: "POST",
        url: `http://localhost:3000/finance/addHutang/${userInformation?.data?.id}`,
        data: {
          dataHutang: dataHutang,
          dataBank: dataInfoPembayaran,
          pembelianBahanBakuId: selectedPembelianBahanBakuId,
        },
      }).then((result) => {
        if (result.status === 200) {
          handleCloseModal();
          setRefreshRencanaPembayaran(true);
          setSelectedPembelianBahanBakuId("");
          setDataInfoPembayaran({});
        } else {
          setOpenSnackBar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menambahkan data hutang");
        }
      });
    }
  };

  const handleTambahItemDataPembayaranLainLain = () => {
    setDataPembayaranLainLain((oldArray) => [
      ...oldArray,
      {
        tanggal: dayjs(""),
        uraian: "",
        noInvoiceKwitansiSj: "",
        jumlahHarga: "",
        tanggalJatuhTempo: dayjs(""),
        pembayaran: "",
        keterangan: "",
      },
    ]);
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
            <Typography
              style={{ color: "#0F607D", fontSize: isMobile ? "4vw" : "3vw" }}
            >
              Rencana Pembayaran
            </Typography>
            {(userInformation?.data?.role === "Admin" ||
              userInformation?.data?.role === "Super Admin" ||
              userInformation?.data?.role === "Owner") && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <DefaultButton
                  height={isMobile ? "" : "2.08vw"}
                  width={isMobile ? "" : "15vw"}
                  borderRadius="0.83vw"
                  fontSize={isMobile ? "10px" : "0.8vw"}
                  onClickFunction={() => {
                    setOpenModalPembayaranLainLain(true);
                  }}
                >
                  Tambah Pembayaran Lain-Lain
                </DefaultButton>
                <div style={{ marginLeft: "8px" }}>
                  <DefaultButton
                    height={isMobile ? "" : "2.08vw"}
                    width={isMobile ? "" : "15vw"}
                    borderRadius="0.83vw"
                    fontSize={isMobile ? "10px" : "1vw"}
                    onClickFunction={() => {
                      setOpenModal(true);
                    }}
                  >
                    Tambah Hutang
                  </DefaultButton>
                </div>
              </div>
            )}
          </div>
          <div
            style={{
              marginBottom:
                ongoingHutangsAndCicilans.length !== 0 ? "64px" : "",
              display: isMobile ? "" : "flex",
              justifyContent: isMobile ? "" : "space-between",
            }}
          >
            {ongoingHutangsAndCicilans.length !== 0 && (
              <div style={{ width: isMobile ? "100%" : "48%" }}>
                <Typography style={{color: "#0F607D"}}>Data Hutang dari bulan sebelum</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Uraian</TableCell>
                        <TableCell>Tanggal Jatuh Tempo</TableCell>
                        <TableCell>Nominal</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ongoingHutangsAndCicilans.length !== 0 && (
                        <React.Fragment>
                          {ongoingHutangsAndCicilans.map(
                            (data, indexOngoing) => {
                              return (
                                <TableRow key={indexOngoing}>
                                  <TableCell>{data.uraian}</TableCell>
                                  <TableCell>
                                    {data.tanggalJatuhTempo}
                                  </TableCell>
                                  <TableCell>{`Rp. ${data.nominal
                                    .toString()
                                    .replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      "."
                                    )},-`}</TableCell>
                                  <TableCell>
                                    <IconButton
                                      onClick={() => {
                                        handleViewHutangPrev(data.id);
                                      }}
                                    >
                                      <VisibilityIcon
                                        sx={{ color: "#0F607D" }}
                                      />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </React.Fragment>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
            {ongoingPembayaranLainLain.length !== 0 && (
              <div style={{ width: isMobile ? "100%" : "48%", marginTop: isMobile ? "16px" : "" }}>
                <Typography style={{color: "#0F607D"}}>
                  Data pembayaran lain-lain dari bulan sebelum
                </Typography>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Uraian</TableCell>
                        <TableCell>Tanggal Jatuh Tempo</TableCell>
                        <TableCell>Nominal</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ongoingPembayaranLainLain.length !== 0 && (
                        <React.Fragment>
                          {ongoingPembayaranLainLain.map(
                            (data, indexOngoing) => {
                              return (
                                <TableRow key={indexOngoing}>
                                  <TableCell>{data.uraian}</TableCell>
                                  <TableCell>
                                    {dayjs(data.tanggalJatuhTempo).format(
                                      "MM/DD/YYYY hh:mm A"
                                    )}
                                  </TableCell>
                                  <TableCell>{`Rp. ${data.nominal
                                    .toString()
                                    .replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      "."
                                    )},-`}</TableCell>
                                  <TableCell>
                                    <IconButton
                                      onClick={() => {
                                        handleViewPembayaranLainsPrev(data.id);
                                      }}
                                    >
                                      <VisibilityIcon
                                        style={{ color: "#0F607D" }}
                                      />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        </React.Fragment>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
          {allDataRencanaPembayaran[0]?.itemRencanaPembayarans?.some(
            (item) => item.pembayaranLains.length > 0
          ) ? (
            <>
              <Typography
                style={{ color: "#0F607D", fontSize: isMobile ? "4vw" : "2vw" }}
              >
                Pembayaran Lain-Lain
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ overflowX: "auto", marginBottom: "32px" }}
              >
                <Table
                  aria-label="simple table"
                  sx={{
                    overflowX: "auto",
                    tableLayout: "fixed",
                    minWidth: 650,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "25px" }}>No.</TableCell>
                      <TableCell>Uraian</TableCell>
                      <TableCell>Tanggal Jatuh Tempo</TableCell>
                      <TableCell>Nominal</TableCell>
                      {/* <TableCell>Keterangan</TableCell> */}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allDataRencanaPembayaran[0]?.itemRencanaPembayarans
                      ?.filter((item) => item.pembayaranLains.length > 0)
                      ?.map((result, index) => {
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
                              {/* <TableCell>{result.keterangan}</TableCell> */}
                              <TableCell>
                                <IconButton
                                  onClick={() => {
                                    handleViewPembayaranLainLain(result.id);
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
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "3.5vw" : "2vw",
                }}
              >
                Belum ada data pembayaran lain-lain
              </Typography>
            </div>
          )}

          {allDataRencanaPembayaran[0]?.itemRencanaPembayarans?.some(
            (item) => item.hutangs.length > 0
          ) ? (
            <>
              <Typography
                style={{ color: "#0F607D", fontSize: isMobile ? "4vw" : "2vw" }}
              >
                Hutang
              </Typography>
              <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
                <Table
                  aria-label="simple table"
                  sx={{
                    overflowX: "auto",
                    tableLayout: "fixed",
                    minWidth: 650,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "25px" }}>No.</TableCell>
                      <TableCell>Uraian</TableCell>
                      <TableCell>Tanggal Jatuh Tempo</TableCell>
                      <TableCell>Nominal</TableCell>
                      {/* <TableCell>Keterangan</TableCell> */}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allDataRencanaPembayaran[0]?.itemRencanaPembayarans
                      ?.filter((item) => item.hutangs.length > 0)
                      ?.map((result, index) => {
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
                              {/* <TableCell>{result.keterangan}</TableCell> */}
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
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "64px",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "3.5vw" : "2vw",
                }}
              >
                Belum ada data pembayaran hutang
              </Typography>
            </div>
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
              padding: isMobile ? "" : "32px",
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
              <Typography
                style={{ color: "#0F607D", fontSize: isMobile ? "6vw" : "3vw" }}
              >
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
                <Typography
                  style={{
                    color: "#0F607D",
                    fontSize: isMobile ? "3.5vw" : "2vw",
                  }}
                >
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
                      {dataHutang.some(
                        (item) => item.keterangan === "Belum Lunas"
                      ) && (
                        <>
                          <TableCell style={{ width: "200px" }}>
                            Tanggal Jatuh Tempo Pembayaran
                          </TableCell>
                          <TableCell style={{ width: "100px" }}>
                            X Pembayaran
                          </TableCell>
                        </>
                      )}
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
                                    height: isMobile ? "50px" : "3vw",
                                    width: "200px",
                                    fontSize: isMobile ? "14px" : "1.5vw",
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
                            {result.keterangan === "Belum Lunas" ? (
                              <>
                                <TableCell>
                                  <MySelectTextField
                                    value={result?.tanggalJatuhTempoPembayaran}
                                    width={"200px"}
                                    data={tanggal}
                                    onChange={(event) => {
                                      handleChangeInputDataHutang(
                                        event,
                                        index,
                                        "tanggalJatuhTempoPembayaran"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <MySelectTextField
                                    value={result?.kaliPembayaran}
                                    width={"100px"}
                                    data={kaliPembayaran}
                                    onChange={(event) => {
                                      handleChangeInputDataHutang(
                                        event,
                                        index,
                                        "kaliPembayaran"
                                      );
                                    }}
                                  />
                                </TableCell>
                              </>
                            ) : (
                              ""
                            )}
                            <TableCell>
                              <IconButton>
                                <DeleteIcon style={{ color: "red" }} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div style={{ minWidth: "1909px" }}></div>
                            <div>
                              {result?.cicilan && (
                                <Table
                                  sx={{
                                    minWidth: 650,
                                    tableLayout: "fixed",
                                    overflowX: "auto",
                                  }}
                                >
                                  <TableHead>
                                    <TableRow>
                                      <TableCell style={{ width: "25px" }}>
                                        No.
                                      </TableCell>
                                      <TableCell style={{ width: "200px" }}>
                                        Jumlah Pembayaran Per Bulan
                                      </TableCell>
                                      <TableCell style={{ width: "200px" }}>
                                        Tanggal Pembayaran
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {result.cicilan.map(
                                      (cicilan, cicilanIndex) => (
                                        <React.Fragment key={cicilanIndex}>
                                          <TableRow>
                                            <TableCell>
                                              {cicilanIndex + 1 + "."}
                                            </TableCell>
                                            <TableCell>{`Rp. ${cicilan.jumlah
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                "."
                                              )},-`}</TableCell>
                                            <TableCell>
                                              {dayjs(cicilan.tanggal).format(
                                                "MM/DD/YYYY"
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {selectedPembelianBahanBakuId !== "" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "32px",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography style={{ fontSize: isMobile ? "4vw" : "1.5vw", color: "#0F607D" }}>
                    No Rekening:
                  </Typography>
                  <div style={{ marginLeft: "8px" }}>
                    <MySelectTextField
                      value={dataInfoPembayaran.namaBank}
                      onChange={(event) => {
                        handleChangeDataInformasiPembayaran(event);
                      }}
                      data={listBank}
                      width="150px"
                    />
                  </div>
                </div>
                <div>
                  {Object.keys(dataInfoPembayaran).length !== 0 &&
                    dataInfoPembayaran.constructor === Object && (
                      <Typography
                        style={{
                          fontSize: isMobile ? "4vw" : "1.5vw",
                          color: "#0F607D",
                          marginTop: "16px",
                        }}
                      >
                        Nama Bank: {dataInfoPembayaran.namaBank}
                      </Typography>
                    )}
                </div>
              </div>
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
                  handleCloseModal();
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
      {openModalViewPembelianlain === true && (
        <MyModal
          open={openModalViewPembelianlain}
          handleClose={handleCloseModalViewPembayaranLainLain}
        >
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "50vw",
              maxHeight: "80vh",
              padding: isMobile ? "" : "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "5vw" : "3vw",
                  marginBottom: "16px",
                }}
              >
                Data Pembayaran Lain-Lain
              </Typography>
              <IconButton
                onClick={() => {
                  handleCloseModalViewPembayaranLainLain();
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
                    <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                    <TableCell style={{ width: "200px" }}>
                      No Invoice/ Kwitansi/ SJ
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Jumlah Harga
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Tanggal Jatuh Tempo
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>Pembayaran</TableCell>
                    <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewDataPembayaranLain.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            {dayjs(result.tanggal).format("MM/DD/YYYY hh:mm A")}
                          </TableCell>
                          <TableCell>{result.uraian}</TableCell>
                          <TableCell>{result.noInvoiceKwitansiJs}</TableCell>
                          <TableCell>{result.jumlahHarga}</TableCell>
                          <TableCell>
                            {dayjs(result.tanggalJatuhTempo).format(
                              "MM/DD/YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>{result.pembayaran}</TableCell>
                          <TableCell>{result.keterangan}</TableCell>
                        </TableRow>
                        {result.keterangan === "Belum Lunas" && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                minWidth: "928px",
                                backgroundColor: "#d3f8fd",
                              }}
                            ></div>
                            {result.cicilanPemLains.length !== 0 && (
                              <Table
                                sx={{
                                  minWidth: 650,
                                  tableLayout: "fixed",
                                  overflowX: "auto",
                                }}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        width: "25px",
                                        backgroundColor: "#d3f8fd",
                                      }}
                                    >
                                      No.
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        width: "200px",
                                        backgroundColor: "#d3f8fd",
                                      }}
                                    >
                                      Jumlah Pembayaran Per Bulan
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        width: "200px",
                                        backgroundColor: "#d3f8fd",
                                      }}
                                    >
                                      Tanggal Pembayaran
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        width: "200px",
                                        backgroundColor: "#d3f8fd",
                                      }}
                                    >
                                      Status Cicilan
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {result.cicilanPemLains.map(
                                    (cicilan, cicilanIndex) => (
                                      <React.Fragment key={cicilanIndex}>
                                        <TableRow>
                                          <TableCell
                                            style={{
                                              backgroundColor: "#d3f8fd",
                                            }}
                                          >
                                            {cicilanIndex + 1 + "."}
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              backgroundColor: "#d3f8fd",
                                            }}
                                          >
                                            {!cicilan.jumlahHa
                                              ? `Rp. ${cicilan.jumlahHarga
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    "."
                                                  )},-`
                                              : `Rp. ${cicilan.jumlahHa
                                                  .toString()
                                                  .replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    "."
                                                  )},-`}
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              backgroundColor: "#d3f8fd",
                                            }}
                                          >
                                            {!cicilan.tanggalJ ||
                                            !dayjs(
                                              cicilan.tanggalJ,
                                              "MM/DD/YYYY hh:mm A",
                                              true
                                            ).isValid()
                                              ? dayjs(
                                                  cicilan.tanggalJatuhTempo
                                                ).format("MM/DD/YYYY")
                                              : dayjs(cicilan.tanggalJa).format(
                                                  "MM/DD/YYYY"
                                                )}
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              backgroundColor: "#d3f8fd",
                                            }}
                                          >
                                            <MySelectTextField
                                              disabled={
                                                userInformation?.data?.role ===
                                                  null ||
                                                userInformation?.data?.role ===
                                                  "Anggota"
                                              }
                                              onChange={(event) => {
                                                handleChangeInputCicilanPembayaranLains(
                                                  event,
                                                  index,
                                                  cicilanIndex
                                                );
                                              }}
                                              id="statusCi"
                                              width={"200px"}
                                              value={
                                                !cicilan.statusCi
                                                  ? cicilan?.statusCicilan
                                                  : cicilan?.statusCi
                                              }
                                              data={keterangan}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      </React.Fragment>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {(userInformation?.data?.role === "Admin" ||
              userInformation?.data?.role === "Super Admin" ||
              userInformation?.data?.role === "Owner") && (
              <div
                style={{
                  display: "flex",
                  marginTop: "32px",
                  justifyContent: "center",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    handleEditCicilanPemLains();
                  }}
                >
                  Edit Cicilan Pembayaran Lain-Lain
                </DefaultButton>
                <Button
                  onClick={() => {
                    handleCloseModalViewPembayaranLainLain();
                  }}
                  style={{ marginLeft: "8px", textTransform: "none" }}
                  variant="outlined"
                  color="error"
                >
                  Cancel
                </Button>
              </div>
            )}
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
              padding: isMobile ? "" : "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "5vw" : "3vw",
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
                        {result.keterangan === "Belum Lunas" && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{
                                minWidth: "700px",
                                backgroundColor: "#d3f8fd",
                              }}
                            ></div>
                            {result.cicilans.length !== 0 && (
                              <Table
                                sx={{
                                  minWidth: 650,
                                  tableLayout: "fixed",
                                  overflowX: "auto",
                                }}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell
                                      style={{
                                        width: "25px",
                                        backgroundColor: "#d3f8fd",
                                      }}
                                    >
                                      No.
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        width: "200px",
                                        backgroundColor: "#d3f8fd",
                                      }}
                                    >
                                      Jumlah Pembayaran Per Bulan
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        width: "200px",
                                        backgroundColor: "#d3f8fd",
                                      }}
                                    >
                                      Tanggal Pembayaran
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        width: "200px",
                                        backgroundColor: "#d3f8fd",
                                      }}
                                    >
                                      Status Cicilan
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {result.cicilans.map(
                                    (cicilan, cicilanIndex) => (
                                      <React.Fragment key={cicilanIndex}>
                                        <TableRow>
                                          <TableCell
                                            style={{
                                              backgroundColor: "#d3f8fd",
                                            }}
                                          >
                                            {cicilanIndex + 1 + "."}
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              backgroundColor: "#d3f8fd",
                                            }}
                                          >{`Rp. ${cicilan.jumlahHarga
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              "."
                                            )},-`}</TableCell>
                                          <TableCell
                                            style={{
                                              backgroundColor: "#d3f8fd",
                                            }}
                                          >
                                            {dayjs(cicilan.tanggal).format(
                                              "MM/DD/YYYY"
                                            )}
                                          </TableCell>
                                          <TableCell
                                            style={{
                                              backgroundColor: "#d3f8fd",
                                            }}
                                          >
                                            <MySelectTextField
                                              disabled={
                                                userInformation?.data?.role ===
                                                  null ||
                                                userInformation?.data?.role ===
                                                  "Anggota"
                                              }
                                              onChange={(event) => {
                                                handleChangeInputCicilan(
                                                  event,
                                                  index,
                                                  cicilanIndex
                                                );
                                              }}
                                              id="statusCicilan"
                                              width={"200px"}
                                              value={cicilan.statusCicilan}
                                              data={keterangan}
                                            />
                                          </TableCell>
                                        </TableRow>
                                      </React.Fragment>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {(userInformation?.data?.role === "Admin" ||
              userInformation?.data?.role === "Super Admin" ||
              userInformation?.data?.role === "Owner") && (
              <div
                style={{
                  margin: "16px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <DefaultButton
                  onClickFunction={() => {
                    handleEditCicilan();
                  }}
                >
                  Edit Cicilan
                </DefaultButton>
                <Button
                  onClick={() => {
                    handleCloseModalView();
                  }}
                  variant="outlined"
                  color="error"
                  style={{ textTransform: "none", marginLeft: "8px" }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </MyModal>
      )}
      {openModalPembayaranLainLain === true && (
        <MyModal
          open={openModalPembayaranLainLain}
          handleClose={handleCloseModalPembayaranLainLain}
        >
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "50vw",
              maxHeight: "80vh",
              padding: isMobile ? "" : "32px",
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
              <Typography
                style={{ color: "#0F607D", fontSize: isMobile ? "5vw" : "3vw" }}
              >
                Pembayaran Lain-Lain
              </Typography>
              <DefaultButton
                height={isMobile ? "" : "2.08vw"}
                width={isMobile ? "" : "15vw"}
                borderRadius="0.83vw"
                fontSize={isMobile ? "10px" : "0.8vw"}
                onClickFunction={() => {
                  handleTambahItemDataPembayaranLainLain();
                }}
              >
                Tambah Item
              </DefaultButton>
            </div>
            <TableContainer sx={{ overflowX: "auto" }} component={Paper}>
              <Table
                sx={{ overflowX: "auto", minWidth: 650, tableLayout: "fixed" }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "25px" }}>No.</TableCell>
                    <TableCell style={{ width: "300px" }}>Tanggal</TableCell>
                    <TableCell style={{ width: "200px" }}>Uraian</TableCell>
                    <TableCell style={{ width: "200px" }}>
                      No Invoice/ Kwitansi/ SJ
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>
                      Jumlah Harga
                    </TableCell>
                    <TableCell style={{ width: "300px" }}>
                      Tanggal Jatuh Tempo
                    </TableCell>
                    <TableCell style={{ width: "200px" }}>Pembayaran</TableCell>
                    <TableCell style={{ width: "200px" }}>Keterangan</TableCell>
                    {dataPembayaranLainLain.some(
                      (item) => item.keterangan === "Belum Lunas"
                    ) && (
                      <>
                        <TableCell style={{ width: "200px" }}>
                          Tanggal Jatuh Tempo Pembayaran
                        </TableCell>
                        <TableCell style={{ width: "100px" }}>
                          X Pembayaran
                        </TableCell>
                      </>
                    )}
                    <TableCell style={{ width: "50px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataPembayaranLainLain.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={["DateTimePicker"]}>
                                <DemoItem>
                                  <DateTimePicker
                                    // disabled
                                    value={
                                      result.tanggal.isValid()
                                        ? result.tanggal
                                        : null
                                    }
                                    onChange={(event) => {
                                      handleChangeInputDataPembelianLainLain(
                                        event,
                                        index,
                                        "tanggal"
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
                              value={result.uraian}
                              //  disabled
                              onChange={(event) => {
                                handleChangeInputDataPembelianLainLain(
                                  event,
                                  index,
                                  "uraian"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={result.noInvoiceKwitansiSj}
                              // disabled
                              onChange={(event) => {
                                handleChangeInputDataPembelianLainLain(
                                  event,
                                  index,
                                  "noInvoiceKwitansiSj"
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              // disabled
                              onChange={(event) => {
                                handleChangeInputDataPembelianLainLain(
                                  event,
                                  index,
                                  "jumlahHarga"
                                );
                              }}
                              value={result.jumlahHarga}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  height: isMobile ? "50px" : "3vw",
                                  width: "200px",
                                  fontSize: isMobile ? "14px" : "1.5vw",
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
                                    // disabled
                                    onChange={(event) => {
                                      handleChangeInputDataPembelianLainLain(
                                        event,
                                        index,
                                        "tanggalJatuhTempo"
                                      );
                                    }}
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
                                handleChangeInputDataPembelianLainLain(
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
                                handleChangeInputDataPembelianLainLain(
                                  event,
                                  index,
                                  "keterangan"
                                );
                              }}
                            />
                          </TableCell>
                          {result.keterangan === "Belum Lunas" ? (
                            <>
                              <TableCell>
                                <MySelectTextField
                                  value={result?.tanggalJatuhTempoPembayaran}
                                  width={"200px"}
                                  data={tanggal}
                                  onChange={(event) => {
                                    handleChangeInputDataPembelianLainLain(
                                      event,
                                      index,
                                      "tanggalJatuhTempoPembayaran"
                                    );
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <MySelectTextField
                                  value={result?.kaliPembayaran}
                                  width={"100px"}
                                  data={kaliPembayaran}
                                  onChange={(event) => {
                                    handleChangeInputDataPembelianLainLain(
                                      event,
                                      index,
                                      "kaliPembayaran"
                                    );
                                  }}
                                />
                              </TableCell>
                            </>
                          ) : (
                            ""
                          )}
                          <TableCell>
                            <IconButton>
                              <DeleteIcon style={{ color: "red" }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ minWidth: "1677px" }}></div>
                          <div>
                            {result?.cicilan && (
                              <Table
                                sx={{
                                  minWidth: 650,
                                  tableLayout: "fixed",
                                  overflowX: "auto",
                                }}
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{ width: "25px" }}>
                                      No.
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Jumlah Pembayaran Per Bulan
                                    </TableCell>
                                    <TableCell style={{ width: "200px" }}>
                                      Tanggal Pembayaran
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {result.cicilan.map(
                                    (cicilan, cicilanIndex) => (
                                      <React.Fragment key={cicilanIndex}>
                                        <TableRow>
                                          <TableCell>
                                            {cicilanIndex + 1 + "."}
                                          </TableCell>
                                          <TableCell>{`Rp. ${cicilan.jumlah
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              "."
                                            )},-`}</TableCell>
                                          <TableCell>
                                            {dayjs(cicilan.tanggal).format(
                                              "MM/DD/YYYY"
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      </React.Fragment>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <div>
              <div
                style={{
                  display: "flex",
                  marginTop: "32px",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography style={{ fontSize: isMobile ? "4vw" : "1.5vw", color: "#0F607D" }}>
                  No Rekening:
                </Typography>
                <div style={{ marginLeft: "8px" }}>
                  <MySelectTextField
                    value={dataInfoPembayaran.namaBank}
                    onChange={(event) => {
                      handleChangeDataInformasiPembayaran(event);
                    }}
                    data={listBank}
                    width="150px"
                  />
                </div>
              </div>
              <div>
                {Object.keys(dataInfoPembayaran).length !== 0 &&
                  dataInfoPembayaran.constructor === Object && (
                    <Typography
                      style={{
                        fontSize: isMobile ?"4vw" :  "1.5vw",
                        color: "#0F607D",
                        marginTop: "16px",
                      }}
                    >
                      Nama Bank: {dataInfoPembayaran.namaBank}
                    </Typography>
                  )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "32px",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  handleAddPembayaranLainLain();
                }}
              >
                Tambah Pembayaran Lain-Lain
              </DefaultButton>
              <Button
                onClick={() => {
                  handleCloseModalPembayaranLainLain();
                }}
                color="error"
                variant="outlined"
                style={{ textTransform: "none", marginLeft: "8px" }}
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

export default RencanaPembayaran;
