import React, { useContext, useEffect, useState } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import "./PembelianBahan.css";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { AppContext } from "../../App";
import DefaultButton from "../../components/Button";
import MyModal from "../../components/Modal";
import MySelectTextField from "../../components/SelectTextField";
import axios from "axios";
import MySnackbar from "../../components/Snackbar";

const StockPage = (props) => {
  const { userInformation } = props;
  const { isMobile } = useContext(AppContext);

  const [openModal, setOpenModal] = useState(false);

  const [allInventoryItems, setAllInventoryItems] = useState([]);
  const [inventoryItem, setInventoryItem] = useState(false);
  const [searchItem, setSearchItem] = useState("");

  const [ifId, setIfId] = useState(0);
  const [namaItem, setNamaItem] = useState("");
  const [rincianItem, setRincianItem] = useState("");
  const [jumlahItem, setJumlahItem] = useState("");
  const [jumlahItemUnit, setJumlahItemUnit] = useState("");
  const [sortName, setSortName] = useState(false);

  const [refreshInventoryItem, setRefreshInventoryItem] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
    if (refreshInventoryItem) {
      axios({
        method: "GET",
        url: "http://localhost:3000/inventory/getAllInventoryItem",
      }).then((result) => {
        if (result.status === 200) {
          setRefreshInventoryItem(false);
          setAllInventoryItems(result);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil memanggil data item bahan baku");
        }
      });
    }
  }, [refreshInventoryItem]);

  const handleSortNamaItem = (property, order = "asc") => {
    setSortName(!sortName);
    if (!allInventoryItems?.data) {
      return;
    }

    const sortedArray = [...allInventoryItems.data].sort((a, b) => {
      const aValue = a[property].toString().toLowerCase();
      const bValue = b[property].toString().toLowerCase();

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });

    setAllInventoryItems({ ...allInventoryItems, data: sortedArray });
  };

  const handleEditInventoryItem = () => {
    if (
      jumlahItem === "" ||
      rincianItem === "" ||
      jumlahItemUnit === "" ||
      namaItem === "" ||
      ifId === 0
    ) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input");
    } else if (rincianItem.length > 255) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("rincian barang terlalu panjang");
    } else {
      const dataInventory = {
        inventoryItemId: ifId,
        namaItem: namaItem,
        rincianItem: rincianItem,
        jumlahItem: `${jumlahItem} ${jumlahItemUnit}`,
      };
      axios({
        method: "PUT",
        url: `http://localhost:3000/inventory/editInventoryItem/${userInformation?.data?.id}`,
        data: { dataInventory: dataInventory },
      }).then((result) => {
        if (result.status === 200) {
          setOpenModal(false);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("Berhasil mengedit item bahan baku");
          setNamaItem("");
          setRincianItem("");
          setJumlahItem("");
          setJumlahItemUnit("");
          setRefreshInventoryItem(true);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil mengedit item bahan baku");
        }
      });
    }
  };

  const handleDeleteInventoryItem = (id) => {
    axios({
      method: "DELETE",
      url: "http://localhost:3000/inventory/deleteInventoryItem",
      params: { userId: userInformation?.data?.id, inventoryItemId: id },
    }).then((result) => {
      if (result.status === 200) {
        setOpenSnackbar(true);
        setSnackbarStatus(true);
        setSnackbarMessage("Berhasil menghapus item bahan baku");
        setRefreshInventoryItem(true);
      } else {
        setOpenSnackbar(true);
        setSnackbarStatus(false);
        setSnackbarMessage("Tidak berhasil menghapus item bahan baku");
      }
    });
  };

  const handleAddInventoryItem = () => {
    if (
      jumlahItem === "" ||
      rincianItem === "" ||
      jumlahItemUnit === "" ||
      namaItem === ""
    ) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Tolong isi semua input");
    } else if (rincianItem.length > 255) {
      setOpenSnackbar(true);
      setSnackbarStatus(false);
      setSnackbarMessage("Rincian barang terlalu panjang");
    } else {
      const dataInventory = {
        namaItem: namaItem,
        rincianItem: rincianItem,
        jumlahItem: `${jumlahItem} ${jumlahItemUnit}`,
      };
      axios({
        method: "POST",
        url: `http://localhost:3000/inventory/addInventoryItem/${userInformation?.data?.id}`,
        data: { dataInventory: dataInventory },
      }).then((result) => {
        if (result.status === 200) {
          setOpenModal(false);
          setOpenSnackbar(true);
          setSnackbarStatus(true);
          setSnackbarMessage("Berhasil menambahkan item bahan baku");
          setNamaItem("");
          setRincianItem("");
          setJumlahItem("");
          setJumlahItemUnit("");
          setRefreshInventoryItem(true);
        } else {
          setOpenSnackbar(true);
          setSnackbarStatus(false);
          setSnackbarMessage("Tidak berhasil menambahkan item bahan baku");
        }
      });
    }
  };

  const separateValueAndUnit = (str) => {
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };
  const handleOpenEditInventoryItems = (data) => {
    const jumlahItem = separateValueAndUnit(data.jumlahItem);
    setOpenModal(true);
    setInventoryItem(true);
    setIfId(data.id);
    setNamaItem(data.namaItem);
    setRincianItem(data.rincianItem);
    setJumlahItem(jumlahItem.value);
    setJumlahItemUnit(jumlahItem.unit);
  };

  const handleCloseEditInventoryItems = () => {
    setOpenModal(false);
    setInventoryItem(false);
    setNamaItem("");
    setRincianItem("");
    setJumlahItem("");
    setJumlahItemUnit("");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNamaItem("");
    setRincianItem("");
    setJumlahItem("");
    setJumlahItemUnit("");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarStatus(true);
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
      <div style={{ margin: "32px", height: "100%", width: "100%" }}>
        <div
          style={{
            display: isMobile ? "" : "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            style={{ fontSize: isMobile ? "" : "3vw", color: "#0F607D" }}
          >
            Kelola Bahan Baku
          </Typography>
          <DefaultButton
            onClickFunction={() => {
              setOpenModal(true);
            }}
          >
            Tambah Stok Bahan Baku
          </DefaultButton>
        </div>
        <div style={{ marginTop: "16px" }}>
          <TextField
            type="text"
            placeholder="Search item"
            onChange={(event) => {
              setSearchItem(event.target.value);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: isMobile ? "15px" : "3vw",
                width: isMobile ? "150px" : "25vw",
                fontSize: isMobile ? "10px" : "1.5vw",
                borderRadius: "10px",
                boxSizing: "border-box",
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
        <div style={{ width: "100%" }}>
          {allInventoryItems.length === 0 ? (
            <Typography>Tidak ada item bahan baku</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Typography style={{ width: "100px" }}>
                          Nama Item
                        </Typography>
                        {sortName ? (
                          <IconButton
                            onClick={() => {
                              handleSortNamaItem("namaItem", "asc");
                            }}
                          >
                            <ArrowDropDownIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => {
                              handleSortNamaItem("namaItem", "desc");
                            }}
                          >
                            <ArrowDropUpIcon />
                          </IconButton>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>Rincian Item</TableCell>
                    <TableCell>Jumlah Item</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allInventoryItems?.data
                    ?.filter((element) => {
                      return element.namaItem
                        .toLowerCase()
                        .includes(searchItem.toLowerCase());
                    })
                    .map((result, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{result.namaItem}</TableCell>
                            <TableCell>{result.rincianItem}</TableCell>
                            <TableCell>{result.jumlahItem}</TableCell>
                            <TableCell>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <IconButton
                                  onClick={() => {
                                    handleOpenEditInventoryItems(result);
                                  }}
                                >
                                  <EditIcon style={{ color: "#0F607D" }} />
                                </IconButton>
                                <IconButton
                                  onClick={() => {
                                    handleDeleteInventoryItem(result.id);
                                  }}
                                >
                                  <DeleteIcon style={{ color: "red" }} />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
      {openModal === true && (
        <MyModal open={openModal} handleClose={handleCloseModal}>
          <div
            // className="hideScrollbar"
            style={{
              margin: isMobile ? "24px" : "0.83vw 1.667vw 0.83vw 1.667vw",
              overflow: "auto",
              width: isMobile ? "80vw" : "40vw",
              maxHeight: "80vh",
            }}
          >
            <div>
              <Typography
                style={{ color: "#0F607D", fontSize: isMobile ? "" : "2vw" }}
              >
                {inventoryItem === true
                  ? "Edit Item Bahan Baku"
                  : "Tambah Item Bahan Baku"}
              </Typography>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={{ width: "150px" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "" : "1vw",
                    }}
                  >
                    Nama Item:
                  </Typography>
                </div>
                <TextField
                  value={namaItem}
                  onChange={(event) => {
                    setNamaItem(event.target.value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: isMobile ? "15px" : "3vw",
                      width: isMobile ? "150px" : "25vw",
                      fontSize: isMobile ? "10px" : "1.5vw",
                      borderRadius: "10px",
                      boxSizing: "border-box",
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={{ width: "150px" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "" : "1vw",
                    }}
                  >
                    Rincian Item:
                  </Typography>
                </div>
                <TextField
                  multiline
                  value={rincianItem}
                  onChange={(event) => {
                    setRincianItem(event.target.value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      width: isMobile ? "150px" : "25vw",
                      fontSize: isMobile ? "10px" : "1.5vw",
                      borderRadius: "10px",
                      boxSizing: "border-box",
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <div style={{ width: "150px" }}>
                  <Typography
                    style={{
                      color: "#0F607D",
                      fontSize: isMobile ? "" : "1vw",
                    }}
                  >
                    Jumlah Item:
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    value={jumlahItem}
                    onChange={(event) => {
                      setJumlahItem(event.target.value);
                    }}
                    type="number"
                    sx={{
                      marginRight: "1.667vw",
                      "& .MuiOutlinedInput-root": {
                        height: isMobile ? "15px" : "3vw",
                        width: isMobile ? "50px" : "7vw",
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
                  <MySelectTextField
                    value={jumlahItemUnit}
                    onChange={(event) => {
                      setJumlahItemUnit(event.target.value);
                    }}
                    type="text"
                    width={isMobile ? "50px" : "7vw"}
                    height={isMobile ? "15px" : "3vw"}
                    borderRadius="10px"
                    data={units}
                    fontSize={isMobile ? "10px" : "1.5vw"}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            >
              <DefaultButton
                onClickFunction={() => {
                  inventoryItem === true
                    ? handleEditInventoryItem()
                    : handleAddInventoryItem();
                }}
              >
                {inventoryItem === true ? "Edit Item" : "Tambah Item"}
              </DefaultButton>
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  inventoryItem === true
                    ? handleCloseEditInventoryItems()
                    : handleCloseModal();
                }}
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

export default StockPage;
