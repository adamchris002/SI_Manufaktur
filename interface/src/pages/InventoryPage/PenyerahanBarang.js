import React, { useState, useEffect } from "react";
import factoryBackground from "../../assets/factorybackground.png";
import axios from "axios";
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
import DeleteIcon from "@mui/icons-material/Delete";
import MySelectTextField from "../../components/SelectTextField";
import DefaultButton from "../../components/Button";

const PenyerahanBarang = () => {
  const [estimatedOrders, setEstimatedOrders] = useState([]);
  const [selectedEstimatedOrdersId, setSelectedEstimatedOrdersId] =
    useState("");
  const [inventoryItems, setInventoryItems] = useState([]);
  const [dataBarangYangDiambil, setDatabarangYangDiambil] = useState([
    {
      namaItem: "",
      kodebarang: "",
      rincianItem: "",
      jumlahYangDiambil: { value: "", unit: "" },
      jumlahDigudang: { value: "", unit: "" },
      lokasiPeyimpanan: "",
    },
  ]);

  console.log(dataBarangYangDiambil);

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

  const separateValueAndUnit = (str) => {
    if (!str) return { value: null, unit: null };
    const parts = str.split(" ");
    const value = parts[0];
    const unit = parts.slice(1).join(" ");
    return { value, unit };
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/inventory/getAllInventoryItem",
    }).then((result) => {
      if (result.status === 200) {
        const tempName = result.data.map((data) => ({
          value: data.namaItem,
          jumlahItem: separateValueAndUnit(data?.jumlahItem),
          ...data,
        }));
        setInventoryItems(tempName);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://localhost:3000/productionPlanning/getAllProductionPlanning",
    }).then((result) => {
      if (result.status === 200) {
        const tempName = result.data.map((data) => ({
          value: data.id,
          ...data,
        }));
        setEstimatedOrders(tempName);
      } else {
      }
    });
  }, []);

  const getSelectedInventoryItem = (value, field, unit) => {
    if (unit) {
      const selectedItem = inventoryItems?.find(
        (result) => value === result.value
      );
      const valueAndUnit = separateValueAndUnit(selectedItem?.[field]);
      return selectedItem ? valueAndUnit : null;
    } else {
      const selectedItem = inventoryItems?.find(
        (result) => value === result.value
      );
      return selectedItem ? selectedItem[field] : null;
    }
  };

  const handleAddRow = () => {
    setDatabarangYangDiambil((oldArray) => [
      ...oldArray,
      {
        namaItem: "",
        kodebarang: "",
        rincianItem: "",
        jumlahYangDiambil: { value: "", unit: "" },
        jumlahDigudang: { value: "", unit: "" },
        lokasiPeyimpanan: "",
      },
    ]);
  };

  const handleChangeInput = (field, event, index, unit) => {
    const value = event.target.value;
    setDatabarangYangDiambil((oldArray) => {
      const updatedItems = oldArray.map((item, i) => {
        if (i === index) {
          let updatedItem = { ...item };
          if (unit) {
            updatedItem = {
              ...updatedItem,
              [field]: {
                vlaue: item[field],
                unit: value,
              },
            };
          } else {
            updatedItem = { ...updatedItem, [field]: value };
          }
          return updatedItem;
        }
        return item;
      });
      return updatedItems;
    });
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
          <Typography style={{ color: "#0F607D", fontSize: "3vw" }}>
            Penyerahan/Pengambilan Barang
          </Typography>
        </div>
        <div style={{ margin: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Laporan Perancanaan yang berlangsung
              </Typography>
              <div style={{ marginLeft: "8px" }}>
                <MySelectTextField
                  data={estimatedOrders}
                  width={"100px"}
                  value={selectedEstimatedOrdersId}
                  onChange={(event) => {
                    setSelectedEstimatedOrdersId(event.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              {estimatedOrders
                ?.filter((plan) => plan.id === selectedEstimatedOrdersId)
                ?.map((result, index) => {
                  return (
                    <div key={index}>
                      {result?.estimasiBahanBakus?.map(
                        (bahanBaku, bahanBakuIndex) => {
                          return (
                            <TableContainer
                              key={bahanBakuIndex}
                              component={Paper}
                              style={{ marginTop: "16px" }}
                            >
                              <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                              >
                                <TableHead>
                                  <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>{bahanBaku.jenis}</TableCell>
                                    <TableCell>{bahanBaku.informasi}</TableCell>
                                    <TableCell>Warna</TableCell>
                                    <TableCell>Estimasi Kebutuhan</TableCell>
                                    <TableCell>Waste</TableCell>
                                    <TableCell>Jumlah Kebutuhan</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {bahanBaku?.bahanBakuAkanDigunakans?.map(
                                    (itemBahanBaku, indexItemBahanBaku) => {
                                      return (
                                        <React.Fragment
                                          key={indexItemBahanBaku}
                                        >
                                          <TableRow>
                                            <TableCell>
                                              {indexItemBahanBaku + 1 + "."}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.namaJenis}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.dataInformasi}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.warna}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.estimasiKebutuhan}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.waste}
                                            </TableCell>
                                            <TableCell>
                                              {itemBahanBaku.jumlahKebutuhan}{" "}
                                            </TableCell>
                                          </TableRow>
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          );
                        }
                      )}
                    </div>
                  );
                })}
            </div>
            <div style={{ marginTop: "32px" }}>
              <Typography style={{ color: "#0F607D", fontSize: "2vw" }}>
                Form Penyerahan/Pengambilan Barang{" "}
              </Typography>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography>Barang yang Diambil:</Typography>
                  <DefaultButton
                    onClickFunction={() => {
                      handleAddRow();
                    }}
                  >
                    Tambah Item
                  </DefaultButton>
                </div>
                <TableContainer component={Paper} style={{ marginTop: "16px" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "50px" }}>No.</TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Nama Barang
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          kode Barang
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Rincian Item
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Jumlah yang Diambil
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Jumlah di Gudang
                        </TableCell>
                        <TableCell style={{ width: "200px" }} align="left">
                          Lokasi Penyimpanan
                        </TableCell>
                        <TableCell style={{ width: "60px" }} align="left">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataBarangYangDiambil.map((result, index) => {
                        const jumlahItemValueAndUnit = getSelectedInventoryItem(
                          result.namaItem,
                          "jumlahItem",
                          true
                        );
                        console.log(jumlahItemValueAndUnit);
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>{index + 1 + "."}</TableCell>
                              <TableCell>
                                <MySelectTextField
                                  data={inventoryItems}
                                  value={result.namaItem}
                                  onChange={(event) => {
                                    handleChangeInput("namaItem", event, index);
                                  }}
                                  width={"200px"}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={getSelectedInventoryItem(
                                    result.namaItem,
                                    "kodeBarang"
                                  )}
                                  disabled
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={getSelectedInventoryItem(
                                    result.namaItem,
                                    "kodeBarang"
                                  )}
                                  disabled
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
                                    type="number"
                                    style={{ width: "140px" }}
                                  />
                                  <MySelectTextField
                                    data={units}
                                    width={"70px"}
                                  />
                                </div>
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
                                    type="number"
                                    style={{ width: "140px" }}
                                    disabled
                                    value={jumlahItemValueAndUnit?.value}
                                  />
                                  <MySelectTextField
                                    disabled={true}
                                    data={units}
                                    width={"70px"}
                                    value={
                                      jumlahItemValueAndUnit !== null
                                        ? jumlahItemValueAndUnit?.unit
                                        : ""
                                    }
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <TextField
                                  value={getSelectedInventoryItem(
                                    result.namaItem,
                                    "lokasi"
                                  )}
                                  disabled
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton>
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
              <div
                style={{
                  padding: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DefaultButton>Tambah Form</DefaultButton>
                <Button
                  style={{ marginLeft: "8px" }}
                  color="error"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenyerahanBarang;
