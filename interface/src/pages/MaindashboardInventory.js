import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "./MaindashboardInventory.css";
import factoryBackground from "../assets/factorybackground.png";
import companyLogo from "../assets/PT_Aridas_Karya_Satria_Logo.png";
import DefaultButton from "../components/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { AppContext } from "../App";
import dayjs from "dayjs";
import MyModal from "../components/Modal";
import MySelectTextField from "../components/SelectTextField";
import MySnackbar from "../components/Snackbar";
import { useAuth } from "../components/AuthContext";

const MaindashboardInventory = (props) => {
  const { userInformation, setUserCredentials } = props;
  const { isMobile } = useContext(AppContext);
  const navigate = useNavigate();

  const { message, clearMessage } = useAuth();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [allPermohonanPembelian, setAllPermohonanPembelian] = useState([]);
  const [allStokOpnam, setAllStokOpnam] = useState([]);

  const [allPenyerahanBarang, setAllPenyerahanBarang] = useState([]);
  const [allInventoryItems, setAllInventoryItems] = useState([]);

  const [permohonanPembelian, setPermohonanPembelian] = useState([]);
  const [pembelianBahanBaku, setPembelianBahanBaku] = useState([]);

  const [refreshPermohonanPembelian, setRefreshPermohonanPembelian] =
    useState(true);
  const [refreshItemsPermohonanPembelian, setRefreshItemsPermohonanPembelian] =
    useState(false);
  const [refreshPembelianBahanBaku, setRefreshPembelianBahanBaku] =
    useState(true);
  const [refresDataStokOpnam, setRefereshDataStokOpnam] = useState(true);
  const [refreshPenyerahanBarang, setRefreshPenyerahanBarang] = useState(true);
  const [triggerStatusPermohonan, setTriggerStatusPermohonan] = useState(false);

  const [openModalPermohonanPembelian, setOpenModalPermohonanPembelian] =
    useState(false);

  const [isEditPermohonanPembelian, setIsEditPermohonanPembelian] =
    useState(false);

    const handleChangeDivisiOwner = (event) => {
      axios({
        method: "PUT",
        url: `http://localhost:3000/finance/updateDivisiOwner/${event.target.value}`,
      }).then((result) => {
        if (result.status === 200) {
          setUserCredentials((oldObject) => {
            return {
              ...oldObject,
              data: {
                ...oldObject.data,
                department: event.target.value,
              },
            };
          });
          switch (event.target.value) {
            case "Marketing":
              navigate("/marketingDashboard");
              break;
            case "Production Planning":
              navigate("/productionPlanningDashboard");
              break;
            case "Production":
              navigate("/productionDashboard");
              break;
            case "Finance":
              navigate("/financeDashboard");
              break;
            default:
            //snackbar
          }
        } else {
          //snackbar
        }
      });
    };

  const lokasi = [
    { value: "Jakarta" },
    { value: "Semarang" },
    { value: "Purwokerto" },
  ];

  const department = [
    { value: "Marketing" },
    { value: "Production Planning" },
    { value: "Production" },
    { value: "Finance" },
  ];

  useEffect(() => {
    if (refreshPenyerahanBarang) {
      axios({
        method: "GET",
        url: "http://localhost:3000/inventory/getAllPengambilanBarang",
      }).then((result) => {
        if (result.status === 200) {
          setAllPenyerahanBarang(result.data);
          setRefreshPenyerahanBarang(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(
            "Tidak berhasil memanggil data pengambilan/penyerahan barang"
          );
          setRefreshPenyerahanBarang(false);
        }
      });
    }
  }, [refreshPenyerahanBarang]);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllInventoryItem",
    }).then((result) => {
      if (result.status === 200) {
        const tempData = result.data.map((item) => ({
          value: item.namaItem,
          ...item,
        }));
        setAllInventoryItems(tempData);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil memanggil data item bahan baku");
      }
    });
  }, []);

  useEffect(() => {
    if (refresDataStokOpnam) {
      axios({
        method: "GET",
        url: "http://localhost:3000/inventory/getAllStokOpnam",
      }).then((result) => {
        if (result.status === 200) {
          setAllStokOpnam(result.data);
          setRefereshDataStokOpnam(false);
          setTriggerStatusPermohonan(true);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data stok opnam");
          setRefereshDataStokOpnam(false);
        }
      });
    }
  }, [refresDataStokOpnam]);

  useEffect(() => {
    if (triggerStatusPermohonan) {
      if (
        Array.isArray(allStokOpnam) &&
        allStokOpnam.some(
          (stokOpnam) =>
            stokOpnam.tanggalAkhirStokOpnam &&
            dayjs().isAfter(dayjs(stokOpnam.tanggalAkhirStokOpnam))
        )
      ) {
        allStokOpnam.forEach((result) => {
          if (result.statusStokOpnam !== "Done") {
            if (dayjs().isAfter(dayjs(result.tanggalAkhirStokOpnam))) {
              axios({
                method: "PUT",
                url: `http://localhost:3000/inventory/statusStokOpnamComplete/${result.id}`,
              })
                .then((response) => {
                  if (response.status === 200) {
                    setTriggerStatusPermohonan(false);
                    setRefereshDataStokOpnam(true);
                  } else {
                    setOpenSnackbar(true);
                    setSnackbarStatus(false);
                    setSnackbarMessage(
                      "Tidak dapat mengupdate data stok opnam"
                    );
                  }
                })
                .catch((error) => {
                  console.error("Error updating data stok opnam: ", error);
                  setOpenSnackbar(true);
                  setSnackbarStatus(false);
                  setSnackbarMessage(
                    "Terjadi kesalahan saat mengupdate data stok opnam"
                  );
                });
            }
          }
        });
      }
    }
  }, [triggerStatusPermohonan]);

  useEffect(() => {
    if (message) {
      setSnackbarMessage(message);
      setSnackbarStatus(true);
      setOpenSnackbar(true);
      clearMessage();
    }
  }, [message, clearMessage]);

  useEffect(() => {
    if (refreshPembelianBahanBaku) {
      axios({
        method: "GET",
        url: "http://localhost:3000/inventory/getAllPembelianBahanBaku",
      }).then((result) => {
        if (result.status === 200) {
          setPembelianBahanBaku(result);
          setRefreshPembelianBahanBaku(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak dapat memanggil data pembelian bahan baku");
          setRefreshPembelianBahanBaku(false);
        }
      });
    }
  }, [refreshPembelianBahanBaku]);

  useEffect(() => {
    if (refreshPermohonanPembelian) {
      axios({
        method: "GET",
        url: "http://localhost:3000/inventory/getAllPermohonanPembelian",
      }).then((result) => {
        try {
          if (result.status === 200) {
            setAllPermohonanPembelian(result);
            setRefreshPermohonanPembelian(false);
          }
        } catch (error) {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak dapat memanggil data");
          setRefreshPermohonanPembelian(false);
        }
      });
    }
  }, [refreshPermohonanPembelian]);

  useEffect(() => {
    if (refreshItemsPermohonanPembelian) {
      axios({
        method: "GET",
        url: `http://localhost:3000/inventory/getPermohonanPembelian/${permohonanPembelian[0].id}`,
      }).then((result) => {
        if (result.status === 200) {
          const transformedData = modifyDataPermohonanPembelian(result.data);
          setPermohonanPembelian(transformedData);
          setRefreshItemsPermohonanPembelian(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak dapat memanggil data permohonan pembelian");
        }
      });
    }
  }, [refreshItemsPermohonanPembelian]);

  const handleDeletePermohonanPembelian = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/inventory/deletePermohonanPembelian/${id}`,
      params: { userId: userInformation?.data?.id },
    }).then((result) => {
      if (result.status === 200) {
        setRefreshPermohonanPembelian(true);
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage(
          `Berhasil menghapus permohonan pembelian dengan id ${id}`
        );
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          `Tidak berhasil menghapus permohonan pembelian dengan id ${id}`
        );
      }
    });
  };

  const handleDeletePenyerahanBarang = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/inventory/deletePenyerahanBarang/${id}`,
      params: { userId: userInformation?.data?.id },
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage(
          `Berhasil menghapus form penyerahan/pengambilan barang dengan id ${id}`
        );
        setRefreshPenyerahanBarang(true);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage(
          `Tidak berhasil menghapus form penyerahan/pengambilan barang dengan id ${id}`
        );
      }
    });
  };

  const handleMoveToEditStokOpnam = (id) => {
    navigate("/inventoryDashboard/stokOpnam", {
      state: {
        stokOpnamId: id,
      },
    });
  };

  const handleDeleteItemPermohonanPembelian = (
    id,
    index,
    permohonanPembelianId
  ) => {
    if (!id || id === undefined) {
      setPermohonanPembelian((oldArray) => {
        return oldArray?.map((item, i) => {
          return {
            ...item,
            daftarPermohonanPembelian: item.daftarPermohonanPembelian.filter(
              (_, j) => j !== index
            ),
          };
        });
      });
    } else {
      axios({
        method: "DELETE",
        url: `http://localhost:3000/inventory/deleteItemsPermohonanPembelian/${id}`,
        params: {
          userId: userInformation?.data?.id,
          permohonanPembelianId: permohonanPembelianId,
        },
      }).then((result) => {
        setRefreshItemsPermohonanPembelian(true);
      });
    }
  };

  const handleOpenModalPermohonanPembelian = () => {
    setOpenModalPermohonanPembelian(true);
    setPermohonanPembelian((oldArray) => [
      ...oldArray,
      {
        nomor: "",
        perihal: "",
        daftarPermohonanPembelian: [
          {
            jenisBarang: "",
            jumlah: { value: "", unit: "" },
            untukPekerjaan: "",
            stok: { value: "", unit: "" },
            keterangan: "",
          },
        ],
      },
    ]);
  };

  const handleOpenModalEditPermohonanPembelian = (data) => {
    setIsEditPermohonanPembelian(true);
    setOpenModalPermohonanPembelian(true);
    const permohonanPembelianDataToEdit = modifyDataPermohonanPembelian(data);
    setPermohonanPembelian(permohonanPembelianDataToEdit);
  };

  const handleCloseModalPermohonanPembelian = () => {
    setPermohonanPembelian([]);
    setOpenModalPermohonanPembelian(false);
    setIsEditPermohonanPembelian(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
  };

  const isPermohonanPembelianEmpty = () => {
    for (const item of permohonanPembelian) {
      if (!item.nomor || !item.perihal) {
        return false;
      }
      for (const dataPermohonan of item.daftarPermohonanPembelian) {
        if (
          !dataPermohonan.jenisBarang ||
          !dataPermohonan.keterangan ||
          !dataPermohonan.jumlah.value ||
          !dataPermohonan.jumlah.value ||
          !dataPermohonan.untukPekerjaan ||
          !dataPermohonan.stok.unit ||
          !dataPermohonan.stok.value
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const handleChangeInputPermohonanPembelian = (
    event,
    index,
    indexPermohonan,
    field,
    unit
  ) => {
    const value = event.target.value;

    setPermohonanPembelian((oldArray) => {
      const newState = oldArray.map((item, i) => {
        if (i === index) {
          if (field === "nomor" || field === "perihal") {
            return {
              ...item,
              [field]: value,
            };
          }
          return {
            ...item,
            daftarPermohonanPembelian: item.daftarPermohonanPembelian.map(
              (daftarPermohonan, j) => {
                if (j === indexPermohonan) {
                  if (unit) {
                    return {
                      ...daftarPermohonan,
                      [field]: {
                        value: daftarPermohonan[field]?.value || "",
                        unit: value,
                      },
                    };
                  } else {
                    if (field === "jumlah" || field === "stok") {
                      return {
                        ...daftarPermohonan,
                        [field]: {
                          ...daftarPermohonan[field],
                          value: value,
                        },
                      };
                    } else {
                      if (field === "jenisBarang") {
                        let findItem = allInventoryItems.find(
                          (item) => item.namaItem === value
                        );
                        let stok = separateValueAndUnit(findItem.jumlahItem);
                        daftarPermohonan.stok = {
                          value: stok.value,
                          unit: stok.unit,
                        };
                      }
                      return {
                        ...daftarPermohonan,
                        [field]: value,
                      };
                    }
                  }
                }
                return daftarPermohonan;
              }
            ),
          };
        }
        return item;
      });
      return newState;
    });
  };

  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  const modifyDataPermohonanPembelian = (data) => {
    const newData = [data];
    return newData.map((item) => {
      const daftarPermohonanPembelian = item.itemPermohonanPembelians.map(
        (permohonan) => {
          const { jumlah, stok, ...rest } = permohonan;
          return {
            ...rest,
            jumlah: separateValueAndUnit(jumlah),
            stok: separateValueAndUnit(stok),
          };
        }
      );

      return {
        id: item.id,
        nomor: item.nomor || "",
        perihal: item.perihal || "",
        daftarPermohonanPembelian: daftarPermohonanPembelian,
      };
    });
  };

  const transformDataPermohonanPembelian = (data) => {
    return data.map((item) => {
      return {
        ...item,
        daftarPermohonanPembelian: item.daftarPermohonanPembelian.map(
          (dataPb) => {
            return {
              ...dataPb,
              jumlah: `${dataPb.jumlah.value} ${dataPb.jumlah.unit}`,
              stok: `${dataPb.stok.value} ${dataPb.stok.unit}`,
            };
          }
        ),
      };
    });
  };

  const handleAddPermohonanPembelian = () => {
    const checkIfPermohonanPembelianEmpty = isPermohonanPembelianEmpty();

    if (checkIfPermohonanPembelianEmpty === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input!");
    } else {
      const transformedPermohonanPembelian =
        transformDataPermohonanPembelian(permohonanPembelian);
      axios({
        method: "POST",
        url: `http://localhost:3000/inventory/addPermohonanPembelian/${userInformation.data.id}`,
        data: { permohonanPembelian: transformedPermohonanPembelian },
      }).then((result) => {
        if (result.status === 200) {
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage(`Berhasil menambahkan Permohonan Pembelian`);
          setRefreshPermohonanPembelian(true);
          setOpenModalPermohonanPembelian(false);
          setPermohonanPembelian([]);
          setIsEditPermohonanPembelian(false);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(`error: ${result.message}`);
        }
      });
    }
  };

  const handleEditPermohonanPembelian = () => {
    const checkIfPermohonanPembelianEmpty = isPermohonanPembelianEmpty();
    const transformedPermohonanPembelian =
      transformDataPermohonanPembelian(permohonanPembelian);

    if (checkIfPermohonanPembelianEmpty === false) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input!");
    } else {
      axios({
        method: "PUT",
        url: `http://localhost:3000/inventory/editPermohonanPembelian/${userInformation.data.id}`,
        data: { permohonanPembelian: transformedPermohonanPembelian },
      }).then((result) => {
        if (result.status === 200) {
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage(`Berhasil Mengedit Permohonan Pembelian!`);
          setRefreshPermohonanPembelian(true);
          setOpenModalPermohonanPembelian(false);
          setPermohonanPembelian([]);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage(`error: ${result.message}`);
        }
      });
    }
  };
  const handleDeletePembelianBahanBaku = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/inventory/deletePembelianBahanBaku/${id}`,
      params: { userId: userInformation?.data?.id },
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus data pembelian bahan baku");
        setRefreshPembelianBahanBaku(true);
        setRefreshPermohonanPembelian(true);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Error dalam menghapus data pembelian bahan baku");
      }
    });
  };

  const handleDeleteStokOpnam = (id) => {
    axios({
      method: "DELETE",
      url: `http://localhost:3000/inventory/deleteStokOpnam/${id}`,
      params: { userId: userInformation?.data?.id },
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus data stok opnam");
        setRefereshDataStokOpnam(true);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Error dalam menghapus data stok opnam");
      }
    });
  };

  const handleMoveToEditPembelianBahanBaku = (id) => {
    navigate("/inventoryDashboard/pembelianBahan", {
      state: {
        pembelianBahanBakuId: id,
      },
    });
  };

  const handleMoveToEditPenyerahanBarang = (id) => {
    navigate("/inventoryDashboard/penyerahanBarang", {
      state: {
        penyerahanBarangId: id,
      },
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
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundImage: `url(${factoryBackground})`,
        backgroundSize: "cover",
        display: "flex",
        backgroundAttachment: "fixed",
        flexDirection: "row",
      }}
    >
      {isMobile ? (
        ""
      ) : (
        <div
          className="hideScrollbar"
          style={{
            width: "16.4617vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div style={{ width: "15vw", height: "15vw", marginTop: "1.667vw" }}>
            <img
              style={{ height: "inherit", width: "inherit" }}
              src={companyLogo}
              alt="Company Logo"
            />
          </div>
          <div style={{ marginTop: "3.33vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("managestocks")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Kelola Bahan Baku
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("permohonanpembelian")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Permohonan Pembelian
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="16px"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("pembelianbahanbaku")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pembelian Bahan Baku
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("stokOpnam")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Stok Opnam
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="0.75vw"
              onClickFunction={() => {
                document
                  .getElementById("pengambilanbarang")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pengambilan/Penyerahan Barang
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("laporansampah")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Laporan Sampah
            </DefaultButton>
          </div>
          <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
            <DefaultButton
              width="15vw"
              height="2.08vw"
              backgroundColor="#0F607D"
              borderRadius="0.83vw"
              fontSize="1vw"
              onClickFunction={() => {
                document
                  .getElementById("activitylog")
                  .scrollIntoView({ behavior: "smooth" });
              }}
            >
              Catatan Aktivitas
            </DefaultButton>
          </div>
          {(userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Owner") && (
            <div style={{ marginTop: "1.667vw", fontSize: "1.25vw" }}>
              <DefaultButton
                width="15vw"
                height="2.08vw"
                backgroundColor="#0F607D"
                borderRadius="0.83vw"
                fontSize="1vw"
                onClickFunction={() => {
                  document
                    .getElementById("kelolaanggota")
                    .scrollIntoView({ behavior: "smooth" });
                }}
              >
                Kelola Anggota
              </DefaultButton>
            </div>
          )}
        </div>
      )}
      {isMobile ? (
        ""
      ) : (
        <div
          id="test"
          style={{
            width: "0.2083vw",
            height: "95vh",
            backgroundColor: "#0F607D",
            alignSelf: "center",
          }}
        />
      )}
      <div
        className="hideScrollbar"
        style={{
          width: isMobile ? "100vw" : "83.1217vw",
          height: "100vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            alignItems: "center",
          }}
        >
          <AccountCircleIcon
            style={{
              width: isMobile ? "10vw" : "3.33vw",
              height: "auto",
              marginRight: "0.83vw",
              cursor: "pointer",
            }}
          />
          <div style={{ textAlign: "left" }}>
            <Typography
              style={{ fontSize: isMobile ? "5vw" : "4vw", color: "#0F607D" }}
            >
              Welcome back, {userInformation.data.username}
            </Typography>
            <Typography
              style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
            >
              {userInformation.data.department} Division
            </Typography>
          </div>
        </div>
        {userInformation?.data?.role === "Owner" && (
          <div style={{ margin: "32px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                style={{ width: "150px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Ubah Divisi
              </Typography>
              <MySelectTextField onChange={(event) => {
                handleChangeDivisiOwner(event);
              }} data={department} width="150px" />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <Typography
                style={{ width: "150px", color: "#0F607D", fontSize: "1.5vw" }}
              >
                Ubah Lokasi
              </Typography>
              <MySelectTextField  data={lokasi} width="150px" />
            </div>
          </div>
        )}
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="managestocks"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Kelola Bahan Baku
          </Typography>
          {userInformation?.data?.role === "Admin" ||
          userInformation?.data?.role === "Super Admin" ||
          userInformation?.data?.role === "Owner" ? (
            <DefaultButton
              height={isMobile ? "" : "2.08vw"}
              width={isMobile ? "" : "15vw"}
              borderRadius="0.83vw"
              fontSize={isMobile ? "10px" : "1vw"}
              onClickFunction={() => {
                navigate("/inventoryDashboard/stockPage");
              }}
            >
              Pergi ke halaman stok
            </DefaultButton>
          ) : (
            ""
          )}
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="permohonanpembelian"
            style={{ color: "#0F607D", fontSize: isMobile ? "4vw" : "2vw" }}
          >
            Permohonan Pembelian
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {(userInformation?.data?.role === "Admin" ||
              userInformation?.data?.role === "Super Admin" ||
              userInformation?.data?.role === "Owner") && (
              <DefaultButton
                onClickFunction={() => {
                  handleOpenModalPermohonanPembelian();
                }}
              >
                <Typography style={{ fontSize: isMobile ? "10px" : "1vw" }}>
                  Tambah Permohonan Pembelian
                </Typography>
              </DefaultButton>
            )}
          </div>
        </div>
        {allPermohonanPembelian.length !== 0 ? (
          <div
            style={{
              margin: isMobile ? "0px 32px 0px 32px" : "1.667vw",
              width: isMobile ? "" : "72vw",
            }}
          >
            {!allPermohonanPembelian?.data?.some(
              (permohonan) =>
                permohonan.statusPermohonan === "Requested" ||
                permohonan.statusPermohonan === "Denied"
            ) ? (
              <div>
                <Typography>Belum ada Permohonan Pembelian</Typography>
              </div>
            ) : (
              <div style={{ width: isMobile ? "100%" : "60%" }}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Nomor</TableCell>
                        <TableCell>Perihal</TableCell>
                        <TableCell>Status Permohonan</TableCell>
                        {(userInformation?.data?.role === "Admin" ||
                          userInformation?.data?.role === "Super Admin" ||
                          userInformation?.data?.role === "Owner") && (
                          <TableCell>Actions</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allPermohonanPembelian?.data
                        ?.filter(
                          (permohonan) =>
                            permohonan.statusPermohonan === "Requested" ||
                            permohonan.statusPermohonan === "Denied"
                        )
                        .map((result, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell style={{ width: "25px" }}>
                                {index + 1 + "."}
                              </TableCell>
                              <TableCell style={{ width: "100px" }}>
                                {result.nomor}
                              </TableCell>
                              <TableCell style={{ width: "100px" }}>
                                {result.perihal}
                              </TableCell>
                              <TableCell style={{ width: "120px" }}>
                                {result.statusPermohonan}
                              </TableCell>
                              {(userInformation?.data?.role === "Admin" ||
                                userInformation?.data?.role === "Super Admin" ||
                                userInformation?.data?.role === "Owner") && (
                                <TableCell style={{ width: "50px" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {result.statusPermohonan !== "Denied" && (
                                      <IconButton
                                        onClick={() => {
                                          handleOpenModalEditPermohonanPembelian(
                                            result
                                          );
                                        }}
                                      >
                                        <EditIcon
                                          style={{ color: "#0F607D" }}
                                        />
                                      </IconButton>
                                    )}
                                    <IconButton
                                      onClick={() => {
                                        handleDeletePermohonanPembelian(
                                          result.id
                                        );
                                      }}
                                      sx={{ marginLeft: "8px" }}
                                    >
                                      <DeleteIcon style={{ color: "red" }} />
                                    </IconButton>
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>
        ) : (
          <div style={{ margin: isMobile ? "0px 32px 0px 32px" : "1.667vw" }}>
            <Typography>Tidak ada Permohonan Pembelian</Typography>
          </div>
        )}
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="pembelianbahanbaku"
            style={{ fontSize: isMobile ? "4vw" : "2vw", color: "#0F607D" }}
          >
            Pembelian Bahan Baku
          </Typography>
          {(userInformation?.data?.role === "Admin" ||
            userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Owner") && (
            <DefaultButton
              onClickFunction={() => {
                navigate("/inventoryDashboard/pembelianBahan");
              }}
            >
              <Typography style={{ fontSize: isMobile ? "10px" : "1vw" }}>
                Tambah Pembelian Bahan
              </Typography>
            </DefaultButton>
          )}
        </div>
        <div
          style={{
            margin: isMobile ? "0px 32px 0px 32px" : "1.667vw",
            width: isMobile ? " " : "72vw",
          }}
        >
          {!allPermohonanPembelian?.data?.some(
            (permohonan) =>
              permohonan.statusPermohonan === "Accepted" ||
              permohonan.statusPermohonan === "Processed"
          ) ? (
            <div>
              <Typography>
                Belum ada Permohonan Pembelian yang di ACC
              </Typography>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: isMobile ? "none" : "space-between",
                  flexDirection: isMobile ? "column" : "",
                }}
              >
                <div style={{ width: isMobile ? "100%" : "48%" }}>
                  <Typography>
                    Permohonan pembelian yang sudah diacc & diproses
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>No.</TableCell>
                          <TableCell>ID Permohonan Pembelian</TableCell>
                          <TableCell>Nomor</TableCell>
                          <TableCell>Perihal</TableCell>
                          <TableCell>Status Permohonan</TableCell>
                          {(userInformation?.data?.role === "Admin" ||
                            userInformation?.data?.role === "Super Admin" ||
                            userInformation?.data?.role === "Owner") && (
                            <TableCell>Actions</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allPermohonanPembelian?.data
                          ?.filter(
                            (permohonan) =>
                              permohonan.statusPermohonan === "Accepted" ||
                              permohonan.statusPermohonan === "Processed"
                          )
                          .map((result, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell style={{ width: "200px" }}>
                                  {result.id}
                                </TableCell>
                                <TableCell>{result.nomor}</TableCell>
                                <TableCell>{result.perihal}</TableCell>
                                <TableCell>{result.statusPermohonan}</TableCell>
                                {(userInformation?.data?.role === "Admin" ||
                                  userInformation?.data?.role ===
                                    "Super Admin" ||
                                  userInformation?.data?.role === "Owner") && (
                                  <TableCell>
                                    <div>
                                      <IconButton
                                        onClick={() => {
                                          handleDeletePermohonanPembelian(
                                            result.id
                                          );
                                        }}
                                        sx={{ marginLeft: "8px" }}
                                      >
                                        <DeleteIcon style={{ color: "red" }} />
                                      </IconButton>
                                    </div>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {pembelianBahanBaku?.data?.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      marginTop: isMobile ? "32px" : "",
                    }}
                  >
                    <Typography>Tidak ada data pembelian bahan baku</Typography>
                  </div>
                ) : (
                  <div
                    style={{
                      width: isMobile ? "100%" : "48%",
                      marginTop: isMobile ? "32px" : "",
                    }}
                  >
                    <Typography>Daftar Pembelian Bahan Baku</Typography>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>No.</TableCell>
                            <TableCell>ID Permohonan Pembelian</TableCell>
                            <TableCell>Leveransir</TableCell>
                            <TableCell>Alamat</TableCell>
                            <TableCell>Tanggal Pembuatan</TableCell>
                            {(userInformation?.data?.role === "Admin" ||
                              userInformation?.data?.role === "Super Admin" ||
                              userInformation?.data?.role === "Owner") && (
                              <TableCell>Actions</TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pembelianBahanBaku?.data?.map((result, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>{index + 1 + "."}</TableCell>
                                <TableCell style={{ width: "200px" }}>
                                  {result.permohonanPembelianId}
                                </TableCell>
                                <TableCell>{result.leveransir}</TableCell>
                                <TableCell>{result.alamat}</TableCell>
                                <TableCell>
                                  {dayjs(result.createdAt).format(
                                    "MM/DD/YYYY hh:mm A"
                                  )}
                                </TableCell>
                                {(userInformation?.data?.role === "Admin" ||
                                  userInformation?.data?.role ===
                                    "Super Admin" ||
                                  userInformation?.data?.role === "Owner") && (
                                  <TableCell>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <IconButton
                                        onClick={() => {
                                          handleMoveToEditPembelianBahanBaku(
                                            result.id
                                          );
                                        }}
                                      >
                                        <EditIcon
                                          style={{ color: "#0F606D" }}
                                        />
                                      </IconButton>
                                      <IconButton
                                        onClick={() => {
                                          handleDeletePembelianBahanBaku(
                                            result.id
                                          );
                                        }}
                                        sx={{ marginLeft: "8px" }}
                                      >
                                        <DeleteIcon style={{ color: "red" }} />
                                      </IconButton>
                                    </div>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="stokOpnam"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Stok Opnam
          </Typography>
          <div>
            {(userInformation?.data?.role === "Admin" ||
              userInformation?.data?.role === "Super Admin" ||
              userInformation?.data?.role === "Owner") && (
              <DefaultButton
                onClickFunction={() => {
                  navigate("/inventoryDashboard/stokOpnam");
                }}
              >
                <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                  Tambah Stok Opnam
                </Typography>
              </DefaultButton>
            )}
          </div>
        </div>
        {allStokOpnam.length === 0 ? (
          <div style={{ margin: "32px" }}>
            <Typography>Tidak ada data stok opnam</Typography>
          </div>
        ) : (
          <div
            style={{
              width: "70%",
              margin: isMobile ? "0px 32px 0px 32px" : "1.667vw",
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Judul Stok Opnam</TableCell>
                    <TableCell>Tanggal Pembuatan Stok Opnam</TableCell>
                    <TableCell>Tanggal Akhir Stok Opnam</TableCell>
                    {(userInformation?.data?.role === "Admin" ||
                      userInformation?.data?.role === "Super Admin" ||
                      userInformation?.data?.role === "Owner") && (
                      <TableCell>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allStokOpnam?.map((result, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>{index + 1 + "."}</TableCell>
                          <TableCell>{result.judulStokOpnam}</TableCell>
                          <TableCell>
                            {dayjs(result.tanggalStokOpnam).format(
                              "MM/DD/YYYY hh:mm A"
                            )}
                          </TableCell>
                          <TableCell>
                            {dayjs(result.tanggalAkhirStokOpnam).format(
                              "MM/DD/YYYY hh:mm A"
                            )}
                          </TableCell>
                          {(userInformation?.data?.role === "Admin" ||
                            userInformation?.data?.role === "Super Admin" ||
                            userInformation?.data?.role === "Owner") && (
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {result.tanggalAkhirStokOpnam &&
                                dayjs().isAfter(
                                  dayjs(result.tanggalAkhirStokOpnam)
                                ) ? (
                                  ""
                                ) : (
                                  <IconButton
                                    onClick={() => {
                                      handleMoveToEditStokOpnam(result.id);
                                    }}
                                  >
                                    <EditIcon style={{ color: "#0F607D" }} />
                                  </IconButton>
                                )}

                                <IconButton
                                  onClick={() => {
                                    handleDeleteStokOpnam(result.id);
                                  }}
                                  style={{ marginLeft: "8px" }}
                                >
                                  <DeleteIcon style={{ color: "red" }} />
                                </IconButton>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="pengambilanbarang"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Pengambilan/Penyerahan Barang
          </Typography>
          {(userInformation?.data?.role === "Admin" ||
            userInformation?.data?.role === "Super Admin" ||
            userInformation?.data?.role === "Owner") && (
            <div>
              <DefaultButton
                onClickFunction={() => {
                  navigate("/inventoryDashboard/penyerahanBarang");
                }}
              >
                <Typography style={{ fontSize: isMobile ? "10px" : "1.042vw" }}>
                  Pergi ke Halaman Pengambilan/Penyerahan Barang
                </Typography>
              </DefaultButton>
            </div>
          )}
        </div>
        {allPenyerahanBarang?.length === 0 ? (
          <div style={{ margin: "32px" }}>
            <Typography>
              Tidak ada data penyerahan/pengambilan barang
            </Typography>
          </div>
        ) : (
          <div
            style={{
              width: "70%",
              margin: isMobile ? "0px 32px 0px 32px" : "1.667vw",
            }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tanggal Pengambilan</TableCell>
                    <TableCell>Tanggal Penyerahan</TableCell>
                    <TableCell>Status Pengambilan/Penyerahan</TableCell>
                    {(userInformation?.data?.role === "Admin" ||
                      userInformation?.data?.role === "Super Admin" ||
                      userInformation?.data?.role === "Owner") && (
                      <TableCell>Actions</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allPenyerahanBarang
                    ?.filter(
                      (item) => item.statusPenyerahan !== "Barang sudah diambil"
                    )
                    ?.map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>
                              {dayjs(result.tanggalPengambilan).format(
                                "MM/DD/YYYY hh:mm A"
                              )}
                            </TableCell>
                            <TableCell>
                              {dayjs(result.tanggalPenyerahan).format(
                                "MM/DD/YYYY hh:mm A"
                              )}
                            </TableCell>
                            <TableCell>{result.statusPenyerahan}</TableCell>
                            {(userInformation?.data?.role === "Admin" ||
                              userInformation?.data?.role === "Super Admin" ||
                              userInformation?.data?.role === "Owner") && (
                              <TableCell>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <IconButton
                                    onClick={() => {
                                      handleMoveToEditPenyerahanBarang(
                                        result.id
                                      );
                                    }}
                                  >
                                    <EditIcon style={{ color: "#0F607D" }} />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      handleDeletePenyerahanBarang(result.id);
                                    }}
                                  >
                                    <DeleteIcon style={{ color: "red" }} />
                                  </IconButton>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="laporansampah"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Laporan Sampah
          </Typography>
          <DefaultButton
            onClickFunction={() => {
              navigate("/inventoryDashboard/laporanSampah");
            }}
          >
            <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
              Pergi ke Halaman Laporan Sampah
            </Typography>
          </DefaultButton>
        </div>
        <div
          style={{
            margin: isMobile
              ? "32px 32px 12px 32px"
              : "3.33vw 1.667vw 0vw 1.667vw",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: isMobile ? "" : "72vw",
          }}
        >
          <Typography
            id="activitylog"
            style={{ fontSize: isMobile ? "4.5vw" : "2vw", color: "#0F607D" }}
          >
            Catatan Aktivitas
          </Typography>
          <div>
            <DefaultButton
              onClickFunction={() => {
                navigate("/inventoryDashboard/activityLog");
              }}
            >
              <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                Pergi ke Halaman Catatan Aktivitas
              </Typography>
            </DefaultButton>
          </div>
        </div>
        {(userInformation?.data?.role === "Super Admin" ||
          userInformation?.data?.role === "Owner") && (
          <div
            style={{
              margin: isMobile
                ? "32px 32px 12px 32px"
                : "3.33vw 1.667vw 0vw 1.667vw",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: isMobile ? "" : "72vw",
            }}
          >
            <Typography
              id="kelolaanggota"
              style={{
                fontSize: isMobile ? "4.5vw" : "2vw",
                color: "#0F607D",
              }}
            >
              Kelola Anggota
            </Typography>
            <div>
              <DefaultButton
                onClickFunction={() => {
                  navigate("/inventoryDashboard/kelolaAnggota");
                }}
              >
                <Typography style={{ fontSize: isMobile ? "12px" : "1.042vw" }}>
                  Pergi ke Halaman Kelola Anggota
                </Typography>
              </DefaultButton>
            </div>
          </div>
        )}
      </div>
      {openModalPermohonanPembelian === true && (
        <MyModal
          open={openModalPermohonanPembelian}
          handleClose={handleCloseModalPermohonanPembelian}
        >
          <div
            className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "80vw",
              maxHeight: "80vh",
            }}
          >
            <div
              style={{
                display: "flex",
                margin: "1.667vw 0px 1.042vw 0px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                style={{
                  color: "#0F607D",
                  fontSize: isMobile ? "7vw" : "2.5vw",
                }}
              >
                {isEditPermohonanPembelian
                  ? "Edit Permohonan Pembelian"
                  : "Tambah Permohonan Pembelian"}
              </Typography>
            </div>
            <div>
              {permohonanPembelian.length !== 0 && (
                <>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      style={{
                        fontSize: isMobile ? "" : "1.5vw",
                        color: "#0F607D",
                      }}
                    >
                      Nomor:{" "}
                    </Typography>
                    <div
                      style={{
                        marginLeft: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        type="text"
                        value={permohonanPembelian[0]?.nomor}
                        onChange={(event) => {
                          handleChangeInputPermohonanPembelian(
                            event,
                            0,
                            "",
                            "nomor"
                          );
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: isMobile ? "30px" : "3vw",
                            width: isMobile ? "200px" : "40vw",
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
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "16px",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: isMobile ? "" : "1.5vw",
                        color: "#0F607D",
                      }}
                    >
                      Perihal:{" "}
                    </Typography>
                    <div
                      style={{
                        marginLeft: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        type="text"
                        value={permohonanPembelian[0]?.perihal}
                        onChange={(event) => {
                          handleChangeInputPermohonanPembelian(
                            event,
                            0,
                            "",
                            "perihal"
                          );
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: isMobile ? "30px" : "3vw",
                            width: isMobile ? "200px" : "40vw",
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
                    </div>
                  </div>
                </>
              )}
              {permohonanPembelian.length !== 0 && (
                <div
                  style={{
                    display: "flex",
                    marginTop: "16px",
                    justifyContent: "flex-end",
                  }}
                >
                  <DefaultButton
                    onClickFunction={() => {
                      setPermohonanPembelian((oldArray) =>
                        oldArray.map((result) => ({
                          ...result,
                          daftarPermohonanPembelian: [
                            ...result.daftarPermohonanPembelian,
                            {
                              jenisBarang: "",
                              jumlah: { value: "", unit: "" },
                              untukPekerjaan: "",
                              stok: { value: "", unit: "" },
                              keterangan: "",
                            },
                          ],
                        }))
                      );
                    }}
                  >
                    <Typography>Tambah Barang</Typography>
                  </DefaultButton>
                </div>
              )}
              {permohonanPembelian?.length !== 0 ? (
                <TableContainer style={{ marginTop: "16px" }} component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell align="left">Jenis Barang</TableCell>
                        <TableCell align="left">Jumlah</TableCell>
                        <TableCell align="left">Untuk Pekerjaan</TableCell>
                        <TableCell align="left">Stok</TableCell>
                        <TableCell align="left">Keterangan</TableCell>
                        <TableCell align="left">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {permohonanPembelian?.map((result, index) => (
                        <React.Fragment key={index}>
                          {result?.daftarPermohonanPembelian?.map(
                            (dataPermohonan, indexPermohonan) => (
                              <TableRow
                                key={`data of index ${indexPermohonan}`}
                              >
                                <TableCell>
                                  <Typography>
                                    {indexPermohonan + 1 + "."}
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  style={{ width: isMobile ? "100px" : "" }}
                                >
                                  {/* <TextField
                                    type="text"
                                    style={{ width: isMobile ? "100px" : "" }}
                                    value={dataPermohonan.jenisBarang}
                                    onChange={(event) => {
                                      handleChangeInputPermohonanPembelian(
                                        event,
                                        index,
                                        indexPermohonan,
                                        "jenisBarang"
                                      );
                                    }}
                                  /> */}
                                  <MySelectTextField
                                    data={allInventoryItems}
                                    value={dataPermohonan.jenisBarang}
                                    width={isMobile ? "100px" : "200px"}
                                    onChange={(event) => {
                                      handleChangeInputPermohonanPembelian(
                                        event,
                                        index,
                                        indexPermohonan,
                                        "jenisBarang"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  style={{ width: isMobile ? "200px" : "" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <TextField
                                      type="number"
                                      style={{ width: isMobile ? "100px" : "" }}
                                      value={dataPermohonan.jumlah.value}
                                      onChange={(event) => {
                                        handleChangeInputPermohonanPembelian(
                                          event,
                                          index,
                                          indexPermohonan,
                                          "jumlah"
                                        );
                                      }}
                                    />
                                    <div style={{ marginLeft: "8px" }}>
                                      <MySelectTextField
                                        type="text"
                                        width={isMobile ? "75px" : "100px"}
                                        height={"55px"}
                                        borderRadius="10px"
                                        data={units}
                                        fontSize={isMobile ? "10px" : "0.8vw"}
                                        value={dataPermohonan.jumlah.unit}
                                        onChange={(event) => {
                                          handleChangeInputPermohonanPembelian(
                                            event,
                                            index,
                                            indexPermohonan,
                                            "jumlah",
                                            true
                                          );
                                        }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell
                                  style={{ width: isMobile ? "100px" : "" }}
                                >
                                  <TextField
                                    value={dataPermohonan.untukPekerjaan}
                                    style={{ width: isMobile ? "100px" : "" }}
                                    type="text"
                                    onChange={(event) => {
                                      handleChangeInputPermohonanPembelian(
                                        event,
                                        index,
                                        indexPermohonan,
                                        "untukPekerjaan"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  style={{ width: isMobile ? "100px" : "" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <TextField
                                      disabled
                                      value={dataPermohonan.stok.value}
                                      style={{ width: isMobile ? "100px" : "" }}
                                      type="number"
                                      onChange={(event) => {
                                        handleChangeInputPermohonanPembelian(
                                          event,
                                          index,
                                          indexPermohonan,
                                          "stok"
                                        );
                                      }}
                                    />
                                    <div style={{ marginLeft: "8px" }}>
                                      <MySelectTextField
                                        disabled
                                        type="text"
                                        onChange={(event) => {
                                          handleChangeInputPermohonanPembelian(
                                            event,
                                            index,
                                            indexPermohonan,
                                            "stok",
                                            true
                                          );
                                        }}
                                        width={isMobile ? "75px" : "100px"}
                                        height={"55px"}
                                        borderRadius="10px"
                                        data={units}
                                        fontSize={isMobile ? "10px" : "0.8vw"}
                                        value={dataPermohonan.stok.unit}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell
                                  style={{ width: isMobile ? "100px" : "" }}
                                >
                                  <TextField
                                    type="text"
                                    value={dataPermohonan.keterangan}
                                    style={{ width: isMobile ? "100px" : "" }}
                                    onChange={(event) => {
                                      handleChangeInputPermohonanPembelian(
                                        event,
                                        index,
                                        indexPermohonan,
                                        "keterangan"
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteItemPermohonanPembelian(
                                        dataPermohonan?.id,
                                        indexPermohonan,
                                        result.id
                                      );
                                    }}
                                  >
                                    <DeleteIcon style={{ color: "red" }} />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "#0F607D",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      margin: "32px",
                    }}
                  >
                    <Typography
                      style={{
                        color: "#0F607D",
                        fontSize: isMobile ? " " : "2vw",
                      }}
                    >
                      Silahkan tambah item permohonan pembelian
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </div>
          {permohonanPembelian.length !== 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "32px",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  isEditPermohonanPembelian
                    ? handleEditPermohonanPembelian()
                    : handleAddPermohonanPembelian();
                }}
              >
                {isEditPermohonanPembelian ? "Edit" : "Tambah"}
              </DefaultButton>
              <Button
                variant="outlined"
                color="error"
                style={{ marginLeft: "8px", textTransform: "none" }}
                onClick={() => {
                  handleCloseModalPermohonanPembelian();
                }}
              >
                Cancel
              </Button>
            </div>
          )}
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

export default MaindashboardInventory;
